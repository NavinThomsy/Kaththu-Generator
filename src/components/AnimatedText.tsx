import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export type AnimationType = 'fade-in' | 'word-by-word' | 'character-by-character' | 'typewriter';

interface AnimatedTextProps {
  text: string;
  animationType: AnimationType;
  font?: string;
  fontSize?: number;
  delay?: number; // Delay in seconds before animation starts
  animationSpeed?: number; // 1 (slowest) to 10 (fastest), default 5
}

export const AnimatedText = React.memo(({
  text,
  animationType,
  font = "font-sans",
  fontSize = 16,
  delay = 0,
  animationSpeed = 5
}: AnimatedTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDelayedStart, setIsDelayedStart] = useState(false);

  useEffect(() => {
    // Reset animation when text or animation type changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsDelayedStart(false);

    // Initial delay timeout
    const timer = setTimeout(() => {
      setIsDelayedStart(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [text, animationType, delay]);

  useEffect(() => {
    if (animationType === 'typewriter' && isDelayedStart) {
      if (currentIndex < text.length) {
        const interval = 50 / (animationSpeed / 5);
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, interval);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, text, animationType, isDelayedStart, animationSpeed]);

  const textStyle = {
    fontSize: fontSize
  };

  const containerClass = clsx("whitespace-pre-wrap prose prose-sm max-w-none", font);

  if (!isDelayedStart && animationType === 'typewriter') {
    return <div className={containerClass} style={textStyle}></div>;
  }

  if (animationType === 'fade-in') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 / (animationSpeed / 5), delay: delay }}
        className={containerClass}
        style={textStyle}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  if (animationType === 'word-by-word') {
    const words = React.useMemo(() => text.split(' '), [text]);
    // Use key to force re-render if delay changes, though usually it's static per session
    // Wait, motion transition delay is absolute. We just add `delay` to `index * 0.1`
    return (
      <div className={containerClass} style={textStyle}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 / (animationSpeed / 5), delay: delay + (index * 0.1 / (animationSpeed / 5)) }}
          >
            {word}{index < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </div>
    );
  }

  if (animationType === 'character-by-character') {
    const characters = React.useMemo(() => text.split(''), [text]);
    return (
      <div className={containerClass} style={textStyle}>
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 / (animationSpeed / 5), delay: delay + (index * 0.03 / (animationSpeed / 5)) }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    );
  }

  if (animationType === 'typewriter') {
    return (
      <div className={containerClass} style={textStyle}>
        {displayedText}
      </div>
    );
  }

  // For other animation types, render HTML directly without animation for now
  return <div className={containerClass} style={textStyle} dangerouslySetInnerHTML={{ __html: text }} />;
});

AnimatedText.displayName = 'AnimatedText';
