import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './MarketPage.module.css';
import { CryptoChart, type CryptoChartHandle } from 'src/shared/presentation/components/CryptoChart/CryptoChart';
import { binanceService } from 'src/modules/market/infrastructure/services/binance.service';
import { ChartToolbar } from 'src/shared/presentation/components/ChartToolbar/ChartToolbar';
import type { ChartStyleType } from '../../components/ChatTypeDropdown/ChartTypeDropdown';
import { MarketHeader } from '../../components/MarketHeader/MarketHeader';
import type { MarketPair } from 'src/modules/market/domain/market.constants';
import { walletRepository } from 'src/modules/wallet/infrastructure/repositories/wallet.repository';
import { OrderForm } from 'src/modules/trade/presentation/components/OrderForm/OrderForm';
import { UserPredictionHistory } from 'src/modules/prediction/presentation/components/UserPredictionHistory/UserPredictionHistory';

export const MarketPage = () => {
  const [stats, setStats] = useState<any>(null);
  // State for the View
  const [chartType, setChartType] = useState<ChartStyleType>('area');
  const [chartInterval, setChartInterval] = useState<string>('1h');
  
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [walletAssets, setWalletAssets] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  
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
        const data = await binanceService.get24hrStats(activeSymbol);
        setStats(data);
      } catch (e) { console.error(e); }
    };
    fetchStats();
    const tempInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(tempInterval);
  }, [activeSymbol]);

  // Helper for Header Props
  const isPositive = stats ? parseFloat(stats.priceChange) >= 0 : true;
  const currentPrice = stats ? parseFloat(stats.lastPrice).toFixed(2) : '---';
  const changeText = stats ? `${parseFloat(stats.priceChange).toFixed(2)} (${parseFloat(stats.priceChangePercent).toFixed(2)}%)` : '';

  // 1. Fetch Wallet Assets on Mount
  useEffect(() => {
    const loadWallet = async () => {
      try {
        const wallet = await walletRepository.getMyWallet();
        setBalance(wallet.usdBalance);
        setWalletAssets(wallet.assets);
      } catch (e) {
        console.error("Failed to load wallet for market pairs", e);
      }
    };
    loadWallet();
  }, []);

  // 2. Transform Wallet Assets into Market Pairs
  const marketPairs = useMemo<MarketPair[]>(() => {
    if (!walletAssets.length) return [];

    return walletAssets
      .filter(asset => asset.symbol !== 'USDT') // Remove Quote Currency (Cash)
      .map(asset => ({
        symbol: `${asset.symbol}USDT`,        // Create Pair ID: BTC -> BTCUSDT
        baseAsset: asset.symbol,              // BTC
        quoteAsset: 'USDT',                   // Always USDT
        name: asset.name,                      // Bitcoin
        icon: asset.iconUrl
      }));
  }, [walletAssets]);

  const safePairs = marketPairs.length > 0 ? marketPairs : [
    { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', name: 'Bitcoin' }
  ];

  const activePairObj = safePairs.find(p => p.symbol === activeSymbol) || safePairs[0];

  return (
    <div className={styles.container}>
      {/* 1. APP HEADER (Full Width, No Sidebar) */}
      <div className={styles.headerArea}>
        <MarketHeader
          currentSymbol={activeSymbol}
          pairs={safePairs}
          price={currentPrice}
          priceChange={changeText}
          isPositive={isPositive}
          balance={balance}
          onSymbolChange={(pair) => setActiveSymbol(pair.symbol)}
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
            symbol={activeSymbol}
            chartType={chartType}
            interval={chartInterval} 
          />
        </div>
      </div>

      <div className={styles.rightPanel}>
        {/* Middle: Order Form */}
          <OrderForm
            pair={activePairObj} 
            currentPrice={parseFloat(stats?.lastPrice || '0')} 
          />
          <div className={styles.history}>
            <UserPredictionHistory />
          </div>
      </div>
    </div>
  );
};