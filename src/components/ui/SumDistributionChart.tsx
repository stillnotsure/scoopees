import React from 'react';
import { BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './card';

interface SumDistributionChartProps {
  sumFrequency: { value: number; frequency: number }[];
  scoopers: { value: number; count: number }[];
  CustomTooltip: React.FC<any>;
}

const SumDistributionChart: React.FC<SumDistributionChartProps> = ({ sumFrequency, scoopers, CustomTooltip }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Sum Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sumFrequency}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="frequency" fill="#94A3B8">
              {sumFrequency.map((entry) => {
                const isValidScooper = scoopers.some(
                  scooper => scooper.value === entry.value
                );
                return (
                  <Cell 
                    key={`cell-${entry.value}`}
                    fill={isValidScooper ? '#4F46E5' : '#94A3B8'}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Blue bars represent sums that match Scooper cards
      </p>
    </Card>
  );
};

export default SumDistributionChart;