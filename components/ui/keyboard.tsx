"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

/* ---------------- SOUND MAPS ---------------- */

const SOUND_DEFINES_DOWN: Record<string, [number, number]> = {
  Escape: [2894, 113], F1: [3610, 98], F2: [4210, 90], F3: [4758, 90], F4: [5250, 100],
  F5: [5831, 105], F6: [6396, 105], F7: [6900, 105], F8: [7443, 111], F9: [7955, 91],
  F10: [8504, 105], F11: [9046, 94], F12: [9582, 96], Backquote: [12476, 100],
  Digit1: [12946, 96], Digit2: [13470, 95], Digit3: [13963, 100], Digit4: [14481, 102],
  Digit5: [14994, 94], Digit6: [15505, 109], Digit7: [15990, 97], Digit8: [16529, 92],
  Digit9: [17012, 103], Digit0: [17550, 87], Minus: [18052, 93], Equal: [18553, 89],
  Backspace: [19065, 110], Tab: [21734, 119], KeyQ: [22245, 95], KeyW: [22790, 89],
  KeyE: [23317, 83], KeyR: [23817, 92], KeyT: [24297, 92], KeyY: [24811, 93],
  KeyU: [25313, 95], KeyI: [25795, 91], KeyO: [26309, 84], KeyP: [26804, 83],
  BracketLeft: [27330, 85], BracketRight: [27883, 99], Backslash: [28393, 100],
  CapsLock: [31011, 126], KeyA: [31542, 85], KeyS: [32031, 88], KeyD: [32492, 85],
  KeyF: [32973, 87], KeyG: [33453, 94], KeyH: [33986, 93], KeyJ: [34425, 88],
  KeyK: [34932, 90], KeyL: [35410, 95], Semicolon: [35914, 95], Quote: [36428, 87],
  Enter: [36902, 117], ShiftLeft: [38136, 133], KeyZ: [38694, 80], KeyX: [39148, 76],
  KeyC: [39632, 95], KeyV: [40136, 94], KeyB: [40621, 107], KeyN: [41103, 90],
  KeyM: [41610, 93], Comma: [42110, 92], Period: [42594, 90], Slash: [43105, 95],
  ShiftRight: [43565, 137], Fn: [44251, 110], ControlLeft: [45327, 83], AltLeft: [45750, 82],
  MetaLeft: [46199, 100], Space: [51541, 144], MetaRight: [47929, 75], AltRight: [49329, 82],
  ArrowUp: [44251, 110], ArrowLeft: [49837, 88], ArrowDown: [50333, 90], ArrowRight: [50783, 111],
};

const SOUND_DEFINES_UP: Record<string, [number, number]> = {
  Escape: [3014, 100], F1: [3710, 90], F2: [4305, 80], F3: [4853, 80], F4: [5355, 90],
  F5: [5941, 95], F6: [6506, 95], F7: [7010, 95], F8: [7558, 100], F9: [8050, 80],
  F10: [8614, 95], F11: [9146, 85], F12: [9682, 85], Backquote: [12581, 90],
  Digit1: [13046, 85], Digit2: [13570, 85], Digit3: [14068, 90], Digit4: [14591, 90],
  Digit5: [15094, 85], Digit6: [15620, 100], Digit7: [16090, 90], Digit8: [16624, 85],
  Digit9: [17122, 90], Digit0: [17640, 80], Minus: [18152, 85], Equal: [18643, 85],
  Backspace: [19180, 100], Tab: [21859, 110], KeyQ: [22345, 85], KeyW: [22880, 85],
  KeyE: [23402, 80], KeyR: [23912, 85], KeyT: [24392, 85], KeyY: [24911, 85],
  KeyU: [25413, 85], KeyI: [25890, 85], KeyO: [26394, 80], KeyP: [26889, 80],
  BracketLeft: [27415, 80], BracketRight: [27988, 90], Backslash: [28498, 90],
  CapsLock: [31146, 110], KeyA: [31632, 80], KeyS: [32121, 80], KeyD: [32577, 80],
  KeyF: [33063, 80], KeyG: [33553, 85], KeyH: [34081, 85], KeyJ: [34515, 85],
  KeyK: [35027, 85], KeyL: [35510, 85], Semicolon: [36014, 85], Quote: [36518, 80],
  Enter: [37027, 105], ShiftLeft: [38276, 120], KeyZ: [38779, 75], KeyX: [39228, 70],
  KeyC: [39732, 85], KeyV: [40236, 85], KeyB: [40736, 95], KeyN: [41198, 85],
  KeyM: [41710, 85], Comma: [42205, 85], Period: [42689, 85], Slash: [43205, 85],
  ShiftRight: [43710, 125], Fn: [44366, 100], ControlLeft: [45412, 80], AltLeft: [45835, 80],
  MetaLeft: [46304, 90], Space: [51691, 130], MetaRight: [48004, 70], AltRight: [49414, 80],
  ArrowUp: [44366, 100], ArrowLeft: [49927, 85], ArrowDown: [50428, 80], ArrowRight: [50898, 100],
};

