"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  User, 
  Heart, 
  FileText, 
  Calendar, 
  Edit, 
  Trash2, 
  Plus,
  Loader2,
  Tag,
  BookOpen,
  TrendingUp
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    recentPosts: 0
  })

  useEffect(() => {
    fetchUserAndPosts()
  }, [])

  const fetchUserAndPosts = async () => {
    setLoading(true)
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    setUser(currentUser)

    // Fetch user's posts
    const { data: userPosts, error } = await supabase
      .from("empath_posts")
      .select("*")
      .eq("user_id", currentUser?.id)
      .order("created_at", { ascending: false })

    if (!error && userPosts) {
      setPosts(userPosts)
      
      // Calculate stats
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      setStats({
        totalPosts: userPosts.length,
        totalViews: userPosts.reduce((sum, post) => sum + (post.views || 0), 0),
        recentPosts: userPosts.filter(post => 
          new Date(post.created_at) > thirtyDaysAgo
        ).length
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-amber-950/20 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-orange-200">Manage your stories and profile</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Total Stories"
            value={stats.totalPosts}
            color="from-amber-500/20 to-orange-500/20"
            borderColor="border-amber-500/30"
            textColor="text-amber-300"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Recent Posts"
            value={stats.recentPosts}
            subtitle="Last 30 days"
            color="from-orange-500/20 to-red-500/20"
            borderColor="border-orange-500/30"
            textColor="text-orange-300"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="Total Impact"
            value={stats.totalPosts * 5}
            subtitle="People helped"
            color="from-yellow-500/20 to-amber-500/20"
            borderColor="border-yellow-500/30"
            textColor="text-yellow-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <ProfileCard user={user} />
          </div>

          {/* Stories Management */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-orange-950/40 via-amber-950/40 to-slate-950/40 backdrop-blur-xl border border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-orange-200">Your Stories</h2>
                  <CreateStoryDialog onSuccess={fetchUserAndPosts} />
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 text-orange-300/60">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No stories yet. Create your first one!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <PostManagementCard 
                          key={post.id} 
                          post={post} 
                          onUpdate={fetchUserAndPosts}
                          onDelete={fetchUserAndPosts}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile Card Component
function ProfileCard({ user }) {
  return (
    <Card className="bg-gradient-to-br from-amber-950/40 via-orange-950/40 to-slate-950/40 backdrop-blur-xl border border-amber-500/20">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-bold text-amber-200 mb-1">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous'}
          </h3>
          <p className="text-sm text-orange-300/60">{user?.email}</p>
        </div>

        <div className="space-y-4 border-t border-orange-500/20 pt-6">
          <div className="flex items-center gap-3 text-orange-200">
            <Calendar className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-orange-300/60">Member since</p>
              <p className="text-sm">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-orange-200">
            <Heart className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-orange-300/60">Role</p>
              <p className="text-sm">Story Contributor</p>
            </div>
          </div>
        </div>

        <Button className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}

// Stats Card Component
function StatCard({ icon, title, value, subtitle, color, borderColor, textColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-gradient-to-br ${color} backdrop-blur-xl border ${borderColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${textColor}`}>{icon}</div>
            <div className="text-right">
              <p className="text-3xl font-bold text-orange-100">{value}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-200">{title}</p>
            {subtitle && (
              <p className="text-xs text-orange-300/60 mt-1">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Post Management Card
function PostManagementCard({ post, onUpdate, onDelete }) {
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
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-orange-300/60 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <h4 className="text-lg font-semibold text-orange-100 mb-2 line-clamp-1">
              {post.title}
            </h4>
            
            {post.description && (
              <p className="text-sm text-orange-200/70 line-clamp-2 mb-3">
                {post.description}
              </p>
            )}
            
            {post.emotion_tags && post.emotion_tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.emotion_tags.slice(0, 3).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <EditStoryDialog post={post} onSuccess={onUpdate}>
              <Button
                size="sm"
                variant="ghost"
                className="bg-orange-900/50 hover:bg-orange-800/70 text-orange-300 border border-orange-500/30"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </EditStoryDialog>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-900/50 hover:bg-rose-800/70 text-rose-300 border border-rose-500/30"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Create Story Dialog
function CreateStoryDialog({ onSuccess }) {
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
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Story
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-slate-900 via-orange-900 to-amber-900 border-orange-500/30 max-w-2xl max-h-[90vh]">
        <DialogTitle className="text-orange-200 mb-4 text-xl font-semibold">
          Create New Story
        </DialogTitle>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4">
            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Author Name</label>
              <Input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Your name..."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter a meaningful title..."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Short Description</label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="A brief summary of your story..."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/30 text-orange-100 border border-orange-500/30 rounded-md p-2 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
              <label className="text-orange-300 text-sm font-medium mb-2 block">
                Emotion Tags 
                <span className="text-orange-400/60 text-xs ml-2">(comma-separated)</span>
              </label>
              <Input
                name="emotion_tags"
                value={form.emotion_tags}
                onChange={handleChange}
                placeholder="e.g., hopeful, reflective, healing"
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Content</label>
              <Textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Share your story here... Each paragraph will be separated automatically."
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 placeholder:text-orange-400/40 min-h-[250px] resize-none"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium"
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
            className="border-orange-500/30 text-orange-300 hover:bg-orange-950/40"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Edit Story Dialog
function EditStoryDialog({ post, onSuccess, children }) {
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

      <DialogContent className="bg-gradient-to-br from-slate-900 via-orange-900 to-amber-900 border-orange-500/30 max-w-2xl max-h-[90vh]">
        <DialogTitle className="text-orange-200 mb-4 text-xl font-semibold">
          Edit Story – {post.title}
        </DialogTitle>

        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4">
            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Author Name</label>
              <Input
                name="author"
                value={form.author}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Short Description</label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/30 text-orange-100 border border-orange-500/30 rounded-md p-2 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
              <label className="text-orange-300 text-sm font-medium mb-2 block">
                Emotion Tags 
                <span className="text-orange-400/60 text-xs ml-2">(comma-separated)</span>
              </label>
              <Input
                name="emotion_tags"
                value={form.emotion_tags}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-orange-300 text-sm font-medium mb-2 block">Content</label>
              <Textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className="bg-black/30 text-orange-100 border-orange-500/30 focus:border-orange-400 min-h-[250px] resize-none"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium"
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
            className="border-orange-500/30 text-orange-300 hover:bg-orange-950/40"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}