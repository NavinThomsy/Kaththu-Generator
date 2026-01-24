import React from "react";

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                {label}
            </span>
            <div className="flex" style={{ gap: '3px' }}>
                <div className="relative border border-black/10" style={{ width: '34px', height: '34px', boxSizing: 'border-box' }}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '24px',
                            height: '24px',
                            backgroundColor: value,
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
                    />
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            padding: 0,
                            margin: 0
                        }}
                    />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="font-mono text-xs text-black border border-black/10 px-3 focus:outline-none focus:border-black/30"
                    style={{ height: '34px', width: '80px', boxSizing: 'border-box' }}
                />
            </div>
        </div>
    );
}

interface ColorsSectionProps {
    envelopeColor: string;
    onEnvelopeColorChange: (color: string) => void;
    paperColor: string;
    onPaperColorChange: (color: string) => void;
    insideColor: string;
    onInsideColorChange: (color: string) => void;
}

export function ColorsSection({
    envelopeColor,
    onEnvelopeColorChange,
    paperColor,
    onPaperColorChange,
    insideColor,
    onInsideColorChange,
}: ColorsSectionProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                Colors
            </span>
            <div className="responsive-row-sm">
                <ColorPicker label="Envelope" value={envelopeColor} onChange={onEnvelopeColorChange} />
                <ColorPicker label="Paper" value={paperColor} onChange={onPaperColorChange} />
                <ColorPicker label="Inside" value={insideColor} onChange={onInsideColorChange} />
            </div>
        </div>
    );
}
