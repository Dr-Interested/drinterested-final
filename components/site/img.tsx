"use client"

import NextImage, { type ImageLoader, type ImageProps } from "next/image"

/**
 * Our event photos in /public/media are already compressed, with 640 and 1080 pixel copies
 * beside them (public/media/_w640, _w1080). Serving those directly means the photos never
 * depend on Vercel's image optimizer, which can refuse requests once a plan's monthly
 * limit is reached. Every other image goes through next/image as usual.
 */
const mediaLoader: ImageLoader = ({ src, width }) => {
  const rel = src.slice("/media/".length)
  if (width <= 640) return `/media/_w640/${rel}?w=${width}`
  if (width <= 1080) return `/media/_w1080/${rel}?w=${width}`
  return `${src}?w=${width}`
}

export default function Img(props: ImageProps) {
  const isMedia = typeof props.src === "string" && props.src.startsWith("/media/") && props.src.endsWith(".webp")
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through in props
  return <NextImage {...props} loader={isMedia ? mediaLoader : props.loader} />
}
