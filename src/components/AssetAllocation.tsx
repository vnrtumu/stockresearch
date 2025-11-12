import { Card } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetAllocationProps {
  holdings: any[];
}

export function AssetAllocation({ holdings }: AssetAllocationProps) {
  // Calculate sector allocation from holdings
  const sectorMap: Record<string, number> = {};
  
  holdings.forEach((holding: any) => {
    // Simple sector mapping based on symbol (in real app, you'd have a proper sector database)
    let sector = 'Others';
    const symbol = holding.symbol?.toUpperCase() || '';
    
    if (['TCS', 'INFY', 'WIPRO', 'TECHM', 'HCLTECH'].includes(symbol)) {
      sector = 'IT';
    } else if (['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK'].includes(symbol)) {
      sector = 'Banking';
    } else if (['RELIANCE', 'ONGC', 'BPCL', 'IOC'].includes(symbol)) {
      sector = 'Energy';
    } else if (['BHARTIARTL', 'IDEA'].includes(symbol)) {
      sector = 'Telecom';
    } else if (['ASIANPAINT', 'NESTLEIND', 'HINDUNILVR', 'ITC', 'BRITANNIA'].includes(symbol)) {
      sector = 'Consumer';
    } else if (['MARUTI', 'TATAMOTORS', 'M&M', 'BAJAJ-AUTO'].includes(symbol)) {
      sector = 'Auto';
    }
    
    sectorMap[sector] = (sectorMap[sector] || 0) + holding.currentValue;
  });

  const totalValue = Object.values(sectorMap).reduce((sum, val) => sum + val, 0);
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];
  const allocationData = Object.entries(sectorMap).map(([name, value], index) => ({
    name,
    value: totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0,
    color: colors[index % colors.length],
  }));

  if (holdings.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Asset Allocation</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400 text-center">No data available<br/>Connect a broker to see allocation</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-gray-900 mb-4">Asset Allocation</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 mt-4">
        {allocationData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}