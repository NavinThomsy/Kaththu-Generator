import React, { useState, useRef, useEffect } from "react";
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    ChevronDown,
} from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

const CustomDropdown = ({ value, onChange, options, style, className }: { value: string | number, onChange: (val: any) => void, options: { label: string | number, value: string | number }[], style?: React.CSSProperties, className?: string }) => {
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
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className="font-mono text-xs text-black flex-1 truncate" style={{ paddingLeft: '8px' }}>
                {value}
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
};

// Props interface for integration with App.tsx
export interface EditorPrototypeProps {
    // Letter content
    letterText: string;
    onLetterTextChange: (html: string) => void;
    letterFont: string;
    onLetterFontChange: (font: string) => void;
    letterSize: number;
    onLetterSizeChange: (size: number) => void;
    textColor: string;
    onTextColorChange: (color: string) => void;

    // Animation
    animationType: string;
    onAnimationTypeChange: (type: string) => void;
    animationSpeed: number;
    onAnimationSpeedChange: (speed: number) => void;

    // Envelope - To
    toText: string;
    onToTextChange: (text: string) => void;
    toFont: string;
    onToFontChange: (font: string) => void;
    toSize: number;
    onToSizeChange: (size: number) => void;

    // Envelope - From
    fromText: string;
    onFromTextChange: (text: string) => void;
    fromFont: string;
    onFromFontChange: (font: string) => void;
    fromSize: number;
    onFromSizeChange: (size: number) => void;

    // Colors
    envelopeColor: string;
    onEnvelopeColorChange: (color: string) => void;
    paperColor: string;
    onPaperColorChange: (color: string) => void;
    insideColor: string;
    onInsideColorChange: (color: string) => void;

    // Other
    postmarkLocation: string;
    onPostmarkLocationChange: (location: string) => void;

    // Images (optional)
    stampSrc?: string;
    onStampSrcChange?: (src: string) => void;
    sealSrc?: string;
    onSealSrcChange?: (src: string) => void;
    logo1Src?: string;
    onLogo1SrcChange?: (src: string) => void;
    logo2Src?: string;
    onLogo2SrcChange?: (src: string) => void;

    // Actions
    generatedUrl: string;
    onCopyUrl: () => void;
    onSaveAndShare: () => void;
}

