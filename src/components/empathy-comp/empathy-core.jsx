"use client"
import { useState } from "react"
import EmapthConversation from "./empathy-messages";
import LetterMain from "@/pages/empath-page/letter-main";
import HomepageMain from "@/pages/home-page/home-page-main";
import Image from "next/image";

export default function EmpathCore (
    isLoading
) {
    const [mode, setMode] = useState()
    const [isLetterSending, setIsLetterSending] = useState(false);
    const [isHomeScreen, setIsMainMenu] = useState(false)
    const [isConversation, setIsConversation] = useState(false)
    const [isMiniGame, setIsMiniGame] = useState(false)


    if(isLoading) {
        return (
            <div className="flex flex-col justify-center items-center">
                <Image 
                    src={"/"}
                    height={"32"}
                    width={"32"}
                    alt="Emapth Logo Img"
                    className=""
                />
            </div>
        )
    }
    


    //Border Colors testing purposes of switch screens
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="lg-w-full md-w-full h-screen m-2 p-4 border border-white overflow-hidden text-white text-center">
                {isConversation ? (
                    <div className="w-full h-full flex flex-col items-center justify-center border border-white">
                        <EmapthConversation />
                    </div>    
                ) : isLetterSending ? (
                    <div className="w-full h-full flex flex-col items-center justify-center border border-red">
                        <LetterMain />
                    </div>
                ) : isHomeScreen ? (
                    <div className="w-full h-full flex flex-col items-center justify-center border border-blue">
                        <HomepageMain />
                    </div>
                ) : isMiniGame ?(
                    <div className="w-full h-full flex flex-col items-center justify-center border border-yellow">
                        
                    </div>        
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border border-amber-500">
                        System Error Loading ....
                    </div>
                )}
            </div>
        </div>
    )
}