import React from 'react';
import { AnimationType } from './AnimatedText';

interface EditorPanelProps {
    // Content
    text: string;
    onTextChange: (text: string) => void;

    // Animation
    animationType: AnimationType;
    onAnimationTypeChange: (type: AnimationType) => void;
    animationSpeed: number;
    onAnimationSpeedChange: (speed: number) => void;

    // Letter styling
    letterFont: string;
    onLetterFontChange: (font: string) => void;
    letterSize: number;
    onLetterSizeChange: (size: number) => void;

    // Envelope fields
    to: string;
    onToChange: (to: string) => void;
    from: string;
    onFromChange: (from: string) => void;
    toFont: string;
    onToFontChange: (font: string) => void;
    toSize: number;
    onToSizeChange: (size: number) => void;
    fromFont: string;
    onFromFontChange: (font: string) => void;
    fromSize: number;
    onFromSizeChange: (size: number) => void;

    // Colors
    envelopeColor: string;
    onEnvelopeColorChange: (color: string) => void;
    letterColor: string;
    onLetterColorChange: (color: string) => void;
    insideEnvelopeColor: string;
    onInsideEnvelopeColorChange: (color: string) => void;
    postmarkText: string;
    onPostmarkTextChange: (text: string) => void;

    // Images
    stampSrc: string;
    onStampChange: (src: string) => void;
    logo1Src: string;
    onLogo1Change: (src: string) => void;
    sealSrc: string;
    onSealChange: (src: string) => void;
    logo2Src: string;
    onLogo2Change: (src: string) => void;

    // Share
    shareUrl: string;
    onCopyUrl: () => void;
}

