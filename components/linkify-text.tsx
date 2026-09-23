import { Fragment } from "react"

const URL_RE = /(https?:\/\/[^\s<>"')\]]+[^\s<>"')\].,;:!?])/g

/**
 * Renders plain text with any http(s) URLs turned into links that open in a new tab. Task
 * descriptions often contain a form or doc link that members previously had to copy by hand.
 */
export default function LinkifyText({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const parts = text.split(URL_RE)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName || "text-[#2d8659] underline underline-offset-2 break-all hover:text-[#4CAF7D]"}
          >
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
