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
    Info,
    Eye,
    EyeOff,
    Indent,
    Outdent,
} from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';

// Custom Font Size Extension
const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize ? element.style.fontSize.replace('px', '') : null,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}px`,
                            };
                        },
                    },
                },
            },
        ];
    },
});

const FONT_STACKS: Record<string, string> = {
    'font-editor-sans': '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono': '"Geist Mono", monospace',
};

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

    // Filenames & Visibility
    stampFilename?: string;
    onStampFilenameChange?: (name: string) => void;
    sealFilename?: string;
    onSealFilenameChange?: (name: string) => void;
    logo1Filename?: string;
    onLogo1FilenameChange?: (name: string) => void;
    logo2Filename?: string;
    onLogo2FilenameChange?: (name: string) => void;
    // Letter Logo
    letterLogoSrc?: string;
    onLetterLogoSrcChange?: (src: string | undefined) => void;
    letterLogoFilename?: string;
    onLetterLogoFilenameChange?: (name: string) => void;
    hideLetterLogo?: boolean;
    onHideLetterLogoChange?: (hide: boolean) => void;

    hideStamp?: boolean;
    onHideStampChange?: (hide: boolean) => void;
    hideSeal?: boolean;
    onHideSealChange?: (hide: boolean) => void;
    hideLogo1?: boolean;
    onHideLogo1Change?: (hide: boolean) => void;
    hideLogo2?: boolean;
    onHideLogo2Change?: (hide: boolean) => void;

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
    stampFilename,
    onStampFilenameChange,
    sealFilename,
    onSealFilenameChange,
    logo1Filename,
    onLogo1FilenameChange,
    logo2Filename,
    onLogo2FilenameChange,
    hideStamp,
    onHideStampChange,
    hideSeal,
    onHideSealChange,
    hideLogo1,
    onHideLogo1Change,
    hideLogo2,
    onHideLogo2Change,
    letterLogoSrc,
    onLetterLogoSrcChange,
    letterLogoFilename,
    onLetterLogoFilenameChange,
    hideLetterLogo,
    onHideLetterLogoChange,
    generatedUrl,
    onCopyUrl,
    onSaveAndShare,
}: EditorPrototypeProps) {

    const [copyFeedback, setCopyFeedback] = useState(false);

    // Helper to read file and update state
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter?: (val: string) => void,
        setFilename?: (name: string) => void,
        setHide?: (hide: boolean) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            if (setFilename) setFilename(file.name);
            if (setHide) setHide(false);

            if (setter) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) {
                        setter(ev.target.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };


    // --- TipTap Rich Text Editor ---
    // State to force re-render for toolbar updates
    const [, forceUpdate] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            TextStyle,
            FontFamily,
            FontSize,
            Color,
        ],
        content: letterText || '<p>Write your letter here...</p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onLetterTextChange(html);
        },
        onSelectionUpdate: () => {
            forceUpdate(n => n + 1);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none h-full',
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
                            <button
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={`p-2 hover:bg-gray-50 border-r border-black/10 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                            >
                                <List className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={`p-2 hover:bg-gray-50 border-r border-black/10 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                            >
                                <ListOrdered className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
                                disabled={!editor?.can().liftListItem('listItem')}
                                className="p-2 hover:bg-gray-50 disabled:opacity-30 border-r border-black/10"
                            >
                                <Outdent className="w-4 h-4 text-black" />
                            </button>
                            <button
                                onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
                                disabled={!editor?.can().sinkListItem('listItem')}
                                className="p-2 hover:bg-gray-50 disabled:opacity-30"
                            >
                                <Indent className="w-4 h-4 text-black" />
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
                            value={(() => {
                                if (!editor) return letterFont;
                                const { from, to, empty } = editor.state.selection;
                                if (empty) {
                                    const attrs = editor.getAttributes('textStyle');
                                    const commonFont = attrs.fontFamily;
                                    if (commonFont) {
                                        return Object.keys(FONT_STACKS).find(k => FONT_STACKS[k] === commonFont) || commonFont;
                                    }
                                    return letterFont;
                                }

                                const fonts = new Set();
                                editor.state.doc.nodesBetween(from, to, (node) => {
                                    if (node.isText) {
                                        const mark = node.marks.find(m => m.type.name === 'textStyle' && m.attrs.fontFamily);
                                        const stack = mark?.attrs.fontFamily;
                                        const key = stack ? (Object.keys(FONT_STACKS).find(k => FONT_STACKS[k] === stack) || stack) : letterFont;
                                        fonts.add(key);
                                    }
                                });

                                if (fonts.size > 1) return "Mixed";
                                if (fonts.size === 1) return [...fonts][0];
                                return letterFont;
                            })()}
                            onChange={(val) => {
                                const stack = FONT_STACKS[val as string];
                                if (stack) {
                                    editor?.chain().focus().setFontFamily(stack).run();
                                }
                                onLetterFontChange(val);
                            }}
                            options={[
                                { label: 'Sans', value: 'font-editor-sans' },
                                { label: 'Serif', value: 'font-serif' },
                                { label: 'Mono', value: 'font-mono' },
                            ]}
                            style={{ width: '92px' }}
                        />

                        {/* Size dropdown */}
                        <CustomDropdown
                            value={(() => {
                                if (!editor) return letterSize;
                                const { from, to, empty } = editor.state.selection;
                                if (empty) {
                                    const attrs = editor.getAttributes('textStyle');
                                    if (attrs.fontSize) return Number(attrs.fontSize);
                                    return letterSize;
                                }

                                const sizes = new Set<number>();
                                editor.state.doc.nodesBetween(from, to, (node) => {
                                    if (node.isText) {
                                        const mark = node.marks.find(m => m.type.name === 'textStyle' && m.attrs.fontSize);
                                        const size = mark ? Number(mark.attrs.fontSize) : letterSize;
                                        sizes.add(size);
                                    }
                                });

                                if (sizes.size > 1) return "Mixed";
                                if (sizes.size === 1) return [...sizes][0];
                                return letterSize;
                            })()}
                            onChange={(val) => {
                                editor?.chain().focus().setMark('textStyle', { fontSize: val }).run();
                                onLetterSizeChange(val as number);
                            }}
                            options={[12, 14, 16, 18, 20, 24, 28, 32].map(s => ({ label: s, value: s }))}
                            style={{ gap: '10px' }}
                        />
                    </div>

                    {/* Rich Text Editor */}
                    <div
                        className={`w-full h-32 border border-black/10 p-3 overflow-auto focus-within:border-black/20 ${letterFont}`}
                        style={{
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
                                { label: 'TYPEWRITER', value: 'typewriter' },
                                { label: 'FADE IN', value: 'fade-in' },
                                { label: 'WORD BY WORD', value: 'word-by-word' },
                                { label: 'CHARACTER', value: 'character-by-character' },
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
                                    { label: 'Sans', value: 'font-editor-sans' },
                                    { label: 'Serif', value: 'font-serif' },
                                    { label: 'Mono', value: 'font-mono' },
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
                                onChange={onFromFontChange}
                                options={[
                                    { label: 'Sans', value: 'font-editor-sans' },
                                    { label: 'Serif', value: 'font-serif' },
                                    { label: 'Mono', value: 'font-mono' },
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
                            className={`w-full h-20 border border-black/10 p-3 resize-none text-sm focus:outline-none focus:border-black/20 ${fromFont}`}
                            style={{ fontSize: `${fromSize}px` }}
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
                                <input
                                    type="text"
                                    value={envelopeColor}
                                    onChange={(e) => onEnvelopeColorChange(e.target.value)}
                                    className="font-mono text-xs text-black border border-black/10 px-3 focus:outline-none focus:border-black/30"
                                    style={{ height: '34px', width: '80px', boxSizing: 'border-box' }}
                                />
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
                                <input
                                    type="text"
                                    value={paperColor}
                                    onChange={(e) => onPaperColorChange(e.target.value)}
                                    className="font-mono text-xs text-black border border-black/10 px-3 focus:outline-none focus:border-black/30"
                                    style={{ height: '34px', width: '80px', boxSizing: 'border-box' }}
                                />
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
                                <input
                                    type="text"
                                    value={insideColor}
                                    onChange={(e) => onInsideColorChange(e.target.value)}
                                    className="font-mono text-xs text-black border border-black/10 px-3 focus:outline-none focus:border-black/30"
                                    style={{ height: '34px', width: '80px', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>


                    </div>
                </div>

                {/* Stickers section */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-mono uppercase tracking-wider" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '12px' }}>
                            Stickers
                        </span>
                        <div title="Toggle checkboxes to show/hide items. Click 'Choose File' to upload your own custom images." className="cursor-help flex items-center">
                            <Info size={12} color="rgba(0,0,0,0.4)" />
                        </div>
                    </div>



                    <div className="grid grid-cols-2" style={{ gap: '10px' }}>
                        {/* Stamp */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onHideStampChange?.(!hideStamp)}
                                    className="focus:outline-none flex items-center justify-center p-0"
                                    style={{ height: '12px', width: '12px' }}
                                >
                                    {hideStamp ? <EyeOff size={12} strokeWidth={1.5} className="text-gray-400" /> : <Eye size={12} strokeWidth={1.5} className="text-gray-500" />}
                                </button>
                                <span className="font-mono uppercase flex items-center h-[12px] leading-none" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                    Stamp
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 transition-opacity duration-200 ${hideStamp ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label
                                    style={{ display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded-none btn-purple transition-all duration-200"
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(e, onStampSrcChange, onStampFilenameChange, onHideStampChange)}
                                    />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400 truncate max-w-[100px]">
                                    {hideStamp ? 'No file uploaded' : (stampFilename || 'Default')}
                                </span>
                            </div>
                        </div>

                        {/* Logo 1 */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onHideLogo1Change?.(!hideLogo1)}
                                    className="focus:outline-none flex items-center justify-center p-0"
                                    style={{ height: '12px', width: '12px' }}
                                >
                                    {hideLogo1 ? <EyeOff size={12} strokeWidth={1.5} className="text-gray-400" /> : <Eye size={12} strokeWidth={1.5} className="text-gray-500" />}
                                </button>
                                <span className="font-mono uppercase flex items-center h-[12px] leading-none" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                    Logo 1
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 transition-opacity duration-200 ${hideLogo1 ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label
                                    style={{ display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded-none btn-purple transition-all duration-200"
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(e, onLogo1SrcChange, onLogo1FilenameChange, onHideLogo1Change)}
                                    />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400 truncate max-w-[100px]">
                                    {hideLogo1 ? 'No file uploaded' : (logo1Filename || 'Default')}
                                </span>
                            </div>
                        </div>

                        {/* Wax Seal */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onHideSealChange?.(!hideSeal)}
                                    className="focus:outline-none flex items-center justify-center p-0"
                                    style={{ height: '12px', width: '12px' }}
                                >
                                    {hideSeal ? <EyeOff size={12} strokeWidth={1.5} className="text-gray-400" /> : <Eye size={12} strokeWidth={1.5} className="text-gray-500" />}
                                </button>
                                <span className="font-mono uppercase flex items-center h-[12px] leading-none" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                    Wax Seal
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 transition-opacity duration-200 ${hideSeal ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label
                                    style={{ display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded-none btn-purple transition-all duration-200"
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(e, onSealSrcChange, onSealFilenameChange, onHideSealChange)}
                                    />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400 truncate max-w-[100px]">
                                    {hideSeal ? 'No file uploaded' : (sealFilename || 'Default')}
                                </span>
                            </div>
                        </div>

                        {/* Logo 2 */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onHideLogo2Change?.(!hideLogo2)}
                                    className="focus:outline-none flex items-center justify-center p-0"
                                    style={{ height: '12px', width: '12px' }}
                                >
                                    {hideLogo2 ? <EyeOff size={12} strokeWidth={1.5} className="text-gray-400" /> : <Eye size={12} strokeWidth={1.5} className="text-gray-500" />}
                                </button>
                                <span className="font-mono uppercase flex items-center h-[12px] leading-none" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                    Logo 2
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 transition-opacity duration-200 ${hideLogo2 ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label
                                    style={{ display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded-none btn-purple transition-all duration-200"
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(e, onLogo2SrcChange, onLogo2FilenameChange, onHideLogo2Change)}
                                    />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400 truncate max-w-[100px]">
                                    {hideLogo2 ? 'No file uploaded' : (logo2Filename || 'Default')}
                                </span>
                            </div>
                        </div>

                        {/* Letter Logo */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onHideLetterLogoChange?.(!hideLetterLogo)}
                                    className="focus:outline-none flex items-center justify-center p-0"
                                    style={{ height: '12px', width: '12px' }}
                                >
                                    {hideLetterLogo ? <EyeOff size={12} strokeWidth={1.5} className="text-gray-400" /> : <Eye size={12} strokeWidth={1.5} className="text-gray-500" />}
                                </button>
                                <span className="font-mono uppercase flex items-center h-[12px] leading-none" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '10px' }}>
                                    Letter Logo
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 transition-opacity duration-200 ${hideLetterLogo ? 'opacity-50 pointer-events-none' : ''}`}>
                                <label
                                    style={{ display: 'inline-block', width: 'auto' }}
                                    className="font-mono text-[10px] px-3 py-1.5 cursor-pointer rounded-none btn-purple transition-all duration-200"
                                >
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(e, onLetterLogoSrcChange, onLetterLogoFilenameChange, onHideLetterLogoChange)}
                                    />
                                </label>
                                <span className="font-mono text-[10px] text-gray-400 truncate max-w-[100px]">
                                    {letterLogoFilename || 'Default'}
                                </span>
                            </div>
                        </div>

                        {/* Postmark Location (Moved to end) */}
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
            </div>

            {/* === SECTION 3: SHARE YOUR LETTER === */}
            <div className="bg-white border border-black/5 flex flex-col" style={{ padding: '15px', gap: '20px' }}>
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Share Your Letter</span>
                </div>

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
                            onClick={() => {
                                onSaveAndShare?.();
                                if (generatedUrl) {
                                    window.open(generatedUrl, '_blank');
                                }
                            }}
                            className="font-mono text-[10px] font-medium px-4 py-2 uppercase tracking-wider rounded-none shrink-0 btn-purple transition-all min-w-[80px] flex items-center justify-center"
                        >
                            SAVE & VIEW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
