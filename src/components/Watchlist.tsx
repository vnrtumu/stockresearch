import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Star, Trash2 } from 'lucide-react';

interface WatchlistProps {
  onStockClick: (symbol: string) => void;
}

export function Watchlist({ onStockClick }: WatchlistProps) {
  const [watchlistStocks, setWatchlistStocks] = useState([
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+2.34%', isPositive: true },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,589.50', change: '+1.87%', isPositive: true },
    { symbol: 'INFY', name: 'Infosys Limited', price: '1,445.25', change: '+3.12%', isPositive: true },
  ]);

  const removeFromWatchlist = (symbol: string) => {
    setWatchlistStocks(watchlistStocks.filter(stock => stock.symbol !== symbol));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        <h2 className="text-gray-900">My Watchlist</h2>
      </div>

      {watchlistStocks.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Your watchlist is empty</p>
          <p className="text-sm text-gray-400">Add stocks to track their performance</p>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-4">
            {watchlistStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onStockClick(stock.symbol)}
                >
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-gray-900">{stock.symbol}</p>
                      <p className="text-sm text-gray-500">{stock.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-gray-900">₹{stock.price}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {stock.isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-sm ${stock.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWatchlist(stock.symbol)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
