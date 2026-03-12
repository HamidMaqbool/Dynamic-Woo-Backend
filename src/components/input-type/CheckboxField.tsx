
import React from 'react';
import { cn } from '../../utils/cn';

interface CheckboxFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
  placeholder?: string;
  title?: string;
  readOnly?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  value,
  onChange,
  placeholder,
  title,
  readOnly
}) => {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer group", readOnly && "cursor-not-allowed opacity-70")}>
      <div className="relative flex items-center">
        <input 
          type="checkbox"
          className="peer sr-only"
          checked={!!value}
          disabled={readOnly}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-5 h-5 border-2 border-slate-300 rounded transition-all peer-checked:bg-indigo-600 peer-checked:border-indigo-600 group-hover:border-indigo-400"></div>
        <svg className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm text-slate-600 font-medium">{placeholder || title}</span>
    </label>
  );
};
