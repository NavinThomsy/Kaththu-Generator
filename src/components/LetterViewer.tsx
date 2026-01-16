import React, { useState } from 'react';
import { Envelope } from './Envelope';
import { AnimatedText, AnimationType } from './AnimatedText';

interface LetterViewerProps {
  text: string;
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
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
}

export function LetterViewer({
  text,
  formatting,
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
  postmarkText
}: LetterViewerProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">

        <div className="relative min-h-[500px] flex items-center justify-center">
          {/* Backdrop for clicking outside to close */}
          {isEnvelopeOpen && (
            <div
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setIsEnvelopeOpen(false)}
            />
          )}

          <div className="relative z-50 w-full flex justify-center">
            <Envelope
              onOpen={() => setIsEnvelopeOpen(true)}
              onClose={() => setIsEnvelopeOpen(false)}
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
            >
              <div className="h-full overflow-auto">
                <AnimatedText
                  key={String(isEnvelopeOpen)}
                  text={text}
                  animationType={animationType}
                  formatting={formatting}
                  font={font}
                  fontSize={fontSize}
                  delay={1.5}
                  animationSpeed={animationSpeed}
                />
              </div>
            </Envelope>
          </div>
        </div>
      </div>
    </div>
  );
}
