"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ImageOff } from "lucide-react";
import { BACKEND_URL } from "@/utils/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GalleryProps, ImgWithFallbackProps } from "@/types";

function ImgWithFallback({
  src,
  alt,
  className,
  iconClass,
}: ImgWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  const handleError = useCallback(() => {
    setErrored(true);
  }, []);

  if (errored || !src) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-linear-to-br from-brand-light/60 to-white w-full h-full`}
      >
        <ImageOff
          className={iconClass || "w-10 h-10 text-brand-navy/30"}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      onError={handleError}
      className={className}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  );
}

export default function Gallery({ cover, images = [] }: GalleryProps) {
  const all = [cover, ...images.filter((u) => u && u !== cover)].filter(
    Boolean
  ) as string[];

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  const total = all.length;

  const url = (u?: string) => {
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return u.startsWith("/") ? `${BACKEND_URL}${u}` : `${BACKEND_URL}/${u}`;
  };

  const next = useCallback(() => {
    setActive((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + total) % total);
  }, [total]);

  if (total === 0) return null;

  return (
    <div data-testid="book-gallery" className="w-full">
      {/* Main Image */}
      <div className="relative w-full max-w-70 sm:max-w-sm md:max-w-md mx-auto aspect-3/4 rounded-2xl sm:rounded-3xl shadow-pop overflow-hidden bg-linear-to-br from-brand-light/60 to-white group">
        <ImgWithFallback
          src={url(all[active])}
          alt="Book Cover"
          className="object-cover transition-opacity duration-300"
          iconClass="w-12 h-12 sm:w-16 sm:h-16 text-brand-navy/30"
        />

        {total > 1 && (
          <>
            <button
              onClick={prev}
              type="button"
              aria-label="Previous image"
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white grid place-items-center shadow-soft opacity-0 group-hover:opacity-100 transition-opacity z-10"
              data-testid="gallery-prev"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-navy" />
            </button>

            <button
              onClick={next}
              type="button"
              aria-label="Next image"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white grid place-items-center shadow-soft opacity-0 group-hover:opacity-100 transition-opacity z-10"
              data-testid="gallery-next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-navy" />
            </button>
          </>
        )}

        <button
          onClick={() => setZoom(true)}
          type="button"
          aria-label="Zoom image"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white grid place-items-center shadow-soft z-10"
          data-testid="gallery-zoom"
        >
          <ZoomIn className="w-4 h-4 text-brand-navy" />
        </button>

        {total > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-white/85 rounded-full z-10">
            {all.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active
                  ? "w-6 bg-brand-royal"
                  : "w-1.5 bg-brand-royal/30"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 w-full">
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center scroll-smooth snap-x">
            {all.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start ${i === active
                  ? "border-brand-royal ring-2 ring-brand-royal/30 scale-105"
                  : "border-brand-light hover:border-brand-royal/40 opacity-70 hover:opacity-100"
                  }`}
                data-testid={`gallery-thumb-${i}`}
              >
                <ImgWithFallback
                  src={url(img)}
                  alt={`Thumbnail ${i + 1}`}
                  className="object-cover"
                  iconClass="w-5 h-5 text-brand-navy/30"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full p-1 sm:p-2 bg-black/95 border-0 z-100 [&_.lucide-x]:text-white">
          <DialogTitle className="sr-only">Image Zoom Preview</DialogTitle>
          <div className="relative w-full h-[70vh] sm:h-[80vh] flex items-center justify-center">
            <ImgWithFallback
              src={url(all[active])}
              alt="Full size view"
              className="object-contain"
              iconClass="w-20 h-20 text-white/40"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}