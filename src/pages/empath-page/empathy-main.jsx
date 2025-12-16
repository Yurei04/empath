
"use client"
import EmpathCore from "@/components/empathy-comp/empathy-core";
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import { useState } from "react";

export default function EmpathyMain() {
    return (
        <div className="w-full min-h-screen bg-black">
            <Navbar />
            {/* EmpathCore now handles everything - no need to pass isLoading */}
            <EmpathCore />
            <Footer />
        </div>
    )
}