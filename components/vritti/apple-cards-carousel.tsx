"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";

/**
 * Adapted from the Vritti UI "Apple Cards Carousel" component
 * (vritti.thesatyajit.com/docs/components/apple-cards-carousel):
 * swapped @tabler/icons-react for the FontAwesome set already used across
 * this project, and swapped the built-in image-only `BlurImage` card face
 * for an arbitrary `media` node so cards can reuse this project's existing
 * screenshot/gradient+logo placeholder treatment.
 */

const useOutsideClick = (
  ref: RefObject<HTMLDivElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};

type CarouselCard = {
  media: ReactNode;
  title: string;
  category: string;
  content: ReactNode;
  /** Optional small text pinned to the bottom of the card face, under its own gradient. */
  footer?: ReactNode;
};

const isMobile = (): boolean =>
  typeof window !== "undefined" && window.innerWidth < 768;

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export function Carousel({
  items,
  initialScroll = 0,
}: {
  items: ReactNode[];
  initialScroll?: number;
}): ReactNode {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScrollability = (): void => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const scrollLeft = (): void => {
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (): void => {
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleCardClose = (index: number): void => {
    if (!carouselRef.current) return;
    const cardWidth = isMobile() ? window.innerWidth * 0.82 : 384;
    const gap = isMobile() ? 16 : 24;
    carouselRef.current.scrollTo({
      left: (cardWidth + gap) * (index + 1),
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full snap-x snap-mandatory overflow-x-scroll overscroll-x-auto scroll-smooth py-6 [scrollbar-width:none] sm:py-8 [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="flex flex-row justify-start gap-4 pl-[max(1.5rem,calc((100vw-68.75rem)/2+1.5rem))] sm:gap-6 sm:pl-[max(2.5rem,calc((100vw-68.75rem)/2+2.5rem))]">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: Math.min(0.08 * index, 0.4),
                    ease: "easeOut",
                  },
                }}
                key={`carousel-card-${index}`}
                className="snap-center rounded-3xl last:pr-6 sm:last:pr-24"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-[max(1.5rem,calc((100vw-68.75rem)/2+1.5rem))] flex justify-end gap-2 sm:mr-[max(2.5rem,calc((100vw-68.75rem)/2+2.5rem))]">
          <button
            type="button"
            className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background relative z-40 flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-40"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="focus-ring border-foreground/10 text-foreground/70 hover:text-foreground bg-background relative z-40 flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-40"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
}

export function Card({
  card,
  index,
}: {
  card: CarouselCard;
  index: number;
}): ReactNode {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = (): void => {
    setOpen(false);
    onCardClose(index);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = open ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useOutsideClick(containerRef, handleClose);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-50 h-screen overflow-x-hidden overflow-y-auto px-4 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/70 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              ref={containerRef}
              className="bg-background relative z-[60] mx-auto my-10 h-fit max-w-3xl rounded-3xl p-6 shadow-2xl sm:p-10"
            >
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="focus-ring bg-foreground text-background sticky top-0 ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
              <p className="text-foreground/60 mt-2 text-sm font-medium tracking-tight">
                {card.category}
              </p>
              <p className="text-foreground mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">
                {card.title}
              </p>
              <div className="mt-8">{card.content}</div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View details for ${card.title}`}
        className="focus-ring relative z-10 flex aspect-[3/4] w-[82vw] max-w-sm shrink-0 cursor-pointer flex-col overflow-hidden rounded-3xl text-left sm:aspect-auto sm:h-[30rem] sm:w-96 sm:max-w-none"
      >
        <div className="absolute inset-0 z-0">{card.media}</div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2/3 bg-gradient-to-b from-black/60 via-black/10 to-transparent" />
        <div className="relative z-20 p-5 text-left sm:p-6">
          <p className="text-[13px] font-medium tracking-tight text-white/80 sm:text-sm">
            {card.category}
          </p>
          <p className="mt-2 max-w-xs text-[17px] leading-snug font-semibold tracking-tight [text-wrap:balance] text-white sm:text-2xl">
            {card.title}
          </p>
        </div>
        {card.footer ? (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative z-20 mt-auto w-full p-5 pr-16 text-left sm:p-6 sm:pr-20">
              {card.footer}
            </div>
          </>
        ) : null}
        <span className="absolute right-5 bottom-5 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md sm:right-6 sm:bottom-6">
          <FontAwesomeIcon
            icon={faPlus}
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        </span>
      </button>
    </>
  );
}
