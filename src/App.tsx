import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Envelope } from "./components/Envelope";
import { AnimatedText, AnimationType } from "./components/AnimatedText";
import { LetterViewer } from "./components/LetterViewer";
import { Sidebar, SavedLetter } from "./components/Sidebar";
import { LetterEditor } from "./components/LetterEditor";
import { RotateCcw, Menu } from "lucide-react";
import { createPublishedURL, isViewerMode } from "./utils/urlHelpers";
import { isHostedUrl } from "./utils/imgbbService";
import { useLetterState } from "./hooks/useLetterState";

const DEFINITIONS = [
    { word: "kathukal", phonetics: "[ka-thu-kal]" },
    { word: "കത്തുകൾ", phonetics: "[ka-thu-kal]" },
    { word: "letters", phonetics: "[let-ers]" }
];

function CyclingTitle() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % DEFINITIONS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const current = DEFINITIONS[index];

    return (
        <div className="mb-8 max-w-sm mx-auto text-left">
            <div className="h-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.word}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-mono font-bold text-gray-900 mb-2 lowercase">
                            {current.word}
                        </h1>
                        <div className="text-sm font-mono text-gray-500 mb-1">
                            {current.phonetics}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm font-mono text-gray-500 italic mb-6"
            >
                noun.
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pl-4 mb-2"
                style={{ borderLeft: '3px solid #6200ea' }}
            >
                <p className="text-sm font-mono text-gray-700 leading-relaxed mb-4">
                    Written messages used to communicate thoughts, information, or emotions, traditionally sent on paper from one person to another.
                </p>
                <div className="text-xs font-mono text-gray-400">
                    see also: letters, notes, correspondence, mail
                </div>
            </motion.div>
        </div>
    );
}

