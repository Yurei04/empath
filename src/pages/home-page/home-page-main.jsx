import { useState } from "react";

export default function HomepageMain() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-950 via-orange-950/30 to-yellow-950/20 overflow-x-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-12">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "home"
                ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 shadow-lg"
                : "bg-gray-900 text-yellow-500 border border-yellow-600/30 hover:border-yellow-500/50"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "about"
                ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 shadow-lg"
                : "bg-gray-900 text-yellow-500 border border-yellow-600/30 hover:border-yellow-500/50"
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => setActiveTab("initiatives")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === "initiatives"
                ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 shadow-lg"
                : "bg-gray-900 text-yellow-500 border border-yellow-600/30 hover:border-yellow-500/50"
            }`}
          >
            Initiatives
          </button>
        </div>

        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 lg:gap-16 animate-fadeIn">
            {/* Text Section */}
            <div className="max-w-2xl text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  Empath
                </span>
              </h1>

              <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-medium text-yellow-200">
                The Path To Take is Always the Longest
              </h2>

              <p className="mt-3 text-sm sm:text-base text-yellow-300/80">
                Come and Talk, Connect and Perceive, All of us are not Alone.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-yellow-500 text-gray-950 font-semibold rounded-lg hover:from-orange-700 hover:to-yellow-600 transition-all shadow-lg">
                  Empathy AI
                </button>
                <button className="px-8 py-3 bg-gray-900 border border-yellow-600/50 text-yellow-100 font-semibold rounded-lg hover:bg-gray-800 hover:border-yellow-500 transition-all">
                  Learn More
                </button>
              </div>
            </div>

            {/* Logo Section */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-4 border-yellow-600 bg-gray-900 shadow-[0_0_25px_rgba(251,191,36,0.4)] overflow-hidden flex items-center justify-center">
              <span className="text-8xl">🤝</span>
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
                  Empath is more than just a platform—it's a sanctuary for emotional well-being and human connection. 
                  We believe that everyone deserves a safe space to express their feelings, seek support, and find understanding.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-gray-800/50 border border-yellow-600/20 rounded-xl p-6">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">Our Mission</h3>
                    <p className="text-yellow-100/80 text-sm">
                      To provide accessible, compassionate support for mental health and emotional wellness through AI-powered conversations.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-yellow-600/20 rounded-xl p-6">
                    <div className="text-4xl mb-3">👁️</div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">Our Vision</h3>
                    <p className="text-yellow-100/80 text-sm">
                      A world where mental health support is available to everyone, anytime, breaking down barriers to care.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-yellow-600/20 rounded-xl p-6">
                    <div className="text-4xl mb-3">💡</div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">Our Values</h3>
                    <p className="text-yellow-100/80 text-sm">
                      Empathy, privacy, accessibility, and continuous improvement drive everything we do.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-yellow-600/20 rounded-xl p-6">
                    <div className="text-4xl mb-3">🌟</div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">Our Impact</h3>
                    <p className="text-yellow-100/80 text-sm">
                      Helping thousands find comfort, understanding, and the courage to seek help when they need it most.
                    </p>
                  </div>
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
                Our Initiatives
              </h2>
              
              <div className="space-y-8">
                {/* Initiative 1 */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">🤖</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">AI-Powered Support</h3>
                      <p className="text-yellow-50/80 mb-3">
                        Our advanced AI companion provides 24/7 emotional support, active listening, and personalized responses 
                        to help you navigate difficult moments.
                      </p>
                      <span className="inline-block bg-orange-600/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Initiative 2 */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">📚</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">Mental Health Education</h3>
                      <p className="text-yellow-50/80 mb-3">
                        Free resources, articles, and workshops on mental health awareness, coping strategies, 
                        and self-care practices for communities worldwide.
                      </p>
                      <span className="inline-block bg-yellow-600/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                        Ongoing
                      </span>
                    </div>
                  </div>
                </div>

                {/* Initiative 3 */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">🌍</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">Community Outreach Program</h3>
                      <p className="text-yellow-50/80 mb-3">
                        Partnering with schools, workplaces, and organizations to provide mental health support 
                        and reduce stigma around seeking help.
                      </p>
                      <span className="inline-block bg-green-600/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                        Expanding
                      </span>
                    </div>
                  </div>
                </div>

                {/* Initiative 4 */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">🔒</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">Privacy-First Approach</h3>
                      <p className="text-yellow-50/80 mb-3">
                        Complete anonymity and end-to-end encryption ensure your conversations remain private and secure. 
                        Your trust is our top priority.
                      </p>
                      <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                        Core Value
                      </span>
                    </div>
                  </div>
                </div>

                {/* Initiative 5 */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">🎨</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">Creative Expression Therapy</h3>
                      <p className="text-yellow-50/80 mb-3">
                        Interactive tools for journaling, art therapy, and mindfulness exercises to help express 
                        emotions in healthy, creative ways.
                      </p>
                      <span className="inline-block bg-purple-600/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
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