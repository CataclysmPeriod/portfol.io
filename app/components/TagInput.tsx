"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { searchTags } from "@/app/actions/tag";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ value, onChange }: TagInputProps) {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    const fetchSuggestions = async () => {
        if (inputValue.trim().length > 0) {
            const results = await searchTags(inputValue);
            // Filter out already selected tags
            setSuggestions(results.filter(t => !value.includes(t.name)));
        } else {
            setSuggestions([]);
        }
    };
    const debounce = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounce);
  }, [inputValue, value]);

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
    setInputVisible(false);
    setSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
          addTag(suggestions[selectedIndex]?.name || inputValue);
      } else {
          addTag(inputValue);
      }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
        setInputVisible(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/30 text-sm bg-white/5"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-pink transition-colors"
          >
            <X size={14} />
          </button>
        </span>
      ))}

      {inputVisible ? (
        <div className="relative">
            <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
                // Delay hiding to allow click on suggestion
                setTimeout(() => {
                    if (inputValue) addTag(inputValue);
                    else setInputVisible(false);
                }, 200);
            }}
            className="px-3 py-1 rounded-full border border-cyan bg-transparent outline-none min-w-[100px] text-sm"
            placeholder="type..."
            />
            {suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[150px] bg-navy border border-white/20 rounded-md shadow-lg z-50 overflow-hidden">
                    {suggestions.map((suggestion, idx) => (
                        <div 
                            key={suggestion.id}
                            className={`px-3 py-2 text-sm cursor-pointer ${idx === selectedIndex ? 'bg-cyan text-navy' : 'hover:bg-white/10'}`}
                            onMouseDown={() => addTag(suggestion.name)} // onMouseDown fires before onBlur
                        >
                            {suggestion.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setInputVisible(true)}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:border-cyan hover:text-cyan transition-colors"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
