"use client"
import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase"

export function CreateStoryDialog({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    emotion_tags: "",
    author: ""
  })
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.author) {
      alert("Please fill in title, author, and content")
      return
    }

    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    const emotionTagsArray = form.emotion_tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const { error } = await supabase
      .from("empath_posts")
      .insert({
        title: form.title,
        description: form.description,
        content: form.content,
        category: form.category,
        emotion_tags: emotionTagsArray,
        author: form.author,
        user_id: user?.id
      })

    setSaving(false)

    if (error) {
      console.error(error)
      alert("Error creating story: " + error.message)
      return
    }

    // Reset form
    setForm({
      title: "",
      description: "",
      content: "",
      category: "",
      emotion_tags: "",
      author: ""
    })

    setOpen(false)
    if (onSuccess) onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm sm:text-base">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">New Story</span>
          <span className="sm:hidden">New</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-900 via-orange-900 to-amber-900 border-orange-500/30 max-w-[95vw] sm:max-w-2xl max-h-[90vh] p-4 sm:p-6">
        <DialogTitle className="text-orange-200 mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">
          Create New Story
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
                placeholder="Your name..."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40 text-sm"
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
                placeholder="Enter a meaningful title..."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40 text-sm"
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
                placeholder="A brief summary of your story..."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40 text-sm"
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
                placeholder="e.g., hopeful, reflective, healing"
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40 text-sm"
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
                placeholder="Share your story here... Each paragraph will be separated automatically."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40 min-h-[200px] sm:min-h-[250px] resize-none text-sm"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium text-sm sm:text-base"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...
              </>
            ) : (
              "Create Story"
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