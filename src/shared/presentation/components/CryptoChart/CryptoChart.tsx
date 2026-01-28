import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { 
  createChart, 
  ColorType,
  CrosshairMode,
  type ISeriesApi,
  type IChartApi,
  type UTCTimestamp,
  LineStyle,
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

// --- CONFIGURATION ---
const UPDATE_FREQUENCY_MS = 100; 
const TICKS_PER_SECOND = 10;

// X-AXIS ZOOM: 4 Minutes (240s)
// This squeezes ~24 vertical grid lines onto the screen (very dense).
const VISIBLE_SECONDS = 240;     
const VISIBLE_TICKS = VISIBLE_SECONDS * TICKS_PER_SECOND; 

// Y-AXIS ZOOM: +/- $28 (Total $56 Height)
// This packs the $2 lines much tighter pixel-wise.
const MONITOR_WINDOW = 28;       

const THEME = {
  bg: '#0f0f0f',           
  grid: '#242832',         
  line: '#2862ff',         
  areaTop: 'rgba(40, 98, 255, 0.3)',      
  areaBottom: 'rgba(40, 98, 255, 0.0)', 
  text: '#EAECEF',
};

// Helper: Generate jagged, realistic micro-movements
const generateMicroTicks = (start: number, end: number, steps: number) => {
    const points = [];
    let current = start;
    const stepSize = (end - start) / steps;
    
    for (let i = 0; i < steps; i++) {
        const noise = (Math.random() - 0.5) * (Math.abs(stepSize) * 3); 
        current += stepSize + noise;
        points.push(current);
    }
    return points;
};

export const CryptoChart = forwardRef<CryptoChartHandle, Props>(({ symbol, chartType = 'area' }, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  
  const targetPriceRef = useRef<number | null>(null);
  const displayedPriceRef = useRef<number | null>(null);
  const viewCenterRef = useRef<number | null>(null);
  const currentCandleRef = useRef<any>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const totalBarsRef = useRef<number>(0);

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

    const coordinateX = chartRef.current.timeScale().timeToCoordinate(data.time);
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
      kineticScroll: { touch: false, mouse: false },
      handleScale: { axisPressedMouseMove: false, mouseWheel: false, pinch: false }, 
      handleScroll: { mouseWheel: false, pressedMouseMove: false, vertTouchDrag: false, horzTouchDrag: false }, 
      layout: { 
        background: { type: ColorType.Solid, color: THEME.bg }, 
        textColor: THEME.text,
        fontSize: 9, // Small font allows dense labels to fit
        fontFamily: "'Roboto Mono', monospace", 
      },
      grid: { 
        vertLines: { color: THEME.grid, style: LineStyle.Dotted }, 
        horzLines: { color: THEME.grid, style: LineStyle.Dotted } 
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { 
        borderColor: THEME.grid, 
        timeVisible: true, 
        secondsVisible: true,
        fixLeftEdge: true, 
        rightOffset: 10, 
        shiftVisibleRangeOnNewBar: false, 
        
        // 10-Second Grid
        tickMarkFormatter: (tickTime: number) => {
           const timeInMs = Math.round(tickTime * UPDATE_FREQUENCY_MS);
           const remainder = Math.abs(timeInMs % 10000); // 10s check
           
           if (remainder < 50 || Math.abs(remainder - 10000) < 50) {
              const date = new Date(timeInMs);
              return date.toLocaleTimeString('en-GB', { 
                 hour12: false, 
                 hour: '2-digit', 
                 minute: '2-digit', 
                 second: '2-digit' 
              });
           }
           return '';
        }
      },
      rightPriceScale: { 
        borderColor: THEME.grid,
        visible: true,
        autoScale: true, 
        scaleMargins: { top: 0.05, bottom: 0.05 } 
      },
      localization: {
        timeFormatter: (tickTime: number) => {
          const date = new Date(tickTime * UPDATE_FREQUENCY_MS); 
          return date.toLocaleTimeString('en-GB', { 
             hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
          });
        },
        priceFormatter: (price: number) => {
          if (Math.abs(price % 2) < 0.1) {
             return price.toFixed(0); 
          }
          return ''; 
        }
      },
    });
    chartRef.current = chart;

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

  // --- SERIES INIT ---
  useEffect(() => {
    if (!chartRef.current) return;
    if (seriesRef.current) chartRef.current.removeSeries(seriesRef.current);

    let newSeries: ISeriesApi<any>;
    const commonOptions: any = { lineWidth: 2 }; 
    const precisionOptions = { priceFormat: { type: 'price', minMove: 2, precision: 0 } };
    const seriesOptions = { ...commonOptions, ...precisionOptions };

    seriesOptions.autoscaleInfoProvider = () => {
        const center = viewCenterRef.current;
        if (center !== null) {
            return {
                priceRange: {
                    minValue: center - MONITOR_WINDOW,
                    maxValue: center + MONITOR_WINDOW,
                },
            };
        }
        return null;
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

    const initData = async () => {
        try {
            const candles = await binanceService.getCandles(symbol, '1s'); 
            const historyPoints = [];
            
            for (let i = 0; i < candles.length; i++) {
                const candle = candles[i];
                const startTick = Math.floor(candle.time * TICKS_PER_SECOND);
                
                const startP = i > 0 ? candles[i-1].close : candle.open;
                const endP = candle.close;
                
                const microPrices = generateMicroTicks(startP, endP, TICKS_PER_SECOND);

                for (let j = 0; j < TICKS_PER_SECOND; j++) {
                    const tickTime = (startTick + j) as UTCTimestamp;
                    const price = microPrices[j];
                    
                    if (chartType === 'line' || chartType === 'area') {
                        historyPoints.push({ time: tickTime, value: price });
                    } else {
                        historyPoints.push({ time: tickTime, open: price, high: price, low: price, close: price });
                    }
                }
            }

            newSeries.setData(historyPoints);
            
            if (historyPoints.length > 0) {
              const last = historyPoints[historyPoints.length - 1];
              const lastPrice = (chartType === 'line' || chartType === 'area') ? last.value : last.close;

              // FIX: Add '?? null' to handle undefined
              targetPriceRef.current = lastPrice ?? null;
              displayedPriceRef.current = lastPrice ?? null;
              viewCenterRef.current = lastPrice ?? null;
            }

            if (chartRef.current && totalBarsRef.current > VISIBLE_TICKS) {
                chartRef.current.timeScale().setVisibleLogicalRange({
                    from: totalBarsRef.current - VISIBLE_TICKS,
                    to: totalBarsRef.current
                });
            } else {
                chartRef.current?.timeScale().scrollToPosition(0, true);
            }

            requestAnimationFrame(updateDotPosition);

        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    initData();

  }, [chartType, symbol, updateDotPosition]);

  // --- LIVE LOOP ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!seriesRef.current || !targetPriceRef.current || !chartRef.current) return;

      if (displayedPriceRef.current === null) displayedPriceRef.current = targetPriceRef.current;
      
      const diff = targetPriceRef.current - displayedPriceRef.current;
      if (Math.abs(diff) < 0.5) {
          displayedPriceRef.current = targetPriceRef.current;
      } else {
          displayedPriceRef.current += diff * 0.3; 
      }

      const now = Date.now();
      const nowTick = Math.floor(now / UPDATE_FREQUENCY_MS) as UTCTimestamp;
      const price = displayedPriceRef.current;

      viewCenterRef.current = price;

      const newPoint = { 
         time: nowTick, 
         open: price, high: price, low: price, close: price 
      };

      const isLine = chartType === 'line' || chartType === 'area';
      if (isLine) {
        seriesRef.current.update({ time: newPoint.time, value: newPoint.close });
        currentCandleRef.current = { time: newPoint.time, value: newPoint.close };
      } else {
        seriesRef.current.update(newPoint);
        currentCandleRef.current = newPoint;
      }
      
      totalBarsRef.current += 1;

      if (totalBarsRef.current > VISIBLE_TICKS) {
          chartRef.current.timeScale().setVisibleLogicalRange({
              from: totalBarsRef.current - VISIBLE_TICKS,
              to: totalBarsRef.current
          });
      }

      updateDotPosition();

    }, UPDATE_FREQUENCY_MS);

    return () => clearInterval(intervalId);
  }, [chartType, updateDotPosition]);

  const handleSocketTick = useCallback((price: number) => {
    targetPriceRef.current = price;
  }, []);
  useBinanceWebSocket(symbol, handleSocketTick);

  return (
    <div ref={chartContainerRef} className={styles.chartContainer}>
      <div ref={dotRef} className={styles.pulsatingDot} />
    </div>
  );
});