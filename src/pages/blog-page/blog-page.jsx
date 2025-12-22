"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import BlogCard from "@/components/blog-comp/blog-card"

import { motion } from "framer-motion"
import { Search } from "lucide-react"

export default function BlogPage() {
    const [posts, setPosts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState("all")

    const categories = [
        "all",
        "Personal Story",
        "Mental Health",
        "Self-Care",
        "Community Support",
        "Relationships",
        "Growth & Healing",
    ]

    useEffect(() => {
        async function fetchPosts() {
            const { data, error } = await supabase
                .from("empath_posts")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) console.error("Error:", error)
            else setPosts(data)
        }

        fetchPosts()
    }, [])

    const filteredData = posts.filter((item) => {
        const search = searchTerm.toLowerCase()

        const title = (item.title || "").toLowerCase()
        const desc = (item.description || "").toLowerCase()
        const content = (item.content || "").toLowerCase()
        const author = (item.author || "").toLowerCase()

        let emotionArray = []
        if (Array.isArray(item.emotion_tags)) {
            emotionArray = item.emotion_tags.map((t) => t.toLowerCase())
        }

        const matchesSearch =
            title.includes(search) ||
            desc.includes(search) ||
            content.includes(search) ||
            author.includes(search) ||
            emotionArray.some((t) => t.includes(search))

        const matchesFilter =
            filter === "all" || (item.category || "").toLowerCase() === filter.toLowerCase()

        return matchesSearch && matchesFilter
    })

    return (
        <div className="w-full min-h-screen p-6 flex flex-col items-center 
            bg-gradient-to-br from-black via-amber-950/40 to-orange-950/30">

            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-7xl mt-20 text-center"
            >
                <h1 className="text-5xl sm:text-6xl font-bold mb-4">
                    <span className="text-transparent bg-clip-text 
                        bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400">
                        Empath Stories
                    </span>
                </h1>
                <p className="text-amber-200 max-w-2xl mx-auto text-lg">
                    A safe space for sharing experiences, finding connection, and healing together.
                </p>
            </motion.div>

            {/* SEARCH BAR */}
            <div className="w-full max-w-2xl mt-10 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-300/60" />
                <input
                    type="text"
                    placeholder="Search stories by title, author, or emotion..."
                    className="w-full pl-12 p-3 bg-amber-950/20 border border-amber-700/40 
                        text-amber-100 placeholder-amber-300/40 rounded-xl backdrop-blur-md
                        focus:ring-2 focus:ring-orange-500/40 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* FILTER CHIPS */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-3 mt-6"
            >
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-md transition 
                            ${filter === cat
                                ? "bg-orange-600 text-white border-orange-400"
                                : "bg-amber-950/20 text-amber-200 border-amber-800/40 hover:bg-orange-700/30"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* CONTENT GRID */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center items-center w-full"
            >
                {filteredData.length === 0 ? (
                    <div className="w-full flex justify-center mt-16 text-amber-300">
                        No Blog Available...
                    </div>
                ) : (
                    <div className="w-[90%] mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredData.map((item) => (
                            <BlogCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
