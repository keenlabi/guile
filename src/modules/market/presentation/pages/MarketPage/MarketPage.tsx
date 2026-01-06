import { useState, useEffect, useRef } from 'react';
import styles from './MarketPage.module.css';
import { CryptoChart, type CryptoChartHandle } from 'src/shared/presentation/components/CryptoChart/CryptoChart';
import { binanceService } from 'src/modules/market/infrastructure/services/binance.service';
import { ChartToolbar } from 'src/shared/presentation/components/ChartToolbar/ChartToolbar';
import type { ChartStyleType } from '../../components/ChatTypeDropdown/ChartTypeDropdown';
import { MarketHeader } from '../../components/MarketHeader/MarketHeader';

export const MarketPage = () => {
  const [stats, setStats] = useState<any>(null);
  // State for the View
  const [chartType, setChartType] = useState<ChartStyleType>('candle');
  const [chartInterval, setChartInterval] = useState<string>('1h');
  
  // Ref to control the chart
  const chartRef = useRef<CryptoChartHandle>(null);
  const chartAreaRef = useRef<HTMLDivElement>(null); // NEW: Ref for the wrapper

  const handleFullscreen = () => {
    if (!chartAreaRef.current) return;

    if (!document.fullscreenElement) {
      // Enter Fullscreen
      chartAreaRef.current.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      // Exit Fullscreen
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    // Keep the header stats "live"
    const fetchStats = async () => {
      try {
        const data = await binanceService.get24hrStats('BTCUSDT');
        setStats(data);
      } catch (e) { console.error(e); }
    };
    fetchStats();
    const tempInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(tempInterval);
  }, []);

  // Helper for Header Props
  const isPositive = stats ? parseFloat(stats.priceChange) >= 0 : true;
  const currentPrice = stats ? parseFloat(stats.lastPrice).toFixed(2) : '---';
  const changeText = stats ? `${parseFloat(stats.priceChange).toFixed(2)} (${parseFloat(stats.priceChangePercent).toFixed(2)}%)` : '';

  return (
    <div className={styles.container}>
      {/* 1. APP HEADER (Full Width, No Sidebar) */}
      <div className={styles.headerArea}>
        <MarketHeader
          symbol="BTC/USDT"
          price={currentPrice}
          priceChange={changeText}
          isPositive={isPositive}
        />
      </div>

      {/* 2. Chart Area (Now Full Width) */}
      <div className={styles.chartArea} ref={chartAreaRef}>
        <div className={styles.toolbarContainer}>
          <ChartToolbar
            onTypeChange={(type) => setChartType(type)} 
            onScreenshot={() => chartRef.current?.takeScreenshot()}
            onFullscreen={() => handleFullscreen()}
            onScaleChange={(mode) => chartRef.current?.setScaleMode(mode)} // Wired
            onTimeframeChange={(newInterval) => setChartInterval(newInterval)}
          />
        </div>

        <div className={styles.chartWrapper}>
          <CryptoChart 
            ref={chartRef} 
            symbol="BTCUSDT" 
            chartType={chartType}
            interval={chartInterval} 
          />
        </div>
      </div>

      {/* 3. Bottom Panel (Positions) */}
      <div className={styles.bottomPanel}>
        <div style={{ padding: '16px', color: '#848e9c', fontSize: '14px', borderBottom: '1px solid #2a2e39' }}>
          Open Positions (0)
        </div>
        {/* Table content goes here */}
      </div>
    </div>
  );
};