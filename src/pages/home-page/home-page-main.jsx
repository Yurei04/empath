import Image from "next/image";
import { useState } from "react";

export default function HomepageMain() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-950 via-orange-950/30 to-yellow-950/20 overflow-x-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {["home", "about", "initiatives"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 shadow-lg"
                  : "bg-gray-900 text-yellow-500 border border-yellow-600/30 hover:border-yellow-500/50"
              }`}
            >
              {tab === "home"
                ? "Home"
                : tab === "about"
                ? "About Empath"
                : "What We Offer"}
            </button>
          ))}
        </div>

        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 lg:gap-16 animate-fadeIn">
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  Empath
                </span>
              </h1>

              <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-medium text-yellow-200">
                A Safe Space to Be Heard
              </h2>

              <p className="mt-4 text-sm sm:text-base text-yellow-300/80">
                Empath is a mental-health focused conversational AI designed to
                listen, understand, and respond with compassion.  
                You don’t need to explain everything perfectly — just start talking.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 font-semibold rounded-lg shadow-lg">
                  Talk to Empath
                </button>
                <button className="px-8 py-3 bg-gray-900 border border-yellow-600/50 text-yellow-100 font-semibold rounded-lg">
                  How It Helps
                </button>
              </div>
            </div>

            <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-4 overflow-hidden border-yellow-600 bg-gray-900 shadow-[0_0_25px_rgba(251,191,36,0.4)] flex items-center justify-center">
              <Image 
              width={500}
              height={500}
              alt="Logo"
              src={"/images/logo.png"}
              className="w-full h-full"
              />

            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="bg-gray-900/50 border border-yellow-600/30 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-6">
                About Empath
              </h2>

              <div className="space-y-6 text-yellow-50">
                <p className="text-lg leading-relaxed">
                  Empath was created for moments when you feel overwhelmed,
                  unheard, or emotionally exhausted.  
                  Inspired by the Sumire project, it focuses on empathy over answers —
                  listening before responding.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <InfoCard
                    icon="🎯"
                    title="Purpose"
                    text="To provide a non-judgmental space where users can talk freely and feel emotionally validated."
                  />
                  <InfoCard
                    icon="🧠"
                    title="Approach"
                    text="Uses empathy-driven responses and CBT-inspired reframing to gently guide reflection."
                  />
                  <InfoCard
                    icon="🔐"
                    title="Safety"
                    text="No diagnosis. No judgment. Conversations are private and focused on emotional support."
                  />
                  <InfoCard
                    icon="🌱"
                    title="Growth"
                    text="Encourages self-awareness, grounding, and healthier thought patterns over time."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initiatives Tab */}
        {activeTab === "initiatives" && (
          <div className="max-w-5xl mx-auto animate-fadeIn">
            <div className="bg-gray-900/50 border border-yellow-600/30 rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-8">
                What Empath Offers
              </h2>

              <div className="space-y-6">
                <Feature
                  icon="💬"
                  title="Empathy-Focused Conversations"
                  text="Empath listens actively and responds with understanding, validation, and emotional awareness."
                  tag="Core"
                />
                <Feature
                  icon="🧩"
                  title="Cognitive Reframing Support"
                  text="Gently highlights negative thought patterns and offers healthier alternative perspectives."
                  tag="CBT-Inspired"
                />
                <Feature
                  icon="🚨"
                  title="Crisis-Aware Responses"
                  text="Detects distress signals and encourages reaching out to trusted people or hotlines when needed."
                  tag="Safety"
                />
                <Feature
                  icon="🛡️"
                  title="Privacy-First Design"
                  text="Anonymous by default. Your thoughts stay yours."
                  tag="Always On"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

/* Small helper components (content-only) */
function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-gray-800/50 border border-yellow-600/20 rounded-xl p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-yellow-400 mb-2">{title}</h3>
      <p className="text-yellow-100/80 text-sm">{text}</p>
    </div>
  );
}

function Feature({ icon, title, text, tag }) {
  return (
    <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-yellow-600/20 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">{title}</h3>
          <p className="text-yellow-50/80 mb-3">{text}</p>
          <span className="inline-block bg-orange-600/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}
