// A Stock represents one NSE company
export interface Stock {
  symbol:        string;   // "TCS", "INFY", etc.
  name:          string;   // "Tata Consultancy Services"
  sector:        string;   // "IT", "Bank", "Energy"
  price:         number;   // Current market price
  open:          number;   // Opening price of the day
  high:          number;   // Highest price today
  low:           number;   // Lowest price today
  prevClose:     number;   // Yesterday closing price
  change:        number;   // price - prevClose
  changePercent: number;   // (change / prevClose) * 100
  volume:        number;   // Number of shares traded
  marketCap?:    number;   // Optional: total company value
}

// A Holding is one stock in the user portfolio
export interface Holding {
  symbol:      string;  // Which stock
  qty:         number;  // How many shares owned
  avgBuyPrice: number;  // Average price paid per share
}

// Order book has buy orders (bids) and sell orders (asks)
export interface OrderBookLevel {
  price: number;  // Price point
  qty:   number;  // Quantity at this price
}
export interface OrderBook {
  symbol: string;
  bids:   OrderBookLevel[];  // Buyers waiting
  asks:   OrderBookLevel[];  // Sellers waiting
}

// Event log entries for the live feed panel
export type EventKind = "connect" | "disconnect" | "price" | "ping" | "error" | "api";
export interface EventLogEntry {
  id:   number;
  msg:  string;
  kind: EventKind;
  time: string;
}

// Which tab is visible
export type TabId = "market" | "portfolio" | "orderbook" | "watchlist";
