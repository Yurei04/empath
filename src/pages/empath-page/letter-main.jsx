"use client"

import LetterMessage from "@/components/letter-comp/letter-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";

export default function LetterMain() {
    const [letters, setLetters] = useState([])
    const [newLetter, setNewLetter] = useState("")
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const {data, error} = await supabase
            .from("letters")
            .select("*")
            .order("created_at", {ascending: false})
        
            if(error) {
                console.log("supabase error: ", error)
                return
            }
            setLetters(data || [])
        }

        fetchData()
    }, [])

    const handleSendLetter = async () => {
        if (!newLetter.trim() || !title.trim() || !author.trim()) return
        
        setIsSending(true)
        const { data, error } = await supabase
            .from("letters")
            .insert([
                { title, author, letter: newLetter }
            ])
            .select()

        if (error) {
            console.log("Error sending letter:", error)
        } else {
            setLetters([data[0], ...letters])
            setNewLetter("")
            setTitle("")
            setAuthor("")
        }
        setIsSending(false)
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-900 flex flex-col p-3 sm:p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl mx-auto mb-4 sm:mb-6 flex-shrink-0"
            >
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                    <Mail className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
                     Letters
                </h1>
                <p className="text-yellow-200/60 mt-1 sm:mt-2 text-sm sm:text-base">Share your heartfelt messages</p>
            </motion.div>

            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-3 sm:gap-6 flex-1 overflow-hidden">
                {/* Letters Display Section */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 space-y-3 sm:space-y-4">
                    {letters.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ y: -4 }}
                            className="w-full"
                        >
                            <Card className="w-full p-4 sm:p-6 shadow-2xl backdrop-blur-xl border-2 border-yellow-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900/60 transition-all duration-500 relative overflow-hidden group">
                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at center, rgba(255,215,0,0.1), transparent 60%)`,
                                    }}
                                />
                                <CardContent className="flex flex-col gap-3 sm:gap-4 p-0 relative z-10">
                                    <motion.div
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="rounded-xl border border-yellow-400/30 p-4 sm:p-6 backdrop-blur-md bg-amber-950/30"
                                    >
                                        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-yellow-200">
                                            No Letters Yet...
                                        </h2>
                                        <p className="text-yellow-300/70 mt-1 sm:mt-2 text-sm sm:text-base">
                                            Be the first to share a encouraging message!
                                        </p>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>   
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {letters.map((letter, idx) => (
                                <div key={letter.id || idx}>
                                    <LetterMessage 
                                        title={letter.title}
                                        author={letter.author}
                                        letter={letter.letter}
                                    />
                                </div>    
                            ))}
                        </div>
                    )}
                </div>

                {/* Compose Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:w-[380px] xl:w-[420px] h-screen flex-shrink-0">
                    <Card className="p-4 sm:p-6 shadow-2xl backdrop-blur-xl border-2 border-yellow-500/20 bg-gradient-to-br from-amber-950/40 to-slate-900/60">
                        <CardContent className="p-0 space-y-3 sm:space-y-4">
                            <div>
                                <label className="text-xs sm:text-sm text-yellow-300/80 mb-1.5 sm:mb-2 block">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Letter title..."
                                    className="w-full p-2.5 sm:p-3 rounded-lg bg-amber-950/30 border border-yellow-400/30 text-yellow-100 placeholder:text-yellow-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm sm:text-base"
                                />
                            </div>
                            
                            <div>
                                <label className="text-xs sm:text-sm text-yellow-300/80 mb-1.5 sm:mb-2 block">Your Name</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Anonymous"
                                    className="w-full p-2.5 sm:p-3 rounded-lg bg-amber-950/30 border border-yellow-400/30 text-yellow-100 placeholder:text-yellow-300/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label className="text-xs sm:text-sm text-yellow-300/80 mb-1.5 sm:mb-2 block">Your Message</label>
                                <Textarea 
                                    value={newLetter}
                                    onChange={(e) => setNewLetter(e.target.value)}
                                    placeholder="Write your heartfelt message here..."
                                    className="min-h-[180px] sm:min-h-[240px] bg-amber-950/30 border-yellow-400/30 text-yellow-100 placeholder:text-yellow-300/40 focus:ring-yellow-400/50 resize-none text-sm sm:text-base"
                                />
                            </div>

                            <Button 
                                onClick={handleSendLetter}
                                disabled={isSending || !newLetter.trim() || !title.trim() || !author.trim()}
                                className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-900 font-semibold py-5 sm:py-6 shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
                            >
                                <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                                {isSending ? "Sending..." : "Send Letter"}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}