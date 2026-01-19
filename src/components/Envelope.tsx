import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { PaperTexture } from '@paper-design/shaders-react';
// @ts-ignore
import navinLogo from '../assets/Navin Logo.png';

export interface EnvelopeProps {
  onOpen: () => void;
  onClose?: () => void;
  isOpen: boolean;
  children: React.ReactNode;
  to?: string;
  from?: string;
  stampSrc?: string;
  logo1Src?: string;
  logo2Src?: string;
  postmarkSrc?: string;
  toFont?: string;
  toSize?: number;
  fromFont?: string;
  fromSize?: number;
  paperColor?: string;
  insideEnvelopeColor?: string;
  letterColor?: string;
  sealSrc?: string;
  postmarkText?: string;
}

// Wax Seal SVG
function WaxSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <radialGradient id="sealGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#c41e3a" />
          <stop offset="50%" stopColor="#8b0000" />
          <stop offset="100%" stopColor="#4a0000" />
        </radialGradient>
      </defs>
      <path
        d="M50 5 Q65 8 75 15 Q88 22 90 35 Q95 50 88 65 Q82 78 70 85 Q55 95 40 90 Q25 88 15 75 Q5 60 10 45 Q12 30 25 18 Q38 8 50 5Z"
        fill="url(#sealGrad)"
        style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))' }}
      />
      <circle cx="50" cy="50" r="22" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.6" />
      <text x="50" y="57" textAnchor="middle" fontSize="22" fontFamily="serif" fill="#ffd700" opacity="0.9">N</text>
    </svg>
  );
}

