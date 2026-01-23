import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export type AnimationType = 'fade-in' | 'word-by-word' | 'character-by-character' | 'typewriter';

interface AnimatedTextProps {
  text: string;
  animationType: AnimationType;
  font?: string;
  fontSize?: number;
  textColor?: string;
  delay?: number; // Delay in seconds before animation starts
  animationSpeed?: number; // 1 (slowest) to 10 (fastest), default 5
}

// Global counter for delays
class IndexCounter {
  value = 0;
}

export const AnimatedText = React.memo(({
  text,
  animationType,
  font = "font-sans",
  fontSize = 16,
  textColor = "#000000",
  delay = 0,
  animationSpeed = 5
}: AnimatedTextProps) => {

  const containerClass = clsx("prose prose-sm max-w-none", font);
  const textStyle = { fontSize, color: textColor };

  // --- Fade In (Simple) ---
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

  // --- Granular Animations (Complex) ---
  // Parse HTML string into DOM nodes
  const parsedNodes = useMemo(() => {
    if (typeof document === 'undefined') return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return Array.from(doc.body.childNodes);
  }, [text]);

  // Recursively render nodes
  // We use a mutable counter to track the global index of the animated chunk (word or char)
  const renderTree = (nodes: Node[], counter: IndexCounter): React.ReactNode => {
    return nodes.map((node, i) => {
      // 1. Text Node -> Split and Animate
      if (node.nodeType === Node.TEXT_NODE) {
        const content = node.textContent || "";

        // Define Splitting Logic
        let chunks: string[] = [];
        let delimiter = "";

        if (animationType === 'word-by-word') {
          // preserve spaces by splitting on spaces but including them? 
          // Simplest: split by space. 
          chunks = content.split(' ');
          delimiter = " ";
        } else {
          // character or typewriter
          chunks = content.split('');
          delimiter = "";
        }

        return (
          <React.Fragment key={i}>
            {chunks.map((chunk, j) => {
              const currentDelay = delay + (counter.value * (animationType === 'word-by-word' ? 0.1 : 0.03) / (animationSpeed / 5));
              counter.value++;

              // Typewriter: appear instantly (duration 0)
              // Others: fade/slide in
              const isTypewriter = animationType === 'typewriter';

              const transition = {
                duration: isTypewriter ? 0 : (animationType === 'word-by-word' ? 0.3 : 0.1) / (animationSpeed / 5),
                delay: currentDelay
              };

              const initial = isTypewriter ? { opacity: 0 } : { opacity: 0, y: animationType === 'word-by-word' ? 10 : 0 };
              const animate = isTypewriter ? { opacity: 1 } : { opacity: 1, y: 0 };

              return (
                <motion.span
                  key={j}
                  initial={initial}
                  animate={animate}
                  transition={transition}
                >
                  {chunk}{j < chunks.length - 1 ? delimiter : ''}
                </motion.span>
              );
            })}
          </React.Fragment>
        );
      }

      // 2. Element Node -> Preserve Style & Recurse
      else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Convert CSSStyleDeclaration to React Style object
        const styles: React.CSSProperties = {};
        for (let k = 0; k < el.style.length; k++) {
          const prop = el.style[k];
          // @ts-ignore
          styles[prop.replace(/-./g, x => x[1].toUpperCase())] = el.style.getPropertyValue(prop);
        }

        // Preserve Classes and Enforce List Styles
        let className = el.getAttribute('class') || "";

        if (tagName === 'ul') {
          className = clsx(className, "list-outside ml-6 my-2");
          styles.listStyleType = 'disc';
        } else if (tagName === 'ol') {
          className = clsx(className, "list-outside ml-6 my-2");
          styles.listStyleType = 'decimal';
        } else if (tagName === 'li') {
          className = clsx(className, "pl-1 mb-1");
          styles.display = 'list-item';

          // Animate the li element so the bullet/number appears with the content
          const liDelay = delay + (counter.value * (animationType === 'word-by-word' ? 0.1 : 0.03) / (animationSpeed / 5));
          const isTypewriter = animationType === 'typewriter';

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: isTypewriter ? 0 : 0.1 / (animationSpeed / 5),
                delay: liDelay
              }}
              style={styles}
              className={className}
            >
              {renderTree(Array.from(el.childNodes), counter)}
            </motion.li>
          );
        }

        return React.createElement(
          tagName,
          {
            key: i,
            style: styles,
            className: className, // Apply processed classes
            // Copy minimal attributes if needed, mostly style is important
            // href for links?
            href: el.getAttribute('href'),
            target: el.getAttribute('target')
          },
          renderTree(Array.from(el.childNodes), counter)
        );
      }

      return null;
    });
  };

  return (
    <div className={containerClass} style={textStyle}>
      {renderTree(parsedNodes, new IndexCounter())}
    </div>
  );
});

AnimatedText.displayName = 'AnimatedText';
