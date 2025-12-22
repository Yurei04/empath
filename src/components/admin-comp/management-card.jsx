"use client"
import { useState } from "react"
import { Calendar, Edit, Trash2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { EditStoryDialog } from "./edit-story"

export function PostManagementCard({ post, onUpdate, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this story?")) return
    
    setDeleting(true)
    const { error } = await supabase
      .from("empath_posts")
      .delete()
      .eq("id", post.id)
    
    setDeleting(false)
    
    if (error) {
      console.error(error)
      alert("Error deleting story")
      return
    }
    
    if (onDelete) onDelete()
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-950/20 via-orange-950/20 to-slate-950/40 border border-orange-500/20 hover:border-orange-400/40 transition-all">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {post.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate max-w-[150px]">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-orange-300/60 flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-3 h-3" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <h4 className="text-base sm:text-lg font-semibold text-orange-100 mb-2 break-words line-clamp-2">
              {post.title}
            </h4>
            
            {post.description && (
              <p className="text-xs sm:text-sm text-orange-200/70 line-clamp-2 mb-3 break-words">
                {post.description}
              </p>
            )}
            
            {post.emotion_tags && post.emotion_tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.emotion_tags.slice(0, 3).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 truncate max-w-[120px]"
                  >
                    {tag}
                  </span>
                ))}
                {post.emotion_tags.length > 3 && (
                  <span className="text-xs px-2 py-1 text-purple-300/60">
                    +{post.emotion_tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex sm:flex-col gap-2 self-end sm:self-start flex-shrink-0">
            <EditStoryDialog post={post} onSuccess={onUpdate}>
              <Button
                size="sm"
                variant="ghost"
                className="bg-orange-900/50 hover:bg-orange-800/70 text-orange-300 border border-orange-500/30 h-8 sm:h-9 px-2 sm:px-3"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </EditStoryDialog>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-900/50 hover:bg-rose-800/70 text-rose-300 border border-rose-500/30 h-8 sm:h-9 px-2 sm:px-3"
            >
              {deleting ? (
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}