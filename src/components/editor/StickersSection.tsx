import React from "react";
import { Info, Eye, EyeOff } from "lucide-react";

interface StickerItemProps {
    label: string;
    isHidden?: boolean;
    onToggleHide?: () => void;
    filename?: string;
    defaultText?: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function StickerItem({ label, isHidden, onToggleHide, filename, defaultText = 'Default', onFileChange }: StickerItemProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                {onToggleHide && (
                    <button
                        type="button"
                        onClick={onToggleHide}
                        className="focus:outline-none flex items-center justify-center p-0"
                        style={{ height: '12px', width: '12px' }}
                    >
                        {isHidden ? <EyeOff size={12} strokeWidth={1.5} className="text-gray-400" /> : <Eye size={12} strokeWidth={1.5} className="text-gray-500" />}
                    </button>
                )}
                <span className="font-mono uppercase flex items-center h-[12px] leading-none" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                    {label}
                </span>
            </div>
            <div className={`flex flex-wrap items-center gap-3 transition-opacity duration-200 ${isHidden ? 'opacity-50 pointer-events-none' : ''}`}>
                <label
                    style={{ display: 'inline-block', width: 'auto' }}
                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded-none btn-purple transition-all duration-200 whitespace-nowrap"
                >
                    CHOOSE FILE
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={onFileChange}
                    />
                </label>
                <span className="font-mono text-[10px] text-gray-400 truncate max-w-[80px] sm:max-w-[100px]">
                    {isHidden ? 'No file uploaded' : (filename || defaultText)}
                </span>
            </div>
        </div>
    );
}

interface StickersSectionProps {
    // Stamp
    stampFilename?: string;
    hideStamp?: boolean;
    onHideStampChange?: (hide: boolean) => void;
    onStampUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Logo 1
    logo1Filename?: string;
    hideLogo1?: boolean;
    onHideLogo1Change?: (hide: boolean) => void;
    onLogo1Upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Wax Seal
    sealFilename?: string;
    hideSeal?: boolean;
    onHideSealChange?: (hide: boolean) => void;
    onSealUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Logo 2
    logo2Filename?: string;
    hideLogo2?: boolean;
    onHideLogo2Change?: (hide: boolean) => void;
    onLogo2Upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Letter Logo
    letterLogoFilename?: string;
    hideLetterLogo?: boolean;
    onHideLetterLogoChange?: (hide: boolean) => void;
    onLetterLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // Postmark
    postmarkLocation: string;
    onPostmarkLocationChange: (location: string) => void;
}

export function StickersSection({
    stampFilename,
    hideStamp,
    onHideStampChange,
    onStampUpload,
    logo1Filename,
    hideLogo1,
    onHideLogo1Change,
    onLogo1Upload,
    sealFilename,
    hideSeal,
    onHideSealChange,
    onSealUpload,
    logo2Filename,
    hideLogo2,
    onHideLogo2Change,
    onLogo2Upload,
    letterLogoFilename,
    hideLetterLogo,
    onHideLetterLogoChange,
    onLetterLogoUpload,
    postmarkLocation,
    onPostmarkLocationChange,
}: StickersSectionProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                    Stickers
                </span>
                <div title="Toggle checkboxes to show/hide items. Click 'Choose File' to upload your own custom images." className="cursor-help flex items-center">
                    <Info size={12} color="rgba(0,0,0,0.4)" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '10px' }}>
                <StickerItem
                    label="Stamp"
                    isHidden={hideStamp}
                    onToggleHide={() => onHideStampChange?.(!hideStamp)}
                    filename={stampFilename}
                    defaultText="Stamp..."
                    onFileChange={onStampUpload}
                />
                <StickerItem
                    label="Logo 1"
                    isHidden={hideLogo1}
                    onToggleHide={() => onHideLogo1Change?.(!hideLogo1)}
                    filename={logo1Filename}
                    onFileChange={onLogo1Upload}
                />
                <StickerItem
                    label="Wax Seal"
                    isHidden={hideSeal}
                    onToggleHide={() => onHideSealChange?.(!hideSeal)}
                    filename={sealFilename}
                    onFileChange={onSealUpload}
                />
                <StickerItem
                    label="Logo 2"
                    isHidden={hideLogo2}
                    onToggleHide={() => onHideLogo2Change?.(!hideLogo2)}
                    filename={logo2Filename}
                    onFileChange={onLogo2Upload}
                />
                <StickerItem
                    label="Letter Logo"
                    isHidden={hideLetterLogo}
                    onToggleHide={() => onHideLetterLogoChange?.(!hideLetterLogo)}
                    filename={letterLogoFilename}
                    onFileChange={onLetterLogoUpload}
                />

                {/* Postmark Location */}
                <div className="flex flex-col gap-1">
                    <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                        Postmark Location
                    </span>
                    <div className="flex items-center gap-2" style={{ height: '34px' }}>
                        <input
                            type="text"
                            value={postmarkLocation}
                            onChange={(e) => onPostmarkLocationChange(e.target.value)}
                            placeholder="LONDON"
                            className="w-[105px] border border-black/10 px-3 font-mono text-xs text-black focus:outline-none focus:border-black/20 [&::placeholder]:text-[rgba(0,0,0,0.3)]"
                            style={{ '--placeholder-color': 'rgba(0, 0, 0, 0.3)', 'fontSize': '10px', height: '100%', boxSizing: 'border-box' } as React.CSSProperties}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