export function EditorPanel({
    text, onTextChange,
    animationType, onAnimationTypeChange,
    animationSpeed, onAnimationSpeedChange,
    letterFont, onLetterFontChange,
    letterSize, onLetterSizeChange,
    to, onToChange,
    from, onFromChange,
    toFont, onToFontChange,
    toSize, onToSizeChange,
    fromFont, onFromFontChange,
    fromSize, onFromSizeChange,
    envelopeColor, onEnvelopeColorChange,
    letterColor, onLetterColorChange,
    insideEnvelopeColor, onInsideEnvelopeColorChange,
    postmarkText, onPostmarkTextChange,
    stampSrc, onStampChange,
    logo1Src, onLogo1Change,
    sealSrc, onSealChange,
    logo2Src, onLogo2Change,
    shareUrl, onCopyUrl,
}: EditorPanelProps) {

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (val: string) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setter(ev.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Font style for Geist Mono
    const geistMono = { fontFamily: "'Geist Mono', monospace" };

    return (
        <div className="w-full max-w-lg" style={geistMono}>

            {/* Section 1: Compose Your Letter */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-900 tracking-wide mb-6">1. COMPOSE YOUR LETTER</h2>

                {/* Formatting Toolbar */}
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-4 mb-5 flex-wrap">
                    {/* Text formatting buttons - B I U */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-base font-bold border-r border-gray-300">B</button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-base italic border-r border-gray-300">I</button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-base underline">U</button>
                    </div>

                    {/* Alignment buttons */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 border-r border-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h14v2H3V4zm0 5h8v2H3V9zm0 5h14v2H3v-2z" /></svg>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 border-r border-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h14v2H3V4zm3 5h8v2H6V9zm-3 5h14v2H3v-2z" /></svg>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 border-r border-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h14v2H3V4zm6 5h8v2H9V9zm-6 5h14v2H3v-2z" /></svg>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z" /></svg>
                        </button>
                    </div>

                    {/* List buttons */}
                    <div className="flex border border-gray-300 rounded overflow-hidden">
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 border-r border-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4h2v2H4V4zm4 0h9v2H8V4zM4 9h2v2H4V9zm4 0h9v2H8V9zm-4 5h2v2H4v-2zm4 0h9v2H8v-2z" /></svg>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h3v2H2V4zm5 0h10v2H7V4zM2 9h3v2H2V9zm5 0h10v2H7V9zm-5 5h3v2H2v-2zm5 0h10v2H7v-2z" /></svg>
                        </button>
                    </div>

                    {/* Color picker */}
                    <div className="w-10 h-10 bg-purple-600 rounded border border-gray-300 cursor-pointer flex-shrink-0" />

                    {/* Font dropdown - fixed width */}
                    <select
                        value={letterFont}
                        onChange={(e) => onLetterFontChange(e.target.value)}
                        className="w-[92px] h-[25px] px-[5px] text-sm border border-gray-300 rounded bg-white"
                        style={{ ...geistMono, padding: '0 5px' }}
                    >
                        <option value="font-sans">Sans</option>
                        <option value="font-serif">Serif</option>
                        <option value="font-mono">Mono</option>
                    </select>

                    {/* Size dropdown - fixed width */}
                    <select
                        value={letterSize}
                        onChange={(e) => onLetterSizeChange(Number(e.target.value))}
                        className="w-16 h-[25px] px-2 text-sm border border-gray-300 rounded bg-white"
                        style={geistMono}
                    >
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                    </select>
                </div>

                {/* Text Area */}
                <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none mb-6"
                    placeholder="Write your letter here..."
                    style={geistMono}
                />

                {/* Animation Type and Speed - side by side */}
                {/* Animation Type and Speed - side by side */}
                <div className="flex items-start gap-[35px]">
                    {/* Animation Type */}
                    <div className="flex-1 flex flex-col items-start justify-between h-[45px] min-w-0">
                        <label className="block text-xs text-gray-500 uppercase tracking-wide">ANIMATION TYPE</label>
                        <select
                            value={animationType}
                            onChange={(e) => onAnimationTypeChange(e.target.value as AnimationType)}
                            className="w-[92px] h-[25px] px-[5px] text-sm border border-gray-300 rounded bg-white"
                            style={{ ...geistMono, padding: '0 5px' }}
                        >
                            <option value="typewriter">TYPEWRITER</option>
                            <option value="fade-in">FADE IN</option>
                            <option value="word-by-word">WORD BY WORD</option>
                            <option value="character-by-character">CHARACTER</option>
                        </select>
                    </div>

                    {/* Animation Speed */}
                    <div className="flex-1 flex flex-col items-start justify-between h-[45px] min-w-0">
                        <label className="block text-xs text-gray-500 uppercase tracking-wide">ANIMATION SPEED</label>
                        <div className="flex justify-between w-full text-xs text-gray-400">
                            <span>Slower</span>
                            <span>Faster</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={animationSpeed}
                            onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #9333EA 0%, #9333EA ${((animationSpeed - 1) / 9) * 100}%, #E5E7EB ${((animationSpeed - 1) / 9) * 100}%, #E5E7EB 100%)`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Customize Envelope */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-900 tracking-wide mb-6">2. CUSTOMIZE ENVELOPE</h2>

                {/* TO and FROM - with gap between textareas */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* TO */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">TO (RECIPIENT)</label>
                        <div className="flex gap-2 mb-3">
                            <select
                                value={toFont}
                                onChange={(e) => onToFontChange(e.target.value)}
                                className="w-[92px] h-[25px] px-[5px] text-sm border border-gray-300 rounded bg-white"
                                style={{ ...geistMono, padding: '0 5px' }}
                            >
                                <option value="font-sans">Sans</option>
                                <option value="font-serif">Serif</option>
                                <option value="font-mono">Mono</option>
                            </select>
                            <select
                                value={toSize}
                                onChange={(e) => onToSizeChange(Number(e.target.value))}
                                className="w-16 h-[25px] px-2 text-sm border border-gray-300 rounded bg-white"
                                style={geistMono}
                            >
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                            </select>
                        </div>
                        <textarea
                            value={to}
                            onChange={(e) => onToChange(e.target.value)}
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                            placeholder="Recipient Name"
                            style={geistMono}
                        />
                    </div>

                    {/* FROM */}
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">FROM (SENDER)</label>
                        <div className="flex gap-2 mb-3">
                            <select
                                value={fromFont}
                                onChange={(e) => onFromFontChange(e.target.value)}
                                className="w-[92px] h-[25px] px-[5px] text-sm border border-gray-300 rounded bg-white"
                                style={{ ...geistMono, padding: '0 5px' }}
                            >
                                <option value="font-sans">Sans</option>
                                <option value="font-serif">Serif</option>
                                <option value="font-mono">Mono</option>
                            </select>
                            <select
                                value={fromSize}
                                onChange={(e) => onFromSizeChange(Number(e.target.value))}
                                className="w-16 h-[25px] px-2 text-sm border border-gray-300 rounded bg-white"
                                style={geistMono}
                            >
                                <option value="12">12</option>
                                <option value="14">14</option>
                                <option value="16">16</option>
                                <option value="18">18</option>
                            </select>
                        </div>
                        <textarea
                            value={from}
                            onChange={(e) => onFromChange(e.target.value)}
                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                            placeholder="Your Name"
                            style={geistMono}
                        />
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-8">
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-4">COLORS</label>
                    <div className="grid grid-cols-4 gap-4">
                        {/* Envelope */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">ENVELOPE</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={envelopeColor}
                                    onChange={(e) => onEnvelopeColorChange(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0 flex-shrink-0"
                                />
                                <input
                                    type="text"
                                    value={envelopeColor}
                                    onChange={(e) => onEnvelopeColorChange(e.target.value)}
                                    className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded"
                                    style={geistMono}
                                />
                            </div>
                        </div>

                        {/* Paper */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">PAPER</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={letterColor}
                                    onChange={(e) => onLetterColorChange(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0 flex-shrink-0"
                                />
                                <input
                                    type="text"
                                    value={letterColor}
                                    onChange={(e) => onLetterColorChange(e.target.value)}
                                    className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded"
                                    style={geistMono}
                                />
                            </div>
                        </div>

                        {/* Inside */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">INSIDE</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={insideEnvelopeColor}
                                    onChange={(e) => onInsideEnvelopeColorChange(e.target.value)}
                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0 flex-shrink-0"
                                />
                                <input
                                    type="text"
                                    value={insideEnvelopeColor}
                                    onChange={(e) => onInsideEnvelopeColorChange(e.target.value)}
                                    className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded"
                                    style={geistMono}
                                />
                            </div>
                        </div>

                        {/* Postmark Location */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">POSTMARK LOCATION</label>
                            <input
                                type="text"
                                value={postmarkText}
                                onChange={(e) => onPostmarkTextChange(e.target.value)}
                                placeholder="LONDON (EMPTY TO HIDE)"
                                className="w-full h-8 px-2 text-xs border border-gray-300 rounded"
                                style={geistMono}
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-4">IMAGES</label>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                        {/* Stamp */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">STAMP</label>
                            <div className="flex items-center gap-3">
                                <label className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded cursor-pointer hover:bg-purple-700 transition-colors whitespace-nowrap">
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, onStampChange)}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-400 truncate">
                                    {stampSrc ? "File chosen" : "No file chosen"}
                                </span>
                            </div>
                        </div>

                        {/* Logo 1 */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">LOGO 1</label>
                            <div className="flex items-center gap-3">
                                <label className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded cursor-pointer hover:bg-purple-700 transition-colors whitespace-nowrap">
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, onLogo1Change)}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-400 truncate">
                                    {logo1Src ? "File chosen" : "No file chosen"}
                                </span>
                            </div>
                        </div>

                        {/* Wax Seal */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">WAX SEAL</label>
                            <div className="flex items-center gap-3">
                                <label className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded cursor-pointer hover:bg-purple-700 transition-colors whitespace-nowrap">
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, onSealChange)}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-400 truncate">
                                    {sealSrc ? "Navin Wax Logo.png" : "No file chosen"}
                                </span>
                            </div>
                        </div>

                        {/* Logo 2 */}
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">LOGO 2</label>
                            <div className="flex items-center gap-3">
                                <label className="px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded cursor-pointer hover:bg-purple-700 transition-colors whitespace-nowrap">
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, onLogo2Change)}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-400 truncate">
                                    {logo2Src ? "File chosen" : "No file chosen"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Share Your Letter */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-900 tracking-wide mb-6">3. SHARE YOUR LETTER</h2>

                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">URL GENERATOR</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 h-10 px-3 text-sm border border-gray-300 rounded bg-gray-50"
                            style={geistMono}
                        />
                        <button
                            onClick={onCopyUrl}
                            className="px-5 py-2 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors whitespace-nowrap"
                        >
                            COPY URL
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
