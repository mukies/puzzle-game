import React, { SetStateAction } from "react";
import { ChevronDown } from "lucide-react";

function LevelSelector({
  onchange,
  level,
}: {
  onchange: React.Dispatch<SetStateAction<number>>;
  level: number;
}) {
  return (
    <div className="relative inline-block w-48">
      <select
        value={level}
        onChange={(e) => onchange(Number(e.target.value))}
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <option key={value} value={value}>
            Level {value}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

export default LevelSelector;
