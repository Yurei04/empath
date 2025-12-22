"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  FileText, 
  Loader2,
  BookOpen,
  TrendingUp,
  Heart
} from "lucide-react"
import { motion } from "framer-motion"

// Import separated components
import { StatCard } from "./stat-card"
import { ProfileCard } from "./profile"
import { PostManagementCard } from "./management-card"
import { CreateStoryDialog } from "./create-story"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/30 to-amber-950/20 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-orange-200">Manage your stories and profile</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={<FileText className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Total Stories"
            value={stats.totalPosts}
            color="from-amber-500/20 to-orange-500/20"
            borderColor="border-amber-500/30"
            textColor="text-amber-300"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Recent Posts"
            value={stats.recentPosts}
            subtitle="Last 30 days"
            color="from-orange-500/20 to-red-500/20"
            borderColor="border-orange-500/30"
            textColor="text-orange-300"
          />
          <StatCard
            icon={<Heart className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="Total Impact"
            value={stats.totalPosts * 5}
            subtitle="People helped"
            color="from-yellow-500/20 to-amber-500/20"
            borderColor="border-yellow-500/30"
            textColor="text-yellow-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Profile Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ProfileCard user={user} />
          </div>

          {/* Stories Management */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card className="bg-gradient-to-br from-orange-950/40 via-amber-950/40 to-slate-950/40 backdrop-blur-xl border border-orange-500/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-orange-200">Your Stories</h2>
                  <CreateStoryDialog onSuccess={fetchUserAndPosts} />
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 text-orange-300/60">
                    <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">No stories yet. Create your first one!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px] pr-2 sm:pr-4">
                    <div className="space-y-3 sm:space-y-4">
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