SOUND_DEFINES_DOWN["ControlRight"] = SOUND_DEFINES_DOWN["ControlLeft"];
SOUND_DEFINES_DOWN["AltRight"] = SOUND_DEFINES_DOWN["AltLeft"];
SOUND_DEFINES_UP["ControlRight"] = SOUND_DEFINES_UP["ControlLeft"];
SOUND_DEFINES_UP["AltRight"] = SOUND_DEFINES_UP["AltLeft"];

/* ---------------- KEY LABELS (WINDOWS) ---------------- */

const KEY_DISPLAY_LABELS: Record<string, string> = {
  Escape: "Esc",
  Backspace: "Backspace",
  Tab: "Tab",
  Enter: "Enter",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Ctrl",
  ControlRight: "Ctrl",
  AltLeft: "Alt",
  AltRight: "Alt",
  MetaLeft: "Win",
  MetaRight: "Win",
  Space: "Space",
  CapsLock: "Caps",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

const getKeyDisplayLabel = (code: string) => {
  if (KEY_DISPLAY_LABELS[code]) return KEY_DISPLAY_LABELS[code];
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  return code;
};

/* ---------------- CONTEXT ---------------- */

const KeyboardContext = createContext<any>(null);

const useKeyboard = () => {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("Wrap inside provider");
  return ctx;
};

/* ---------------- PROVIDER ---------------- */

// ── CHANGE 1: Added onKeyPress to provider props ──────────────────────────────
const KeyboardProvider = ({
  children,
  enableSound = true,
  containerRef,
  onKeyPress,          // ← NEW PROP
}: {
  children:     React.ReactNode
  enableSound?: boolean
  containerRef?: React.RefObject<HTMLDivElement | null>
  onKeyPress?:  (code: string) => void  // ← NEW TYPE
}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const [soundLoaded, setSoundLoaded] = useState(false);

  // ── CHANGE 2: Store onKeyPress in a ref to avoid stale closures ───────────
  // This ensures we always call the latest version of onKeyPress
  const onKeyPressRef = useRef(onKeyPress)
  useEffect(() => { onKeyPressRef.current = onKeyPress }, [onKeyPress])

  useEffect(() => {
    if (!containerRef?.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    if (!enableSound) return;

    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const response = await fetch("/sounds/sound.ogg");
        if (!response.ok) {
          console.warn("Sound file not available at /sounds/sound.ogg");
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        setSoundLoaded(true);
      } catch (error) {
        console.warn("Failed to load mechanical keyboard sound:", error);
      }
    };

    initAudio();

    return () => {
      audioContextRef.current?.close();
    };
  }, [enableSound]);

  const playSound = (keyCode: string, type: "down" | "up") => {
    if (!enableSound || !soundLoaded || !audioContextRef.current || !audioBufferRef.current) return;

    const soundDef = type === "down" ? SOUND_DEFINES_DOWN[keyCode] : SOUND_DEFINES_UP[keyCode];
    
    let startTime = 0;
    let duration = audioBufferRef.current.duration;

    if (soundDef) {
      const [startMs, durationMs] = soundDef;
      const proposedStart = startMs / 1000;
      const proposedDuration = durationMs / 1000;

      if (proposedStart < audioBufferRef.current.duration) {
        startTime = proposedStart;
        duration = Math.min(proposedDuration, audioBufferRef.current.duration - proposedStart);
      }
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 14000; 

    source.connect(filter);
    filter.connect(audioContextRef.current.destination);
    
    source.start(0, startTime, duration);
  };

  // ── CHANGE 3: Call onKeyPressRef.current after playing sound ─────────────
  const setPressed = (code: string) => {
    if (pressedKeys.has(code)) return;
    setPressedKeys((prev) => new Set(prev).add(code));
    setLastPressedKey(code);
    playSound(code, "down");
    onKeyPressRef.current?.(code);  // ← NEW: notify parent of key press
  };

  const setReleased = (code: string) => {
    if (!pressedKeys.has(code)) return;
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
    playSound(code, "up");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      const scrollKeys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (scrollKeys.includes(e.code)) {
        e.preventDefault();
      }

      if (e.repeat) return;
      setPressed(e.code);
    };

    const up = (e: KeyboardEvent) => {
      if (!isVisible) return;
      setReleased(e.code);
    };

    document.addEventListener("keydown", down, { passive: false });
    document.addEventListener("keyup", up);

    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
    };
  }, [pressedKeys, isVisible]);

  return (
    <KeyboardContext.Provider
      value={{ pressedKeys, setPressed, setReleased, lastPressedKey }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};


/* ---------------- PREVIEW ---------------- */

const Preview = () => {
  const { lastPressedKey, pressedKeys } = useKeyboard();
  const [displayKey, setDisplayKey] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (lastPressedKey) {
      if (
        lastPressedKey === "Space" ||
        lastPressedKey === "ShiftLeft" ||
        lastPressedKey === "ShiftRight"
      ) {
        setDisplayKey(null);
        return;
      }

      setDisplayKey(getKeyDisplayLabel(lastPressedKey));
      setAnimationKey((prev) => prev + 1);
    }
  }, [lastPressedKey]);

  const isPressed = pressedKeys.size > 0;

  return (
    <div className="relative flex h-16 w-full items-center justify-center overflow-hidden mb-4">
      <AnimatePresence mode="popLayout">
        {displayKey && (
          <motion.div
            key={animationKey}
            layout
            initial={{ opacity: 0, scale: 0.5, y: 15 }}
            animate={{
              opacity: 1,
              scale: isPressed ? 0.95 : 1.1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: -15 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            className="absolute flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-md border border-white/20 px-6 py-3 shadow-2xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              animate={{ opacity: 0.8, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.1 }}
              className="text-3xl font-black text-neutral-800 font-mono tracking-tighter"
            >
              {displayKey}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- KEY ---------------- */

const Key = ({ code, children, className = "" }: any) => {
  const { pressedKeys, setPressed, setReleased } = useKeyboard();
  const active = pressedKeys.has(code);

  return (
    <div className={cn("p-[0.5px] rounded-[4.5px]", active ? "bg-indigo-400" : "bg-transparent")}>
      <button
        onMouseDown={() => setPressed(code)}
        onMouseUp={() => setReleased(code)}
        onMouseLeave={() => setReleased(code)}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-[4px] bg-gray-50 text-[8px] font-bold text-neutral-600 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.5),0px_1px_1px_0px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,1)_inset] transition-all duration-75 active:scale-95 select-none",
          active && "scale-95 bg-gray-100/90 shadow-[inset_0px_1px_2px_rgba(0,0,0,0.1)] text-indigo-600",
          className
        )}
      >
        {children}
      </button>
    </div>
  );
};

