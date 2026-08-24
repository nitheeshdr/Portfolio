"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

type CertificateCtaProps = {
  /** Award/certificate title, used for alt text and the modal's aria-label. */
  title: string;
  /** Full-resolution letter/certificate image, shown in the popup. */
  letterImage: string;
  /** Issuer logo shown as the clickable trigger. Omit to render a text CTA instead. */
  logo?: string;
  /** Text-CTA label, used when `logo` is omitted. */
  label?: string;
};

export function CertificateCta({
  title,
  letterImage,
  logo,
  label = "View the letter",
}: CertificateCtaProps): ReactNode {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {logo ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View the ${title} certificate`}
          className="focus-ring border-foreground/10 relative h-16 w-16 shrink-0 cursor-zoom-in overflow-hidden rounded-2xl border bg-white transition-transform hover:scale-[1.03]"
        >
          <Image
            src={logo}
            alt={title}
            fill
            sizes="64px"
            className="object-cover"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring border-foreground/15 bg-foreground/3 hover:bg-foreground/6 text-foreground/80 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium tracking-tight transition-colors"
        >
          <FontAwesomeIcon
            icon={faFileLines}
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          {label}
        </button>
      )}

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="focus-ring absolute top-4 right-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-lg cursor-auto"
            >
              <Image
                src={letterImage}
                alt={title}
                width={1000}
                height={1400}
                sizes="(min-width: 640px) 32rem, 100vw"
                className="h-auto max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
