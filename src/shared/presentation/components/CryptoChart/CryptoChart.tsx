import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { 
  createChart, 
  ColorType,
  PriceScaleMode,
  type ISeriesApi,
  type IChartApi,
} from 'lightweight-charts';
import { binanceService } from 'src/modules/market/infrastructure/services/binance.service';
import styles from './CryptoChart.module.css';
import type { ChartStyleType } from 'src/modules/market/presentation/components/ChatTypeDropdown/ChartTypeDropdown';

export interface CryptoChartHandle {
  takeScreenshot: () => void;
  toggleFullscreen: () => void;
  setScaleMode: (mode: 'log' | 'normal' | 'auto') => void;
}

interface Props {
  symbol: string;
  chartType?: ChartStyleType;
  interval?: string;
}

export const CryptoChart = forwardRef<CryptoChartHandle, Props>(({ symbol, chartType = 'candle', interval = '1h' }, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const dataRef = useRef<any[]>([]); // Keeps local copy to avoid re-fetching on type switch

  // --- Exposed Methods ---
  useImperativeHandle(ref, () => ({
    takeScreenshot: () => { 
      if (chartRef.current && chartContainerRef.current) {
        const canvas = chartContainerRef.current.querySelector('canvas');
        if (canvas) {
          const url = canvas.toDataURL();
          const link = document.createElement('a');
          link.download = `${symbol}-chart.png`;
          link.href = url;
          link.click();
        }
      }
    },
    toggleFullscreen: () => {
      if (!chartContainerRef.current) return;
      if (!document.fullscreenElement) {
        chartContainerRef.current.requestFullscreen().catch(err => console.error(err));
      } else {
        document.exitFullscreen();
      }
    },
    setScaleMode: (mode) => {
      if (!chartRef.current) return;
      if (mode === 'auto') {
         chartRef.current.priceScale('right').applyOptions({ autoScale: true });
         chartRef.current.timeScale().fitContent();
      } else {
         chartRef.current.priceScale('right').applyOptions({
           mode: mode === 'log' ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal,
           autoScale: true,
         });
      }
    }
  }));

  // --- EFFECT 1: Initialize Chart Instance (Runs ONCE) ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Create Chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      localization: {
        priceFormatter: (price: number) => {
          // Formats 90600 -> "90,600.00"
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price);
        },
      },
      layout: { background: { type: ColorType.Solid, color: '#131722' }, textColor: '#d1d4dc' },
      grid: { vertLines: { color: 'rgba(42, 46, 57, 0.2)' }, horzLines: { color: 'rgba(42, 46, 57, 0.2)' } },
      timeScale: { borderColor: 'rgba(197, 203, 206, 0.1)', timeVisible: true },
    });
    chartRef.current = chart;

    // 2. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]?.target) {
        const { width, height } = entries[0].contentRect;
        chart.applyOptions({ width, height });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    // 3. Cleanup
    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null; // Important: Clear series ref so other effects don't use dead series
    };
  }, []); // Empty dependency array = Only runs on mount/unmount

  // --- EFFECT 2: Manage Series Type (Runs on chartType change) ---
  useEffect(() => {
    if (!chartRef.current) return;

    // 1. Remove Old Series
    if (seriesRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (e) { console.warn("Series removal error:", e); }
    }

    // 2. Add New Series
    let newSeries: ISeriesApi<any>;
    switch (chartType) {
      case 'bar':
        newSeries = chartRef.current.addBarSeries({ upColor: '#0ecb81', downColor: '#f6465d' });
        break;
      case 'line':
        newSeries = chartRef.current.addLineSeries({ color: '#f0b90b', lineWidth: 2 });
        break;
      case 'area':
        newSeries = chartRef.current.addAreaSeries({ 
          topColor: 'rgba(240, 185, 11, 0.5)', bottomColor: 'rgba(240, 185, 11, 0.04)', lineColor: '#f0b90b', lineWidth: 2 
        });
        break;
      case 'hollow':
        newSeries = chartRef.current.addCandlestickSeries({
          upColor: 'transparent', downColor: '#f6465d', borderUpColor: '#0ecb81', borderDownColor: '#f6465d', wickUpColor: '#0ecb81', wickDownColor: '#f6465d'
        });
        break;
      case 'candle':
      default:
        newSeries = chartRef.current.addCandlestickSeries({
          upColor: '#0ecb81', downColor: '#f6465d', borderVisible: false, wickUpColor: '#0ecb81', wickDownColor: '#f6465d'
        });
        break;
    }
    seriesRef.current = newSeries;

    // 3. Restore Data (Instant, no fetch)
    if (dataRef.current.length > 0) {
      const isLine = chartType === 'line' || chartType === 'area';
      const formattedData = isLine 
        ? dataRef.current.map((d: any) => ({ time: d.time, value: d.close })) 
        : dataRef.current;
      newSeries.setData(formattedData);
    }
  }, [chartType]); // Only re-run if type changes

  // --- EFFECT 3: Data Fetching & Live Updates (Runs on Symbol/Interval change) ---
  useEffect(() => {
    // A. Fetch Initial History
    const fetchData = async () => {
      const data = await binanceService.getCandles(symbol, interval);
      dataRef.current = data; // Update local cache

      if (seriesRef.current) {
        const isLine = chartType === 'line' || chartType === 'area';
        const formattedData = isLine ? data.map((d: any) => ({ time: d.time, value: d.close })) : data;
        seriesRef.current.setData(formattedData);
        chartRef.current?.timeScale().fitContent(); // Reset zoom on new data
      }
    };
    fetchData();

    // B. Start Live Polling
    const pollInterval = setInterval(async () => {
      const candle = await binanceService.getLatestCandle(symbol, interval);
      
      if (!seriesRef.current) return;

      const isLine = chartType === 'line' || chartType === 'area';
      const updateData = isLine ? { time: candle.time, value: candle.close } : candle;

      seriesRef.current.update(updateData);
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [symbol, interval]); // Only runs if these change (not chartType!)

  return <div ref={chartContainerRef} className={styles.chartContainer} />;
});