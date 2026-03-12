
import React from 'react';
import { cn } from '../../utils/cn';

interface RadioFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
  readOnly?: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  name,
  value,
  onChange,
  options,
  readOnly
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {options?.map((opt) => (
        <label key={opt.value} className={cn("flex items-center gap-2 cursor-pointer group", readOnly && "cursor-not-allowed opacity-70")}>
          <input 
            type="radio"
            name={name}
            className="peer sr-only"
            checked={value === opt.value}
            disabled={readOnly}
            onChange={() => onChange(opt.value)}
          />
          <div className="w-5 h-5 border-2 border-slate-300 rounded-full transition-all peer-checked:border-indigo-600 peer-checked:border-[6px] group-hover:border-indigo-400"></div>
          <span className="text-sm text-slate-600 font-medium">{opt.label}</span>
        </label>
      ))}
    </div>
  );
};
