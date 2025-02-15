import React from 'react';

interface ScoopeeInputProps {
  scoopeeInput: string;
  setScoopeeInput: (input: string) => void;
  scoopees: { value: number; count: number }[];
}

const ScoopeeInput: React.FC<ScoopeeInputProps> = ({ scoopeeInput, setScoopeeInput, scoopees }) => {
  return (
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
        Current cards: {scoopees.map(({ value, count }) => 
          `${value}${count > 1 ? ` (×${count})` : ''}`
        ).join(", ")}
      </div>
    </div>
  );
};

export default ScoopeeInput;