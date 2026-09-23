"use client";

import { useEffect, useRef, useState } from "react";
import { imageUrl, srcSet, type ImageAsset } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  image: ImageAsset;
  alt: string;
  /** `sizes` attribute – tells the browser which rendition to pick. */
  sizes?: string;
  /** Fill the (relatively positioned) parent, cropping with object-cover. Used for cards/heroes only. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  objectPosition?: string;
};

/**
 * Responsive <picture> with AVIF → WebP fallbacks, lazy loading, a blurred low-res
 * placeholder and a soft fade-in once the real image has loaded.
 */
export function Picture({ image, alt, sizes = "100vw", fill, priority, className, imgClassName, objectPosition }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true);
  }, []);

  const placeholder = {
    backgroundColor: image.color ?? "#1c1f1b",
    backgroundImage: image.blurDataUrl && !loaded ? `url(${image.blurDataUrl})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: objectPosition ?? "center",
  };

  return (
    <picture
      className={cn(fill ? "absolute inset-0 block overflow-hidden" : "block", className)}
      style={fill ? placeholder : { ...placeholder, aspectRatio: `${image.width} / ${image.height}` }}
    >
      <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={sizes} />
      <img
        ref={ref}
        src={imageUrl(image, 1600, "webp")}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        style={{ objectPosition }}
        className={cn(
          "block h-full w-full transition-opacity duration-700 ease-out",
          fill ? "object-cover" : "object-contain",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </picture>
  );
}
