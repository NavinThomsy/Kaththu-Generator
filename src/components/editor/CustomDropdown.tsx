import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomDropdownProps {
    value: string | number;
    onChange: (val: string | number) => void;
    options: { label: string | number; value: string | number }[];
    style?: React.CSSProperties;
    className?: string;
}

export function CustomDropdown({ value, onChange, options, style, className }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={`relative flex items-center border border-black/10 bg-white cursor-pointer select-none ${className || ''}`}
            style={{ height: '34px', gap: '5px', ...style }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className="font-mono text-xs text-black flex-1 truncate" style={{ paddingLeft: '8px' }}>
                {options.find(opt => opt.value === value)?.label || value}
            </span>
            <ChevronDown className="w-3 h-3 text-black flex-shrink-0" style={{ marginRight: '8px' }} />

            {isOpen && (
                <div
                    className="absolute left-0 w-full bg-white border border-black/10 max-h-48 overflow-y-auto shadow-sm flex flex-col"
                    style={{
                        top: '100%',
                        marginTop: '4px',
                        zIndex: 1000
                    }}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`px-3 py-2 text-xs text-left font-mono hover:bg-gray-50 transition-colors ${option.value === value ? 'bg-gray-50' : ''}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            style={{ paddingLeft: '8px' }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
