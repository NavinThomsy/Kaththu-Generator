import React, { useState } from "react";

interface ShareSectionProps {
    generatedUrl: string;
    onSaveAndShare: (url?: string, shouldOpen?: boolean) => void;
    isUploading?: boolean;
}

export function ShareSection({
    generatedUrl,
    onSaveAndShare,
    isUploading = false,
}: ShareSectionProps) {
    const [shortUrl, setShortUrl] = useState('');
    const [isShortening, setIsShortening] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState(false);

    // Reset short URL when long URL changes
    React.useEffect(() => {
        setShortUrl('');
    }, [generatedUrl]);

    const handleSaveClick = async () => {
        if (isUploading) return;

        // If we already have one, use it -> OPEN IT
        if (shortUrl) {
            onSaveAndShare(shortUrl, true);
            return;
        }

        // Otherwise generate one -> SAVE BUT DON'T OPEN AUTOMATICALLY
        setIsShortening(true);
        try {
            const res = await fetch(`/api/shorten?url=${encodeURIComponent(generatedUrl)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.shortUrl) {
                    setShortUrl(data.shortUrl);
                    // Save to history but DO NOT OPEN
                    onSaveAndShare(data.shortUrl, false);
                    return;
                }
            }
            // Fallback
            onSaveAndShare(); // Uses default true (open)
        } catch (e) {
            console.error("Shortening error:", e);
            onSaveAndShare();
        } finally {
            setIsShortening(false);
        }
    };

    const displayUrl = shortUrl || '';

    return (
        <div className="flex flex-col gap-2 relative">
            <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                {shortUrl ? 'Share this link:' : 'Ready to share?'}
            </span>
            <div className="flex items-center gap-2">
                <div className="relative flex-none group" style={{ width: '50%' }}>
                    <input
                        type="text"
                        value={displayUrl}
                        readOnly
                        placeholder="Click Generate →"
                        onClick={() => {
                            if (displayUrl) {
                                navigator.clipboard.writeText(displayUrl);
                                setCopyFeedback(true);
                                setTimeout(() => setCopyFeedback(false), 2000);
                            }
                        }}
                        className={`w-full border px-3 font-mono text-xs focus:outline-none transition-colors ${shortUrl ? 'border-green-500 text-green-700 bg-green-50 cursor-pointer' : 'border-black/10 text-gray-400 bg-gray-50'}`}
                        style={{ height: '34px', boxSizing: 'border-box' }}
                        title={shortUrl ? "Click to copy" : "Generate link first"}
                    />
                    {/* Simple Toast */}
                    {copyFeedback && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs py-2 px-4 rounded-full pointer-events-none transition-all duration-200 z-[9999] shadow-xl border border-black/5 animate-in fade-in slide-in-from-bottom-4 font-medium">
                            Link copied to clipboard!
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSaveClick}
                    disabled={isUploading || isShortening}
                    className={`font-mono text-[10px] font-medium px-4 py-2 uppercase tracking-wider rounded-none shrink-0 btn-purple transition-all min-w-[80px] flex items-center justify-center gap-2 ${(isUploading || isShortening) ? 'opacity-50 cursor-wait' : ''}`}
                >
                    {isUploading ? (
                        <>
                            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                            UPLOADING...
                        </>
                    ) : isShortening ? (
                        <>
                            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                            SHORTENING...
                        </>
                    ) : shortUrl ? (
                        'OPEN LETTER'
                    ) : (
                        'SAVE & GENERATE LINK'
                    )}
                </button>
            </div>
        </div>
    );
}
