import { Github, Mail, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-gray-950 via-orange-950/40 to-black border-t border-yellow-800/40 text-yellow-200 px-6 py-12">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        
        {/* Brand / Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 max-w-md">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400">
            Empath
          </h2>

          <p className="text-sm text-yellow-300/80 leading-relaxed">
            A safe, non-judgmental space powered by empathy-focused AI.
            Built to listen, understand, and support emotional well-being —
            anytime you need someone to talk to.
          </p>

          <div className="flex gap-4 mt-2">
            <a href="" aria-label="Email">
              <Mail className="h-5 w-5 text-yellow-300 hover:text-orange-400 transition-colors" />
            </a>
            <a href="" aria-label="GitHub">
              <Github className="h-5 w-5 text-yellow-300 hover:text-orange-400 transition-colors" />
            </a>
            <a href="" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-yellow-300 hover:text-orange-400 transition-colors" />
            </a>
            <a href="" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-yellow-300 hover:text-orange-400 transition-colors" />
            </a>
          </div>
        </div>

        {/* Contact / Feedback */}
        <div className="w-full md:w-auto flex flex-col items-center md:items-end text-center md:text-right space-y-3">
          <p className="text-sm text-yellow-300/80">
            Want to share feedback or reach out?
          </p>

          <form className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full sm:w-64 px-3 py-2 rounded-lg bg-black/40 border border-yellow-700/50 text-sm text-yellow-100 placeholder-yellow-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-gray-950 text-sm rounded-lg transition-colors"
            >
              Contact Empath
            </button>
          </form>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-10 text-center text-xs text-yellow-500/70 max-w-3xl mx-auto">
        © {new Date().getFullYear()} Empath.  
        Empath is not a replacement for professional mental health care.
      </div>
    </footer>
  )
}
