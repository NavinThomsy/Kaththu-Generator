import React, { useState, useEffect } from "react";
import { readAndCompressImage } from '../utils/imageCompression';
import { uploadToImgBB } from '../utils/imgbbService';
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
    Indent,
    Outdent,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';

// Import extracted components
import { CustomDropdown } from './editor/CustomDropdown';
import { AnimationSection } from './editor/AnimationSection';
import { ToFromSection } from './editor/ToFromSection';
import { ColorsSection } from './editor/ColorsSection';
import { StickersSection } from './editor/StickersSection';
import { ShareSection } from './editor/ShareSection';

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

// Props interface for integration with App.tsx
export interface LetterEditorProps {
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
    onSaveAndShare: (url?: string) => void;
}

export function LetterEditor({
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
}: LetterEditorProps) {

    // Helper to read file, compress it, upload to ImgBB, and update state with hosted URL
    const handleImageUpload = async (
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
                // Track upload start
                setUploadingCount(prev => prev + 1);

                try {
                    // First compress the image
                    const compressed = await readAndCompressImage(file);

                    // OPTIMISTIC UPDATE: Show local preview immediately!
                    setter(compressed);

                    // Upload to ImgBB in the background
                    // (User sees the image instantly, we replace it with hosted URL when ready)
                    uploadToImgBB(compressed, file.name).then((hostedUrl) => {
                        if (hostedUrl) {
                            setter(hostedUrl);
                        } else {
                            console.warn('ImgBB upload failed, keeping local base64');
                        }
                    }).finally(() => {
                        // Track upload finish (success or fail)
                        setUploadingCount(prev => Math.max(0, prev - 1));
                    });
                } catch (err) {
                    console.error('Failed to process image:', err);
                    setUploadingCount(prev => Math.max(0, prev - 1));

                    // Fallback to uncompressed base64
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        if (ev.target?.result) {
                            setter(ev.target.result as string);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };


    // --- TipTap Rich Text Editor ---
    // State to force re-render for toolbar updates
    const [, forceUpdate] = useState(0);
    // Track active uploads to show spinner
    const [uploadingCount, setUploadingCount] = useState(0);

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
        if (editor && !editor.isDestroyed) {
            try {
                editor.view.dom.style.fontFamily = letterFont === 'Mono' ? 'monospace' : letterFont === 'Serif' ? 'serif' : 'sans-serif';
                editor.view.dom.style.fontSize = `${letterSize}px`;
                editor.view.dom.style.color = textColor;
            } catch (e) {
                // Ignore view access errors during mount/unmount
            }
        }
    }, [editor, letterFont, letterSize, textColor]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* === SECTION 1: COMPOSE YOUR LETTER === */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-black/5 flex flex-col"
                style={{ padding: '15px', gap: '20px' }}
            >
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Compose Your Letter</span>
                </div>

                <div className="flex flex-col" style={{ gap: '5px' }}>
                    {/* Rich Text Toolbar */}
                    <div className="flex items-center gap-1 w-full" style={{ flexWrap: 'wrap' }}>
                        {/* Bold */}
                        <button
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive('bold') ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <Bold className="w-4 h-4 text-black" />
                        </button>

                        {/* Italic */}
                        <button
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive('italic') ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <Italic className="w-4 h-4 text-black" />
                        </button>

                        {/* Underline */}
                        <button
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive('underline') ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <Underline className="w-4 h-4 text-black" />
                        </button>

                        {/* Align Left */}
                        <button
                            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <AlignLeft className="w-4 h-4 text-black" />
                        </button>

                        {/* Align Center */}
                        <button
                            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <AlignCenter className="w-4 h-4 text-black" />
                        </button>

                        {/* Align Right */}
                        <button
                            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <AlignRight className="w-4 h-4 text-black" />
                        </button>

                        {/* Bullet List */}
                        <button
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <List className="w-4 h-4 text-black" />
                        </button>

                        {/* Ordered List */}
                        <button
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            className={`p-2 border border-black/10 hover:bg-gray-50 flex-shrink-0 ${editor?.isActive('orderedList') ? 'bg-gray-200' : 'bg-white'}`}
                        >
                            <ListOrdered className="w-4 h-4 text-black" />
                        </button>

                        {/* Outdent - Lift List Item */}
                        <button
                            onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
                            disabled={!editor?.can().liftListItem('listItem')}
                            className={`p-2 border border-black/10 flex-shrink-0 ${!editor?.can().liftListItem('listItem') ? 'bg-gray-100 text-gray-300' : 'bg-white hover:bg-gray-50'}`}
                            title="Outdent"
                        >
                            <Outdent className="w-4 h-4 text-black" />
                        </button>

                        {/* Indent - Sink List Item */}
                        <button
                            onClick={() => editor?.chain().focus().sinkListItem('listItem').run()}
                            disabled={!editor?.can().sinkListItem('listItem')}
                            className={`p-2 border border-black/10 flex-shrink-0 ${!editor?.can().sinkListItem('listItem') ? 'bg-gray-100 text-gray-300' : 'bg-white hover:bg-gray-50'}`}
                            title="Indent"
                        >
                            <Indent className="w-4 h-4 text-black" />
                        </button>

                        {/* Color picker with dropdown chevron */}
                        <div className="flex items-center border border-black/10 bg-white flex-shrink-0">
                            <div className="relative flex items-center" style={{ height: '34px', paddingLeft: '8px', paddingRight: '4px' }}>
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: (() => {
                                            try { return editor?.getAttributes('textStyle').color || textColor } catch { return textColor }
                                        })(),
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                                <ChevronDown className="w-3 h-3 text-black ml-1" />
                                <input
                                    type="color"
                                    value={(() => {
                                        try { return editor?.getAttributes('textStyle').color || textColor } catch { return textColor }
                                    })()}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        editor?.chain().focus().setColor(val).run();
                                        forceUpdate(n => n + 1);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Spacer for desktop - pushes font/size to right on lg screens */}
                        <div className="hidden lg:block lg:flex-1" />

                        {/* Font & Size dropdowns - grouped together to wrap as one unit */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Font dropdown */}
                            <CustomDropdown
                                value={(() => {
                                    if (!editor) return letterFont;
                                    try {
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
                                    } catch (e) {
                                        return letterFont;
                                    }
                                })()}
                                onChange={(val) => {
                                    const stack = FONT_STACKS[val as string];
                                    if (stack) {
                                        editor?.chain().focus().setFontFamily(stack).run();
                                    }
                                }}
                                options={[
                                    { label: 'Sans', value: 'font-editor-sans' },
                                    { label: 'Serif', value: 'font-serif' },
                                    { label: 'Mono', value: 'font-mono' },
                                ]}
                                style={{ width: '100px' }}
                            />

                            {/* Size dropdown */}
                            <CustomDropdown
                                value={(() => {
                                    if (!editor || editor.isDestroyed) return letterSize;
                                    try {
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
                                    } catch (e) {
                                        // Editor view might not be ready
                                        return letterSize;
                                    }
                                })()}
                                onChange={(val) => {
                                    editor?.chain().focus().setMark('textStyle', { fontSize: val }).run();
                                }}
                                options={[12, 14, 16, 18, 20, 24, 28, 32].map(s => ({ label: s, value: s }))}
                                style={{ width: '60px' }}
                            />
                        </div>
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
                <AnimationSection
                    animationType={animationType}
                    onAnimationTypeChange={onAnimationTypeChange}
                    animationSpeed={animationSpeed}
                    onAnimationSpeedChange={onAnimationSpeedChange}
                />
            </motion.div>

            {/* === SECTION 2: CUSTOMIZE ENVELOPE === */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-black/5 flex flex-col"
                style={{ padding: '15px', gap: '20px' }}
            >
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Customize Envelope</span>
                </div>

                {/* To and From fields */}
                <ToFromSection
                    toText={toText}
                    onToTextChange={onToTextChange}
                    toFont={toFont}
                    onToFontChange={onToFontChange}
                    toSize={toSize}
                    onToSizeChange={onToSizeChange}
                    fromText={fromText}
                    onFromTextChange={onFromTextChange}
                    fromFont={fromFont}
                    onFromFontChange={onFromFontChange}
                    fromSize={fromSize}
                    onFromSizeChange={onFromSizeChange}
                />

                {/* Colors section */}
                <ColorsSection
                    envelopeColor={envelopeColor}
                    onEnvelopeColorChange={onEnvelopeColorChange}
                    paperColor={paperColor}
                    onPaperColorChange={onPaperColorChange}
                    insideColor={insideColor}
                    onInsideColorChange={onInsideColorChange}
                />

                {/* Stickers section */}
                <StickersSection
                    stampFilename={stampFilename}
                    hideStamp={hideStamp}
                    onHideStampChange={onHideStampChange}
                    onStampUpload={(e) => handleImageUpload(e, onStampSrcChange, onStampFilenameChange, onHideStampChange)}
                    logo1Filename={logo1Filename}
                    hideLogo1={hideLogo1}
                    onHideLogo1Change={onHideLogo1Change}
                    onLogo1Upload={(e) => handleImageUpload(e, onLogo1SrcChange, onLogo1FilenameChange, onHideLogo1Change)}
                    sealFilename={sealFilename}
                    hideSeal={hideSeal}
                    onHideSealChange={onHideSealChange}
                    onSealUpload={(e) => handleImageUpload(e, onSealSrcChange, onSealFilenameChange, onHideSealChange)}
                    logo2Filename={logo2Filename}
                    hideLogo2={hideLogo2}
                    onHideLogo2Change={onHideLogo2Change}
                    onLogo2Upload={(e) => handleImageUpload(e, onLogo2SrcChange, onLogo2FilenameChange, onHideLogo2Change)}
                    letterLogoFilename={letterLogoFilename}
                    hideLetterLogo={hideLetterLogo}
                    onHideLetterLogoChange={onHideLetterLogoChange}
                    onLetterLogoUpload={(e) => handleImageUpload(e, onLetterLogoSrcChange, onLetterLogoFilenameChange, onHideLetterLogoChange)}
                    postmarkLocation={postmarkLocation}
                    onPostmarkLocationChange={onPostmarkLocationChange}
                />
            </motion.div>

            {/* === SECTION 3: SHARE YOUR LETTER === */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white border border-black/5 flex flex-col"
                style={{ padding: '15px', gap: '20px' }}
            >
                <div className="flex items-center gap-1 font-mono uppercase tracking-wider" style={{ color: '#000000', fontSize: '16px' }}>
                    <span>Share Your Letter</span>
                </div>

                <ShareSection
                    generatedUrl={generatedUrl}
                    onSaveAndShare={onSaveAndShare}
                    isUploading={uploadingCount > 0}
                />
            </motion.div>
        </div>
    );
}
