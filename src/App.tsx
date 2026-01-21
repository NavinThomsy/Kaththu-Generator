import React, { useState, useEffect, useRef } from "react";
import { TextEditor } from "./components/TextEditor";
import { Envelope } from "./components/Envelope";
import {
    AnimatedText,
    AnimationType,
} from "./components/AnimatedText";
import { LetterViewer } from "./components/LetterViewer";
import { Sidebar, SavedLetter } from "./components/Sidebar";
import { EditorPrototype } from "./components/EditorPrototype";
import { RotateCcw, Share2, Menu } from "lucide-react";
import {
    createPublishedURL,
    getLetterFromURL,
    isViewerMode,
} from "./utils/urlHelpers";
// @ts-ignore
import waxSealImage from "./assets/Navin Logo Wax Seal.png";
// @ts-ignore
import stampImage from "./assets/Stamp.png";
// @ts-ignore
import logo1Image from "./assets/Logo 1.png";

const DEFAULT_IMAGES = {
    STAMP: stampImage,
    SEAL: waxSealImage,
    LOGO1: logo1Image,
    LOGO2: "https://images.unsplash.com/photo-1767695086479-869f10facf90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
};

const DEFAULT_FILENAMES = {
    STAMP: "Stamp.png",
    SEAL: "Wax Seal.png",
    LOGO1: "Logo 1.png",
    LOGO2: "Logo 2.png"
};

