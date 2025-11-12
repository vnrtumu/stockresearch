import { Card } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendingStocksProps {
  onStockClick: (symbol: string) => void;
}

const trendingStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+2.34%', isPositive: true, volume: '12.5M' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,589.50', change: '+1.87%', isPositive: true, volume: '8.3M' },
  { symbol: 'INFY', name: 'Infosys Limited', price: '1,445.25', change: '+3.12%', isPositive: true, volume: '15.2M' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1,623.40', change: '-0.45%', isPositive: false, volume: '9.7M' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '934.60', change: '+1.23%', isPositive: true, volume: '11.4M' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '872.30', change: '+2.56%', isPositive: true, volume: '7.8M' },
];

export function TrendingStocks({ onStockClick }: TrendingStocksProps) {
  return (
    <div>
      <h2 className="text-gray-900 mb-4">Trending Stocks</h2>
      <Card className="p-6">
        <div className="space-y-4">
          {trendingStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              onClick={() => onStockClick(stock.symbol)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-500">{stock.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-gray-900">₹{stock.price}</p>
                  <p className="text-sm text-gray-500">Vol: {stock.volume}</p>
                </div>
                <div className="flex items-center gap-2 min-w-[100px] justify-end">
                  {stock.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={stock.isPositive ? 'text-green-600' : 'text-red-600'}>
                    {stock.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
