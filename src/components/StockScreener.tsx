import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface StockScreenerProps {
  onStockClick: (symbol: string) => void;
}

const allStocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+2.34%', isPositive: true, sector: 'Energy', marketCap: '16.5T' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,589.50', change: '+1.87%', isPositive: true, sector: 'IT', marketCap: '13.2T' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1,623.40', change: '-0.45%', isPositive: false, sector: 'Banking', marketCap: '11.8T' },
  { symbol: 'INFY', name: 'Infosys Limited', price: '1,445.25', change: '+3.12%', isPositive: true, sector: 'IT', marketCap: '6.1T' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '934.60', change: '+1.23%', isPositive: true, sector: 'Banking', marketCap: '6.5T' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '872.30', change: '+2.56%', isPositive: true, sector: 'Telecom', marketCap: '5.2T' },
  { symbol: 'WIPRO', name: 'Wipro Limited', price: '412.70', change: '+1.45%', isPositive: true, sector: 'IT', marketCap: '2.3T' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: '3,245.70', change: '-3.45%', isPositive: false, sector: 'Consumer', marketCap: '3.1T' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', price: '9,876.50', change: '+0.89%', isPositive: true, sector: 'Auto', marketCap: '3.0T' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: '1,089.30', change: '-0.67%', isPositive: false, sector: 'Pharma', marketCap: '2.6T' },
];

export function StockScreener({ onStockClick }: StockScreenerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sector, setSector] = useState('all');

  const filteredStocks = allStocks.filter((stock) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sector === 'all' || stock.sector === sector;
    return matchesSearch && matchesSector;
  });

  return (
    <div>
      <h2 className="text-gray-900 mb-4">Stock Screener</h2>
      
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by symbol or company name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Banking">Banking</SelectItem>
              <SelectItem value="Energy">Energy</SelectItem>
              <SelectItem value="Auto">Auto</SelectItem>
              <SelectItem value="Pharma">Pharma</SelectItem>
              <SelectItem value="Consumer">Consumer</SelectItem>
              <SelectItem value="Telecom">Telecom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setSector('all'); }}>
            Reset
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Symbol</th>
                <th className="text-left py-3 px-4 text-gray-700">Company</th>
                <th className="text-left py-3 px-4 text-gray-700">Sector</th>
                <th className="text-right py-3 px-4 text-gray-700">Price</th>
                <th className="text-right py-3 px-4 text-gray-700">Change</th>
                <th className="text-right py-3 px-4 text-gray-700">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onStockClick(stock.symbol)}
                >
                  <td className="py-4 px-4 text-gray-900">{stock.symbol}</td>
                  <td className="py-4 px-4 text-gray-600">{stock.name}</td>
                  <td className="py-4 px-4 text-gray-600">{stock.sector}</td>
                  <td className="py-4 px-4 text-right text-gray-900">₹{stock.price}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {stock.isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={stock.isPositive ? 'text-green-600' : 'text-red-600'}>
                        {stock.change}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">{stock.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
