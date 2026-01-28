import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
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

interface DataPoint {
  time: number;
  value: number;
}

// --- CONFIGURATION ---
const TOTAL_X_WINDOW = 140; 
const TICK_GAP_X_SECONDS = 10; 
const MICRO_TICKS_PER_SEC = 20; 

// --- ALGORITHMS ---

const getSmartTickStep = (min: number, max: number, targetTickCount: number) => {
    const range = max - min;
    const rawStep = range / targetTickCount;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    if (residual > 5) return 10 * magnitude;
    if (residual > 2) return 5 * magnitude;
    if (residual > 1) return 2 * magnitude;
    return magnitude;
};

// IMPROVED: Much subtler organic walk
const generateOrganicWalk = (start: number, end: number, steps: number) => {
    const points = [];
    let current = start;
    const timeStepSize = (end - start) / steps; 
    
    // REDUCED: Volatility lowered significantly (0.5 -> 0.1)
    const volatility = Math.abs(end - start) * 0.1 + 0.05; 

    for (let i = 1; i <= steps; i++) {
        const trend = start + (timeStepSize * i);
        const remainingSteps = steps - i;
        const noiseScale = (remainingSteps / steps) * volatility * 0.5; 
        const randomStep = (Math.random() - 0.5) * noiseScale;
        current = (current * 0.5) + (trend * 0.5) + randomStep;
        points.push(current);
    }
    points[points.length - 1] = end;
    return points;
};