export default function App() {
    const [viewMode, setViewMode] = useState(() =>
        isViewerMode(),
    );

    // --- Content State ---
    const [text, setText] = useState(() => {
        const data = getLetterFromURL();
        return data
            ? data.text
            : "Hello World \n\nBest,\nNavin Thomsy";
    });
    const [animationType, setAnimationType] =
        useState<AnimationType>(() => {
            const data = getLetterFromURL();
            return data ? data.animationType : "fade-in";
        });

    const [animationSpeed, setAnimationSpeed] = useState(() => {
        const data = getLetterFromURL();
        return data?.animationSpeed || 5;
    });

    const [letterFont, setLetterFont] = useState(() => {
        const data = getLetterFromURL();
        return data?.font || "font-editor-sans";
    });

    const [letterSize, setLetterSize] = useState(() => {
        const data = getLetterFromURL();
        return data?.fontSize || 12;
    });

    const [envelopeColor, setEnvelopeColor] = useState(() => {
        const data = getLetterFromURL();
        return data?.envelopeColor || "#eceada";
    });

    const [letterColor, setLetterColor] = useState(() => {
        const data = getLetterFromURL();
        return data?.letterColor || "#ffffff";
    });

    const [insideEnvelopeColor, setInsideEnvelopeColor] = useState(() => {
        const data = getLetterFromURL();
        return data?.insideEnvelopeColor || "#966d1d";
    });

    // --- Envelope State ---
    const [to, setTo] = useState(() => {
        const data = getLetterFromURL();
        return data?.toText || "Recipient Name";
    });
    // ... (omitted parts of file for brevity in prompt, but in real execution I match lines)
    // Actually, to avoid context errors with huge gaps, I will target specific blocks. 
    // Block 1: State definition
    // Block 2: URL params (createPublishedURL) - I will do this in a separate step or just update state for now.
    // Block 3: Pass to LetterViewer
    // Block 4: Add Color Picker
    // I'll do this in smaller chunks. First Component State.

    const [from, setFrom] = useState(() => {
        const data = getLetterFromURL();
        return data?.fromText || "Navin Thomsy\n";
    });

    const [stampSrc, setStampSrc] = useState(() => {
        const data = getLetterFromURL();
        // Start with default if no data, or if data has it. Only empty if explicitly removed?
        // Actually, getLetterFromURL returns what's in URL. If URL has nothing, it returns nothing.
        // If it's a fresh load (no data), we want defaults.
        return data ? (data.stampImage || "") : DEFAULT_IMAGES.STAMP;
    });
    const [sealSrc, setSealSrc] = useState(() => {
        const data = getLetterFromURL();
        return data ? (data.sealSrc || "") : DEFAULT_IMAGES.SEAL;
    });
    const [logo1Src, setLogo1Src] = useState(() => {
        const data = getLetterFromURL();
        return data ? (data.logo1Src || "") : DEFAULT_IMAGES.LOGO1;
    });
    const [postmarkSrc, setPostmarkSrc] = useState(() => {
        const data = getLetterFromURL();
        return data ? (data.postmarkSrc || "") : "";
    });
    const [postmarkText, setPostmarkText] = useState(() => {
        const data = getLetterFromURL();
        return data?.postmarkText ?? "LONDON";
    });
    const [logo2Src, setLogo2Src] = useState(DEFAULT_IMAGES.LOGO2);

    // Filenames & Visibility
    const [stampFilename, setStampFilename] = useState(DEFAULT_FILENAMES.STAMP);
    const [sealFilename, setSealFilename] = useState(DEFAULT_FILENAMES.SEAL);
    const [logo1Filename, setLogo1Filename] = useState(DEFAULT_FILENAMES.LOGO1);
    const [logo2Filename, setLogo2Filename] = useState(DEFAULT_FILENAMES.LOGO2);
    // Letter Logo
    const [letterLogoSrc, setLetterLogoSrc] = useState<string | undefined>(undefined);
    const [letterLogoFilename, setLetterLogoFilename] = useState("Letter Logo.png");

    const [hideStamp, setHideStamp] = useState(false);
    const [hideSeal, setHideSeal] = useState(false);
    const [hideLogo1, setHideLogo1] = useState(false);
    const [hideLogo2, setHideLogo2] = useState(false);
    const [hideLetterLogo, setHideLetterLogo] = useState(false);

    const [toFont, setToFont] = useState(() => {
        const data = getLetterFromURL();
        return data?.toFont || "font-serif";
    });
    const [toSize, setToSize] = useState(() => {
        const data = getLetterFromURL();
        return data?.toSize || 14;
    });
    const [fromFont, setFromFont] = useState(() => {
        const data = getLetterFromURL();
        return data?.fromFont || "font-serif";
    });
    const [fromSize, setFromSize] = useState(() => {
        const data = getLetterFromURL();
        return data?.fromSize || 14;
    });

    // --- Local History State ---
    const [sentLetters, setSentLetters] = useState<SavedLetter[]>(
        () => {
            try {
                const saved = localStorage.getItem("sent_letters");
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        },
    );

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // --- Handlers ---

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

    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [key, setKey] = useState(0);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    // Click outside to close envelope
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // Only close if click is INSIDE the preview container but OUTSIDE the envelope itself
            if (
                isEnvelopeOpen &&
                previewContainerRef.current &&
                previewContainerRef.current.contains(target) && // Click is in the preview area
                envelopeRef.current &&
                !envelopeRef.current.contains(target) // Click is NOT on the envelope
            ) {
                setIsEnvelopeOpen(false);
                setKey(Date.now()); // Reset animation
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEnvelopeOpen]);

    useEffect(() => {
        const handleHashChange = () => {
            const isViewer = isViewerMode();
            setViewMode(isViewer);

            if (isViewer) {
                const letterData = getLetterFromURL();
                if (letterData) {
                    setText(letterData.text);
                    setAnimationType(letterData.animationType);
                    setLetterFont(letterData.font || "font-sans");
                    setLetterSize(letterData.fontSize || 16);
                    if (letterData.toText) setTo(letterData.toText);
                    if (letterData.fromText) setFrom(letterData.fromText);
                    if (letterData.stampImage)
                        setStampSrc(letterData.stampImage);
                    if (letterData.logo1Src)
                        setLogo1Src(letterData.logo1Src);
                    if (letterData.logo2Src)
                        setLogo2Src(letterData.logo2Src);
                    if (letterData.toFont) setToFont(letterData.toFont);
                    if (letterData.toSize) setToSize(letterData.toSize);
                    if (letterData.fromFont)
                        setFromFont(letterData.fromFont);
                    if (letterData.fromSize)
                        setFromSize(letterData.fromSize);
                    // Logos usually aren't customized per letter in this simplified version unless we add them to URL,
                    // but I'll leave logos as local state default for now since I didn't add them to URL Helper effectively.
                    // Wait, I should add logos to URL Helper if I want them persisted?
                    // The interface has logo1Src/logo2Src. I'll pass them to createPublishedURL.
                }
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        window.addEventListener("popstate", handleHashChange);

        return () => {
            window.removeEventListener(
                "hashchange",
                handleHashChange,
            );
            window.removeEventListener("popstate", handleHashChange);
        };
    }, []);

    const handleOpenEnvelope = () => {
        setIsEnvelopeOpen(true);
    };

    const handleReset = () => {
        setIsEnvelopeOpen(false);
        setKey(key + 1);
    };

    const handleDeleteLetter = (id: string) => {
        const newLetters = sentLetters.filter((l) => l.id !== id);
        setSentLetters(newLetters);
        localStorage.setItem(
            "sent_letters",
            JSON.stringify(newLetters),
        );
    };

    const handleOpenSavedLink = (url: string) => {
        window.open(url, "_blank");
    };

    const handleSaveAndShare = () => {
        // 1. Create URL
        const url = createPublishedURL({
            text,
            animationType,
            font: letterFont,
            fontSize: letterSize,
            toText: to,
            fromText: from,
            stampImage: stampSrc,
            postmarkText,
            postmarkSrc,
            logo1Src,
            logo2Src,
            toFont,
            toSize,
            fromFont,
            fromSize,
            envelopeColor,
            insideEnvelopeColor,
            letterColor,
            animationSpeed,
            sealSrc,
        });

        // 2. Save to History
        const newLetter: SavedLetter = {
            id: Date.now().toString(),
            recipient: to,
            excerpt:
                text.slice(0, 50) + (text.length > 50 ? "..." : ""),
            createdAt: new Date().toISOString(),
            url: url,
        };

        const updatedLetters = [newLetter, ...sentLetters];
        setSentLetters(updatedLetters);
        localStorage.setItem(
            "sent_letters",
            JSON.stringify(updatedLetters),
        );

        // 3. Open
        window.open(url, "_blank");
    };

    const handleBackToEditor = () => {
        const url = new URL(window.location.href);
        url.search = "";
        url.hash = "";
        window.history.pushState({}, "", url.pathname);
        setViewMode(false);
    };

    // --- Render ---

    if (viewMode) {
        return (
            <>
                <LetterViewer
                    text={text}
                    animationType={animationType}
                    font={letterFont}
                    fontSize={letterSize}
                    toText={to}
                    fromText={from}
                    stampImage={stampSrc}
                    logo1Src={logo1Src}
                    logo2Src={logo2Src}
                    postmarkSrc={postmarkSrc}
                    toFont={toFont}
                    toSize={toSize}
                    fromFont={fromFont}
                    fromSize={fromSize}
                    envelopeColor={envelopeColor}
                    insideEnvelopeColor={insideEnvelopeColor}
                    letterColor={letterColor}
                    animationSpeed={animationSpeed}
                    sealSrc={sealSrc}
                    postmarkText={postmarkText}
                />
                <button
                    onClick={handleBackToEditor}
                    className="fixed bottom-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase tracking-widest bg-white/80 px-3 py-2 rounded-full shadow-sm backdrop-blur-sm"
                >
                    Create Your Own
                </button>
            </>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Sidebar (Desktop) */}
            <div
                className={`${isSidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden relative border-r border-gray-200 bg-white`}
            >
                <Sidebar
                    letters={sentLetters}
                    onDelete={handleDeleteLetter}
                    onOpen={handleOpenSavedLink}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Toggle Sidebar Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-hidden h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-0">
                        {/* Left Column: Editor Controls */}
                        <div className="h-full overflow-y-auto p-4 md:p-8 border-r border-gray-200 no-scrollbar">
                            <div className="max-w-2xl mx-auto pt-12 pb-20">
                                <h1 className="text-center mb-8 text-gray-800 text-3xl font-serif">
                                    Animated Letter App
                                </h1>
                                <EditorPrototype
                                    letterText={text}
                                    onLetterTextChange={setText}
                                    letterFont={letterFont}
                                    onLetterFontChange={setLetterFont}
                                    letterSize={letterSize}
                                    onLetterSizeChange={setLetterSize}
                                    textColor="#000000"
                                    onTextColorChange={() => { }}
                                    animationType={animationType}
                                    onAnimationTypeChange={(val) => setAnimationType(val as AnimationType)}
                                    animationSpeed={animationSpeed}
                                    onAnimationSpeedChange={setAnimationSpeed}
                                    toText={to}
                                    onToTextChange={setTo}
                                    toFont={toFont}
                                    onToFontChange={setToFont}
                                    toSize={toSize}
                                    onToSizeChange={setToSize}
                                    fromText={from}
                                    onFromTextChange={setFrom}
                                    fromFont={fromFont}
                                    onFromFontChange={setFromFont}
                                    fromSize={fromSize}
                                    onFromSizeChange={setFromSize}
                                    envelopeColor={envelopeColor}
                                    onEnvelopeColorChange={setEnvelopeColor}
                                    paperColor={letterColor}
                                    onPaperColorChange={setLetterColor}
                                    insideColor={insideEnvelopeColor}
                                    onInsideColorChange={setInsideEnvelopeColor}
                                    postmarkLocation={postmarkText}
                                    onPostmarkLocationChange={setPostmarkText}
                                    stampSrc={stampSrc}
                                    onStampSrcChange={setStampSrc}
                                    sealSrc={sealSrc}
                                    onSealSrcChange={setSealSrc}
                                    logo1Src={logo1Src}
                                    onLogo1SrcChange={setLogo1Src}
                                    logo2Src={logo2Src}
                                    onLogo2SrcChange={setLogo2Src}
                                    stampFilename={stampFilename}
                                    onStampFilenameChange={setStampFilename}
                                    sealFilename={sealFilename}
                                    onSealFilenameChange={setSealFilename}
                                    logo1Filename={logo1Filename}
                                    onLogo1FilenameChange={setLogo1Filename}
                                    logo2Filename={logo2Filename}
                                    onLogo2FilenameChange={setLogo2Filename}
                                    hideStamp={hideStamp}
                                    onHideStampChange={setHideStamp}
                                    hideSeal={hideSeal}
                                    onHideSealChange={setHideSeal}
                                    hideLogo1={hideLogo1}
                                    onHideLogo1Change={setHideLogo1}
                                    hideLogo2={hideLogo2}
                                    onHideLogo2Change={setHideLogo2}
                                    letterLogoSrc={letterLogoSrc}
                                    onLetterLogoSrcChange={setLetterLogoSrc}
                                    letterLogoFilename={letterLogoFilename}
                                    onLetterLogoFilenameChange={setLetterLogoFilename}
                                    hideLetterLogo={hideLetterLogo}
                                    onHideLetterLogoChange={setHideLetterLogo}
                                    generatedUrl={createPublishedURL({
                                        text,
                                        animationType,
                                        font: letterFont,
                                        fontSize: letterSize,
                                        toText: to,
                                        fromText: from,
                                        stampImage: hideStamp ? undefined : stampSrc,
                                        postmarkText,
                                        postmarkSrc,
                                        logo1Src: hideLogo1 ? undefined : logo1Src,
                                        logo2Src: hideLogo2 ? undefined : logo2Src,
                                        toFont,
                                        toSize,
                                        fromFont,
                                        fromSize,
                                        envelopeColor,
                                        insideEnvelopeColor,
                                        letterColor,
                                        animationSpeed,
                                        sealSrc: hideSeal ? undefined : sealSrc,
                                    })}
                                    onCopyUrl={() => navigator.clipboard.writeText(createPublishedURL({
                                        text,
                                        animationType,
                                        font: letterFont,
                                        fontSize: letterSize,
                                        toText: to,
                                        fromText: from,
                                        stampImage: hideStamp ? undefined : stampSrc,
                                        postmarkText,
                                        postmarkSrc,
                                        logo1Src: hideLogo1 ? undefined : logo1Src,
                                        logo2Src: hideLogo2 ? undefined : logo2Src,
                                        toFont,
                                        toSize,
                                        fromFont,
                                        fromSize,
                                        envelopeColor,
                                        insideEnvelopeColor,
                                        letterColor,
                                        animationSpeed,
                                        sealSrc,
                                    }))}
                                    onSaveAndShare={handleSaveAndShare}
                                />

                            </div>
                        </div>

                        {/* Right Column: Preview */}
                        <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50/50">
                            <div ref={previewContainerRef} className="max-w-2xl mx-auto pt-12 space-y-4">


                                <div
                                    ref={envelopeRef}
                                    className="relative min-h-[500px] flex items-center justify-center"
                                >
                                    <Envelope
                                        key={key}
                                        onOpen={handleOpenEnvelope}
                                        onClose={() => setIsEnvelopeOpen(false)}
                                        isOpen={isEnvelopeOpen}
                                        to={to}
                                        from={from}
                                        stampSrc={hideStamp ? undefined : stampSrc}
                                        logo1Src={hideLogo1 ? undefined : logo1Src}
                                        logo2Src={hideLogo2 ? undefined : logo2Src}
                                        sealSrc={hideSeal ? undefined : sealSrc}
                                        postmarkSrc={postmarkSrc}
                                        postmarkText={postmarkText}
                                        toFont={toFont}
                                        toSize={toSize}
                                        fromFont={fromFont}
                                        fromSize={fromSize}
                                        paperColor={envelopeColor}
                                        insideEnvelopeColor={insideEnvelopeColor}
                                        letterColor={letterColor}
                                        letterLogoSrc={letterLogoSrc}
                                        hideLetterLogo={hideLetterLogo}
                                        letterFont={letterFont}
                                    >
                                        <AnimatedText
                                            key={String(isEnvelopeOpen)} // Reset animation on open
                                            text={text}
                                            animationType={animationType}
                                            font={letterFont}
                                            fontSize={letterSize}
                                            delay={1.5}
                                        />
                                    </Envelope>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save & Share Button */}
                    {/* Reset Button */}
                    <button
                        onClick={() => setIsEnvelopeOpen(false)}
                        className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center z-[100]"
                        style={{ backgroundColor: '#6200ea' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5000ca'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6200ea'}
                        onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#4000aa'}
                        onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#5000ca'}
                        title="Reset View"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}