export default function App() {
    // Use custom hook for letter state
    const letter = useLetterState();

    // UI State (not related to letter content)
    const [viewMode, setViewMode] = useState(() => isViewerMode());
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [key, setKey] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Refs
    const envelopeRef = useRef<HTMLDivElement>(null);
    const rightColumnRef = useRef<HTMLDivElement>(null);

    // --- Local History State ---
    const [sentLetters, setSentLetters] = useState<SavedLetter[]>(() => {
        try {
            const saved = localStorage.getItem("sent_letters");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Click outside to close envelope
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                isEnvelopeOpen &&
                rightColumnRef.current &&
                rightColumnRef.current.contains(target) &&
                envelopeRef.current &&
                !envelopeRef.current.contains(target)
            ) {
                setIsEnvelopeOpen(false);
                setKey(Date.now());
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEnvelopeOpen]);

    // Handle URL changes
    useEffect(() => {
        const handleHashChange = () => {
            const isViewer = isViewerMode();
            setViewMode(isViewer);
            if (isViewer) {
                letter.updateFromURL();
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        window.addEventListener("popstate", handleHashChange);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            window.removeEventListener("popstate", handleHashChange);
        };
    }, [letter.updateFromURL]);

    // Generate URL params object - only include images if they are hosted URLs (not base64)
    const urlParams = useMemo(() => ({
        text: letter.text,
        animationType: letter.animationType,
        font: letter.letterFont,
        fontSize: letter.letterSize,
        toText: letter.to,
        fromText: letter.from,
        stampImage: letter.hideStamp ? undefined : (isHostedUrl(letter.stampSrc) ? letter.stampSrc : undefined),
        postmarkText: letter.postmarkText,
        postmarkSrc: isHostedUrl(letter.postmarkSrc) ? letter.postmarkSrc : undefined,
        logo1Src: letter.hideLogo1 ? undefined : (isHostedUrl(letter.logo1Src) ? letter.logo1Src : undefined),
        logo2Src: letter.hideLogo2 ? undefined : (isHostedUrl(letter.logo2Src) ? letter.logo2Src : undefined),
        toFont: letter.toFont,
        toSize: letter.toSize,
        fromFont: letter.fromFont,
        fromSize: letter.fromSize,
        envelopeColor: letter.envelopeColor,
        insideEnvelopeColor: letter.insideEnvelopeColor,
        letterColor: letter.letterColor,
        animationSpeed: letter.animationSpeed,
        sealSrc: letter.hideSeal ? undefined : (isHostedUrl(letter.sealSrc) ? letter.sealSrc : undefined),
        letterLogoSrc: letter.hideLetterLogo ? undefined : (isHostedUrl(letter.letterLogoSrc) ? letter.letterLogoSrc : undefined),
        hideLetterLogo: letter.hideLetterLogo,
    }), [letter]);

    const generatedUrl = useMemo(() => createPublishedURL(urlParams), [urlParams]);

    const animatedTextComponent = useMemo(() => (
        <AnimatedText
            key={`${isEnvelopeOpen}-${letter.animationType}`}
            text={letter.text}
            animationType={letter.animationType}
            font={letter.letterFont}
            fontSize={letter.letterSize}
            textColor={letter.textColor}
            delay={1.5}
            animationSpeed={letter.animationSpeed}
        />
    ), [isEnvelopeOpen, letter.text, letter.animationType, letter.letterFont, letter.letterSize, letter.animationSpeed, letter.textColor]);

    // --- Handlers ---
    const handleOpenEnvelope = () => setIsEnvelopeOpen(true);

    const handleDeleteLetter = (id: string) => {
        const newLetters = sentLetters.filter((l) => l.id !== id);
        setSentLetters(newLetters);
        localStorage.setItem("sent_letters", JSON.stringify(newLetters));
    };

    const handleOpenSavedLink = (url: string) => window.open(url, "_blank");

    const handleSaveAndShare = () => {
        const url = generatedUrl;

        const newLetter: SavedLetter = {
            id: Date.now().toString(),
            recipient: letter.to,
            excerpt: letter.text.slice(0, 50) + (letter.text.length > 50 ? "..." : ""),
            createdAt: new Date().toISOString(),
            url: url,
        };

        const updatedLetters = [newLetter, ...sentLetters];
        setSentLetters(updatedLetters);
        localStorage.setItem("sent_letters", JSON.stringify(updatedLetters));

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
                    text={letter.text}
                    animationType={letter.animationType}
                    font={letter.letterFont}
                    fontSize={letter.letterSize}
                    toText={letter.to}
                    fromText={letter.from}
                    stampImage={letter.stampSrc}
                    logo1Src={letter.logo1Src}
                    logo2Src={letter.logo2Src}
                    postmarkSrc={letter.postmarkSrc}
                    toFont={letter.toFont}
                    toSize={letter.toSize}
                    fromFont={letter.fromFont}
                    fromSize={letter.fromSize}
                    envelopeColor={letter.envelopeColor}
                    insideEnvelopeColor={letter.insideEnvelopeColor}
                    letterColor={letter.letterColor}
                    animationSpeed={letter.animationSpeed}
                    sealSrc={letter.sealSrc}
                    postmarkText={letter.postmarkText}
                    letterLogoSrc={letter.letterLogoSrc}
                    hideLetterLogo={letter.hideLetterLogo}
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
        <div className="flex lg:h-screen min-h-screen bg-gray-100 lg:overflow-hidden font-sans">
            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? "sidebar-container" : "w-0"} transition-all duration-300 overflow-hidden relative border-r border-gray-200 bg-white`}
            >
                <Sidebar
                    letters={sentLetters}
                    onDelete={handleDeleteLetter}
                    onOpen={handleOpenSavedLink}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:h-full h-auto lg:overflow-hidden relative">
                {/* Toggle Sidebar Button */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="menu-toggle absolute top-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}

                <div className="flex-1 lg:overflow-hidden lg:h-full h-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-full h-auto gap-0">
                        {/* Left Column: Editor Controls */}
                        <div className="lg:h-full lg:overflow-y-auto h-auto p-4 md:p-8 border-r border-gray-200 no-scrollbar">
                            <div className="max-w-2xl mx-auto responsive-header-padding pb-20">
                                <CyclingTitle />
                                <LetterEditor
                                    letterText={letter.text}
                                    onLetterTextChange={letter.setText}
                                    letterFont={letter.letterFont}
                                    onLetterFontChange={letter.setLetterFont}
                                    letterSize={letter.letterSize}
                                    onLetterSizeChange={letter.setLetterSize}
                                    textColor={letter.textColor}
                                    onTextColorChange={letter.setTextColor}
                                    animationType={letter.animationType}
                                    onAnimationTypeChange={(val) => letter.setAnimationType(val as AnimationType)}
                                    animationSpeed={letter.animationSpeed}
                                    onAnimationSpeedChange={letter.setAnimationSpeed}
                                    toText={letter.to}
                                    onToTextChange={letter.setTo}
                                    toFont={letter.toFont}
                                    onToFontChange={letter.setToFont}
                                    toSize={letter.toSize}
                                    onToSizeChange={letter.setToSize}
                                    fromText={letter.from}
                                    onFromTextChange={letter.setFrom}
                                    fromFont={letter.fromFont}
                                    onFromFontChange={letter.setFromFont}
                                    fromSize={letter.fromSize}
                                    onFromSizeChange={letter.setFromSize}
                                    envelopeColor={letter.envelopeColor}
                                    onEnvelopeColorChange={letter.setEnvelopeColor}
                                    paperColor={letter.letterColor}
                                    onPaperColorChange={letter.setLetterColor}
                                    insideColor={letter.insideEnvelopeColor}
                                    onInsideColorChange={letter.setInsideEnvelopeColor}
                                    postmarkLocation={letter.postmarkText}
                                    onPostmarkLocationChange={letter.setPostmarkText}
                                    stampSrc={letter.stampSrc}
                                    onStampSrcChange={letter.setStampSrc}
                                    sealSrc={letter.sealSrc}
                                    onSealSrcChange={letter.setSealSrc}
                                    logo1Src={letter.logo1Src}
                                    onLogo1SrcChange={letter.setLogo1Src}
                                    logo2Src={letter.logo2Src}
                                    onLogo2SrcChange={letter.setLogo2Src}
                                    stampFilename={letter.stampFilename}
                                    onStampFilenameChange={letter.setStampFilename}
                                    sealFilename={letter.sealFilename}
                                    onSealFilenameChange={letter.setSealFilename}
                                    logo1Filename={letter.logo1Filename}
                                    onLogo1FilenameChange={letter.setLogo1Filename}
                                    logo2Filename={letter.logo2Filename}
                                    onLogo2FilenameChange={letter.setLogo2Filename}
                                    hideStamp={letter.hideStamp}
                                    onHideStampChange={letter.setHideStamp}
                                    hideSeal={letter.hideSeal}
                                    onHideSealChange={letter.setHideSeal}
                                    hideLogo1={letter.hideLogo1}
                                    onHideLogo1Change={letter.setHideLogo1}
                                    hideLogo2={letter.hideLogo2}
                                    onHideLogo2Change={letter.setHideLogo2}
                                    letterLogoSrc={letter.letterLogoSrc}
                                    onLetterLogoSrcChange={letter.setLetterLogoSrc}
                                    letterLogoFilename={letter.letterLogoFilename}
                                    onLetterLogoFilenameChange={letter.setLetterLogoFilename}
                                    hideLetterLogo={letter.hideLetterLogo}
                                    onHideLetterLogoChange={letter.setHideLetterLogo}
                                    generatedUrl={generatedUrl}
                                    onCopyUrl={() => navigator.clipboard.writeText(generatedUrl)}
                                    onSaveAndShare={handleSaveAndShare}
                                />
                            </div>
                        </div>

                        {/* Right Column: Preview */}
                        <div ref={rightColumnRef} className="lg:h-full lg:overflow-y-auto min-h-screen lg:min-h-0 p-4 md:p-8 bg-gray-50/50">
                            <div className="max-w-2xl mx-auto pt-0 lg:pt-12 space-y-4">
                                <div
                                    ref={envelopeRef}
                                    className="relative min-h-[500px] flex items-center justify-center"
                                >
                                    <Envelope
                                        key={key}
                                        onOpen={handleOpenEnvelope}
                                        onClose={() => setIsEnvelopeOpen(false)}
                                        isOpen={isEnvelopeOpen}
                                        to={letter.to}
                                        from={letter.from}
                                        stampSrc={letter.hideStamp ? undefined : letter.stampSrc}
                                        logo1Src={letter.hideLogo1 ? undefined : letter.logo1Src}
                                        logo2Src={letter.hideLogo2 ? undefined : letter.logo2Src}
                                        sealSrc={letter.hideSeal ? undefined : letter.sealSrc}
                                        postmarkSrc={letter.postmarkSrc}
                                        postmarkText={letter.postmarkText}
                                        toFont={letter.toFont}
                                        toSize={letter.toSize}
                                        fromFont={letter.fromFont}
                                        fromSize={letter.fromSize}
                                        paperColor={letter.envelopeColor}
                                        insideEnvelopeColor={letter.insideEnvelopeColor}
                                        letterColor={letter.letterColor}
                                        letterLogoSrc={letter.letterLogoSrc}
                                        hideLetterLogo={letter.hideLetterLogo}
                                        letterFont={letter.letterFont}
                                    >
                                        {animatedTextComponent}
                                    </Envelope>
                                </div>
                            </div>
                        </div>
                    </div>

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