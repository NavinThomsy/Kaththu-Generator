import { AnimationType } from '../components/AnimatedText';

export interface LetterData {
  text: string;
  animationType: AnimationType;
  font?: string;
  fontSize?: number;

  // Envelope Customization
  toText?: string;
  fromText?: string;
  stampImage?: string | null;
  postmarkText?: string | null;
  postmarkSrc?: string | null;
  sealSrc?: string | null;
  sealImage?: string | null;
  logo1Src?: string | null;
  logo2Src?: string | null;
  envelopeColor?: string;
  letterColor?: string;
  insideEnvelopeColor?: string;
  waxColor?: string;
  toFont?: string;
  toSize?: number;
  fromFont?: string;
  fromSize?: number;
  animationSpeed?: number;
}

export function encodeLetterData(data: LetterData): string {
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
}

export function decodeLetterData(encoded: string): LetterData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function createPublishedURL(data: LetterData): string {
  const encoded = encodeLetterData(data);
  const url = new URL(window.location.href);
  // Clear existing params and hash to ensure a clean URL
  url.hash = '';
  url.search = '';
  url.searchParams.set('letter', encoded);
  return url.toString();
}

export function getLetterFromURL(): LetterData | null {
  // Try hash first
  const hash = window.location.hash;
  const hashMatch = hash.match(/#letter=(.+)/);
  if (hashMatch) {
    return decodeLetterData(hashMatch[1]);
  }

  // Try search params (fallback)
  const searchParams = new URLSearchParams(window.location.search);
  const paramData = searchParams.get('letter');
  if (paramData) {
    return decodeLetterData(paramData);
  }

  return null;
}

export function isViewerMode(): boolean {
  if (window.location.hash.startsWith('#letter=')) return true;

  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.has('letter');
}
