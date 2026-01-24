import { useState, useCallback } from 'react';
import { AnimationType } from '../components/AnimatedText';
import { getLetterFromURL } from '../utils/urlHelpers';

// Import default images
// @ts-ignore
import waxSealImage from '../assets/Navin Logo Wax Seal.png';
// @ts-ignore
import stampImage from '../assets/Stamp.png';
// @ts-ignore
import logo1Image from '../assets/Logo 1.png';
// @ts-ignore
import logo2Image from '../assets/Logo 2.png';

const DEFAULT_IMAGES = {
    STAMP: stampImage,
    SEAL: waxSealImage,
    LOGO1: logo1Image,
    LOGO2: logo2Image
};

const DEFAULT_FILENAMES = {
    STAMP: "Stamp.png",
    SEAL: "Wax Seal.png",
    LOGO1: "Logo 1.png",
    LOGO2: "Logo 2.png"
};

export interface LetterState {
    // Content
    text: string;
    animationType: AnimationType;
    animationSpeed: number;
    letterFont: string;
    letterSize: number;
    textColor: string;

    // Envelope - To/From
    to: string;
    from: string;
    toFont: string;
    toSize: number;
    fromFont: string;
    fromSize: number;

    // Colors
    envelopeColor: string;
    letterColor: string;
    insideEnvelopeColor: string;

    // Images
    stampSrc: string;
    sealSrc: string;
    logo1Src: string;
    logo2Src: string;
    postmarkSrc: string;
    postmarkText: string;
    letterLogoSrc: string | undefined;

    // Filenames
    stampFilename: string;
    sealFilename: string;
    logo1Filename: string;
    logo2Filename: string;
    letterLogoFilename: string;

    // Visibility
    hideStamp: boolean;
    hideSeal: boolean;
    hideLogo1: boolean;
    hideLogo2: boolean;
    hideLetterLogo: boolean;
}

export interface LetterStateSetters {
    setText: (val: string) => void;
    setAnimationType: (val: AnimationType) => void;
    setAnimationSpeed: (val: number) => void;
    setLetterFont: (val: string) => void;
    setLetterSize: (val: number) => void;
    setTextColor: (val: string) => void;
    setTo: (val: string) => void;
    setFrom: (val: string) => void;
    setToFont: (val: string) => void;
    setToSize: (val: number) => void;
    setFromFont: (val: string) => void;
    setFromSize: (val: number) => void;
    setEnvelopeColor: (val: string) => void;
    setLetterColor: (val: string) => void;
    setInsideEnvelopeColor: (val: string) => void;
    setStampSrc: (val: string) => void;
    setSealSrc: (val: string) => void;
    setLogo1Src: (val: string) => void;
    setLogo2Src: (val: string) => void;
    setPostmarkSrc: (val: string) => void;
    setPostmarkText: (val: string) => void;
    setLetterLogoSrc: (val: string | undefined) => void;
    setStampFilename: (val: string) => void;
    setSealFilename: (val: string) => void;
    setLogo1Filename: (val: string) => void;
    setLogo2Filename: (val: string) => void;
    setLetterLogoFilename: (val: string) => void;
    setHideStamp: (val: boolean) => void;
    setHideSeal: (val: boolean) => void;
    setHideLogo1: (val: boolean) => void;
    setHideLogo2: (val: boolean) => void;
    setHideLetterLogo: (val: boolean) => void;
    updateFromURL: () => void;
}

