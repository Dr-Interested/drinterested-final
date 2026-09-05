"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { X, Globe, RotateCcw, ZoomIn, MousePointer, MessageSquare, ImageOff, Type, Circle, Sun, Moon, Droplet, Minus, Link } from 'lucide-react';

const DEFAULT_SETTINGS = {
  textSize: 100,
  cursorSize: 100,
  hideImages: false,
  invertColors: false,
  darkMode: false,
  grayscale: false,
  contrast: false,
  readingGuide: false,
  highlightLinks: false
};
const POSITION_STORAGE_KEY = 'accessibilityPosition';

const loadSettings = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const saved = window.localStorage.getItem('accessibilitySettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const AccessibilityWidget = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isDarkMode = resolvedTheme ? resolvedTheme === 'dark' : settings.darkMode;
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const buttonSize = 44;
  const iconSize =
    settings.textSize >= 130 ? 72 : settings.textSize >= 115 ? 68 : 60;

  const getButtonSize = () => {
    const el = buttonRef.current;
    if (!el) {
      return { width: buttonSize, height: buttonSize };
    }
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width || buttonSize,
      height: rect.height || buttonSize
    };
  };

  const clampPosition = (x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };
    const { width, height } = getButtonSize();
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY)
    };
  };

  const getCornerPosition = () => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    const { width, height } = getButtonSize();
    const margin = 16;
    return clampPosition(
      window.innerWidth - width - margin,
      window.innerHeight - height - margin
    );
  };

  // Use useLayoutEffect to set isMounted BEFORE any rendering
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    setIsMounted(true);
    // Always start pinned to the bottom-right corner. (A previously dragged position used to be
    // restored from localStorage here, which is why it kept coming back mid-screen.) Dragging
    // still works within the session.
    setPosition(clampPosition(window.innerWidth - buttonSize - 16, window.innerHeight - buttonSize - 16));
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    setPosition((prev) => clampPosition(prev.x, prev.y));
  }, [isMounted, settings.textSize]);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || typeof document === 'undefined') return;

    window.localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

    const root = document.documentElement;

    root.style.fontSize = `${settings.textSize}%`;

    const cursorScale = settings.cursorSize / 100;
    const cursorSize = Math.round(24 * cursorScale);
    if (settings.cursorSize !== 100) {
      root.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 24 24"><path d="M3 3 L3 18 L8 13 L11 20 L13 19 L10 12 L16 12 Z" fill="white" stroke="black" stroke-width="1"/></svg>') 0 0, auto`;
    } else {
      root.style.cursor = '';
    }

    const filters = [];
    if (settings.invertColors) filters.push('invert(1)');
    if (settings.grayscale) filters.push('grayscale(100%)');
    if (settings.contrast) filters.push('contrast(115%)');

    root.style.filter = filters.join(' ');

    const applyImageVisibility = () => {
      const images = document.querySelectorAll('img, video, iframe');
      images.forEach((element) => {
        const el = element as HTMLElement;
        el.style.opacity = settings.hideImages ? '0' : '';
        el.style.pointerEvents = settings.hideImages ? 'none' : '';
      });
    };

    const applyMediaFilters = () => {
      const mediaElements = document.querySelectorAll('img, video, iframe');
      mediaElements.forEach((element) => {
        const el = element as HTMLElement;
        if (filters.length > 0) {
          const counterFilters = [];
          if (settings.invertColors) counterFilters.push('invert(1)');
          if (settings.grayscale) counterFilters.push('grayscale(0)');
          if (settings.contrast) counterFilters.push('contrast(87%)');
          el.style.filter = counterFilters.join(' ');
        } else {
          el.style.filter = '';
        }
      });
    };

    const updateLinks = () => {
      const allLinks = document.querySelectorAll('a');
      allLinks.forEach((element) => {
        const link = element as HTMLAnchorElement;
        if (
          link.closest('.accessibility-menu') ||
          link.closest('.accessibility-button')
        ) {
          return;
        }

        if (settings.highlightLinks) {
          link.style.setProperty('background-color', 'yellow', 'important');
          link.style.setProperty('color', 'black', 'important');
          link.style.setProperty('text-decoration', 'underline', 'important');
          link.style.setProperty('font-weight', 'bold', 'important');
        } else {
          link.style.removeProperty('background-color');
          link.style.removeProperty('color');
          link.style.removeProperty('text-decoration');
          link.style.removeProperty('font-weight');
        }
      });
    };

    applyImageVisibility();
    applyMediaFilters();
    updateLinks();

    const observer = new MutationObserver(() => {
      applyImageVisibility();
      applyMediaFilters();
      updateLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [settings, isMounted, pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (isSmallScreen) {
        setPosition(getCornerPosition());
      } else {
        setPosition((prev) => clampPosition(prev.x, prev.y));
      }
    };
    window.addEventListener('resize', handleResize);
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsSmallScreen(event.matches);
    };

    setIsSmallScreen(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      (mediaQuery as any).addListener(handleChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isSmallScreen && (settings.textSize !== 100 || settings.cursorSize !== 100)) {
      setSettings(prev => ({ ...prev, textSize: 100, cursorSize: 100 }));
    }
  }, [isMounted, isSmallScreen, settings.textSize, settings.cursorSize]);

  useEffect(() => {
    if (!isMounted) return;
    if (isSmallScreen) {
      setIsDragging(false);
      setPosition(getCornerPosition());
    }
  }, [isMounted, isSmallScreen]);

  useEffect(() => {
    if (!isMounted || !resolvedTheme) return;

    const shouldBeDark = resolvedTheme === 'dark';
    setSettings(prev => (prev.darkMode === shouldBeDark ? prev : { ...prev, darkMode: shouldBeDark }));
  }, [isMounted, resolvedTheme]);

  type BooleanSettings = 'hideImages' | 'invertColors' | 'darkMode' | 'grayscale' | 'contrast' | 'readingGuide' | 'highlightLinks';

  const toggleSetting = (key: BooleanSettings) => {
    if (key === 'darkMode') {
      const nextDarkMode = !isDarkMode;
      setTheme(nextDarkMode ? 'dark' : 'light');
      setSettings(prev => ({ ...prev, darkMode: nextDarkMode }));
      return;
    }

    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const adjustValue = (key: 'textSize' | 'cursorSize', value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('accessibilitySettings', JSON.stringify(DEFAULT_SETTINGS));
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSmallScreen) {
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest('.accessibility-button') && !target.closest('.accessibility-menu')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition(
        clampPosition(
          e.clientX - dragOffset.x,
          e.clientY - dragOffset.y
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          POSITION_STORAGE_KEY,
          JSON.stringify(clampPosition(position.x, position.y))
        );
      } catch {
        // ignore storage errors
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  const [guideY, setGuideY] = useState(0);

  useEffect(() => {
    const handleMouseMoveGuide = (e: MouseEvent) => {
      if (settings.readingGuide) {
        setGuideY(e.clientY);
      }
    };

    if (settings.readingGuide) {
      document.addEventListener('mousemove', handleMouseMoveGuide);
      return () => document.removeEventListener('mousemove', handleMouseMoveGuide);
    }
  }, [settings.readingGuide]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {settings.readingGuide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9998
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${guideY - 20}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }} />
          <div style={{
            position: 'absolute',
            top: `${guideY - 20}px`,
            left: 0,
            right: 0,
            height: '40px',
            backgroundColor: 'transparent',
            border: '2px solid #6366f1',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
          }} />
          <div style={{
            position: 'absolute',
            top: `${guideY + 20}px`,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }} />
        </div>
      )}

      <div
        ref={buttonRef}
        className="accessibility-button"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          cursor: isSmallScreen ? 'default' : isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Accessibility Options"
          className="bg-[#405862] hover:bg-[#334650] text-[#f1ece7] rounded-full w-11 h-11 flex items-center justify-center shadow-md transition-all overflow-hidden"
          style={{ backgroundColor: '#405862' }}
        >
          <svg
            viewBox="0 0 256 256"
            fill="#f1ece7"
            className="w-9 h-9 block transition-all"
          >
            <path d="M0 0 C17.00534889 13.16990335 29.30674858 29.65101732 35.875 50.2265625 C36.1946875 51.22042969 36.514375 52.21429688 36.84375 53.23828125 C43.46144161 78.14653717 38.56507814 104.40568339 26.03125 126.47265625 C12.14101114 148.36116789 -9.24920821 164.10267229 -34.61450195 169.78417969 C-60.1259204 174.8905594 -86.20396338 170.38097328 -107.875 155.9765625 C-129.4752662 140.14348727 -144.03436146 118.97955941 -148.71264648 92.19067383 C-152.23237493 66.88989049 -146.66458931 41.92475432 -131.55859375 21.31640625 C-99.88650297 -18.89647305 -42.81021493 -30.1300154 0 0 Z M-68 7.5390625 C-71.95420637 12.53997056 -73.72589662 16.55749608 -73.46875 22.921875 C-72.75860924 27.68304598 -70.9764248 31.5308257 -67.40625 34.80078125 C-61.94363753 38.83987394 -56.89258444 40.20118227 -50.125 39.2265625 C-45.01386726 37.06553971 -41.18397904 33.87621064 -38.125 29.2265625 C-36.36983222 23.96105916 -36.05284064 18.13052777 -37.99609375 12.8671875 C-41.48694459 6.77822801 -45.74254551 4.16613319 -52.5 2.2890625 C-58.57341572 2.18434844 -63.26276152 3.72867503 -68 7.5390625 Z M-113.125 47.2265625 C-114.55162219 50.07980687 -114.43533868 52.06110799 -114.125 55.2265625 C-111.58005816 59.48999599 -109.10334548 60.9571257 -104.33618164 62.24145508 C-103.21070923 62.51252075 -103.21070923 62.51252075 -102.0625 62.7890625 C-101.28189209 62.99104248 -100.50128418 63.19302246 -99.69702148 63.40112305 C-85.07125266 67.50368757 -85.07125266 67.50368757 -70.125 69.2265625 C-71.08224731 86.13643712 -73.3466613 100.69462126 -80.15625 116.25390625 C-80.56389084 117.18830788 -80.56389084 117.18830788 -80.97976685 118.1415863 C-82.35544977 121.2828625 -83.75497491 124.40966663 -85.19873047 127.52026367 C-85.97821045 129.25046753 -85.97821045 129.25046753 -86.7734375 131.015625 C-87.24958496 132.04381348 -87.72573242 133.07200195 -88.21630859 134.13134766 C-89.32062167 137.89289553 -88.9911148 140.42985599 -88.125 144.2265625 C-86.70833333 146.80989583 -86.70833333 146.80989583 -84.125 148.2265625 C-81.34755344 148.77977054 -78.87108218 148.95599058 -76.125 148.2265625 C-72.71212017 145.30753941 -71.04295507 142.40341947 -69.25 138.31640625 C-68.73953125 137.16076172 -68.2290625 136.00511719 -67.703125 134.81445312 C-67.18234375 133.60982422 -66.6615625 132.40519531 -66.125 131.1640625 C-65.60421875 129.98650391 -65.0834375 128.80894531 -64.546875 127.59570312 C-58.59660563 115.33979698 -58.59660563 115.33979698 -56.125 102.2265625 C-55.465 102.2265625 -54.805 102.2265625 -54.125 102.2265625 C-54.02606445 103.20794189 -53.92712891 104.18932129 -53.82519531 105.20043945 C-53.18601899 109.6341518 -51.63460199 113.52643609 -49.921875 117.64453125 C-49.60220764 118.42419754 -49.28254028 119.20386383 -48.95318604 120.00715637 C-48.27818201 121.645105 -47.59888752 123.28129144 -46.91552734 124.91577148 C-45.87639678 127.41070886 -44.86155216 129.91464155 -43.84765625 132.41992188 C-43.186353 134.01622944 -42.5236399 135.61195383 -41.859375 137.20703125 C-41.56021179 137.95188278 -41.26104858 138.69673431 -40.95281982 139.4641571 C-39.07508319 143.88058577 -37.3396715 146.61868275 -33.125 149.2265625 C-29.625 150.05989583 -29.625 150.05989583 -26.125 149.2265625 C-23.01079959 146.44366001 -21.27905458 144.66507872 -20.82714844 140.4453125 C-21.18017865 136.63027122 -22.28351795 133.85689047 -23.828125 130.3515625 C-24.10718689 129.70517822 -24.38624878 129.05879395 -24.67376709 128.39282227 C-25.56396407 126.33277425 -26.46791902 124.27922628 -27.375 122.2265625 C-33.48544477 108.36042485 -38.40861654 95.15263394 -39.375 79.8515625 C-39.49101562 78.30082031 -39.49101562 78.30082031 -39.609375 76.71875 C-39.79432117 74.22197664 -39.96613677 71.72510652 -40.125 69.2265625 C-39.38306396 69.1347168 -38.64112793 69.04287109 -37.87670898 68.94824219 C-29.85247011 67.9137965 -22.00198354 66.17338808 -14.125 64.3515625 C-13.02679932 64.10712402 -11.92859863 63.86268555 -10.79711914 63.61083984 C-3.22998472 61.86678726 -3.22998472 61.86678726 2.875 57.2265625 C4.30162219 54.37331813 4.18533868 52.39201701 3.875 49.2265625 C2.51426358 46.27537534 2.51426358 46.27537534 -0.125 44.2265625 C-7.34379343 42.50069005 -13.19287156 44.15156743 -20.25 46.0390625 C-22.49111552 46.60452615 -24.73330146 47.16576506 -26.9765625 47.72265625 C-28.04422852 47.98804199 -29.11189453 48.25342773 -30.21191406 48.52685547 C-52.51688232 53.88438472 -73.61930151 50.76930392 -95.40161133 44.8527832 C-102.52782365 42.95483266 -107.40995119 41.6748008 -113.125 47.2265625 Z" transform="translate(182.4,55.6)"/>
          </svg>
        </button>

        {isOpen && (
          <div
            className="accessibility-menu"
            style={{
              position: 'absolute',
              bottom: '70px',
              right: 0,
              width: 'min(24rem, calc(100vw - 24px))',
              maxHeight: 'min(600px, calc(100vh - 120px))',
              overflowY: 'auto',
              backgroundColor: isDarkMode ? '#1e293b' : 'white',
              color: isDarkMode ? '#f1ece7' : '#0b0b0b',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ backgroundColor: '#405862' }} className="text-[#f1ece7] p-4 flex items-center justify-between rounded-t-lg">
              <h2 className="text-lg font-semibold">Accessibility Options</h2>
              <div className="flex items-center gap-2">
                <button onClick={resetAll} className="p-1 hover:bg-[#334650] rounded" aria-label="Reset All">
                  <RotateCcw size={20} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[#334650] rounded" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <h3 className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Content</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => {
                    if (isSmallScreen) return;
                    if (settings.textSize === 100) adjustValue('textSize', 115);
                    else if (settings.textSize === 115) adjustValue('textSize', 130);
                    else adjustValue('textSize', 100);
                  }}
                  disabled={isSmallScreen}
                  aria-disabled={isSmallScreen}
                  title={isSmallScreen ? "Bigger Text is disabled on tablet and mobile." : undefined}
                  className={`p-4 rounded-lg border-2 transition-all w-full flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.textSize > 100 && !isSmallScreen
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  } ${isSmallScreen ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <ZoomIn className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium mb-2">Bigger Text</div>
                  <div className="flex gap-1 justify-center pointer-events-none">
                    <div className={`h-2 w-8 rounded-sm transition-all ${settings.textSize >= 115 ? 'bg-white' : 'bg-gray-300'}`} />
                    <div className={`h-2 w-8 rounded-sm transition-all ${settings.textSize === 130 ? 'bg-white' : 'bg-gray-300'}`} />
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (isSmallScreen) return;
                    if (settings.cursorSize === 100) adjustValue('cursorSize', 125);
                    else if (settings.cursorSize === 125) adjustValue('cursorSize', 150);
                    else adjustValue('cursorSize', 100);
                  }}
                  disabled={isSmallScreen}
                  aria-disabled={isSmallScreen}
                  title={isSmallScreen ? "Bigger Cursor is disabled on tablet and mobile." : undefined}
                  className={`p-4 rounded-lg border-2 transition-all w-full flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.cursorSize > 100 && !isSmallScreen
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  } ${isSmallScreen ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <MousePointer className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium mb-2">Bigger Cursor</div>
                  <div className="flex gap-1 justify-center pointer-events-none">
                    <div className={`h-2 w-8 rounded-sm transition-all ${settings.cursorSize >= 125 ? 'bg-white' : 'bg-gray-300'}`} />
                    <div className={`h-2 w-8 rounded-sm transition-all ${settings.cursorSize === 150 ? 'bg-white' : 'bg-gray-300'}`} />
                  </div>
                </button>
                <button
                  onClick={() => toggleSetting('hideImages')}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-3 col-span-2 min-h-[54px] leading-tight ${
                    settings.hideImages
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <ImageOff size={20} />
                  <div className="text-sm font-medium">Hide Images</div>
                </button>
              </div>

              <h3 className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Colors</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => toggleSetting('invertColors')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.invertColors
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12 A10 10 0 0 0 12 22 L12 2 A10 10 0 0 0 2 12" fill="currentColor"/>
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12 A3 3 0 0 0 12 15 L12 9 A3 3 0 0 0 9 12" fill="currentColor" stroke="none"/>
                  </svg>
                  <div className="text-sm font-medium">Invert Colors</div>
                </button>
                <button
                  onClick={() => toggleSetting('darkMode')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    isDarkMode
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <Moon className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Dark Mode</div>
                </button>
                <button
                  onClick={() => toggleSetting('grayscale')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.grayscale
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="12" r="6"/>
                    <circle cx="15" cy="12" r="6"/>
                  </svg>
                  <div className="text-sm font-medium">Grayscale</div>
                </button>
                <button
                  onClick={() => toggleSetting('contrast')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.contrast
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <Sun className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Contrast</div>
                </button>
              </div>

              <h3 className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Navigation</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleSetting('readingGuide')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.readingGuide
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <Minus className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Reading Guide</div>
                </button>
                <button
                  onClick={() => toggleSetting('highlightLinks')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[108px] leading-tight ${
                    settings.highlightLinks
                      ? 'bg-[#405862] text-[#f1ece7] border-[#405862]'
                      : isDarkMode
                      ? 'bg-[#2a373f] border-[#374853] text-[#f1ece7] hover:border-[#405862]'
                      : 'bg-[#fcfbf9] border-gray-200 text-[#405862] hover:border-[#405862]'
                  }`}
                >
                  <Link className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-medium">Highlight Links</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AccessibilityWidget;
