import React from 'react';
import { Trash2, Mail, PanelLeftClose } from 'lucide-react';

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
  onClose: () => void;
}

export function Sidebar({ letters, onDelete, onOpen, onClose }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-black/5 flex flex-col h-screen overflow-hidden shrink-0">
      <div className="p-4 border-b border-black/5 flex justify-between items-start">
        <div>
          <h2 className="font-mono uppercase tracking-wider text-black" style={{ fontSize: '16px' }}>
            Letter History
          </h2>
          <p className="font-mono mt-1" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
            LOCAL HISTORY OF YOUR SENT LETTERS
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
          title="Close Menu"
        >
          <PanelLeftClose className="w-5 h-5 text-black/40" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {letters.length === 0 ? (
          <div className="text-center py-10">
            <Mail className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(0, 0, 0, 0.1)' }} />
            <p className="font-mono" style={{ color: 'rgba(0, 0, 0, 0.3)', fontSize: '10px' }}>
              NO LETTERS SENT YET
            </p>
          </div>
        ) : (
          letters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white border border-black/5 hover:border-black/10 p-3 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-mono text-xs text-black uppercase truncate">
                    TO: {letter.recipient || 'UNTITLED'}
                  </h3>
                  <span className="font-mono" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                    {new Date(letter.createdAt).toLocaleDateString()} • {new Date(letter.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(letter.id)}
                  className="text-black/30 hover:text-black/60 transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              <div className="font-mono line-clamp-2 mb-3" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                "{letter.excerpt}"
              </div>

              <button
                onClick={() => onOpen(letter.url)}
                className="w-full flex items-center justify-center gap-2 font-mono uppercase tracking-wider text-white transition-all"
                style={{
                  backgroundColor: '#6200ea',
                  fontSize: '10px',
                  height: '34px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5000ca'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6200ea'}
              >
                OPEN LINK
              </button>
            </div>
          ))
        )}
      </div>
    </div >
  );
}
