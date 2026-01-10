import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './MarketPage.module.css';

// --- Components ---
import { CryptoChart, type CryptoChartHandle } from 'src/shared/presentation/components/CryptoChart/CryptoChart';
import { MarketHeader } from '../../components/MarketHeader/MarketHeader';
import { OrderForm } from 'src/modules/trade/presentation/components/OrderForm/OrderForm';
import { MarketActivityBar } from '../../components/MarketActivityBar/MarketActivityBar';
import { UserPredictionHistory } from 'src/modules/prediction/presentation/components/UserPredictionHistory/UserPredictionHistory';
import type { ChartStyleType } from '../../components/ChatTypeDropdown/ChartTypeDropdown';

// --- Services & Domain ---
import { binanceService } from 'src/modules/market/infrastructure/services/binance.service';
import { walletRepository } from 'src/modules/wallet/infrastructure/repositories/wallet.repository';
import type { MarketPair } from 'src/modules/market/domain/market.constants';

export const MarketPage = () => {
  // --- STATE ---
  const [pairs, setPairs] = useState<MarketPair[]>([]); 
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  
  const [stats, setStats] = useState<any>(null);
  const [chartType, setChartType] = useState<ChartStyleType>('area');
  const [chartInterval, setChartInterval] = useState<string>('1m');
  const [activePanel, setActivePanel] = useState<string | null>(null);
  
  const chartRef = useRef<CryptoChartHandle>(null);
  const chartAreaRef = useRef<HTMLDivElement>(null);

  // --- 1. FETCH ASSETS & BUILD PAIRS ---
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const assets = await walletRepository.getAssets();
        
        // Transform Backend Assets -> Market Pairs
        const tradeablePairs: MarketPair[] = assets
          .filter(asset => asset.isTradingEnabled)
          .map(asset => ({
            symbol: `${asset.symbol}USDT`, 
            baseAsset: asset.symbol,
            quoteAsset: 'USDT',
            name: asset.name,
            icon: asset.iconUrl
          }));

        setPairs(tradeablePairs);

        // Safety Check: If current active symbol isn't in the new list, switch to the first available one
        if (tradeablePairs.length > 0) {
            const isCurrentValid = tradeablePairs.some(p => p.symbol === activeSymbol);
            if (!isCurrentValid) {
                setActiveSymbol(tradeablePairs[0].symbol);
            }
        }
      } catch (e) {
        console.error("Failed to load market pairs", e);
      }
    };

    fetchMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- 2. LOAD WALLET BALANCE ---
  // Memoized so it can be passed to OrderForm without re-triggering renders
  const loadWallet = useCallback(async () => {
    try {
      const wallet = await walletRepository.getMyWallet();
      setWalletBalance(wallet.usdBalance); 
    } catch (e) {
      console.error("Failed to sync wallet", e);
    }
  }, []);

  // Initial Wallet Load
  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  // --- 3. LIVE STATS LOOP ---
  useEffect(() => {
    if (!activeSymbol) return;

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

  // --- HANDLERS ---
  const togglePanel = (panel: string) => {
    setActivePanel(current => current === panel ? null : panel);
  };
  
  const handleFullscreen = () => {
    if (!chartAreaRef.current) return;
    if (!document.fullscreenElement) {
      chartAreaRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  // --- DATA PREP ---
  const isPositive = stats ? parseFloat(stats.priceChange) >= 0 : true;
  const currentPrice = stats ? parseFloat(stats.lastPrice).toFixed(2) : '---';
  const changeText = stats ? `${parseFloat(stats.priceChange).toFixed(2)} (${parseFloat(stats.priceChangePercent).toFixed(2)}%)` : '';

  // Get current pair object (Safe fallback)
  const activePairObj = useMemo(() => {
    return pairs.find(p => p.symbol === activeSymbol) || pairs[0] || { 
      symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', name: 'Loading...' 
    };
  }, [pairs, activeSymbol]);

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <MarketHeader
          currentSymbol={activeSymbol}
          pairs={pairs} 
          price={currentPrice}
          priceChange={changeText}
          isPositive={isPositive}
          balance={walletBalance}
          onSymbolChange={(pair) => setActiveSymbol(pair.symbol)}
          onTypeChange={(type) => setChartType(type)} 
          onFullscreen={() => handleFullscreen()}
          onTimeframeChange={(newInterval) => setChartInterval(newInterval)}
          onDepositTriggered={()=> {}}
        />
      </div>
      
      <div className={styles.chartArea} ref={chartAreaRef}>
        <div className={styles.railArea}>
          <div className={styles.market_activity}>
            <MarketActivityBar 
              activePanel={activePanel} 
              onToggle={togglePanel} 
            />
          </div>
      
          {activePanel === 'history' ? 
            <div className={`${styles.historyPanel}`}>
              <UserPredictionHistory /> 
            </div>
          : null}
        </div>

        <div className={styles.chartWrapper}>
          {activeSymbol && (
            <CryptoChart 
                ref={chartRef} 
                symbol={activeSymbol}
                chartType={chartType}
                interval={chartInterval} 
            />
          )}
        </div>

        <div className={styles.orderForm}>
          <OrderForm
            pair={activePairObj} 
            currentPrice={parseFloat(stats?.lastPrice || '0')} 
            onSuccess={loadWallet} /* Connects the trade success to wallet reload */
          />
        </div>
      </div>
    </div>
  );
};