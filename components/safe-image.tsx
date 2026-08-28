"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

/**
 * next/image wrapper that falls back to a known-good local image if the given src 404s or
 * otherwise fails to load — e.g. a cover_image/author image URL pointing at a deleted Supabase
 * Storage object. Prevents broken-image icons in place of "images aren't loading."
 */
export default function SafeImage({
  src,
  fallbackSrc = "/circle-logo.png",
  alt,
  ...props
}: ImageProps & { fallbackSrc?: string }) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}
