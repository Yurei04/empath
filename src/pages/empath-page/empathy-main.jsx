"use client"
import EmpathCore from "@/components/empathy-comp/empathy-core";
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import { useState } from "react";

export default function EmpathyMain (

) {
    const [isLoading, setIsLoading] = useState(false);
    const [slowLoading, setSlowLoading] = useState(false);

    if (slowLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-purple-300">
                <div className="animate-pulse">
                    <p>Website Loading…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-black">
            <Navbar />
            <EmpathCore 
                isLoading={isLoading}
            />
            <Footer />
        </div>
    )
}