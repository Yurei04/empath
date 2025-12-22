import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MailCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LetterBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch random letter from Supabase
  const fetchRandomLetter = async () => {
    setIsLoading(true);
    try {
      // Fetch all letters from Supabase
      const { data, error } = await supabase
        .from("letters")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.log("supabase error: ", error);
        throw error;
      }
      
      // Check if we have any letters
      if (!data || data.length === 0) {
        setCurrentLetter({
          title: "No Letters Available",
          author: "System",
          letter: "There are no letters in the database yet. Check back later!"
        });
        setIsOpen(true);
        return;
      }

      // Pick a random letter from the array
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomLetter = data[randomIndex];

      setCurrentLetter({
        title: randomLetter.title,
        author: randomLetter.author,
        letter: randomLetter.letter
      });
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching letter:', error);
      // Fallback letter in case of error
      setCurrentLetter({
        title: "Connection Issue",
        author: "System",
        letter: "We couldn't fetch a letter at this moment. Please try again later."
      });
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={fetchRandomLetter}
        disabled={isLoading}
        className="bg-gray-900 cursor-pointer border border-yellow-600 text-yellow-400 rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-amber-800 hover:border-yellow-500/50 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Read a letter"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <MailCheck />
        )}
      </button>

      {/* Alert Dialog */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-gray-900 border-2 border-yellow-600/30 text-yellow-50 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
              A Letter for You
            </AlertDialogTitle>
            <AlertDialogDescription className="text-yellow-600/70">
              Someone shared their story. Perhaps it will resonate with you.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Letter Content */}
          {currentLetter ? (
            <div className="max-h-[60vh] overflow-y-auto py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-1">
                    {currentLetter.title}
                  </h3>
                  <p className="text-sm text-yellow-600/70">
                    From: {currentLetter.author}
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-yellow-600/30 rounded-lg p-4">
                  <p className="text-yellow-50 leading-relaxed whitespace-pre-wrap">
                    {currentLetter.letter}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end mt-4">
            <AlertDialogAction className="bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 font-semibold rounded-lg px-6 py-2 hover:from-orange-700 hover:to-yellow-600 transition-all">
              Close
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}