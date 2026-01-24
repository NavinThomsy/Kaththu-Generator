import React, { useState } from "react";

interface ShareSectionProps {
    generatedUrl: string;
    onSaveAndShare: () => void;
}

export function ShareSection({
    generatedUrl,
    onSaveAndShare,
}: ShareSectionProps) {
    const [copyFeedback, setCopyFeedback] = useState(false);

    return (
        <div className="flex flex-col gap-2 relative">
            <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                Click to copy URL
            </span>
            <div className="flex items-center gap-2">
                <div className="relative flex-none group" style={{ width: '50%' }}>
                    <input
                        type="text"
                        value={generatedUrl}
                        readOnly
                        onClick={() => {
                            if (generatedUrl) {
                                navigator.clipboard.writeText(generatedUrl);
                                setCopyFeedback(true);
                                setTimeout(() => setCopyFeedback(false), 2000);
                            }
                        }}
                        className="w-full border border-black/10 px-3 font-mono text-xs text-gray-400 bg-white focus:outline-none cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{ height: '34px', boxSizing: 'border-box' }}
                        title="Click to copy"
                    />
                    {/* Simple Toast */}
                    {copyFeedback && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs py-2 px-4 rounded-full pointer-events-none transition-all duration-200 z-[9999] shadow-xl border border-black/5 animate-in fade-in slide-in-from-bottom-4 font-medium">
                            Link copied to clipboard!
                        </div>
                    )}
                </div>
                <button
                    onClick={onSaveAndShare}
                    className="font-mono text-[10px] font-medium px-4 py-2 uppercase tracking-wider rounded-none shrink-0 btn-purple transition-all min-w-[80px] flex items-center justify-center"
                >
                    SAVE & VIEW
                </button>
            </div>
        </div>
    );
}
