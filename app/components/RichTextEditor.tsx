"use client";
import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string) => {
    document.execCommand(command, false, undefined);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Sync initial value (only once to avoid cursor jumping)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
        if (value === "") editorRef.current.innerHTML = "";
    }
  }, [value]);

  return (
    <div className="bg-white text-navy rounded border-2 border-transparent focus-within:border-cyan transition-colors overflow-hidden">
      <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-100 text-black">
        <button 
            type="button" 
            onClick={() => exec('bold')} 
            className="font-bold px-3 py-1 hover:bg-gray-300 rounded min-w-[30px]"
            title="Bold"
        >
            B
        </button>
        <button 
            type="button" 
            onClick={() => exec('italic')} 
            className="italic px-3 py-1 hover:bg-gray-300 rounded min-w-[30px]"
            title="Italic"
        >
            I
        </button>
        <button 
            type="button" 
            onClick={() => exec('underline')} 
            className="underline px-3 py-1 hover:bg-gray-300 rounded min-w-[30px]"
            title="Underline"
        >
            U
        </button>
      </div>
      <div 
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] outline-none font-mono"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}
