"use client"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"

export function EditStoryDialog({ post, onSuccess, children }) {
  const [form, setForm] = useState({
    title: post.title || "",
    description: post.description || "",
    content: post.content || "",
    category: post.category || "",
    emotion_tags: Array.isArray(post.emotion_tags) 
      ? post.emotion_tags.join(", ") 
      : post.emotion_tags || "",
    author: post.author || ""
  })
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)

    const emotionTagsArray = form.emotion_tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const { error } = await supabase
      .from("empath_posts")
      .update({
        title: form.title,
        description: form.description,
        content: form.content,
        category: form.category,
        emotion_tags: emotionTagsArray,
        author: form.author,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)

    setSaving(false)

    if (error) {
      console.error(error)
      alert("Error saving changes: " + error.message)
      return
    }

    setOpen(false)
    if (onSuccess) onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-900 via-orange-900 to-amber-900 border-orange-500/30 max-w-[95vw] sm:max-w-2xl max-h-[90vh] p-4 sm:p-6">
        <DialogTitle className="text-orange-200 mb-3 sm:mb-4 text-lg sm:text-xl font-semibold line-clamp-1 break-words pr-8">
          Edit Story – {post.title}
        </DialogTitle>

        <ScrollArea className="h-[60vh] sm:h-[65vh] pr-2 sm:pr-4">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-orange-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Author Name
              </label>
              <Input
                name="author"
                value={form.author}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 text-sm"
              />
            </div>

            <div>
              <label className="text-orange-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Title
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 text-sm"
              />
            </div>

            <div>
              <label className="text-orange-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Short Description
              </label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 text-sm"
              />
            </div>

            <div>
              <label className="text-orange-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/30 text-orange-100 border border-orange-500/30 rounded-md p-2 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              >
                <option value="">Select a category...</option>
                <option value="Personal Story">Personal Story</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Self-Care">Self-Care</option>
                <option value="Community Support">Community Support</option>
                <option value="Relationships">Relationships</option>
                <option value="Growth & Healing">Growth & Healing</option>
              </select>
            </div>

            <div>
              <label className="text-orange-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Emotion Tags 
                <span className="text-orange-400/60 text-xs ml-2">(comma-separated)</span>
              </label>
              <Input
                name="emotion_tags"
                value={form.emotion_tags}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 text-sm"
              />
            </div>

            <div>
              <label className="text-orange-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 block">
                Content
              </label>
              <Textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 min-h-[200px] sm:min-h-[250px] resize-none text-sm"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium text-sm sm:text-base"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-orange-500/30 text-orange-300 hover:bg-orange-950/40 text-sm sm:text-base"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}