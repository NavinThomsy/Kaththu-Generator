import React, { useState } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  onFormattingChange: (formatting: { bold: boolean; italic: boolean; underline: boolean }) => void;
}

export function TextEditor({ value, onChange, formatting, onFormattingChange }: TextEditorProps) {
  const toggleFormat = (format: 'bold' | 'italic' | 'underline') => {
    onFormattingChange({
      ...formatting,
      [format]: !formatting[format]
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => toggleFormat('bold')}
          className={`p-2 rounded border transition-colors ${
            formatting.bold
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFormat('italic')}
          className={`p-2 rounded border transition-colors ${
            formatting.italic
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFormat('underline')}
          className={`p-2 rounded border transition-colors ${
            formatting.underline
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <Underline className="w-5 h-5" />
        </button>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message here..."
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
        style={{
          fontWeight: formatting.bold ? 'bold' : 'normal',
          fontStyle: formatting.italic ? 'italic' : 'normal',
          textDecoration: formatting.underline ? 'underline' : 'none'
        }}
      />
    </div>
  );
}
