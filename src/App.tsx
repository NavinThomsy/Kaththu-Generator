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
      return data ? data.animationType : "fade-in";
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

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto pt-12">
            <h1 className="text-center mb-8 text-gray-800 text-3xl font-serif">
              Animated Letter App
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pb-20">
              {/* Left Column: Editor Controls */}
              <div className="space-y-6">
                {/* Compose Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="mb-4 text-gray-700 font-semibold flex items-center gap-2">
                    1. Compose Your Letter
                  </h2>
                  <TextEditor
                    value={text}
                    onChange={setText}
                  />

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        Font Family
                      </label>
                      <select
                        value={letterFont}
                        onChange={(e) =>
                          setLetterFont(e.target.value)
                        }
                        className="w-full px-2 py-1 text-xs border rounded bg-gray-50 focus:ring-1 focus:ring-gray-300 outline-none text-gray-700 h-8"
                      >
                        <option value="font-serif">
                          Serif
                        </option>
                        <option value="font-sans">Sans</option>
                        <option value="font-mono">Mono</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                        Font Size
                      </label>
                      <div className="flex items-center gap-2 bg-gray-50 px-2 rounded h-8 border">
                        <input
                          type="range"
                          min="12"
                          max="32"
                          value={letterSize}
                          onChange={(e) =>
                            setLetterSize(
                              Number(e.target.value),
                            )
                          }
                          className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-500 w-4 text-right">
                          {letterSize}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Envelope Design Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="mb-4 text-gray-700 font-semibold">
                    2. Customize Envelope
                  </h2>
                  <div className="space-y-6">
                    {/* To Field */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To (Recipient)
                      </label>
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all text-gray-800"
                      />
                      <div className="flex gap-2 items-center">
                        <select
                          value={toFont}
                          onChange={(e) =>
                            setToFont(e.target.value)
                          }
                          className="px-2 py-1 text-xs border rounded bg-gray-50 focus:ring-1 focus:ring-gray-300 outline-none text-gray-700 h-8"
                        >
                          <option value="font-serif">
                            Serif
                          </option>
                          <option value="font-sans">
                            Sans
                          </option>
                          <option value="font-mono">
                            Mono
                          </option>
                        </select>
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-2 rounded h-8 border">
                          <span className="text-[10px] text-gray-400">
                            Size
                          </span>
                          <input
                            type="range"
                            min="12"
                            max="48"
                            value={toSize}
                            onChange={(e) =>
                              setToSize(Number(e.target.value))
                            }
                            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-500 w-4 text-right">
                            {toSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* From Field */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From (Sender)
                      </label>
                      <textarea
                        value={from}
                        onChange={(e) =>
                          setFrom(e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none text-gray-800"
                      />
                      <div className="flex gap-2 items-center">
                        <select
                          value={fromFont}
                          onChange={(e) =>
                            setFromFont(e.target.value)
                          }
                          className="px-2 py-1 text-xs border rounded bg-gray-50 focus:ring-1 focus:ring-gray-300 outline-none text-gray-700 h-8"
                        >
                          <option value="font-serif">
                            Serif
                          </option>
                          <option value="font-sans">
                            Sans
                          </option>
                          <option value="font-mono">
                            Mono
                          </option>
                        </select>
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 px-2 rounded h-8 border">
                          <span className="text-[10px] text-gray-400">
                            Size
                          </span>
                          <input
                            type="range"
                            min="10"
                            max="24"
                            value={fromSize}
                            onChange={(e) =>
                              setFromSize(
                                Number(e.target.value),
                              )
                            }
                            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-500 w-4 text-right">
                            {fromSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full gap-2">
                      {/* Envelope Color */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate" title="Envelope Color">
                          Envelope
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={envelopeColor}
                            onChange={(e) => setEnvelopeColor(e.target.value)}
                            className="w-8 h-8 p-0 rounded cursor-pointer border-0 flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={envelopeColor}
                            onChange={(e) => setEnvelopeColor(e.target.value)}
                            className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-gray-200 text-gray-800 text-xs"
                          />
                        </div>
                      </div>

                      {/* Letter Color */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate" title="Letter Color">
                          Letter
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={letterColor}
                            onChange={(e) => setLetterColor(e.target.value)}
                            className="w-8 h-8 p-0 rounded cursor-pointer border-0 flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={letterColor}
                            onChange={(e) => setLetterColor(e.target.value)}
                            className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-gray-200 text-gray-800 text-xs"
                          />
                        </div>
                      </div>

                      {/* Inside Envelope Color */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate" title="Inside Color">
                          Inside
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="color"
                            value={insideEnvelopeColor}
                            onChange={(e) => setInsideEnvelopeColor(e.target.value)}
                            className="w-8 h-8 p-0 rounded cursor-pointer border-0 flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={insideEnvelopeColor}
                            onChange={(e) => setInsideEnvelopeColor(e.target.value)}
                            className="w-full min-w-0 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-gray-200 text-gray-800 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-1 gap-2">
                      <details className="group">
                        <summary className="text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer list-none flex items-center gap-1">
                          <span className="group-open:rotate-90 transition-transform">
                            ▸
                          </span>{" "}
                          Custom Images
                        </summary>
                        <div className="mt-3 grid grid-cols-1 gap-3 pl-4">
                          {/* Stamp */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-gray-400">Stamp Image</label>
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] text-gray-500 cursor-pointer select-none leading-none pt-[2px]">Show</label>
                                <input
                                  type="checkbox"
                                  checked={!!stampSrc}
                                  onChange={(e) => setStampSrc(e.target.checked ? DEFAULT_IMAGES.STAMP : "")}
                                  className="w-3 h-3 rounded text-gray-800 focus:ring-gray-300 border-gray-300"
                                />
                              </div>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!stampSrc}
                              onChange={(e) => handleImageUpload(e, setStampSrc)}
                              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Wax Seal */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-gray-400">Wax Seal Image</label>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, setSealSrc)}
                              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Postmark */}
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">
                              Postmark Text (Empty to hide)
                            </label>
                            <input
                              type="text"
                              value={postmarkText}
                              onChange={(e) => setPostmarkText(e.target.value)}
                              placeholder="e.g. LONDON"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 text-gray-800 text-sm mb-2"
                            />

                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-gray-400">Postmark Image (Optional)</label>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, setPostmarkSrc)}
                              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                            />
                          </div>



                          {/* Logo 1 */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-gray-400">Top Right Logo</label>
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] text-gray-500 cursor-pointer select-none leading-none pt-[2px]">Show</label>
                                <input
                                  type="checkbox"
                                  checked={!!logo1Src}
                                  onChange={(e) => setLogo1Src(e.target.checked ? DEFAULT_IMAGES.LOGO1 : "")}
                                  className="w-3 h-3 rounded text-gray-800 focus:ring-gray-300 border-gray-300"
                                />
                              </div>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!logo1Src}
                              onChange={(e) => handleImageUpload(e, setLogo1Src)}
                              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Logo 2 */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[10px] text-gray-400">Bottom Right Logo</label>
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] text-gray-500 cursor-pointer select-none leading-none pt-[2px]">Show</label>
                                <input
                                  type="checkbox"
                                  checked={!!logo2Src}
                                  onChange={(e) => setLogo2Src(e.target.checked ? DEFAULT_IMAGES.LOGO2 : "")}
                                  className="w-3 h-3 rounded text-gray-800 focus:ring-gray-300 border-gray-300"
                                />
                              </div>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={!logo2Src}
                              onChange={(e) => handleImageUpload(e, setLogo2Src)}
                              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>

                {/* Animation Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="mb-4 text-gray-700 font-semibold">
                    3. Select Animation
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setAnimationType("fade-in")
                      }
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${animationType === "fade-in"
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      Fade In
                    </button>
                    <button
                      onClick={() =>
                        setAnimationType("word-by-word")
                      }
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${animationType === "word-by-word"
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      Word by Word
                    </button>
                    <button
                      onClick={() =>
                        setAnimationType(
                          "character-by-character",
                        )
                      }
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${animationType ===
                        "character-by-character"
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      Character
                    </button>
                    <button
                      onClick={() =>
                        setAnimationType("typewriter")
                      }
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${animationType === "typewriter"
                        ? "border-gray-800 bg-gray-800 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      Typewriter
                    </button>
                  </div>
                </div>

                {/* Animation Speed */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="mb-4 text-gray-700 font-semibold flex items-center gap-2">
                    4. Animation Speed
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Slowest</span>
                      <span className="text-sm font-medium text-gray-800">{animationSpeed}</span>
                      <span className="text-sm text-gray-500">Fastest</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={animationSpeed}
                      onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
                    />
                  </div>
                </div>

                {isEnvelopeOpen && (
                  <button
                    onClick={handleReset}
                    className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset Envelope
                  </button>
                )}
              </div>

              {/* Right Column: Preview */}
              <div className="space-y-4 lg:sticky lg:top-8">
                <div className="text-center">
                  <h2 className="mb-2 text-gray-700 font-serif text-lg">
                    Preview
                  </h2>
                </div>

                <div className="relative min-h-[500px] flex items-center justify-center">
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

            {/* Save & Share Button */}
            <button
              onClick={handleSaveAndShare}
              className="fixed bottom-8 right-8 px-6 py-3 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-black transition-all flex items-center gap-2 z-50 hover:scale-105"
            >
              <Share2 className="w-5 h-5" />
              Save & Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}