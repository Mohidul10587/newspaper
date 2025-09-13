"use client"

import type React from "react"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Reply, Flag, ThumbsUp } from "lucide-react"

interface CommentSectionProps {
  newsId: string
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  replies: Comment[]
  likes: number
  isApproved: boolean
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    author: "John Doe",
    content: "This is a very informative article. Thank you for sharing this news.",
    createdAt: "2024-01-15T10:30:00Z",
    replies: [
      {
        id: "2",
        author: "Jane Smith",
        content: "I agree! Very well written.",
        createdAt: "2024-01-15T11:00:00Z",
        replies: [],
        likes: 2,
        isApproved: true,
      },
    ],
    likes: 5,
    isApproved: true,
  },
  {
    id: "3",
    author: "Ahmed Rahman",
    content: "Great coverage of this important topic. Looking forward to more updates.",
    createdAt: "2024-01-15T12:15:00Z",
    replies: [],
    likes: 3,
    isApproved: true,
  },
]

export function CommentSection({ newsId }: CommentSectionProps) {
  const t = useTranslations()
  const locale = useLocale() as "en" | "bn"
  const [comments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would submit to API
    console.log("Submitting comment:", { newsId, content: newComment, guestName, guestEmail })
    setNewComment("")
    setGuestName("")
    setGuestEmail("")
  }

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    // In production, this would submit to API
    console.log("Submitting reply:", { newsId, parentId, content: replyContent })
    setReplyContent("")
    setReplyingTo(null)
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-8 mt-4" : "mb-6"}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {comment.author
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
            {!comment.isApproved && (
              <Badge variant="outline" className="text-xs">
                {locale === "bn" ? "অনুমোদনের অপেক্ষায়" : "Pending approval"}
              </Badge>
            )}
          </div>
          <p className="text-sm mb-3 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 text-xs">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="h-3 w-3" />
              {comment.likes}
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Reply className="h-3 w-3" />
                {locale === "bn" ? "উত্তর দিন" : "Reply"}
              </button>
            )}
            <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors">
              <Flag className="h-3 w-3" />
              {locale === "bn" ? "রিপোর্ট" : "Report"}
            </button>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={locale === "bn" ? "আপনার উত্তর লিখুন..." : "Write your reply..."}
                className="mb-2"
                rows={3}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={!replyContent.trim()}>
                  {locale === "bn" ? "উত্তর পোস্ট করুন" : "Post Reply"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                >
                  {locale === "bn" ? "বাতিল" : "Cancel"}
                </Button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t("common.comments")} ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={locale === "bn" ? "আপনার নাম" : "Your name"}
                required
              />
              <Input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder={locale === "bn" ? "আপনার ইমেইল" : "Your email"}
                required
              />
            </div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={locale === "bn" ? "আপনার মন্তব্য লিখুন..." : "Write your comment..."}
              rows={4}
              required
            />
            <Button type="submit" disabled={!newComment.trim() || !guestName.trim() || !guestEmail.trim()}>
              {locale === "bn" ? "মন্তব্য পোস্ট করুন" : "Post Comment"}
            </Button>
          </form>

          {/* Comments List */}
          <div>
            {comments.length > 0 ? (
              comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {locale === "bn"
                    ? "এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!"
                    : "No comments yet. Be the first to comment!"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
