import React from 'react';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer } from 'recharts';
import { Card } from './card';

interface ScooperEffectivenessChartProps {
  scooperEffectiveness: { value: number; combinations: number }[];
}

const ScooperEffectivenessChart: React.FC<ScooperEffectivenessChartProps> = ({ scooperEffectiveness }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Scooper Card Effectiveness</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scooperEffectiveness}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="combinations" 
              stroke="#4F46E5" 
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Shows how many Scoopee combinations can make each Scooper value
      </p>
    </Card>
  );
};

export default ScooperEffectivenessChart;