"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import {
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Polaroid = {
  id: string;
  rotate: number;
  src: string;
};

const PHOTOS: Polaroid[] = [
  { id: "g", rotate: -8, src: "/polaroids/photo-7.jpg" },
  { id: "hero", rotate: 6, src: "/portrait.jpg" },
  { id: "a", rotate: -4, src: "/polaroids/photo-1.jpg" },
  { id: "b", rotate: 7, src: "/polaroids/photo-2.jpg" },
  { id: "c", rotate: -6, src: "/polaroids/photo-3.jpg" },
  { id: "d", rotate: 5, src: "/polaroids/photo-4.jpg" },
  { id: "e", rotate: -3, src: "/polaroids/photo-5.jpg" },
  { id: "f", rotate: 8, src: "/polaroids/photo-6.jpg" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function PolaroidCard({
  photo,
  index,
}: {
  photo: Polaroid;
  index: number;
}): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = 18;
    const k = 0.25;
    mx.set(Math.max(-max, Math.min(max, dx * k)));
    my.set(Math.max(-max, Math.min(max, dy * k)));
  };

  const handleLeave = (): void => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0, y: -120, filter: "blur(18px)", rotate: photo.rotate }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: photo.rotate }}
      transition={{
        duration: 0.9,
        delay: 0.05 + index * 0.08,
        ease: EASE,
      }}
      style={{
        x: tx,
        y: ty,
        rotate: photo.rotate,
      }}
      className="relative aspect-[3/4] w-[clamp(6rem,11vw,9rem)] shrink-0 overflow-hidden rounded-2xl border-6 border-neutral-300/40 bg-white p-1.5 dark:border-white/15 dark:bg-neutral-900"
    >
      <PolaroidPhoto src={photo.src} />
    </motion.div>
  );
}

function PolaroidPhoto({
  src,
  priority = false,
}: {
  src: string;
  priority?: boolean;
}): ReactNode {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <Image
        src={src}
        alt="Nitheesh Rajendran"
        fill
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        sizes="(min-width: 640px) 144px, 220px"
        priority={priority}
        className="pointer-events-none object-cover select-none"
      />
    </div>
  );
}

const SWIPE_THRESHOLD = 90;

/** Tap-or-swipe stack of flashcards. */
export function PolaroidFlashcards({
  className = "w-[13rem]",
}: {
  /** Controls the stack's width — height follows via the 3:4 aspect ratio. */
  className?: string;
} = {}): ReactNode {
  const [active, setActive] = useState(0);
  const count = PHOTOS.length;

  const advance = (): void => setActive((v) => (v + 1) % count);

  const front = PHOTOS[active % count] ?? PHOTOS[0]!;
  const behind = [1, 2].map((offset) => ({
    offset,
    photo: PHOTOS[(active + offset) % count] ?? PHOTOS[0]!,
  }));

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={`relative aspect-[3/4] ${className}`}
        style={{ perspective: 800 }}
      >
        {behind
          .slice()
          .reverse()
          .map(({ offset, photo }) => (
            <div
              key={photo.id}
              aria-hidden="true"
              style={{
                transform: `scale(${1 - offset * 0.06}) translateY(${offset * 10}px) rotate(${offset % 2 ? 4 : -4}deg)`,
                zIndex: 10 - offset,
              }}
              className="absolute inset-0 overflow-hidden rounded-2xl border-6 border-neutral-300/40 bg-white p-1.5 opacity-70 dark:border-white/15 dark:bg-neutral-900"
            >
              <PolaroidPhoto src={photo.src} />
            </div>
          ))}

        <AnimatePresence initial={false}>
          <motion.div
            key={`${front.id}-${active}`}
            drag="x"
            dragElastic={0.6}
            dragConstraints={{ left: 0, right: 0 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) advance();
            }}
            onTap={advance}
            initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{
              opacity: 0,
              x: -220,
              rotate: -18,
              transition: { duration: 0.35, ease: EASE },
            }}
            transition={{ duration: 0.4, ease: EASE }}
            whileTap={{ cursor: "grabbing" }}
            className="absolute inset-0 z-20 cursor-grab touch-pan-y overflow-hidden rounded-2xl border-6 border-neutral-300/40 bg-white p-1.5 shadow-lg active:cursor-grabbing dark:border-white/15 dark:bg-neutral-900"
          >
            <PolaroidPhoto src={front.src} priority />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1.5" aria-hidden="true">
        {PHOTOS.map((photo, i) => (
          <span
            key={photo.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-4 bg-foreground/60" : "w-1.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
      <p className="text-foreground/40 text-[12px] tracking-tight">
        Tap or swipe for more
      </p>
    </div>
  );
}

export function PolaroidStrip(): ReactNode {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <div aria-hidden="true" className="h-[clamp(8rem,15vw,12rem)] w-full" />;
  }

  return (
    <>
      <div className="sm:hidden">
        <PolaroidFlashcards />
      </div>
      <div className="hidden w-full flex-wrap items-start justify-center gap-1 px-4 sm:flex sm:gap-1.5 sm:px-8">
        {PHOTOS.map((photo, i) => (
          <PolaroidCard key={photo.id} photo={photo} index={i} />
        ))}
      </div>
    </>
  );
}
