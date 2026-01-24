import React from "react";
import { CustomDropdown } from "./CustomDropdown";

interface ToFromSectionProps {
    toText: string;
    onToTextChange: (text: string) => void;
    toFont: string;
    onToFontChange: (font: string) => void;
    toSize: number;
    onToSizeChange: (size: number) => void;
    fromText: string;
    onFromTextChange: (text: string) => void;
    fromFont: string;
    onFromFontChange: (font: string) => void;
    fromSize: number;
    onFromSizeChange: (size: number) => void;
}

export function ToFromSection({
    toText,
    onToTextChange,
    toFont,
    onToFontChange,
    toSize,
    onToSizeChange,
    fromText,
    onFromTextChange,
    fromFont,
    onFromFontChange,
    fromSize,
    onFromSizeChange,
}: ToFromSectionProps) {
    return (
        <div className="responsive-row">
            {/* TO (Recipient) */}
            <div className="flex-1 flex flex-col gap-2">
                <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                    To (Recipient)
                </span>
                <div className="flex gap-2">
                    <CustomDropdown
                        value={toFont}
                        onChange={(val) => onToFontChange(val as string)}
                        options={[
                            { label: 'Sans', value: 'font-editor-sans' },
                            { label: 'Serif', value: 'font-serif' },
                            { label: 'Mono', value: 'font-mono' },
                        ]}
                        style={{ width: '92px' }}
                    />
                    <CustomDropdown
                        value={toSize}
                        onChange={(val) => onToSizeChange(val as number)}
                        options={[12, 14, 16, 18, 20, 24].map(s => ({ label: s, value: s }))}
                        style={{ gap: '10px' }}
                    />
                </div>
                <textarea
                    value={toText}
                    onChange={(e) => onToTextChange(e.target.value)}
                    className={`w-full h-20 border border-black/10 p-3 resize-none text-sm focus:outline-none focus:border-black/20 ${toFont}`}
                    style={{ fontSize: `${toSize}px` }}
                    placeholder=""
                />
            </div>

            {/* FROM (Sender) */}
            <div className="flex-1 flex flex-col gap-2">
                <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                    From (Sender)
                </span>
                <div className="flex gap-2">
                    <CustomDropdown
                        value={fromFont}
                        onChange={(val) => onFromFontChange(val as string)}
                        options={[
                            { label: 'Sans', value: 'font-editor-sans' },
                            { label: 'Serif', value: 'font-serif' },
                            { label: 'Mono', value: 'font-mono' },
                        ]}
                        style={{ width: '92px' }}
                    />
                    <CustomDropdown
                        value={fromSize}
                        onChange={(val) => onFromSizeChange(val as number)}
                        options={[12, 14, 16, 18, 20, 24].map(s => ({ label: s, value: s }))}
                        style={{ gap: '10px' }}
                    />
                </div>
                <textarea
                    value={fromText}
                    onChange={(e) => onFromTextChange(e.target.value)}
                    className={`w-full h-20 border border-black/10 p-3 resize-none text-sm focus:outline-none focus:border-black/20 ${fromFont}`}
                    style={{ fontSize: `${fromSize}px` }}
                    placeholder=""
                />
            </div>
        </div>
    );
}
