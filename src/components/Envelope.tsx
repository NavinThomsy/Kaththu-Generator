import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { ImageWithFallback } from './figma/ImageWithFallback';
import navinSeal from "figma:asset/927ea48388e50db575bfbe0ba2acc80fe2fd5b36.png";

export interface EnvelopeProps {
  onOpen: () => void;
  onClose?: () => void; // Added onClose
  isOpen: boolean;
  children: React.ReactNode;
  to?: string;
  from?: string;
  stampSrc?: string;
  logo1Src?: string;
  logo2Src?: string;
  toFont?: string;
  toSize?: number;
  fromFont?: string;
  fromSize?: number;
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
  toSize = 24,
  fromFont = "font-serif",
  fromSize = 14
}: EnvelopeProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // If envelope opens, ensure we are flipped to the back side
  // When closing, wait for animation then flip back to front
  useEffect(() => {
    if (isOpen) {
      setIsFlipped(true);
    } else {
      // Small delay to let letter slide in before flipping
      const timer = setTimeout(() => {
        setIsFlipped(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full p-4 perspective-1000">


      {/* 3D Envelope Container - moves down when letter rises */}
      <motion.div
        className="relative w-full aspect-[1.5] group cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
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

        {/* ==============================
            BACK FACE (Flap/Pocket Side) 
            Rotated 0deg. 
            When container is 0, this is visible.
           ============================== */}
        <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>

          {/* 1. Inside Back of Envelope (z=0) */}
          <div className="absolute inset-0 bg-[#e0d6c2] shadow-xl rounded-sm backface-hidden" style={{ transform: 'translateZ(0px)' }}></div>

          {/* 2. The Letter Itself - nested inside for proper 3D rotation */}
          <motion.div
            className="absolute left-1/2 bg-white shadow-lg p-8 text-gray-800 font-serif origin-top backface-hidden overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
              width: 'min(90%, 600px)' // Wider constraint
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
                y: "-50%", // Rise to center 
                z: 50,
                height: "65vh", // Fixed height for internal scrolling
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
            <div className="relative z-10 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">{children}</div>
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
            <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L0,100 L55,55 Z" fill="#ebe1cf" stroke="#d4c5a9" strokeWidth="0.5" />
            </svg>
            <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M100,0 L100,100 L45,55 Z" fill="#ebe1cf" stroke="#d4c5a9" strokeWidth="0.5" />
            </svg>
            <svg className="absolute inset-0 w-full h-full drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 L100,100 L50,45 Z" fill="#ebe1cf" stroke="#d4c5a9" strokeWidth="0.5" />
            </svg>
          </div>

          {/* 4. Top Flap (The "Lid") - Animates 180 degrees */}
          <motion.div
            className="absolute inset-0 w-full h-full origin-top pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: { rotateX: 0, z: 30 },
              open: { rotateX: 180, z: 0 }
            }}
            transition={{
              rotateX: { duration: 0.8, type: "spring", stiffness: 60, damping: 12 },
              z: { delay: 0.2 }
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
              <svg className="w-full h-full filter drop-shadow-sm" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L50,55 Z" fill="#ebe1cf" stroke="#d4c5a9" strokeWidth="0.5" />
              </svg>

              {/* Wax Seal - CENTERED at 50% */}
              <motion.div
                className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 pointer-events-auto cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ opacity: isOpen ? 0 : 1 }}
              >
                <ImageWithFallback
                  src={navinSeal}
                  alt="Wax Seal"
                  className="w-full h-full object-cover rounded-full drop-shadow-xl border-4 border-[#e0d6c2]/30"
                />
              </motion.div>
            </div>

            {/* Back of Flap (Open state) */}
            <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L50,55 Z" fill="#e0d6c2" stroke="#d4c5a9" strokeWidth="0.5" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* ==============================
            FRONT FACE (Address Side) 
            Rotated 180deg so it faces BACK initially (relative to container). 
            When container is rotated 180 (initial state), this face is at 360 (0) -> Visible.
           ============================== */}
        <div
          className="absolute inset-0 backface-hidden shadow-xl rounded-sm overflow-hidden bg-[#ebe1cf]"
          style={{ transform: 'rotateY(180deg)' }}
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-multiply pointer-events-none"></div>

          {/* Border Element */}
          <div className="absolute inset-4 border-2 border-[#d4c5a9] opacity-50 pointer-events-none rounded-sm"></div>

          {/* Stamp (Top Right) */}
          <div className="absolute top-6 right-6 w-24 h-28 transform rotate-3 shadow-sm border border-gray-300 p-1 bg-white">
            <ImageWithFallback
              src={stampSrc || "https://images.unsplash.com/photo-1579270031023-b1d56906a246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"}
              alt="Stamp"
              className="w-full h-full object-cover grayscale-[0.2]"
            />
          </div>
          {/* Postmark overlay */}
          <div className="absolute top-6 right-16 w-20 h-20 opacity-40 mix-blend-multiply pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-12">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 2" />
              <text x="50" y="55" textAnchor="middle" fontSize="14" fontFamily="serif" fill="#333">LONDON</text>
            </svg>
          </div>

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-3/4">
            <p
              className={clsx("text-center text-gray-800 tracking-wide leading-relaxed", toFont)}
              style={{ fontSize: toSize }}
            >
              {to}
            </p>
          </div>

          {/* Logos (Bottom Corners) */}
          <div className="absolute bottom-6 left-6 w-14 h-14 opacity-80 mix-blend-multiply filter hover:brightness-90 transition-all">
            <ImageWithFallback
              src={logo1Src || "https://images.unsplash.com/photo-1628151016008-25f0a202e86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}
              alt="Logo 1"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute bottom-6 right-6 w-14 h-14 opacity-80 mix-blend-multiply filter hover:brightness-90 transition-all">
            <ImageWithFallback
              src={logo2Src || "https://images.unsplash.com/photo-1636955860106-9e1208a54d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"}
              alt="Logo 2"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

      </motion.div>

      {/* Helper text */}
      <motion.p
        className="mt-12 text-gray-400 font-medium tracking-widest uppercase text-xs transition-all duration-300"
      >
        {!isFlipped
          ? "Click envelope to turn over"
          : (!isOpen ? "Click seal to open" : "")}
      </motion.p>
    </div>
  );
}