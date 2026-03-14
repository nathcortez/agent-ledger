import axios from 'axios';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Signal {
  action: 'BUY' | 'SELL' | 'HOLD';
  score: number;
  price: number;
  reason: string;
  rsi: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timestamp: number;
}

export async function fetchCandles(symbol = 'ETHUSDT', interval = '5m', limit = 100): Promise<Candle[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const response = await axios.get(url);
  return response.data.map((c: any[]) => ({
    timestamp: c[0],
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5]),
  }));
}

function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateTrend(closes: number[]): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
  const recent = closes.slice(-10);
  const ma = recent.reduce((a, b) => a + b, 0) / recent.length;
  const last = closes[closes.length - 1];
  if (last > ma * 1.005) return 'BULLISH';
  if (last < ma * 0.995) return 'BEARISH';
  return 'NEUTRAL';
}

export function analyzeSignals(candles: Candle[]): Signal {
  const closes = candles.map(c => c.close);
  const price = closes[closes.length - 1];
  const rsi = calculateRSI(closes);
  const trend = calculateTrend(closes);
  let score = 50;
  const reasons: string[] = [];

  if (rsi < 30) { score += 25; reasons.push(`RSI oversold (${rsi.toFixed(1)})`); }
  else if (rsi > 70) { score -= 25; reasons.push(`RSI overbought (${rsi.toFixed(1)})`); }
  else reasons.push(`RSI neutral (${rsi.toFixed(1)})`);

  if (trend === 'BULLISH') { score += 15; reasons.push('Uptrend detected'); }
  else if (trend === 'BEARISH') { score -= 15; reasons.push('Downtrend detected'); }

  let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  if (score >= 65 && trend === 'BULLISH') action = 'BUY';
  else if (score <= 35 && trend === 'BEARISH') action = 'SELL';

  return {
    action,
    score: Math.max(0, Math.min(100, score)),
    price,
    reason: reasons.join(' | '),
    rsi,
    trend,
    timestamp: Date.now(),
  };
}