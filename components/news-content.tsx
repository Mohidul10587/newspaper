"use client"

import { AdSlot } from "@/components/ad-slot"

interface NewsContentProps {
  content: string
}

export function NewsContent({ content }: NewsContentProps) {
  // Split content into paragraphs and insert ads
  const paragraphs = content.split("\n\n").filter((p) => p.trim())

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => (
        <div key={index}>
          <p className="mb-6 leading-relaxed text-foreground">{paragraph}</p>

          {/* Insert ad after every 3rd paragraph */}
          {(index + 1) % 3 === 0 && index < paragraphs.length - 1 && (
            <div className="my-8">
              <AdSlot
                slotKey={`in_content_${Math.floor((index + 1) / 3)}`}
                className="h-24"
                placeholder="In-Content Advertisement"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