export function Envelope({
  onOpen,
  onClose,
  isOpen,
  children,
  to = "The Google Design Team",
  from = "Navin Thomsy",
  stampSrc,
  logo1Src,
  logo2Src,
  toFont = "font-serif",
  toSize = 14,
  fromFont = "font-serif",
  fromSize = 14,
  paperColor = "#ebe1cf",
  insideEnvelopeColor = "#ebe1cf",
  letterColor = "#ffffff",
  sealSrc,
  postmarkSrc,
  postmarkText = "LONDON"
}: EnvelopeProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Allow scrolling from outside the container when open
  useEffect(() => {
    if (!isOpen) return;

    let destination = scrollRef.current?.scrollTop || 0;
    let isAnimating = false;
    let rafId: number;

    const smoothScroll = () => {
      if (!scrollRef.current) return;
      const current = scrollRef.current.scrollTop;
      const diff = destination - current;

      if (Math.abs(diff) < 1) {
        scrollRef.current.scrollTop = destination;
        isAnimating = false;
        return;
      }

      // Linear interpolation (lerp) for smoothness
      scrollRef.current.scrollTop = current + diff * 0.15;
      rafId = requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      // If the scroll target is NOT inside our scroll container (and not its child), manual scroll
      if (scrollRef.current && !scrollRef.current.contains(e.target as Node)) {
        // Prevent default only if we are handling it? actually native scroll is fine on body usually.
        // But we want to 'capture' it.

        // Sync destination if not animating (e.g. after a native scroll interaction)
        if (!isAnimating && scrollRef.current) {
          destination = scrollRef.current.scrollTop;
        }

        destination += e.deltaY;

        // Clamp destination
        if (scrollRef.current) {
          const maxScroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
          destination = Math.max(0, Math.min(destination, maxScroll));
        }

        if (!isAnimating) {
          isAnimating = true;
          rafId = requestAnimationFrame(smoothScroll);
        }
      }
    };

    // Listen for native scroll to keep destination in sync
    const handleNativeScroll = () => {
      if (!isAnimating && scrollRef.current) {
        destination = scrollRef.current.scrollTop;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    const box = scrollRef.current;
    if (box) box.addEventListener('scroll', handleNativeScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (box) box.removeEventListener('scroll', handleNativeScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isOpen]);

  // Derive colors - memoize if possible, but simple enough for now
  const mainColor = paperColor;
  const darkerColor = insideEnvelopeColor;

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(true);
    } else {
      const timer = setTimeout(() => {
        setIsFlipped(false);
      }, 800); // Wait for flap to fully close (0.8s) before flipping
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full p-4 perspective-1000">

      {/* 3D Envelope Container - moves down when letter rises */}
      <motion.div
        className="relative w-full aspect-[1.5] group cursor-pointer select-none"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        animate={{
          rotateY: isFlipped ? 0 : 180,
          y: isOpen ? 220 : 0
        }}
        transition={{
          rotateY: { duration: 0.8, type: "spring", stiffness: 40, damping: 14 },
          y: { delay: 0.5, duration: 1.2, type: "spring", stiffness: 40, damping: 16 }
        }}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* Edge spines to hide gap during rotation - thickened to cover full 20px depth */}
        <div
          className="absolute left-0 top-0 bottom-0 rounded-l-sm"
          style={{
            width: '20px',
            transform: 'rotateY(-90deg)',
            transformOrigin: 'left center',
            backgroundColor: mainColor
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 rounded-r-sm"
          style={{
            width: '20px',
            transform: 'rotateY(90deg)',
            transformOrigin: 'right center',
            backgroundColor: mainColor
          }}
        />
        {/* Top Spine to cover the hinge gap - Solid "Roof" */}
        <div
          className="absolute top-0 left-0 right-0 rounded-t-sm"
          style={{
            height: '20px',
            transform: 'rotateX(90deg)',
            transformOrigin: 'top center',
            backgroundColor: mainColor
          }}
        />

        {/* ============================== BACK FACE (Flap/Pocket Side) ============================== */}
        <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>

          {/* 1. Inside Back of Envelope (z=0) - Base layer matches spines */}
          <div
            className="absolute inset-0 shadow-xl rounded-sm backface-hidden"
            style={{ transform: 'translateZ(0px)', backgroundColor: mainColor }}
          />

          {/* 1b. Inner colored layer - visible interior */}
          <div
            className="absolute inset-[2px] rounded-sm backface-hidden"
            style={{ transform: 'translateZ(0.5px)', backgroundColor: darkerColor }}
          />

          {/* 2. The Letter */}
          <motion.div
            className="absolute left-1/2 shadow-lg p-8 text-gray-800 font-serif origin-top backface-hidden overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              width: 'min(90%, 600px)',
              backgroundColor: letterColor,
              willChange: 'transform, opacity, height'
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: {
                x: "-50%",
                y: "5%",
                z: 2,
                height: "90%",
                scale: 0.95,
                top: "5%",
              },
              open: {
                x: "-50%",
                y: "-50%",
                z: 50,
                height: "65vh",
                scale: 1,
                top: "0%",
                transition: {
                  x: { duration: 0 },
                  y: { delay: 0.6, duration: 1.5, type: "spring", stiffness: 50, damping: 15 },
                  z: { delay: 1.0, duration: 0 },
                  scale: { delay: 0.6, duration: 0.8, type: "spring", stiffness: 80, damping: 12 },
                  height: { delay: 0.6, duration: 0.6 }
                }
              }
            }}
          >


            {/* Paper Texture Shader */}
            <div className="absolute inset-0 pointer-events-none z-0 rounded-sm overflow-hidden mix-blend-multiply opacity-100">
              <PaperTexture
                style={{ width: '100%', height: '100%' }}
                className="w-full h-full"
                // @ts-ignore
                colorBack="#ffffff"
                colorFront="#f1efe8e3"
                contrast={0.7}
                roughness={0.4}
                fiber={0.3}
                fiberSize={0.4}
                crumples={0.8}
                crumpleSize={0.8}
                folds={0.9}
                foldCount={3}
                drops={0.0}
                fade={0}
                seed={5.8}
                // @ts-ignore - PaperTexture types might be missing scale/fit in some versions, but user requested it
                options={{ scale: 0.6 }}
              />
            </div>

            {/* Custom Scrollbar Styles */}
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .custom-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <div ref={scrollRef} className="custom-scrollbar relative z-10 h-full overflow-y-auto pr-2">
              {/* User Logo (In Flow) - mb-6 for more gap, opacity-100 for visibility */}
              <div
                className="relative mt-4 ml-6 mb-6 w-10 h-10 mix-blend-multiply z-20"
                style={{ width: '40px', height: '40px' }}
              >
                <img src={navinLogo} alt="Logo" className="w-full h-full object-contain" />
              </div>

              <div className="pl-6 md:pl-8">
                {children}
              </div>
            </div>
          </motion.div>

          {/* 3. Envelope Pocket (Front Flaps) - (z=20) */}
          <div
            className={clsx(
              "absolute inset-0 transition-colors backface-hidden",
              (!isOpen && isFlipped) ? "cursor-pointer pointer-events-auto" : "pointer-events-none"
            )}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (!isOpen && isFlipped) onOpen();
            }}
            style={{ transform: 'translateZ(20px)' }}
          >
            {/* Left Flap */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(2px 1px 3px rgba(0,0,0,0.12))' }}>
              <path d="M0,0 L0,100 L55,55 Z" fill={mainColor} />
            </svg>
            {/* Right Flap */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(-2px 1px 3px rgba(0,0,0,0.12))' }}>
              <path d="M100,0 L100,100 L45,55 Z" fill={mainColor} />
            </svg>
            {/* Bottom Flap */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.1))' }}>
              <path d="M0,100 L100,100 L50,45 Z" fill={mainColor} />
            </svg>
          </div>

          {/* 4. Top Flap (The "Lid") - Animates 180 degrees */}
          <motion.div
            className="absolute inset-0 w-full h-full origin-top pointer-events-none"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: {
                rotateX: 0,
                z: 22,
                transition: {
                  rotateX: { duration: 0.8, type: "spring", stiffness: 60, damping: 12 },
                  z: { duration: 0 } // Snap instantly to clearance height on close
                }
              },
              open: {
                rotateX: 180,
                z: 0,
                transition: {
                  rotateX: { duration: 0.8, type: "spring", stiffness: 60, damping: 12 },
                  z: { delay: 0.1, duration: 0.3 } // Wait slightly before dropping Z on open
                }
              }
            }}
          >
            {/* Front of Flap (Closed state) */}
            <div
              className="absolute inset-0 backface-hidden cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen && isFlipped) onOpen();
              }}
            >
              {/* Top Flap */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                <path d="M0,0 L100,0 L50,55 Z" fill={mainColor} />
              </svg>

              {/* Wax Seal - CENTERED at 50% */}
              <motion.div
                className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-auto cursor-pointer z-[100]"
                style={{ transform: 'translateZ(5px)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={{
                  closed: { opacity: 1, transition: { delay: 1.6, duration: 0.4 } },
                  open: { opacity: 0, transition: { duration: 0 } }
                }}
              >
                {sealSrc ? (
                  <img src={sealSrc} alt="Wax Seal" className="w-full h-full object-contain" style={{ filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))' }} />
                ) : (
                  <WaxSeal className="w-full h-full" />
                )}
              </motion.div>
            </div>

            {/* Back of Flap (Open state) - Geometrically inset path + Opacity toggle to prevent bleeding */}
            <motion.div
              className="absolute inset-0 backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
              variants={{
                closed: { opacity: 0, transition: { delay: 0.8, duration: 0 } },
                open: { opacity: 1, transition: { duration: 0 } }
              }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Inset coordinates: 0->0.5, 100->99.5, 55->54.5 (slightly smaller triangle) */}
                <path d="M0.5,0 L99.5,0 L50,54.5 Z" fill={darkerColor} />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* ============================== FRONT FACE (Address Side) ============================== */}
        <div
          className="absolute inset-0 backface-hidden shadow-xl rounded-sm overflow-hidden"
          style={{
            transform: 'rotateY(180deg) translateZ(20px)', // Match pocket depth (20px) to close the box gap
            backgroundColor: mainColor,
            willChange: 'transform'
          }}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-multiply pointer-events-none"></div>

          {/* Border Element */}
          <div className="absolute inset-4 border-2 opacity-30 pointer-events-none rounded-sm" style={{ borderColor: darkerColor }}></div>

          {/* Stamp (Top Right) */}
          <div className="absolute top-6 right-6 w-20 h-24 transform rotate-3 shadow-sm border border-gray-300 p-1 bg-white overflow-hidden">
            {stampSrc ? (
              <img src={stampSrc} alt="Stamp" className="w-full h-full object-cover" />
            ) : null}
          </div>

          {/* Postmark overlay */}
          {(postmarkText || postmarkSrc) && (
            <div className="absolute top-6 right-16 w-32 h-20 opacity-0 mix-blend-multiply pointer-events-none overflow-visible">
              {postmarkSrc ? (
                <img src={postmarkSrc} alt="Postmark" className="w-full h-full object-contain transform -rotate-12" />
              ) : (
                <svg viewBox="0 0 160 100" className="w-full h-full transform -rotate-6">
                  {/* Outer Ring */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2563eb" strokeWidth="3" />
                  {/* Inner Ring */}
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#2563eb" strokeWidth="2" />

                  {/* Text curved path */}
                  <path id="curve" d="M 18 50 A 32 32 0 1 1 82 50" fill="none" />
                  <text fontSize="12" fontFamily="serif" fontWeight="bold" fill="#2563eb" letterSpacing="1">
                    <textPath href="#curve" startOffset="50%" textAnchor="middle">
                      {postmarkText || "ROYAL MAIL"}
                    </textPath>
                  </text>

                  {/* Date/Location center text */}
                  <text x="50" y="55" textAnchor="middle" fontSize="14" fontFamily="serif" fill="#2563eb">
                    2026
                  </text>

                  {/* Wavy Cancellation Lines */}
                  <path d="M 95 30 Q 110 20 125 30 T 155 30" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <path d="M 95 45 Q 110 35 125 45 T 155 45" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <path d="M 95 60 Q 110 50 125 60 T 155 60" fill="none" stroke="#2563eb" strokeWidth="3" />
                  <path d="M 95 75 Q 110 65 125 75 T 155 75" fill="none" stroke="#2563eb" strokeWidth="3" />
                </svg>
              )}
            </div>
          )}

          {/* From Address (Top Left) */}
          <div className="absolute top-8 left-8 text-left opacity-90">
            <p className="font-serif text-[#8a7f6b] text-[10px] tracking-widest uppercase mb-1">From:</p>
            <p
              className={clsx("text-[#5c5343] font-medium leading-tight max-w-[150px] whitespace-pre-line", fromFont)}
              style={{ fontSize: fromSize }}
            >
              {from}
            </p>
          </div>

          {/* To Address (Center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="font-serif text-[#8a7f6b] text-[10px] tracking-widest uppercase mb-1">To:</p>
            <p
              className={clsx("text-[#5c5343] font-medium leading-tight max-w-[200px] whitespace-pre-line", toFont)}
              style={{ fontSize: toSize }}
            >
              {to}
            </p>
          </div>

          {/* Logos */}
          {/* Logo 1 (Top Right below Stamp) - Size increased to w-28 h-28, tilted -3deg */}
          <div className="absolute w-24 h-24 overflow-visible" style={{ top: '80px', right: '4rem', transform: 'rotate(-5deg)' }}>
            {logo1Src ? (
              <img src={logo1Src} alt="Logo 1" className="w-full h-full object-contain" />
            ) : null}
          </div>
          <div className="absolute bottom-6 right-6 w-14 h-14 overflow-hidden">
            {logo2Src ? (
              <img src={logo2Src} alt="Logo 2" className="w-full h-full object-contain" />
            ) : null}
          </div>
        </div>

      </motion.div>

    </div>
  );
}