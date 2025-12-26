import { useState, KeyboardEvent } from 'react';

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  error?: string;
}

const SkillInput = ({ skills, onChange, error }: SkillInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!skills.includes(trimmedValue)) {
        onChange([...skills, trimmedValue]);
        setInputValue('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter' : 'Add another skill...'}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SkillInput;

