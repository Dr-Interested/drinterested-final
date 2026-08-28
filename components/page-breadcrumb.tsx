import { Fragment } from "react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import SeoSchema from "@/components/seo-schema"
import { generateBreadcrumbSchema } from "@/lib/seo-utils"

const SITE_URL = "https://www.drinterested.org"

export type BreadcrumbTrailItem = { name: string; href: string }

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD in one component, so the two
 * never drift out of sync. The last item renders as the current (non-link) page.
 */
export default function PageBreadcrumb({ items }: { items: BreadcrumbTrailItem[] }) {
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
  }))

  return (
    <>
      <SeoSchema id="breadcrumb-schema" schema={generateBreadcrumbSchema(schemaItems)} />
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <Fragment key={item.href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="line-clamp-1">{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.name}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  )
}
