import { useState } from "react"
import { supabase } from "@/lib/supabase";

export default function EmpathCore (

) {
    const [mode, setMode] = useState(isHomeScreen)
    const [isLetterSending, setIsLetterSending] = useState(false);
    const [isHomeScreen, setIsMainMenu] = useState(false)
    const [isConversation, setIsConversation] = useState(false)
    const [isMiniGame, setIsMiniGame] = useState(false)


    if(isLoading) {

    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="">
                {isConversation ? (
                    <div>

                    </div>    
                ) : isLetterSending ? (
                    <div>
                    </div>
                ) : isHomeScreen ? (
                    <div>

                    </div>
                ) : isMiniGame ?(
                    <div>

                    </div>        
                ) : (
                    <div>
                        System Error Loading ....
                    </div>
                )}
            </div>
        </div>
    )
}