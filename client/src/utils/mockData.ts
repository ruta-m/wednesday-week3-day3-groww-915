import type { Stock, Holding } from "@/types";

// 10 real NSE stocks with realistic starting prices
export const MOCK_STOCKS: Stock[] = [
  { symbol:"TCS", name:"Tata Consultancy Services", sector:"IT",
    price:3820, open:3800, high:3855, low:3795, prevClose:3810,
    change:10, changePercent:0.26, volume:1250000 },

  { symbol:"INFY", name:"Infosys Limited", sector:"IT",
    price:1650, open:1635, high:1662, low:1628, prevClose:1640,
    change:10, changePercent:0.61, volume:980000 },

  { symbol:"HDFCBANK", name:"HDFC Bank Ltd", sector:"Banking",
    price:1520, open:1505, high:1532, low:1498, prevClose:1510,
    change:10, changePercent:0.66, volume:1500000 },

  { symbol:"ICICIBANK", name:"ICICI Bank Ltd", sector:"Banking",
    price:1080, open:1068, high:1092, low:1060, prevClose:1070,
    change:10, changePercent:0.93, volume:1340000 },

  { symbol:"RELIANCE", name:"Reliance Industries", sector:"Energy",
    price:2940, open:2925, high:2960, low:2910, prevClose:2930,
    change:10, changePercent:0.34, volume:1700000 },

  { symbol:"HINDUNILVR", name:"Hindustan Unilever", sector:"FMCG",
    price:2485, open:2470, high:2498, low:2460, prevClose:2475,
    change:10, changePercent:0.40, volume:620000 },

  { symbol:"ITC", name:"ITC Limited", sector:"FMCG",
    price:430, open:425, high:434, low:422, prevClose:428,
    change:2, changePercent:0.47, volume:2100000 },

  { symbol:"LT", name:"Larsen & Toubro", sector:"Engineering",
    price:3650, open:3620, high:3685, low:3605, prevClose:3635,
    change:15, changePercent:0.41, volume:540000 },

  { symbol:"SBIN", name:"State Bank of India", sector:"Banking",
    price:780, open:770, high:788, low:768, prevClose:775,
    change:5, changePercent:0.65, volume:2600000 },

  { symbol:"BHARTIARTL", name:"Bharti Airtel", sector:"Telecom",
    price:1225, open:1210, high:1238, low:1205, prevClose:1215,
    change:10, changePercent:0.82, volume:910000 },

  { symbol:"ASIANPAINT", name:"Asian Paints", sector:"Chemicals",
    price:3050, open:3030, high:3075, low:3015, prevClose:3040,
    change:10, changePercent:0.33, volume:430000 }
];

// 5 sample portfolio holdings
export const MOCK_HOLDINGS: Holding[] = [
  { symbol:"TCS",      qty:10, avgBuyPrice:3700 },
  { symbol:"INFY",     qty:25, avgBuyPrice:1450 },
  { symbol:"HDFCBANK", qty:15, avgBuyPrice:1580 },
];

// Generate a random order book around a given price
export function generateOrderBook(price: number) {
  const bids = Array.from({ length: 5 }, (_, i) => ({
    price: +(price - (i+1) * 0.5).toFixed(2),
    qty:   Math.floor(Math.random() * 500 + 100),
  }));
  const asks = Array.from({ length: 5 }, (_, i) => ({
    price: +(price + (i+1) * 0.5).toFixed(2),
    qty:   Math.floor(Math.random() * 500 + 100),
  }));
  return { bids, asks };
}

// Generate 40 historical prices near a base price (for chart)
export function generateHistory(base: number, points = 40): number[] {
  return Array.from({ length: points }, () =>
    +(base * (1 + (Math.random() - 0.5) * 0.015)).toFixed(2)
  );
}
