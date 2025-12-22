import { User, Calendar, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ProfileCard({ user }) {
  return (
    <Card className="bg-gradient-to-br from-amber-950/40 via-orange-950/40 to-slate-950/40 backdrop-blur-xl border border-amber-500/20">
      <CardContent className="p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-amber-200 mb-1 truncate px-2">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous'}
          </h3>
          <p className="text-xs sm:text-sm text-orange-300/60 truncate px-2">{user?.email}</p>
        </div>

        <div className="space-y-3 sm:space-y-4 border-t border-orange-500/20 pt-4 sm:pt-6">
          <div className="flex items-center gap-3 text-orange-200">
            <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-orange-300/60">Member since</p>
              <p className="text-sm truncate">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-orange-200">
            <Heart className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-orange-300/60">Role</p>
              <p className="text-sm truncate">Story Contributor</p>
            </div>
          </div>
        </div>

        <Button className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm sm:text-base">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}