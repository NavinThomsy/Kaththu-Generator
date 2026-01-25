import React, { useState, useEffect } from 'react';
import { Envelope } from './Envelope';
import { AnimatedText, AnimationType } from './AnimatedText';

interface LetterViewerProps {
  text: string;
  animationType: AnimationType;
  font?: string;
  fontSize?: number;

  toText?: string;
  fromText?: string;
  stampImage?: string | null;
  logo1Src?: string | null;
  logo2Src?: string | null;
  toFont?: string;
  toSize?: number;
  fromFont?: string;
  fromSize?: number;
  envelopeColor?: string;
  insideEnvelopeColor?: string;
  letterColor?: string;
  animationSpeed?: number;
  sealSrc?: string;
  postmarkText?: string;
  postmarkSrc?: string | null;
  letterLogoSrc?: string;
  hideLetterLogo?: boolean;
}

export function LetterViewer({
  text,
  animationType,
  font = "font-sans",
  fontSize = 16,
  toText,
  fromText,
  stampImage,
  logo1Src,
  logo2Src,
  toFont,
  toSize,
  fromFont,
  fromSize,
  envelopeColor = "#9fadbc",
  insideEnvelopeColor = "#ebe1cf",
  letterColor = "#ffffff",
  animationSpeed = 5,
  sealSrc,
  postmarkText,
  postmarkSrc,
  letterLogoSrc,
  hideLetterLogo,
}: LetterViewerProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setIsEnvelopeOpen(false);
    setIsFlipped(false);
    // Force remount to skip closing animation
    setTimeout(() => setResetKey(prev => prev + 1), 100);
  };

  // Lock body scroll when envelope is open on mobile
  useEffect(() => {
    if (isEnvelopeOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isEnvelopeOpen]);

  // Determine instruction text based on state
  const getInstructionText = () => {
    if (!isFlipped) {
      return "tap or click to flip letter";
    } else if (!isEnvelopeOpen) {
      return "tap or click to open the seal";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">

        <div className="relative min-h-[500px] flex items-center justify-center">
          {/* Backdrop for clicking outside to close */}
          {isEnvelopeOpen && (
            <div
              className="fixed inset-0 z-40 cursor-default"
              onClick={handleReset}
            />
          )}

          <div className="relative z-50 w-full flex justify-center">
            <Envelope
              key={resetKey}
              onOpen={() => setIsEnvelopeOpen(true)}
              onClose={() => setIsEnvelopeOpen(false)}
              onFlip={() => setIsFlipped(true)}
              isOpen={isEnvelopeOpen}
              to={toText}
              from={fromText}
              stampSrc={stampImage || undefined}
              logo1Src={logo1Src || undefined}
              logo2Src={logo2Src || undefined}
              toFont={toFont}
              toSize={toSize}
              fromFont={fromFont}
              fromSize={fromSize}
              paperColor={envelopeColor}
              insideEnvelopeColor={insideEnvelopeColor}
              letterColor={letterColor}
              sealSrc={sealSrc}
              postmarkText={postmarkText}
              letterLogoSrc={letterLogoSrc}
              hideLetterLogo={hideLetterLogo}
            >
              <AnimatedText
                key={String(isEnvelopeOpen)}
                text={text}
                animationType={animationType}
                font={font}
                fontSize={fontSize}
                delay={1.5}
                animationSpeed={animationSpeed}
              />
            </Envelope>
          </div>
        </div>

        {/* Contextual Instructions */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 font-mono tracking-wide">
            {getInstructionText()}
          </p>
        </div>
      </div>
    </div>
  );
}

