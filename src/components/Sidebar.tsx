import React from 'react';
import { Trash2, ExternalLink, Mail, Clock } from 'lucide-react';

export interface SavedLetter {
  id: string;
  recipient: string;
  excerpt: string;
  createdAt: string;
  url: string;
}

interface SidebarProps {
  letters: SavedLetter[];
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
}

export function Sidebar({ letters, onDelete, onOpen }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden shrink-0">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-serif text-gray-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          Letter History
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Local history of your sent letters.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {letters.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No letters sent yet.</p>
          </div>
        ) : (
          letters.map((letter) => (
            <div 
              key={letter.id} 
              className="group bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-lg p-3 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-800 text-sm truncate w-40">
                    To: {letter.recipient || 'Untitled'}
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(letter.createdAt).toLocaleDateString()} • {new Date(letter.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button 
                  onClick={() => onDelete(letter.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="text-xs text-gray-500 line-clamp-2 mb-3 font-serif italic">
                "{letter.excerpt}"
              </div>

              <button
                onClick={() => onOpen(letter.url)}
                className="w-full flex items-center justify-center gap-2 text-xs bg-gray-900 text-white py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Open Link
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
