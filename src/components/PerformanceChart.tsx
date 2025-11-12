import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const performanceData = {
  '1W': [
    { date: 'Mon', value: 1200000 },
    { date: 'Tue', value: 1215000 },
    { date: 'Wed', value: 1208000 },
    { date: 'Thu', value: 1230000 },
    { date: 'Fri', value: 1245000 },
    { date: 'Sat', value: 1245000 },
    { date: 'Sun', value: 1245678.50 },
  ],
  '1M': [
    { date: 'Week 1', value: 1150000 },
    { date: 'Week 2', value: 1180000 },
    { date: 'Week 3', value: 1200000 },
    { date: 'Week 4', value: 1245678.50 },
  ],
  '3M': [
    { date: 'Month 1', value: 1050000 },
    { date: 'Month 2', value: 1150000 },
    { date: 'Month 3', value: 1245678.50 },
  ],
  '1Y': [
    { date: 'Jan', value: 950000 },
    { date: 'Feb', value: 980000 },
    { date: 'Mar', value: 1020000 },
    { date: 'Apr', value: 1050000 },
    { date: 'May', value: 1080000 },
    { date: 'Jun', value: 1100000 },
    { date: 'Jul', value: 1150000 },
    { date: 'Aug', value: 1180000 },
    { date: 'Sep', value: 1200000 },
    { date: 'Oct', value: 1220000 },
    { date: 'Nov', value: 1245678.50 },
  ],
  'ALL': [
    { date: '2023', value: 800000 },
    { date: '2024', value: 1000000 },
    { date: '2025', value: 1245678.50 },
  ],
};

type Period = '1W' | '1M' | '3M' | '1Y' | 'ALL';

export function PerformanceChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1M');

  const formatValue = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900">Portfolio Performance</h3>
        <div className="flex gap-1">
          {(['1W', '1M', '3M', '1Y', 'ALL'] as Period[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData[selectedPeriod]}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={formatValue} />
            <Tooltip 
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Portfolio Value']}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