export function useLetterState(): LetterState & LetterStateSetters {
    // Get initial values from URL if present
    const getInitialData = () => getLetterFromURL();

    // Content
    const [text, setText] = useState(() => {
        const data = getInitialData();
        return data ? data.text : "Hello World \n\nBest,\nNavin Thomsy";
    });

    const [animationType, setAnimationType] = useState<AnimationType>(() => {
        const data = getInitialData();
        return data ? data.animationType : "fade-in";
    });

    const [animationSpeed, setAnimationSpeed] = useState(() => {
        const data = getInitialData();
        return data?.animationSpeed || 5;
    });

    const [letterFont, setLetterFont] = useState(() => {
        const data = getInitialData();
        return data?.font || "font-editor-sans";
    });

    const [letterSize, setLetterSize] = useState(() => {
        const data = getInitialData();
        return data?.fontSize || 12;
    });

    const [textColor, setTextColor] = useState("#000000");

    // Envelope - To/From
    const [to, setTo] = useState(() => {
        const data = getInitialData();
        return data?.toText || "Recipient Name";
    });

    const [from, setFrom] = useState(() => {
        const data = getInitialData();
        return data?.fromText || "Navin Thomsy\n";
    });

    const [toFont, setToFont] = useState(() => {
        const data = getInitialData();
        return data?.toFont || "font-serif";
    });

    const [toSize, setToSize] = useState(() => {
        const data = getInitialData();
        return data?.toSize || 14;
    });

    const [fromFont, setFromFont] = useState(() => {
        const data = getInitialData();
        return data?.fromFont || "font-serif";
    });

    const [fromSize, setFromSize] = useState(() => {
        const data = getInitialData();
        return data?.fromSize || 14;
    });

    // Colors
    const [envelopeColor, setEnvelopeColor] = useState(() => {
        const data = getInitialData();
        return data?.envelopeColor || "#eceada";
    });

    const [letterColor, setLetterColor] = useState(() => {
        const data = getInitialData();
        return data?.letterColor || "#ffffff";
    });

    const [insideEnvelopeColor, setInsideEnvelopeColor] = useState(() => {
        const data = getInitialData();
        return data?.insideEnvelopeColor || "#966d1d";
    });

    // Images
    const [stampSrc, setStampSrc] = useState(() => {
        const data = getInitialData();
        return data ? (data.stampImage || "") : DEFAULT_IMAGES.STAMP;
    });

    const [sealSrc, setSealSrc] = useState(() => {
        const data = getInitialData();
        return data ? (data.sealSrc || "") : DEFAULT_IMAGES.SEAL;
    });

    const [logo1Src, setLogo1Src] = useState(() => {
        const data = getInitialData();
        return data ? (data.logo1Src || "") : DEFAULT_IMAGES.LOGO1;
    });

    const [logo2Src, setLogo2Src] = useState(() => {
        const data = getInitialData();
        return data ? (data.logo2Src || "") : DEFAULT_IMAGES.LOGO2;
    });

    const [postmarkSrc, setPostmarkSrc] = useState(() => {
        const data = getInitialData();
        return data ? (data.postmarkSrc || "") : "";
    });

    const [postmarkText, setPostmarkText] = useState(() => {
        const data = getInitialData();
        return data?.postmarkText ?? "LONDON";
    });

    const [letterLogoSrc, setLetterLogoSrc] = useState<string | undefined>(() => {
        const data = getInitialData();
        return data?.letterLogoSrc || undefined;
    });

    // Filenames
    const [stampFilename, setStampFilename] = useState(DEFAULT_FILENAMES.STAMP);
    const [sealFilename, setSealFilename] = useState(DEFAULT_FILENAMES.SEAL);
    const [logo1Filename, setLogo1Filename] = useState(DEFAULT_FILENAMES.LOGO1);
    const [logo2Filename, setLogo2Filename] = useState(DEFAULT_FILENAMES.LOGO2);
    const [letterLogoFilename, setLetterLogoFilename] = useState("Letter Logo.png");

    // Visibility
    const [hideStamp, setHideStamp] = useState(false);
    const [hideSeal, setHideSeal] = useState(false);
    const [hideLogo1, setHideLogo1] = useState(false);
    const [hideLogo2, setHideLogo2] = useState(false);
    const [hideLetterLogo, setHideLetterLogo] = useState(() => {
        const data = getInitialData();
        return data ? (data.hideLetterLogo ?? false) : false;
    });

    // Update all state from URL (used when hash changes)
    const updateFromURL = useCallback(() => {
        const letterData = getLetterFromURL();
        if (letterData) {
            setText(letterData.text);
            setAnimationType(letterData.animationType);
            setLetterFont(letterData.font || "font-sans");
            setLetterSize(letterData.fontSize || 16);
            if (letterData.toText) setTo(letterData.toText);
            if (letterData.fromText) setFrom(letterData.fromText);
            if (letterData.stampImage) setStampSrc(letterData.stampImage);
            if (letterData.logo1Src) setLogo1Src(letterData.logo1Src);
            if (letterData.logo2Src) setLogo2Src(letterData.logo2Src);
            if (letterData.toFont) setToFont(letterData.toFont);
            if (letterData.toSize) setToSize(letterData.toSize);
            if (letterData.fromFont) setFromFont(letterData.fromFont);
            if (letterData.fromSize) setFromSize(letterData.fromSize);
            // Fix: Sync all missing fields
            if (letterData.letterLogoSrc !== undefined) setLetterLogoSrc(letterData.letterLogoSrc || undefined);
            if (letterData.hideLetterLogo !== undefined) setHideLetterLogo(letterData.hideLetterLogo);
            // Ensure seal and postmark are synced too if missing
            if (letterData.sealSrc) setSealSrc(letterData.sealSrc);
            if (letterData.postmarkText) setPostmarkText(letterData.postmarkText);
            if (letterData.postmarkSrc) setPostmarkSrc(letterData.postmarkSrc);
        }
    }, []);

    return {
        // State values
        text,
        animationType,
        animationSpeed,
        letterFont,
        letterSize,
        textColor,
        to,
        from,
        toFont,
        toSize,
        fromFont,
        fromSize,
        envelopeColor,
        letterColor,
        insideEnvelopeColor,
        stampSrc,
        sealSrc,
        logo1Src,
        logo2Src,
        postmarkSrc,
        postmarkText,
        letterLogoSrc,
        stampFilename,
        sealFilename,
        logo1Filename,
        logo2Filename,
        letterLogoFilename,
        hideStamp,
        hideSeal,
        hideLogo1,
        hideLogo2,
        hideLetterLogo,
        // Setters
        setText,
        setAnimationType,
        setAnimationSpeed,
        setLetterFont,
        setLetterSize,
        setTextColor,
        setTo,
        setFrom,
        setToFont,
        setToSize,
        setFromFont,
        setFromSize,
        setEnvelopeColor,
        setLetterColor,
        setInsideEnvelopeColor,
        setStampSrc,
        setSealSrc,
        setLogo1Src,
        setLogo2Src,
        setPostmarkSrc,
        setPostmarkText,
        setLetterLogoSrc,
        setStampFilename,
        setSealFilename,
        setLogo1Filename,
        setLogo2Filename,
        setLetterLogoFilename,
        setHideStamp,
        setHideSeal,
        setHideLogo1,
        setHideLogo2,
        setHideLetterLogo,
        updateFromURL,
    };
}
