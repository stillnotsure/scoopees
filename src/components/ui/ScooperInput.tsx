import React from 'react';

interface ScooperInputProps {
  scooperInput: string;
  setScooperInput: (input: string) => void;
  scoopers: { value: number; count: number }[];
}

const ScooperInput: React.FC<ScooperInputProps> = ({ scooperInput, setScooperInput, scoopers }) => {
  return (
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
        Current cards: {scoopers.map(({ value, count }) => 
          `${value}${count > 1 ? ` (×${count})` : ''}`
        ).join(", ")}
      </div>
    </div>
  );
};

export default ScooperInput;