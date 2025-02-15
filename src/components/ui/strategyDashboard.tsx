import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import ScoopeeInput from './ScoopeeInput';
import ScooperInput from './ScooperInput';
import SumDistributionChart from './SumDistributionChart';
import ScooperEffectivenessChart from './ScooperEffectivenessChart';
import StrategicInsights from './StrategicInsights';

interface CardCount {
  value: number;
  count: number;
}

interface Sum {
  sum: number;
  combination: string;
}

interface Frequency {
  value: number;
  frequency: number;
}

interface ScooperEffectiveness {
  value: number;
  count: number;
  combinations: number;
  probability: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: { value: number; frequency: number; isValidScooper: boolean } }[];
}

const StrategyDashboard = () => {
  const [scoopeeInput, setScoopeeInput] = useState<string>("1 (2), 2 (1), 3-5 (2)");
  const [scooperInput, setScooperInput] = useState<string>("5-7 (2), 8 (3)");
  
  const parseInput = (input: string): CardCount[] => {
    try {
      const cardCounts = new Map<number, number>();
      
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
  
  const possibleSums = useMemo<Sum[]>(() => {
    const sums: Sum[] = [];
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

  const sumFrequency = useMemo<Frequency[]>(() => {
    const frequency: { [key: number]: number } = {};
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

  const scooperEffectiveness = useMemo<ScooperEffectiveness[]>(() => 
    scoopers.map(({value, count}) => ({
      value,
      count,
      combinations: possibleSums.filter(sum => sum.sum === value).length,
      probability: possibleSums.filter(sum => sum.sum === value).length / possibleSums.length
    }))
  , [scoopers, possibleSums]);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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
            <ScoopeeInput 
              scoopeeInput={scoopeeInput} 
              setScoopeeInput={setScoopeeInput} 
              scoopees={scoopees} 
            />
            <ScooperInput 
              scooperInput={scooperInput} 
              setScooperInput={setScooperInput} 
              scoopers={scoopers} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SumDistributionChart 
              sumFrequency={sumFrequency} 
              scoopers={scoopers} 
              CustomTooltip={CustomTooltip} 
            />
            <ScooperEffectivenessChart 
              scooperEffectiveness={scooperEffectiveness} 
            />
          </div>

          <StrategicInsights 
            sumFrequency={sumFrequency} 
            scooperEffectiveness={scooperEffectiveness} 
            possibleSums={possibleSums} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyDashboard;