import React, { useState, useEffect } from "react";
import { TextEditor } from "./components/TextEditor";
import { Envelope } from "./components/Envelope";
import {
    AnimatedText,
    AnimationType,
} from "./components/AnimatedText";
import { LetterViewer } from "./components/LetterViewer";
import { Sidebar, SavedLetter } from "./components/Sidebar";
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
            return data ? data.animationType : "typewriter";
        });

    const [animationSpeed, setAnimationSpeed] = useState(() => {
        const data = getLetterFromURL();
        return data?.animationSpeed || 5;
    });

    const [letterFont, setLetterFont] = useState(() => {
        const data = getLetterFromURL();
        return data?.font || "font-sans";
    });

    const [letterSize, setLetterSize] = useState(() => {
        const data = getLetterFromURL();
        return data?.fontSize || 16;
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

    const [from, setFrom] = useState(() => {
        const data = getLetterFromURL();
        return data?.fromText || "Navin Thomsy\n";
    });

    const [stampSrc, setStampSrc] = useState(() => {
        const data = getLetterFromURL();
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
    const [logo2Src, setLogo2Src] = useState(() => {
        const data = getLetterFromURL();
        return data ? (data.logo2Src || "") : DEFAULT_IMAGES.LOGO2;
    });

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

        // 3. Copy to clipboard
        navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
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
        <div className="flex h-screen bg-gray-100 overflow-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#FAFAFA]">
                {/* Toggle Sidebar Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-6 left-6 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto px-8 py-12">
                        {/* Two Column Grid */}
                        <div className="grid grid-cols-[1fr_500px] gap-12 items-start">

                            {/* Left Column: Editor */}
                            <div className="flex flex-col gap-[17px] min-w-0">

                                {/* Section 1: Compose Your Letter */}
                                <div className="bg-white border border-[rgba(0,0,0,0.05)] flex flex-col gap-[20px] h-[300px] overflow-clip p-[15px] rounded-sm">
                                    <div className="flex items-center">
                                        <p className="text-[12px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                            1. COMPOSE YOUR LETTER
                                        </p>
                                    </div>

                                    {/* Text Editor */}
                                    <TextEditor
                                        value={text}
                                        onChange={setText}
                                    />

                                    {/* Font and Size Dropdowns */}
                                    <div className="flex gap-[10px]">
                                        <select
                                            value={letterFont}
                                            onChange={(e) => setLetterFont(e.target.value)}
                                            className="flex-1 h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                            style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                        >
                                            <option value="font-sans">Sans</option>
                                            <option value="font-serif">Serif</option>
                                            <option value="font-mono">Mono</option>
                                        </select>

                                        <select
                                            value={letterSize}
                                            onChange={(e) => setLetterSize(Number(e.target.value))}
                                            className="w-[60px] h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                            style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                        >
                                            <option value="12">12</option>
                                            <option value="14">14</option>
                                            <option value="16">16</option>
                                            <option value="18">18</option>
                                            <option value="20">20</option>
                                            <option value="24">24</option>
                                        </select>
                                    </div>

                                    {/* Animation Type and Speed */}
                                    <div className="flex flex-col gap-[10px]">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[8px] leading-none text-black/60" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                ANIMATION TYPE
                                            </p>
                                            <p className="text-[8px] leading-none text-black/60" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                ANIMATION SPEED
                                            </p>
                                        </div>

                                        <div className="flex gap-[10px] items-center">
                                            <select
                                                value={animationType}
                                                onChange={(e) => setAnimationType(e.target.value as AnimationType)}
                                                className="flex-1 h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white uppercase"
                                                style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                            >
                                                <option value="typewriter">TYPEWRITER</option>
                                                <option value="fade-in">FADE IN</option>
                                                <option value="word-by-word">WORD BY WORD</option>
                                                <option value="character-by-character">CHARACTER</option>
                                            </select>

                                            <div className="flex-1 flex flex-col gap-[5px]">
                                                <div className="flex justify-between text-[8px]" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    <span className="text-black/40">Slower</span>
                                                    <span className="text-black/40">Faster</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    step="0.5"
                                                    value={animationSpeed}
                                                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                                                    className="w-full h-[4px] rounded-full appearance-none cursor-pointer"
                                                    style={{
                                                        background: `linear-gradient(to right, #6A00FF 0%, #6A00FF ${((animationSpeed - 1) / 9) * 100}%, #E5E5E5 ${((animationSpeed - 1) / 9) * 100}%, #E5E5E5 100%)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Customize Envelope */}
                                <div className="bg-white border border-[rgba(0,0,0,0.05)] flex flex-col gap-[20px] p-[15px] rounded-sm">
                                    <div className="flex items-center">
                                        <p className="text-[12px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                            2. CUSTOMIZE ENVELOPE
                                        </p>
                                    </div>

                                    {/* TO and FROM sections */}
                                    <div className="grid grid-cols-2 gap-[15px]">
                                        {/* TO (RECIPIENT) */}
                                        <div className="flex flex-col gap-[10px]">
                                            <p className="text-[8px] leading-none text-black/60" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                TO (RECIPIENT)
                                            </p>
                                            <div className="flex gap-[5px]">
                                                <select
                                                    value={toFont}
                                                    onChange={(e) => setToFont(e.target.value)}
                                                    className="flex-1 h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                                    style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                                >
                                                    <option value="font-sans">Sans</option>
                                                    <option value="font-serif">Serif</option>
                                                    <option value="font-mono">Mono</option>
                                                </select>
                                                <select
                                                    value={toSize}
                                                    onChange={(e) => setToSize(Number(e.target.value))}
                                                    className="w-[50px] h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                                    style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                                >
                                                    <option value="12">12</option>
                                                    <option value="14">14</option>
                                                    <option value="16">16</option>
                                                    <option value="18">18</option>
                                                    <option value="20">20</option>
                                                </select>
                                            </div>
                                            <input
                                                type="text"
                                                value={to}
                                                onChange={(e) => setTo(e.target.value)}
                                                className="w-full h-[80px] px-[10px] py-[8px] text-[12px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                                style={{ fontFamily: 'system-ui, sans-serif' }}
                                            />
                                        </div>

                                        {/* FROM (SENDER) */}
                                        <div className="flex flex-col gap-[10px]">
                                            <p className="text-[8px] leading-none text-black/60" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                FROM (SENDER)
                                            </p>
                                            <div className="flex gap-[5px]">
                                                <select
                                                    value={fromFont}
                                                    onChange={(e) => setFromFont(e.target.value)}
                                                    className="flex-1 h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                                    style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                                >
                                                    <option value="font-sans">Sans</option>
                                                    <option value="font-serif">Serif</option>
                                                    <option value="font-mono">Mono</option>
                                                </select>
                                                <select
                                                    value={fromSize}
                                                    onChange={(e) => setFromSize(Number(e.target.value))}
                                                    className="w-[50px] h-[24px] px-[8px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white"
                                                    style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}
                                                >
                                                    <option value="12">12</option>
                                                    <option value="14">14</option>
                                                    <option value="16">16</option>
                                                    <option value="18">18</option>
                                                    <option value="20">20</option>
                                                </select>
                                            </div>
                                            <textarea
                                                value={from}
                                                onChange={(e) => setFrom(e.target.value)}
                                                className="w-full h-[80px] px-[10px] py-[8px] text-[12px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-white resize-none"
                                                style={{ fontFamily: 'system-ui, sans-serif' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <p className="text-[8px] leading-none text-black/60 mb-[10px]" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                            COLORS
                                        </p>
                                        <div className="grid grid-cols-4 gap-[10px]">
                                            {/* Envelope */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    ENVELOPE
                                                </p>
                                                <div className="flex items-center gap-[5px]">
                                                    <input
                                                        type="color"
                                                        value={envelopeColor}
                                                        onChange={(e) => setEnvelopeColor(e.target.value)}
                                                        className="w-[24px] h-[24px] rounded-[2px] border-0 cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={envelopeColor}
                                                        onChange={(e) => setEnvelopeColor(e.target.value)}
                                                        className="flex-1 h-[24px] px-[5px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px]"
                                                        style={{ fontFamily: "'Geist Mono', monospace" }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Paper */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    PAPER
                                                </p>
                                                <div className="flex items-center gap-[5px]">
                                                    <input
                                                        type="color"
                                                        value={letterColor}
                                                        onChange={(e) => setLetterColor(e.target.value)}
                                                        className="w-[24px] h-[24px] rounded-[2px] border-0 cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={letterColor}
                                                        onChange={(e) => setLetterColor(e.target.value)}
                                                        className="flex-1 h-[24px] px-[5px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px]"
                                                        style={{ fontFamily: "'Geist Mono', monospace" }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Inside */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    INSIDE
                                                </p>
                                                <div className="flex items-center gap-[5px]">
                                                    <input
                                                        type="color"
                                                        value={insideEnvelopeColor}
                                                        onChange={(e) => setInsideEnvelopeColor(e.target.value)}
                                                        className="w-[24px] h-[24px] rounded-[2px] border-0 cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={insideEnvelopeColor}
                                                        onChange={(e) => setInsideEnvelopeColor(e.target.value)}
                                                        className="flex-1 h-[24px] px-[5px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px]"
                                                        style={{ fontFamily: "'Geist Mono', monospace" }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Postmark Location */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    POSTMARK LOCATION
                                                </p>
                                                <input
                                                    type="text"
                                                    value={postmarkText}
                                                    onChange={(e) => setPostmarkText(e.target.value)}
                                                    placeholder="LONDON (EMPTY TO HIDE)"
                                                    className="w-full h-[24px] px-[5px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px]"
                                                    style={{ fontFamily: "'Geist Mono', monospace" }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Images */}
                                    <div>
                                        <p className="text-[8px] leading-none text-black/60 mb-[10px]" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                            IMAGES
                                        </p>
                                        <div className="grid grid-cols-2 gap-[10px]">
                                            {/* Stamp */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    STAMP
                                                </p>
                                                <label className="h-[24px] px-[10px] flex items-center justify-center text-[8px] bg-[#6A00FF] text-white rounded-[2px] cursor-pointer hover:bg-[#5500CC] transition-colors" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setStampSrc)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-[8px] text-black/40 truncate" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                    {stampSrc ? "File chosen" : "No file chosen"}
                                                </p>
                                            </div>

                                            {/* Logo 1 */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    LOGO 1
                                                </p>
                                                <label className="h-[24px] px-[10px] flex items-center justify-center text-[8px] bg-[#6A00FF] text-white rounded-[2px] cursor-pointer hover:bg-[#5500CC] transition-colors" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setLogo1Src)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-[8px] text-black/40 truncate" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                    {logo1Src ? "File chosen" : "No file chosen"}
                                                </p>
                                            </div>

                                            {/* Wax Seal */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    WAX SEAL
                                                </p>
                                                <label className="h-[24px] px-[10px] flex items-center justify-center text-[8px] bg-[#6A00FF] text-white rounded-[2px] cursor-pointer hover:bg-[#5500CC] transition-colors" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setSealSrc)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-[8px] text-black/40 truncate" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                    {sealSrc ? "Navin Wax Seal.png" : "No file chosen"}
                                                </p>
                                            </div>

                                            {/* Logo 2 */}
                                            <div className="flex flex-col gap-[5px]">
                                                <p className="text-[8px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                                    LOGO 2
                                                </p>
                                                <label className="h-[24px] px-[10px] flex items-center justify-center text-[8px] bg-[#6A00FF] text-white rounded-[2px] cursor-pointer hover:bg-[#5500CC] transition-colors" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}>
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, setLogo2Src)}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-[8px] text-black/40 truncate" style={{ fontFamily: "'Geist Mono', monospace" }}>
                                                    {logo2Src ? "File chosen" : "No file chosen"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Share Your Letter */}
                                <div className="bg-white border border-[rgba(0,0,0,0.05)] flex flex-col gap-[20px] p-[15px] rounded-sm">
                                    <div className="flex items-center">
                                        <p className="text-[12px] leading-none text-black" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                            3. SHARE YOUR LETTER
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[8px] leading-none text-black/60 mb-[10px]" style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400 }}>
                                            URL GENERATOR
                                        </p>
                                        <div className="flex gap-[10px]">
                                            <input
                                                type="text"
                                                value={createPublishedURL({
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
                                                })}
                                                readOnly
                                                className="flex-1 h-[24px] px-[10px] text-[8px] border border-[rgba(0,0,0,0.1)] rounded-[2px] bg-gray-50"
                                                style={{ fontFamily: "'Geist Mono', monospace" }}
                                            />
                                            <button
                                                onClick={handleSaveAndShare}
                                                className="h-[24px] px-[10px] flex items-center justify-center text-[8px] bg-[#6A00FF] text-white rounded-[2px] cursor-pointer hover:bg-[#5500CC] transition-colors"
                                                style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 500 }}
                                            >
                                                COPY URL
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Preview */}
                            <div className="flex flex-col gap-4 sticky top-12">
                                <div className="relative min-h-[500px] flex items-center justify-center bg-white rounded-lg border border-gray-200 p-8">
                                    <Envelope
                                        key={key}
                                        onOpen={handleOpenEnvelope}
                                        onClose={() => setIsEnvelopeOpen(false)}
                                        isOpen={isEnvelopeOpen}
                                        to={to}
                                        from={from}
                                        stampSrc={stampSrc}
                                        logo1Src={logo1Src}
                                        logo2Src={logo2Src}
                                        postmarkSrc={postmarkSrc}
                                        postmarkText={postmarkText}
                                        toFont={toFont}
                                        toSize={toSize}
                                        fromFont={fromFont}
                                        fromSize={fromSize}
                                        paperColor={envelopeColor}
                                        insideEnvelopeColor={insideEnvelopeColor}
                                        letterColor={letterColor}
                                        sealSrc={sealSrc}
                                    >
                                        <AnimatedText
                                            key={String(isEnvelopeOpen)}
                                            text={text}
                                            animationType={animationType}
                                            font={letterFont}
                                            fontSize={letterSize}
                                            delay={1.5}
                                            animationSpeed={animationSpeed}
                                        />
                                    </Envelope>
                                </div>

                                {isEnvelopeOpen && (
                                    <button
                                        onClick={handleReset}
                                        className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset Envelope
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
