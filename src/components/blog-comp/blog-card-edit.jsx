"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"

export default function BlogCardEdit({ post, onUpdate, children }) {
  const [form, setForm] = useState({
    title: post.title || "",
    description: post.description || "",
    content: post.content || "",
    category: post.category || "",
    emotion_tags: Array.isArray(post.emotion_tags) 
      ? post.emotion_tags.join(", ") 
      : post.emotion_tags || "",
  })

  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)

    // Convert emotion_tags string to array
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)

    setSaving(false)

    if (error) {
      console.error(error)
      alert("Error saving changes: " + error.message)
      return
    }

    if (onUpdate) onUpdate()
    
    // Close dialog
    const closeButton = document.querySelector("[data-dialog-close]")
    if (closeButton) closeButton.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 border-teal-500/30 max-w-2xl max-h-[90vh]" data-dialog-close>
        <DialogTitle className="text-teal-200 mb-4 text-xl font-semibold">
          Edit Story – {post.title}
        </DialogTitle>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4">

            <div>
              <label className="text-teal-300 text-sm font-medium mb-2 block">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a meaningful title..."
                className="bg-black/30 text-teal-100 border-teal-500/30 focus:border-teal-400 placeholder:text-teal-400/40"
              />
            </div>

            <div>
              <label className="text-teal-300 text-sm font-medium mb-2 block">Short Description</label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="A brief summary of your story..."
                className="bg-black/30 text-teal-100 border-teal-500/30 focus:border-teal-400 placeholder:text-teal-400/40"
              />
            </div>

            <div>
              <label className="text-teal-300 text-sm font-medium mb-2 block">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/30 text-teal-100 border border-teal-500/30 rounded-md p-2 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
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
              <label className="text-teal-300 text-sm font-medium mb-2 block">
                Emotion Tags 
                <span className="text-teal-400/60 text-xs ml-2">(comma-separated)</span>
              </label>
              <Input
                name="emotion_tags"
                value={form.emotion_tags}
                onChange={handleChange}
                placeholder="e.g., hopeful, reflective, healing"
                className="bg-black/30 text-teal-100 border-teal-500/30 focus:border-teal-400 placeholder:text-teal-400/40"
              />
            </div>

            <div>
              <label className="text-teal-300 text-sm font-medium mb-2 block">Content</label>
              <ScrollArea className="h-64 w-full rounded-md border border-teal-500/30 bg-black/30">
                <Textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Share your story here... Each paragraph will be separated automatically."
                  className="bg-transparent text-teal-100 border-0 resize-none min-h-[250px] w-full p-4 placeholder:text-teal-400/40 focus:outline-none"
                />
              </ScrollArea>
            </div>

          </div>
        </ScrollArea>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium"
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
            onClick={() => document.querySelector("[data-dialog-close]").click()}
            className="border-teal-500/30 text-teal-300 hover:bg-teal-950/40"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}