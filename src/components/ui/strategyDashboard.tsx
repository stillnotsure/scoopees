
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Bar, ResponsiveContainer, Cell } from 'recharts';

const StrategyDashboard = () => {
  const [scoopeeInput, setScoopeeInput] = useState("1 (2), 2 (1), 3-5 (2)");
  const [scooperInput, setScooperInput] = useState("5-7 (2), 8 (3)");
  
  const parseInput = (input) => {
    try {
      const cardCounts = new Map();
      
      input.split(',').forEach(part => {
        part = part.trim();
        
        if (part.includes('-')) {
          const [rangeStr, multiplierStr] = part.split('(');
          const [start, end] = rangeStr.trim().split('-').map(n => parseInt(n));
          const multiplier = parseInt(multiplierStr?.replace(')', '')) || 1;
          
          for (let i = start; i <= end; i++) {
            cardCounts.set(i, (cardCounts.get(i) || 0) + multiplier);
          }
        } else {
          const [numStr, multiplierStr] = part.split('(');
          const num = parseInt(numStr);
          const multiplier = parseInt(multiplierStr?.replace(')', '')) || 1;
          
          if (!isNaN(num)) {
            cardCounts.set(num, (cardCounts.get(num) || 0) + multiplier);
          }
        }
      });
      
      return Array.from(cardCounts.entries()).map(([value, count]) => ({
        value,
        count
      }));
    } catch (e) {
      console.error("Error parsing input:", e);
      return [];
    }
  };

  const scoopees = useMemo(() => parseInput(scoopeeInput), [scoopeeInput]);
  const scoopers = useMemo(() => parseInput(scooperInput), [scooperInput]);
  
  const possibleSums = useMemo(() => {
    const sums = [];
    const cards = scoopees.flatMap(({value, count}) => 
      Array(count).fill(value)
    );
    
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        sums.push({
          sum: cards[i] + cards[j],
          combination: `${cards[i]}+${cards[j]}`
        });
      }
    }
    return sums;
  }, [scoopees]);

  const sumFrequency = useMemo(() => {
    const frequency = {};
    possibleSums.forEach(({sum}) => {
      frequency[sum] = (frequency[sum] || 0) + 1;
    });
    return Object.entries(frequency)
      .map(([sum, freq]) => ({
        value: parseInt(sum),
        frequency: freq
      }))
      .sort((a, b) => a.value - b.value);
  }, [possibleSums]);

  const scooperEffectiveness = useMemo(() => 
    scoopers.map(({value, count}) => ({
      value,
      count,
      combinations: possibleSums.filter(sum => sum.sum === value).length,
      probability: possibleSums.filter(sum => sum.sum === value).length / possibleSums.length
    }))
  , [scoopers, possibleSums]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]?.payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-white text-gray-900 p-2 border border-gray-200 rounded shadow">
          <p className="font-semibold">Sum: {data.value}</p>
          <p>Combinations: {data.frequency}</p>
          <p>{data.isValidScooper ? "✓ Valid Scooper value" : "✗ Not a Scooper value"}</p>
        </div>
      );
    }
    return null;
  };  

  return (
    <div className="p-4 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Strategic Analysis Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scoopee Cards
              </label>
              <input
                type="text"
                value={scoopeeInput}
                onChange={(e) => setScoopeeInput(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., '1 (2), 2-4 (3)'"
              />
              <div className="text-sm text-gray-500">
                Current cards: {scoopees.map(({value, count}) => 
                  `${value}${count > 1 ? ` (×${count})` : ''}`
                ).join(", ")}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Scooper Cards
              </label>
              <input
                type="text"
                value={scooperInput}
                onChange={(e) => setScooperInput(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., '5 (2), 6-8 (1)'"
              />
              <div className="text-sm text-gray-500">
                Current cards: {scoopers.map(({value, count}) => 
                  `${value}${count > 1 ? ` (×${count})` : ''}`
                ).join(", ")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Sum Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sumFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="value" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="frequency"
                      fill="#94A3B8"
                    >
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
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-semibold">Sum: {data.value}</p>
        <p>Combinations: {data.frequency}</p>
        <p>{data.isValidScooper ? "Valid Scooper value" : "Not a Scooper value"}</p>
      </div>
    );
  }
  return null;
};

export default StrategyDashboard;