export function EditorPrototype({
    letterText,
    onLetterTextChange,
    letterFont,
    onLetterFontChange,
    letterSize,
    onLetterSizeChange,
    textColor,
    onTextColorChange,
    animationType,
    onAnimationTypeChange,
    animationSpeed,
    onAnimationSpeedChange,
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
    envelopeColor,
    onEnvelopeColorChange,
    paperColor,
    onPaperColorChange,
    insideColor,
    onInsideColorChange,
    postmarkLocation,
    onPostmarkLocationChange,
    stampSrc,
    onStampSrcChange,
    sealSrc,
    onSealSrcChange,
    logo1Src,
    onLogo1SrcChange,
    logo2Src,
    onLogo2SrcChange,
    generatedUrl,
    onCopyUrl,
    onSaveAndShare,
}: EditorPrototypeProps) {


    // --- TipTap Rich Text Editor ---
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable default heading, we don't need it
                heading: false,
            }),
            UnderlineExtension,
            TextAlign.configure({
                types: ['paragraph'],
            }),
            TextStyle,
            Color,
        ],
        content: letterText || '<p>Write your letter here...</p>',
        onUpdate: ({ editor }) => {
            // Sync editor content to parent state for live preview (HTML to preserve formatting)
            const html = editor.getHTML();
            onLetterTextChange(html);
        },
        editorProps: {
            attributes: {
                class: 'w-full h-full outline-none prose prose-sm max-w-none',
                style: `font-family: ${letterFont === 'Mono' ? 'monospace' : letterFont === 'Serif' ? 'serif' : 'sans-serif'}; font-size: ${letterSize}px; color: ${textColor};`,
            },
        },
    });

    // Update editor styling when font/size/color changes
    useEffect(() => {
        if (editor) {
            editor.view.dom.style.fontFamily = letterFont === 'Mono' ? 'monospace' : letterFont === 'Serif' ? 'serif' : 'sans-serif';
            editor.view.dom.style.fontSize = `${letterSize}px`;
            editor.view.dom.style.color = textColor;
        }
    }, [editor, letterFont, letterSize, textColor]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* === SECTION 1: COMPOSE YOUR LETTER === */}
            <div className="bg-white border border-black/5 flex flex-col" style={{ padding: '15px', gap: '20px' }}>
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Compose Your Letter</span>
                </div>

                <div className="flex flex-col" style={{ gap: '5px' }}>
                    {/* Toolbar */}
                    <div className="flex items-center gap-2">
                        {/* Formatting buttons */}
                        <div className="flex border border-black/10">
                            <button
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`p-2 hover:bg-gray-50 border-r border-black/10 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                            >
                                <Bold className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`p-2 hover:bg-gray-50 border-r border-black/10 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                            >
                                <Italic className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                className={`p-2 hover:bg-gray-50 ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
                            >
                                <Underline className="w-4 h-4 text-black" />
                            </button>
                        </div>

                        {/* Alignment buttons */}
                        <div className="flex border border-black/10">
                            <button
                                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                                className={`p-2 hover:bg-gray-50 border-r border-black/10 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
                            >
                                <AlignLeft className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                                className={`p-2 hover:bg-gray-50 border-r border-black/10 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
                            >
                                <AlignCenter className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                                className={`p-2 hover:bg-gray-50 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
                            >
                                <AlignRight className="w-4 h-4 text-black" />
                            </button>
                        </div>

                        {/* List buttons */}
                        <div className="flex border border-black/10">
                            <button className="p-2 hover:bg-gray-50 border-r border-black/10">
                                <List className="w-4 h-4 text-black" />
                            </button>
                            <button className="p-2 hover:bg-gray-50">
                                <ListOrdered className="w-4 h-4 text-black" />
                            </button>
                        </div>

                        {/* Color picker */}
                        <div className="flex items-center border border-black/10">
                            <div className="relative" style={{ width: '34px', height: '34px', boxSizing: 'border-box' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: textColor,
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => onTextColorChange(e.target.value)}
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
                        </div>

                        {/* Spacer */}
                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Font dropdown */}
                        <CustomDropdown
                            value={letterFont}
                            onChange={onLetterFontChange}
                            options={[
                                { label: 'Sans', value: 'Sans' },
                                { label: 'Serif', value: 'Serif' },
                                { label: 'Mono', value: 'Mono' },
                            ]}
                            style={{ width: '92px' }}
                        />

                        {/* Size dropdown */}
                        <CustomDropdown
                            value={letterSize}
                            onChange={onLetterSizeChange}
                            options={[12, 14, 16, 18, 20, 24, 28, 32].map(s => ({ label: s, value: s }))}
                            style={{ gap: '10px' }}
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div
                        className="w-full h-32 border border-black/10 p-3 overflow-auto focus-within:border-black/20"
                        style={{
                            fontFamily: letterFont === 'Mono' ? 'monospace' : letterFont === 'Serif' ? 'serif' : 'sans-serif',
                            fontSize: `${letterSize}px`,
                            color: textColor,
                        }}
                    >
                        <EditorContent editor={editor} className="h-full" />
                    </div>
                </div>

                {/* Animation controls */}
                <div className="flex self-stretch items-end" style={{ gap: '24px' }}>
                    {/* Animation Type */}
                    <div className="flex flex-col gap-2">
                        <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                            Animation Type
                        </span>
                        <CustomDropdown
                            value={animationType}
                            onChange={onAnimationTypeChange}
                            options={[
                                { label: 'Typewriter', value: 'Typewriter' },
                                { label: 'Fade In', value: 'Fade In' },
                                { label: 'Word by Word', value: 'Word by Word' },
                                { label: 'Character', value: 'Character' },
                            ]}
                            style={{ width: '150px' }}
                        />
                    </div>

                    {/* Animation Speed */}
                    <div className="flex-1 flex flex-col justify-between">
                        <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                            Animation Speed
                        </span>
                        <div className="flex flex-col">
                            <div className="flex justify-between font-mono" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                <span>Slower</span>
                                <span>Faster</span>
                            </div>
                            <style>{`
                                .no-thumb::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    appearance: none;
                                    width: 0;
                                    height: 0;
                                    background: transparent;
                                    border: none;
                                }
                                .no-thumb::-moz-range-thumb {
                                    width: 0;
                                    height: 0;
                                    background: transparent;
                                    border: none;
                                }
                                .no-thumb::-ms-thumb {
                                    width: 0;
                                    height: 0;
                                    background: transparent;
                                    border: none;
                                }
                            `}</style>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={animationSpeed}
                                onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
                                className="no-thumb w-full appearance-none cursor-pointer focus:outline-none"
                                style={{
                                    height: '10px',
                                    marginTop: '4px',
                                    marginBottom: '0',
                                    background: `linear-gradient(to right, #6A00FF ${((animationSpeed - 1) / 9) * 100}%, #f3f4f6 ${((animationSpeed - 1) / 9) * 100}%)`
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* === SECTION 2: CUSTOMIZE ENVELOPE === */}
            <div className="bg-white border border-black/5 flex flex-col" style={{ padding: '15px', gap: '20px' }}>
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Customize Envelope</span>
                </div>

                {/* To and From fields */}
                <div className="flex gap-4">
                    {/* TO (Recipient) */}
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                            To (Recipient)
                        </span>
                        <div className="flex gap-2">
                            <CustomDropdown
                                value={toFont}
                                onChange={onToFontChange}
                                options={[
                                    { label: 'Sans', value: 'Sans' },
                                    { label: 'Serif', value: 'Serif' },
                                    { label: 'Mono', value: 'Mono' },
                                ]}
                                style={{ width: '92px' }}
                            />
                            <CustomDropdown
                                value={toSize}
                                onChange={onToSizeChange}
                                options={[12, 14, 16, 18, 20, 24].map(s => ({ label: s, value: s }))}
                                style={{ gap: '10px' }}
                            />
                        </div>
                        <textarea
                            value={toText}
                            onChange={(e) => onToTextChange(e.target.value)}
                            className="w-full h-20 border border-black/10 p-3 resize-none text-sm focus:outline-none focus:border-black/20"
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
                                onChange={onFromFontChange}
                                options={[
                                    { label: 'Sans', value: 'Sans' },
                                    { label: 'Serif', value: 'Serif' },
                                    { label: 'Mono', value: 'Mono' },
                                ]}
                                style={{ width: '92px' }}
                            />
                            <CustomDropdown
                                value={fromSize}
                                onChange={onFromSizeChange}
                                options={[12, 14, 16, 18, 20, 24].map(s => ({ label: s, value: s }))}
                                style={{ gap: '10px' }}
                            />
                        </div>
                        <textarea
                            value={fromText}
                            onChange={(e) => onFromTextChange(e.target.value)}
                            className="w-full h-20 border border-black/10 p-3 resize-none text-sm focus:outline-none focus:border-black/20"
                            placeholder=""
                        />
                    </div>
                </div>

                {/* Colors section */}
                <div className="flex flex-col gap-2">
                    <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                        Colors
                    </span>
                    <div className="flex" style={{ gap: '10px' }}>
                        {/* Envelope */}
                        <div className="flex flex-col gap-1">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Envelope
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
                                            backgroundColor: envelopeColor,
                                            border: '1px solid rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <input
                                        type="color"
                                        value={envelopeColor}
                                        onChange={(e) => onEnvelopeColorChange(e.target.value)}
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
                                <div className="flex items-center border border-black/10 px-3" style={{ height: '34px', boxSizing: 'border-box' }}>
                                    <span className="font-mono text-xs text-black">{envelopeColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Paper */}
                        <div className="flex flex-col gap-1">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Paper
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
                                            backgroundColor: paperColor,
                                            border: '1px solid rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <input
                                        type="color"
                                        value={paperColor}
                                        onChange={(e) => onPaperColorChange(e.target.value)}
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
                                <div className="flex items-center border border-black/10 px-3" style={{ height: '34px', boxSizing: 'border-box' }}>
                                    <span className="font-mono text-xs text-black">{paperColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Inside */}
                        <div className="flex flex-col gap-1">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Inside
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
                                            backgroundColor: insideColor,
                                            border: '1px solid rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <input
                                        type="color"
                                        value={insideColor}
                                        onChange={(e) => onInsideColorChange(e.target.value)}
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
                                <div className="flex items-center border border-black/10 px-3" style={{ height: '34px', boxSizing: 'border-box' }}>
                                    <span className="font-mono text-xs text-black">{insideColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Postmark Location */}
                        <div className="flex flex-col gap-1 flex-1">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Postmark Location
                            </span>
                            <input
                                type="text"
                                value={postmarkLocation}
                                onChange={(e) => onPostmarkLocationChange(e.target.value)}
                                placeholder="LONDON (EMPTY TO HIDE)"
                                className="border border-black/10 px-3 font-mono text-xs text-black focus:outline-none focus:border-black/20 [&::placeholder]:text-[rgba(0,0,0,0.3)]"
                                style={{ '--placeholder-color': 'rgba(0, 0, 0, 0.3)', 'fontSize': '10px', height: '34px', boxSizing: 'border-box' } as React.CSSProperties}
                            />
                        </div>
                    </div>
                </div>

                {/* Images section */}
                <div className="flex flex-col gap-2">
                    <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                        Images
                    </span>
                    <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                        {/* Stamp */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Stamp
                            </span>
                            <div className="flex items-center gap-3">
                                <label
                                    style={{ backgroundColor: '#6A00FF', color: 'white', display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded hover:opacity-90"
                                >
                                    Choose File
                                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400">
                                    No file chosen
                                </span>
                            </div>
                        </div>

                        {/* Logo 1 */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Logo 1
                            </span>
                            <div className="flex items-center gap-3">
                                <label
                                    style={{ backgroundColor: '#6A00FF', color: 'white', display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded hover:opacity-90"
                                >
                                    Choose File
                                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400">
                                    No file chosen
                                </span>
                            </div>
                        </div>

                        {/* Wax Seal */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Wax Seal
                            </span>
                            <div className="flex items-center gap-3">
                                <label
                                    style={{ backgroundColor: '#6A00FF', color: 'white', display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded hover:opacity-90"
                                >
                                    Choose File
                                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400">
                                    Navin Wax Logo.png
                                </span>
                            </div>
                        </div>

                        {/* Logo 2 */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono uppercase" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                Logo 2
                            </span>
                            <div className="flex items-center gap-3">
                                <label
                                    style={{ backgroundColor: '#6A00FF', color: 'white', display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded hover:opacity-90"
                                >
                                    Choose File
                                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400">
                                    No file chosen
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === SECTION 3: SHARE YOUR LETTER === */}
            <div className="bg-white border border-black/5 flex flex-col" style={{ padding: '15px', gap: '20px' }}>
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Share Your Letter</span>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                        URL Generator
                    </span>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={generatedUrl}
                            readOnly
                            className="flex-1 border border-black/10 px-3 font-mono text-xs text-gray-400 bg-white focus:outline-none"
                            style={{ height: '34px', boxSizing: 'border-box' }}
                        />
                        <button
                            onClick={onCopyUrl}
                            style={{ backgroundColor: '#6A00FF', color: 'white' }}
                            className="font-mono text-[10px] font-medium px-4 py-2 uppercase tracking-wider rounded shrink-0 hover:opacity-90"
                        >
                            Copy URL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
