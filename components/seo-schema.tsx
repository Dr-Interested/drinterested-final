import Script from "next/script"

interface SEOSchemaProps {
  schema?: object
  // Required and must be unique per page: next/script dedupes inline scripts by `id`, so any
  // two <SeoSchema> instances that share an id on the same page silently drop one of them
  // (this previously happened site-wide against the root layout's "organization-schema").
  id: string
}

export default function SeoSchema({ schema, id }: SEOSchemaProps) {
  if (!schema) return null

  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
