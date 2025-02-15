import React from 'react';
import { Card } from './card';

interface StrategicInsightsProps {
  sumFrequency: { value: number; frequency: number }[];
  scooperEffectiveness: { value: number; combinations: number; count: number }[];
  possibleSums: { sum: number; combination: string }[];
}

const StrategicInsights: React.FC<StrategicInsightsProps> = ({ sumFrequency, scooperEffectiveness, possibleSums }) => {
  return (
    <Card className="mt-4 p-4">
      <h3 className="text-lg font-semibold mb-2">Strategic Insights</h3>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>
            Most common sums: {sumFrequency.sort((a, b) => b.frequency - a.frequency)
              .slice(0, 3)
              .map(item => `${item.value} (${item.frequency} combinations)`)
              .join(', ')}
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>
            Most versatile Scoopers: {scooperEffectiveness
              .sort((a, b) => b.combinations - a.combinations)
              .slice(0, 3)
              .map(item => `${item.value} (${item.combinations} combinations, ×${item.count})`)
              .join(', ')}
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          <span>
            Total possible combinations: {possibleSums.length}
          </span>
        </li>
      </ul>
    </Card>
  );
};

export default StrategicInsights;