/* ---------------- KEYBOARD ---------------- */

// ── CHANGE 4: Added onKeyPress to Keyboard component props ────────────────────
export const Keyboard = ({ 
  className = "",
  enableSound = true,
  showPreview = true,
  onKeyPress,             // ← NEW PROP
}: { 
  className?:  string
  enableSound?: boolean
  showPreview?: boolean
  onKeyPress?:  (code: string) => void  // ← NEW TYPE
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    // ── CHANGE 5: Pass onKeyPress through to KeyboardProvider ─────────────────
    <KeyboardProvider
      enableSound={enableSound}
      containerRef={containerRef}
      onKeyPress={onKeyPress}  // ← NEW: forwarded to provider
    >
      <div 
        ref={containerRef}
        className={cn(
          "mx-auto w-fit p-4 rounded-2xl bg-neutral-200 shadow-2xl ring-1 ring-black/5 [zoom:0.8] sm:[zoom:1.25] md:[zoom:1.5] lg:[zoom:1.75] xl:[zoom:2]",
          className
        )}
      >
        {showPreview && <Preview />}

        <div className="flex flex-col gap-1 p-1 rounded-xl bg-neutral-300/40 backdrop-blur-sm shadow-inner">
          {/* Row 1 */}
          <div className="flex gap-1">
            <Key code="Escape" className="w-10">esc</Key>
            {[1,2,3,4,5,6,7,8,9,0].map(n => (
              <Key key={n} code={`Digit${n}`}>{n}</Key>
            ))}
            <Key code="Backspace" className="w-16">delete</Key>
          </div>

          {/* Row 2 */}
          <div className="flex gap-1">
            <Key code="Tab" className="w-14">tab</Key>
            {"QWERTYUIOP".split("").map(k => (
              <Key key={k} code={`Key${k}`}>{k}</Key>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex gap-1">
            <Key code="CapsLock" className="w-16">caps</Key>
            {"ASDFGHJKL".split("").map(k => (
              <Key key={k} code={`Key${k}`}>{k}</Key>
            ))}
            <Key code="Enter" className="w-16">return</Key>
          </div>

          {/* Row 4 */}
          <div className="flex gap-1">
            <Key code="ShiftLeft" className="w-20">shift</Key>
            {"ZXCVBNM".split("").map(k => (
              <Key key={k} code={`Key${k}`}>{k}</Key>
            ))}
            <Key code="ShiftRight" className="w-20">shift</Key>
          </div>

          {/* Windows Row */}
          <div className="flex gap-1 items-end">
            <Key code="ControlLeft" className="w-10">ctrl</Key>
            <Key code="MetaLeft" className="w-10">win</Key>
            <Key code="AltLeft" className="w-10">alt</Key>

            <Key code="Space" className="w-48"></Key>

            <Key code="AltRight" className="w-10">alt</Key>
            <Key code="MetaRight" className="w-10">win</Key>
            <Key code="ControlRight" className="w-10">ctrl</Key>

            <div className="flex gap-1 items-center ml-auto">
              <Key code="ArrowLeft" className="h-6 w-6">
                <IconCaretLeftFilled size={10} />
              </Key>
              <div className="flex flex-col gap-[1px]">
                <Key code="ArrowUp" className="h-[14px] w-6">
                  <IconCaretUpFilled size={8} />
                </Key>
                <Key code="ArrowDown" className="h-[14px] w-6">
                  <IconCaretDownFilled size={8} />
                </Key>
              </div>
              <Key code="ArrowRight" className="h-6 w-6">
                <IconCaretRightFilled size={10} />
              </Key>
            </div>
          </div>
        </div>
      </div>
    </KeyboardProvider>
  );
};