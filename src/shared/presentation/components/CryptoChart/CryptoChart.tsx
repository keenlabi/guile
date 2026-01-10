import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { 
  createChart, 
  ColorType,
  CrosshairMode,
  type ISeriesApi,
  type IChartApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { binanceService } from 'src/modules/market/infrastructure/services/binance.service';
import { useBinanceWebSocket } from 'src/shared/presentation/hooks/useBinanceWebSocket'; 
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

// 1. CONFIGURATION
const UPDATE_FREQUENCY_MS = 100; // 10 ticks per second

const THEME = {
  bg: '#0f0f0f',           
  grid: '#242832',         
  line: '#2862ff',         
  areaTop: '#182545',      
  areaBottom: 'rgba(24, 37, 69, 0.0)', 
  text: '#848e9c',
};

export const CryptoChart = forwardRef<CryptoChartHandle, Props>(({ symbol, chartType = 'area', interval = '1m' }, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  
  const targetPriceRef = useRef<number | null>(null);
  const displayedPriceRef = useRef<number | null>(null);
  const dataCountRef = useRef<number>(0); 
  
  const currentCandleRef = useRef<any>(null);
  const dotRef = useRef<HTMLDivElement>(null);

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
    setScaleMode: () => {} 
  }));

  const updateDotPosition = useCallback(() => {
    if (!chartRef.current || !seriesRef.current || !dotRef.current || !currentCandleRef.current) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      return;
    }
    const data = currentCandleRef.current;
    const time = data.time;
    // @ts-ignore
    const coordinateX = chartRef.current.timeScale().timeToCoordinate(time);
    const val = data.value !== undefined ? data.value : data.close;
    const coordinateY = seriesRef.current.priceToCoordinate(val);

    if (coordinateX === null || coordinateY === null) {
      dotRef.current.style.display = 'none';
    } else {
      dotRef.current.style.display = 'block';
      dotRef.current.style.transform = `translate(${coordinateX}px, ${coordinateY}px)`; 
    }
  }, []);

  // --- INITIALIZE CHART ---
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      kineticScroll: { touch: true, mouse: true },
      layout: { 
        background: { type: ColorType.Solid, color: THEME.bg }, 
        textColor: THEME.text,
        fontFamily: "'Roboto Mono', monospace", 
      },
      grid: { 
        vertLines: { color: THEME.grid, style: 1 }, 
        horzLines: { color: THEME.grid, style: 1 } 
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { 
        borderColor: THEME.grid, 
        timeVisible: true, 
        secondsVisible: true,
        barSpacing: 6,
        minBarSpacing: 1, 
        rightOffset: 20, 
        shiftVisibleRangeOnNewBar: true,
        tickMarkFormatter: (tickTime: number) => {
           const safeTick = Math.round(tickTime);
           const date = new Date(safeTick * UPDATE_FREQUENCY_MS); 
           const seconds = date.getSeconds();
           // Show label at 00, 15, 30, 45
           if (seconds % 15 === 0) {
              return date.toLocaleTimeString('en-GB', { 
                 hour12: false, minute: '2-digit', second: '2-digit' 
              });
           }
           return '';
        }
      },
      rightPriceScale: { 
        borderColor: THEME.grid,
        autoScale: true, 
        // KEY CHANGE: Increased margins to dampen the auto-zoom
        // The line will stay in the middle 40% of the screen.
        scaleMargins: { top: 0.3, bottom: 0.3 } 
      },
      localization: {
        timeFormatter: (tickTime: number) => {
          const date = new Date(tickTime * UPDATE_FREQUENCY_MS); 
          return date.toLocaleTimeString('en-GB', { 
             hour12: false, minute: '2-digit', second: '2-digit' 
          });
        },
        priceFormatter: (price: number) => {
          return new Intl.NumberFormat('en-US', {
             minimumFractionDigits: 2,
             maximumFractionDigits: 2,
          }).format(price);
        }
      },
    });
    chartRef.current = chart;

    chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
      updateDotPosition();
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]?.target) {
        const { width, height } = entries[0].contentRect;
        chart.applyOptions({ width, height });
        setTimeout(updateDotPosition, 0);
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [updateDotPosition]);

  // --- SERIES SETUP ---
  useEffect(() => {
    if (!chartRef.current) return;
    if (seriesRef.current) chartRef.current.removeSeries(seriesRef.current);

    let newSeries: ISeriesApi<any>;
    const commonOptions: any = { lineWidth: 3 }; 
    const precisionOptions = {
        priceFormat: { minMove: 0.01, precision: 2 }
    };

    const seriesOptions = {
        ...commonOptions,
        ...precisionOptions,
    };

    switch (chartType) {
      case 'bar':
        newSeries = chartRef.current.addBarSeries({ upColor: '#0ecb81', downColor: '#f6465d', ...seriesOptions });
        break;
      case 'line':
        newSeries = chartRef.current.addLineSeries({ color: THEME.line, ...seriesOptions });
        break;
      case 'area':
        newSeries = chartRef.current.addAreaSeries({ topColor: THEME.areaTop, bottomColor: THEME.areaBottom, lineColor: THEME.line, ...seriesOptions });
        break;
      case 'hollow':
      case 'candle':
      default:
        newSeries = chartRef.current.addCandlestickSeries({ upColor: '#0ecb81', downColor: '#f6465d', borderVisible: false, wickUpColor: '#0ecb81', wickDownColor: '#f6465d', ...seriesOptions });
        break;
    }
    seriesRef.current = newSeries;
    
    // Reset
    dataCountRef.current = 0;
    targetPriceRef.current = null;
    displayedPriceRef.current = null;
    setTimeout(updateDotPosition, 50);
  }, [chartType, updateDotPosition]);

  // --- HEARTBEAT & PHYSICS ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!seriesRef.current || !targetPriceRef.current) return;

      if (displayedPriceRef.current === null) displayedPriceRef.current = targetPriceRef.current;
      
      const factor = 0.2; 
      const diff = targetPriceRef.current - displayedPriceRef.current;
      
      if (Math.abs(diff) > 0.00001) {
         displayedPriceRef.current += diff * factor;
      } else {
         displayedPriceRef.current = targetPriceRef.current;
      }

      const nowTick = Math.floor(Date.now() / UPDATE_FREQUENCY_MS); 
      const price = displayedPriceRef.current;

      const newPoint = { 
         time: nowTick as UTCTimestamp, 
         open: price, high: price, low: price, close: price 
      };

      dataCountRef.current++;

      const isLine = chartType === 'line' || chartType === 'area';
      if (isLine) {
        seriesRef.current.update({ time: newPoint.time, value: newPoint.close });
        currentCandleRef.current = { time: newPoint.time, value: newPoint.close };
      } else {
        seriesRef.current.update(newPoint);
        currentCandleRef.current = newPoint;
      }

      updateDotPosition();

    }, UPDATE_FREQUENCY_MS);

    return () => clearInterval(intervalId);
  }, [chartType, updateDotPosition]);

  // --- WEBSOCKET ---
  const handleSocketTick = useCallback((price: number) => {
    targetPriceRef.current = price;
  }, []);
  useBinanceWebSocket(symbol, handleSocketTick);

  // --- HISTORY ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await binanceService.getCandles(symbol, interval);
        if (seriesRef.current && data.length > 0) {
           const formatted = data.map((d: any) => {
             const tick = Math.floor(d.time / UPDATE_FREQUENCY_MS) as UTCTimestamp;
             if (chartType === 'line' || chartType === 'area') {
                return { time: tick, value: parseFloat(d.close) };
             }
             return {
                 time: tick,
                 open: parseFloat(d.open), high: parseFloat(d.high), low: parseFloat(d.low), close: parseFloat(d.close)
             };
           });
           
           formatted.sort((a: any, b: any) => a.time - b.time);
           seriesRef.current.setData(formatted);

           const lastData = formatted[formatted.length - 1];
           const lastPrice = (chartType === 'line' || chartType === 'area') ? lastData.value : lastData.close;
           
           targetPriceRef.current = lastPrice;
           displayedPriceRef.current = lastPrice;
           currentCandleRef.current = lastData;

           if (chartRef.current) {
              chartRef.current.timeScale().fitContent(); 
           }
           requestAnimationFrame(updateDotPosition);
        }
      } catch (e) { console.error(e); }
    };
    fetchHistory();
  }, [symbol, interval, chartType, updateDotPosition]);

  return (
    <div ref={chartContainerRef} className={styles.chartContainer}>
      <div ref={dotRef} className={styles.pulsatingDot} />
    </div>
  );
});