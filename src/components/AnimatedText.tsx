import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export type AnimationType = 'fade-in' | 'word-by-word' | 'character-by-character' | 'typewriter';

interface AnimatedTextProps {
  text: string;
  animationType: AnimationType;
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  font?: string;
  fontSize?: number;
}

export function AnimatedText({ text, animationType, formatting, font = "font-sans", fontSize = 16 }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset animation when text or animation type changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, animationType]);

  useEffect(() => {
    if (animationType === 'typewriter') {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, text, animationType]);

  const textStyle = {
    fontWeight: formatting.bold ? 'bold' : 'normal',
    fontStyle: formatting.italic ? 'italic' : 'normal',
    textDecoration: formatting.underline ? 'underline' : 'none',
    fontSize: fontSize
  };
  
  const containerClass = clsx("whitespace-pre-wrap", font);

  if (animationType === 'fade-in') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className={containerClass}
        style={textStyle}
      >
        {text}
      </motion.div>
    );
  }

  if (animationType === 'word-by-word') {
    const words = text.split(' ');
    return (
      <div className={containerClass} style={textStyle}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {word}{index < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </div>
    );
  }

  if (animationType === 'character-by-character') {
    const characters = text.split('');
    return (
      <div className={containerClass} style={textStyle}>
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: index * 0.03 }}
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
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block"
        >
          |
        </motion.span>
      </div>
    );
  }

  return <div className={containerClass} style={textStyle}>{text}</div>;
}
