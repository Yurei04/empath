"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Heart } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"

export default function BlogCard({ item }) {
  return (
    <Dialog>
      <DialogTrigger className="flex justify-start items-start text-start">
        <Card className="group relative bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-black backdrop-blur-xl border border-amber-500/20 hover:border-orange-400/60 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/20">
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-orange-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardContent className="relative p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">

                {/* Category */}
                {item.category && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent mb-3 group-hover:from-yellow-200 group-hover:to-orange-300 transition-all duration-300 line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-amber-100/80 text-sm leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                )}

                {/* Emotion Tags */}
                {item.emotion_tags && item.emotion_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.emotion_tags.map((emotion, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-orange-400/30 text-orange-300 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-orange-500/10"
                      >
                        <Heart className="w-3 h-3" />
                        {emotion}
                      </span>
                    ))}
                  </div>
                )}

                {/* Info */}
                <div className="bg-black/30 rounded-lg p-3 border border-orange-500/10 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-100/70">
                      <span className="text-orange-400 font-medium">By:</span> {item.author}
                    </span>
                    <span className="text-amber-100/70 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* FULL VIEW */}
      <DialogContent className="w-screen h-screen max-w-none p-0 rounded-none flex p-2 bg-amber-900">
        <DialogTitle className="sr-only">{item.title}</DialogTitle>

        <Card className="w-full h-full relative bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-black backdrop-blur-xl border border-amber-500/20 overflow-hidden shadow-2xl shadow-orange-500/20">
          
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-orange-500/5 to-yellow-500/0 opacity-50" />

          <CardContent className="relative p-8 w-full h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto">

              {/* Category */}
              {item.category && (
                <div className="mb-3">
                  <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent mb-6">
                {item.title}
              </h2>

              {/* Emotion Tags */}
              {item.emotion_tags && item.emotion_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.emotion_tags.map((emotion, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-orange-400/30 text-orange-300 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg shadow-orange-500/10"
                    >
                      <Heart className="w-4 h-4" />
                      {emotion}
                    </span>
                  ))}
                </div>
              )}

              {/* Info */}
              <div className="bg-black/30 rounded-lg p-4 border border-orange-500/10 mb-8">
                <div className="flex items-center justify-between text-base">
                  <span className="text-amber-100/80">
                    <span className="text-orange-400 font-medium">Written by:</span> {item.author}
                  </span>
                  <span className="text-amber-100/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Content */}
              {item.content && (
                <div className="space-y-6 text-amber-100/90 text-base leading-relaxed">
                  {item.content
                    .split("\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