export const CryptoChartD3 = forwardRef<CryptoChartHandle, Props>(({ symbol }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // STATE
  const dataRef = useRef<DataPoint[]>([]);
  const targetPriceRef = useRef<number>(0);
  const currentDisplayedPrice = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const lastRecordedTimeRef = useRef<number>(0);
  const liveJitterRef = useRef<number>(0);

  // VIEW STATE (New Panning Logic)
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragStartOffset = useRef<number>(0);
  const viewOffsetMs = useRef<number>(0); // 0 = Live, >0 = Looking at past
  const isLive = useRef<boolean>(true);   // Helper flag

  // Camera State
  const currentYMin = useRef<number>(0);
  const currentYMax = useRef<number>(0);
  const isInitialized = useRef<boolean>(false);

  // Mouse State
  const mousePos = useRef<{x: number, y: number} | null>(null);

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => console.log('Screenshot MVP'),
    toggleFullscreen: () => {
      if (containerRef.current) {
        if (!document.fullscreenElement) containerRef.current.requestFullscreen();
        else document.exitFullscreen();
      }
    },
    setScaleMode: () => {}
  }));

  // --- 1. DATA LOADER ---
  useEffect(() => {
    const initData = async () => {
      try {
        const candles = await binanceService.getCandles(symbol, '1s');
        const highResPoints: DataPoint[] = [];

        for (let i = 1; i < candles.length; i++) {
            const prev = parseFloat(candles[i-1].close);
            const curr = parseFloat(candles[i].close);
            const timeStep = 1000 / MICRO_TICKS_PER_SEC;
            const walkPoints = generateOrganicWalk(prev, curr, MICRO_TICKS_PER_SEC);
            
            walkPoints.forEach((val, idx) => {
                highResPoints.push({
                    time: (candles[i-1].time * 1000) + (idx * timeStep),
                    value: val
                });
            });
        }
        
        if (highResPoints.length > 0) {
            dataRef.current = highResPoints;
            const lastVal = highResPoints[highResPoints.length - 1].value;
            const lastTime = highResPoints[highResPoints.length - 1].time;

            targetPriceRef.current = lastVal;
            currentDisplayedPrice.current = lastVal;
            lastRecordedTimeRef.current = lastTime; 

            currentYMin.current = lastVal - 10;
            currentYMax.current = lastVal + 10;
            isInitialized.current = true;
        }
      } catch (e) {
        console.error(e);
      }
    };
    initData();
  }, [symbol]);

  // --- 2. SOCKET ---
  const handleSocketTick = useCallback((price: number) => {
    targetPriceRef.current = price;
  }, []);
  useBinanceWebSocket(symbol, handleSocketTick);

  // --- 3. ANIMATION LOOP ---
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const margin = { top: 20, right: 70, bottom: 20, left: 0 };
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // LAYERS
    const gridLayer = svg.append("g");
    const chartLayer = svg.append("g");
    const axisLayer = svg.append("g");
    const overlayLayer = svg.append("g");
    const crosshairLayer = svg.append("g");
    const labelLayer = svg.append("g");
    const priceTagLayer = svg.append("g");

    // INTERACTION LAYER (Full Screen Catch-All)
    const interactionRect = svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "transparent")
        .style("cursor", "grab"); // Default cursor

    // STATIC PATHS
    const areaPath = chartLayer.append("path")
        .attr("fill", "rgba(40, 98, 255, 0.2)");
    const linePath = chartLayer.append("path")
        .attr("fill", "none")
        .attr("stroke", "#2862ff")
        .attr("stroke-width", 2);
    const pulsar = chartLayer.append("circle")
        .attr("r", 4)
        .attr("fill", "#fff");
    
    // CENTER RADAR
    const horizontalPriceLine = overlayLayer.append("line")
        .attr("stroke", "#ffffff").attr("stroke-opacity", 0.5).attr("stroke-width", 1);
    const verticalCenterLine = overlayLayer.append("line")
        .attr("stroke", "rgba(255, 255, 255, 0.1)").attr("stroke-dasharray", "4,4").attr("stroke-width", 1);

    // PRICE TAG
    const priceTagBg = priceTagLayer.append("rect").attr("fill", "#2862ff").attr("rx", 4).attr("ry", 4).attr("height", 20);
    const priceTagText = priceTagLayer.append("text").attr("fill", "#fff").style("font-size", "11px").style("font-weight", "bold").style("font-family", "Roboto Mono").attr("text-anchor", "middle").attr("alignment-baseline", "middle");

    // --- INTERACTION LOGIC (PANNING) ---
    interactionRect
        .on("mousedown", (event) => {
            isDragging.current = true;
            dragStartX.current = event.clientX;
            dragStartOffset.current = viewOffsetMs.current;
            interactionRect.style("cursor", "grabbing");
        })
        .on("mousemove", (event) => {
            const [x, y] = d3.pointer(event);
            mousePos.current = { x, y };

            if (isDragging.current) {
                const diffX = event.clientX - dragStartX.current;
                // Convert pixel drag to time (rough approx: 1px ~= 100ms depending on zoom, 
                // but simpler to use a multiplier for feel)
                const msPerPixel = (TOTAL_X_WINDOW * 1000) / containerRef.current!.clientWidth;
                
                // Dragging RIGHT (positive diff) means moving BACK in time -> Increase offset
                // Dragging LEFT (negative diff) means moving FORWARD -> Decrease offset
                let newOffset = dragStartOffset.current + (diffX * msPerPixel);
                
                // Clamp: Can't go into the future (negative offset)
                if (newOffset < 0) newOffset = 0;
                
                viewOffsetMs.current = newOffset;
                isLive.current = newOffset < 100; // Snap to live if close to 0
            }
        })
        .on("mouseup", () => {
            isDragging.current = false;
            interactionRect.style("cursor", "grab");
        })
        .on("mouseleave", () => {
            isDragging.current = false;
            mousePos.current = null;
            interactionRect.style("cursor", "grab");
        });


    const render = () => {
        const width = containerRef.current?.clientWidth || 0;
        const height = containerRef.current?.clientHeight || 0;
        if (width === 0) {
            animationFrameId.current = requestAnimationFrame(render);
            return;
        }

        // --- A. PHYSICS ENGINE ---
        const diff = targetPriceRef.current - currentDisplayedPrice.current;
        if (Math.abs(diff) > 0.001) currentDisplayedPrice.current += diff * 0.10; 
        else currentDisplayedPrice.current = targetPriceRef.current;

        // REDUCED: Jitter toned down to 10% of previous value
        const wanderStep = (Math.random() - 0.5) * 0.005; 
        liveJitterRef.current += wanderStep;
        liveJitterRef.current *= 0.95; 

        const organicPrice = currentDisplayedPrice.current + liveJitterRef.current;
        const now = Date.now();

        // --- B. RECORD HISTORY ---
        if (now - lastRecordedTimeRef.current > 50) { 
            dataRef.current.push({ time: now, value: organicPrice });
            lastRecordedTimeRef.current = now;
        }
        
        // Data for rendering is History + Current Tip
        const renderData = [...dataRef.current, { time: now, value: organicPrice }];

        // --- C. VIEWPORT CALCULATION (Interactive) ---
        // 1. Determine "Center Time"
        // If Live: Center = Now
        // If Panning: Center = Now - Offset
        // const effectiveCenterTime = now + viewOffsetMs.current; // Dragging right adds offset? No, dragging right moves view left.
        // Let's correct logic: 
        // Drag right (Move View Left) -> Look at Past -> Offset > 0.
        // Actually, d3 zoom logic is simpler:
        // Let's treat viewOffsetMs as "How far BACK from NOW is the center".
        
        const centerTime = now - viewOffsetMs.current;

        const halfWindowMs = (TOTAL_X_WINDOW * 1000) / 2;
        const xMin = centerTime - halfWindowMs;
        const xMax = centerTime + halfWindowMs;

        // --- D. AUTO-SCALE Y-AXIS ---
        // Find min/max price currently visible on screen
        const visiblePoints = renderData.filter(d => d.time >= xMin && d.time <= xMax);
        
        // Default to current price if no history visible (rare)
        let minVal = organicPrice;
        let maxVal = organicPrice;
        
        if (visiblePoints.length > 0) {
            const minP = d3.min(visiblePoints, d => d.value) || minVal;
            const maxP = d3.max(visiblePoints, d => d.value) || maxVal;
            
            // If we are LIVE, ensure the current organic price is included in bounds calculation
            if (isLive.current) {
                if (organicPrice < minVal) minVal = organicPrice;
                if (organicPrice > maxVal) maxVal = organicPrice;
            } else {
                // If panning, we just use visible history min/max
                minVal = minP;
                maxVal = maxP;
            }
        }

        let range = maxVal - minVal;
        if (range < 5) range = 5; // Minimum zoom
        const padding = range * 0.2; // 20% padding
        
        if (!isInitialized.current) {
             currentYMin.current = minVal - padding;
             currentYMax.current = maxVal + padding;
             isInitialized.current = true;
        } else {
             currentYMin.current += ((minVal - padding) - currentYMin.current) * 0.1;
             currentYMax.current += ((maxVal + padding) - currentYMax.current) * 0.1;
        }

        const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width - margin.right]);
        const yScale = d3.scaleLinear().domain([currentYMin.current, currentYMax.current]).range([height - margin.bottom, margin.top]);

        // --- E. DRAW GRID ---
        gridLayer.selectAll("*").remove();
        axisLayer.selectAll(".axis-text").remove();

        // Center Lines
        const centerX = (width - margin.right) / 2;
        verticalCenterLine.attr("x1", centerX).attr("x2", centerX).attr("y1", margin.top).attr("y2", height - margin.bottom);
        
        // Price Line: Always shows the LIVE price, even if you pan back (as a reference)
        const livePriceY = yScale(organicPrice); 
        horizontalPriceLine.attr("x1", 0).attr("x2", width).attr("y1", livePriceY).attr("y2", livePriceY);

        const tickStep = getSmartTickStep(currentYMin.current, currentYMax.current, 8);
        const startY = Math.ceil(currentYMin.current / tickStep) * tickStep;

        for (let v = startY; v <= currentYMax.current; v += tickStep) {
            const y = yScale(v);
            if (y > margin.top && y < height - margin.bottom) {
                gridLayer.append("line").attr("x1", 0).attr("x2", width - margin.right).attr("y1", y).attr("y2", y).attr("stroke", "#242832").attr("stroke-dasharray", "3,3");
                axisLayer.append("text").attr("class", "axis-text").attr("x", width - 50).attr("y", y + 4).attr("fill", "#FFFFFF").style("font-size", "12px").style("font-weight", "bold").style("font-family", "Roboto Mono").text(tickStep < 1 ? v.toFixed(2) : v.toFixed(0));
            }
        }

        const xTicks = xScale.ticks(d3.timeSecond.every(TICK_GAP_X_SECONDS)!);
        xTicks.forEach(d => {
            const x = xScale(d);
            if (x >= 0 && x <= width - margin.right) {
                gridLayer.append("line").attr("x1", x).attr("x2", x).attr("y1", margin.top).attr("y2", height - margin.bottom).attr("stroke", "#242832").attr("stroke-dasharray", "3,3");
                axisLayer.append("text").attr("class", "axis-text").attr("x", x).attr("y", height - 5).attr("text-anchor", "middle").attr("fill", "#FFFFFF").style("font-size", "11px").style("font-weight", "bold").style("font-family", "Roboto Mono").text(d3.timeFormat("%H:%M:%S")(d));
            }
        });

        // --- F. DRAW CHART ---
        // Filter data to only draw what's visible (Performance)
        const visibleDataForLine = renderData.filter(d => d.time > xMin - 5000 && d.time < xMax + 5000);
        
        if (visibleDataForLine.length > 1) {
            const areaFn = d3.area<DataPoint>().x(d => xScale(d.time)).y0(height).y1(d => yScale(d.value)).curve(d3.curveLinear);
            const lineFn = d3.line<DataPoint>().x(d => xScale(d.time)).y(d => yScale(d.value)).curve(d3.curveLinear);
            areaPath.datum(visibleDataForLine).attr("d", areaFn);
            linePath.datum(visibleDataForLine).attr("d", lineFn);
        }
        
        // Pulsar (Only visible if we are close to live, or if the live point is in view)
        const pulsarX = xScale(now);
        if (pulsarX > 0 && pulsarX < width - margin.right) {
            pulsar.attr("cx", pulsarX).attr("cy", livePriceY).style("opacity", 1);
        } else {
            pulsar.style("opacity", 0);
        }

        // --- G. PRICE TAG ---
        const tagX = width - margin.right + 5;
        const tagWidth = 55;
        priceTagBg.attr("x", tagX).attr("y", livePriceY - 10).attr("width", tagWidth);
        priceTagText.attr("x", tagX + (tagWidth / 2)).attr("y", livePriceY + 1).text(organicPrice.toFixed(0));

        // --- H. CROSSHAIR ---
        crosshairLayer.selectAll("*").remove();
        labelLayer.selectAll(".mouse-label").remove();
        labelLayer.selectAll(".mouse-label-bg").remove();

        if (mousePos.current) {
            const { x, y } = mousePos.current;
            if (x < width - margin.right && y > margin.top && y < height - margin.bottom) {
                crosshairLayer.append("line").attr("x1", x).attr("x2", x).attr("y1", margin.top).attr("y2", height - margin.bottom).attr("stroke", "#ffffff").attr("stroke-dasharray", "2,2").attr("stroke-opacity", 0.7);
                crosshairLayer.append("line").attr("x1", 0).attr("x2", width - margin.right).attr("y1", y).attr("y2", y).attr("stroke", "#ffffff").attr("stroke-dasharray", "2,2").attr("stroke-opacity", 0.7);

                const mousePrice = yScale.invert(y);
                const priceTxt = mousePrice.toFixed(2);
                labelLayer.append("rect").attr("class", "mouse-label-bg").attr("x", width - margin.right).attr("y", y - 10).attr("width", margin.right).attr("height", 20).attr("fill", "#333");
                labelLayer.append("text").attr("class", "mouse-label").attr("x", width - 30).attr("y", y + 4).attr("text-anchor", "middle").attr("fill", "#fff").style("font-size", "11px").style("font-family", "Roboto Mono").text(priceTxt);

                const mouseTime = xScale.invert(x);
                const timeTxt = d3.timeFormat("%H:%M:%S")(mouseTime);
                labelLayer.append("rect").attr("class", "mouse-label-bg").attr("x", x - 30).attr("y", height - margin.bottom).attr("width", 60).attr("height", 20).attr("fill", "#333");
                labelLayer.append("text").attr("class", "mouse-label").attr("x", x).attr("y", height - 5).attr("text-anchor", "middle").attr("fill", "#fff").style("font-size", "11px").style("font-family", "Roboto Mono").text(timeTxt);
            }
        }

        animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Cleanup: Lazy (10 mins)
  useEffect(() => {
     const interval = setInterval(() => {
         const cutoff = Date.now() - (600 * 1000); 
         if (dataRef.current.length > 0 && dataRef.current[0].time < cutoff) {
             dataRef.current = dataRef.current.filter(d => d.time > cutoff);
         }
     }, 5000);
     return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className={styles.chartContainer}>
      <svg ref={svgRef} width="100%" height="100%" style={{ display: 'block' }} />
    </div>
  );
});

CryptoChartD3.displayName = 'CryptoChartD3';