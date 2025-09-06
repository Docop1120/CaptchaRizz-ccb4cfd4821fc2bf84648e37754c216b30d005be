import { Home, Users, Play, Download, Copy, Check } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { NavBar } from "@/components/ui/tubelight-navbar"
import { GradientText } from "@/components/ui/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Waves } from "@/components/ui/waves-background"
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from "@/components/ui/code-block"
import { WaitlistDemo } from "@/components/ui/waitlist-demo"
import { useState, useRef, useEffect } from 'react'
import CaptchaImage from "@/components/captcha/CaptchaImage"
export default function HomePage() {
  const [copied, setCopied] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [captchaSuccess, setCaptchaSuccess] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [failCount, setFailCount] = useState(0);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [boomerAlert, setBoomerAlert] = useState(false);
  const boomerAudioRef = useRef<HTMLAudioElement>(null);
  const [, setLocation] = useLocation();

  // Show welcome popup, then redirect to login when captchaSuccess is true
  useEffect(() => {
    if (captchaSuccess) {
      setShowWelcome(true);
      const timeout = setTimeout(() => {
        setShowWelcome(false);
        setDemoOpen(false);
        setCaptchaSuccess(false);
        setLocation('/login');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [captchaSuccess, setLocation]);

  // Play boomer alert audio when boomerAlert is shown
  useEffect(() => {
    if (boomerAlert && boomerAudioRef.current) {
      boomerAudioRef.current.currentTime = 0;
      boomerAudioRef.current.play();
    }
  }, [boomerAlert]);

  const navItems = [
    { name: 'Home', url: '#hero', icon: Home },
    { name: 'How it Works', url: '#how-it-works', icon: Play },
    { name: 'Waitlist', url: '#waitlist', icon: Users },
    { name: 'Install', url: '#install', icon: Download }
  ];

  const installCode = `npm install captcha-rizz

// Initialize CaptchaRizz
import { CaptchaRizz } from 'captcha-rizz';

const captcha = new CaptchaRizz({
  apiKey: 'your-api-key',
  theme: 'dark',
  difficulty: 'medium'
});

// Verify user
captcha.verify().then(result => {
  if (result.success) {
    console.log('Human verified! 🎉');
  } else {
    console.log('Bot detected! 🤖');
  }
});`

  const handleCopy = () => {
    navigator.clipboard.writeText(installCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section with Gradient Background */}
      <div id="hero" className="min-h-screen bg-gradient-to-br from-ink via-[#1a1a3a] to-ink relative">
        {/* Neural Network Background for Hero only */}
        <div className="absolute inset-0 -z-10 opacity-30">
          {/* Simplified neural network background */}
          <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/10 via-vivid-violet/5 to-plasma-blue/10 animate-pulse" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(75, 15, 255, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(42, 179, 255, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, rgba(122, 44, 255, 0.05) 0%, transparent 50%)`
          }} />
        </div>
        
        {/* Navigation */}
        <div className="fixed top-3 left-3 md:top-6 md:left-6 z-50">
          <button 
            onClick={() => {
              document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center gap-2 cursor-pointer bg-white/10 backdrop-blur-sm rounded-xl p-2 hover:bg-white/20 transition-all duration-200 touch-manipulation"
          >
            <img 
              src="/attached_assets/CAPTCHARIZZ_1757079876773.png"
              alt="CaptchaRizz"
              className="w-8 h-8 md:w-10 md:h-10 hover:scale-105 transition-transform duration-200"
            />
          </button>
        </div>
        <NavBar items={navItems} />

        {/* Hero Content */}
        <main className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
          {/* Hero Title */}
          <div className="text-center max-w-6xl mx-auto mb-6 sm:mb-8" data-testid="hero-title">
            <h1 className="display-font text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
              <GradientText
                colors={["#4B0FFF", "#7A2CFF", "#2AB3FF", "#4B0FFF"]}
                animationSpeed={6}
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2"
              >
                Humans only.
              </GradientText>
              <div className="text-foreground/90 mt-2">
                Bots can bounce.
              </div>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body px-2">
              CaptchaRizz is an AI-powered vibe check that replaces clunky CAPTCHAs with culture-savvy prompts. Fast, fun, and hard to spoof.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none px-4 sm:px-0 justify-center items-center" data-testid="hero-cta">
            <Button 
              size="lg" 
              className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg touch-manipulation"
              data-testid="button-try-demo"
              onClick={() => setDemoOpen(true)}
            >
              <span className="relative z-10 tracking-wide">Try the demo</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto glass-card hover:bg-white/5 text-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-primary/30 touch-manipulation"
              data-testid="button-install"
            >
              <span className="tracking-wide">Install on your site</span>
            </Button>
          </div>

          {/* Modal for demo */}
          {demoOpen && !boomerAlert && !showWelcome && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 relative w-full max-w-sm flex flex-col items-center">
                <button
                  className="absolute top-3 right-3 text-gray-500 text-2xl font-bold hover:text-gray-700"
                  onClick={() => {
                    setDemoOpen(false);
                    setCaptchaSuccess(false);
                  }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex justify-center items-center w-full">
                  <CaptchaImage
                    key={captchaKey}
                    onSuccess={() => {
                      setCaptchaSuccess(true);
                      setFailCount(0); // reset on success
                    }}
                    onFail={() => {
                      const newCount = failCount + 1;
                      setFailCount(newCount);
                      setCaptchaKey(prev => prev + 1); // force re-mount (refresh) captcha
                      if (newCount >= 3) {
                        setBoomerAlert(true);
                        setTimeout(() => {
                          setDemoOpen(false);
                          setFailCount(0);
                          setBoomerAlert(false);
                        }, 3000);
                      }
                    }}
                  />
                </div>
                {captchaSuccess && (
                  <div className="mt-4 text-green-600 font-semibold text-lg">
                    Success!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Welcome Humans Popup */}
          {showWelcome && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full relative">
                <div className="text-green-600 font-extrabold text-3xl animate-bounce mb-2 text-center">
                  Welcome humans!
                </div>
              </div>
            </div>
          )}

          {/* Boomer Alert Popup */}
          {boomerAlert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center max-w-lg w-full relative">
                <div className="text-red-600 font-extrabold text-3xl animate-bounce mb-2 text-center">
                  Boomer alert!
                </div>
                <audio ref={boomerAudioRef} src="/attached_assets/WhatsApp%20Audio%202025-09-06%20at%2006.15.23_5a409032.mp3" preload="auto" />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Content Sections with Black Background */}
      <div className="bg-black">
        {/* How It Works Section */}
        <div id="how-it-works" className="relative w-full max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6 md:px-8" data-testid="how-it-works">
          <Waves 
            lineColor="rgba(75, 15, 255, 0.15)"
            backgroundColor="black"
            waveSpeedX={0.01}
            waveSpeedY={0.008}
            waveAmpX={25}
            waveAmpY={15}
            friction={0.92}
            tension={0.008}
            maxCursorMove={80}
            xGap={15}
            yGap={35}
            className="animate-wave-pulse"
          />
          <div className="relative z-10 text-center mb-8 sm:mb-12">
            <h2 className="display-font text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">How it works</h2>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Step 1 */}
            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="step-1">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="display-font text-xl font-semibold text-foreground mb-3">Enter the gate</h3>
                <p className="text-muted-foreground">You hit a page and need to prove you're real.</p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="step-2">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="display-font text-xl font-semibold text-foreground mb-3">Pass the vibe check</h3>
                <p className="text-muted-foreground">Answer a quick human-only prompt (slang, meme logic, or tiny expression task).</p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="step-3">
              <CardContent className="p-6 sm:p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-xl mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="display-font text-xl font-semibold text-foreground mb-3">You're in</h3>
                <p className="text-muted-foreground">Welcome, human. Bots get blocked.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-12 sm:py-16 px-4 sm:px-0">
          <WaitlistDemo />
        </section>

        {/* Team Section */}
        <div className="relative w-full max-w-6xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6 md:px-8" data-testid="team">
          <Waves 
            lineColor="rgba(42, 179, 255, 0.12)"
            backgroundColor="black"
            waveSpeedX={0.008}
            waveSpeedY={0.012}
            waveAmpX={30}
            waveAmpY={20}
            friction={0.88}
            tension={0.012}
            maxCursorMove={120}
            xGap={12}
            yGap={40}
            className="animate-wave-pulse"
          />
          <div className="relative z-10 text-center mb-8 sm:mb-12">
            <h2 className="display-font text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">Meet the Team</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">The humans behind the human verification</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="team-euan">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
                  <span className="text-white text-2xl font-bold">EF</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Euan Fraser</h3>
                <p className="text-sm text-muted-foreground mb-2">Frontend & Integration</p>
                <p className="text-xs text-muted-foreground/80">Building seamless user experiences and connecting all the pieces</p>
              </CardContent>
            </Card>

            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="team-ming">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
                  <span className="text-white text-2xl font-bold">MC</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Ming Xuan Chong</h3>
                <p className="text-sm text-muted-foreground mb-2">Backend & Database</p>
                <p className="text-xs text-muted-foreground/80">Architecting robust systems and data infrastructure</p>
              </CardContent>
            </Card>

            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="team-mo">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-primary rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
                  <span className="text-white text-2xl font-bold">MA</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Mo Alizadeh</h3>
                <p className="text-sm text-muted-foreground mb-2">Marketing & UI</p>
                <p className="text-xs text-muted-foreground/80">Crafting compelling experiences and spreading the word</p>
              </CardContent>
            </Card>

            <Card className="glass-card group hover:bg-white/5 transition-all duration-300 transform hover:scale-105" data-testid="team-keith">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full mb-4 mx-auto flex items-center justify-center overflow-hidden">
                  <span className="text-white text-2xl font-bold">KA</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Keith Arputham</h3>
                <p className="text-sm text-muted-foreground mb-2">Backend Developer</p>
                <p className="text-xs text-muted-foreground/80">Building powerful server-side logic and APIs</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why CaptchaRizz Section */}
        <div className="w-full max-w-4xl mx-auto text-center mb-12 sm:mb-16 px-4 sm:px-6 md:px-8" data-testid="why-captcharizz">
          <h2 className="display-font text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">Why CaptchaRizz?</h2>
          
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground px-2">
            <p>Because traffic-light CAPTCHAs are so 2005.</p>
            <p>Bots don't know Gen Z slang. <GradientText className="inline font-semibold" colors={["#4B0FFF", "#7A2CFF", "#2AB3FF"]}>That's the firewall.</GradientText></p>
            <p>Smarter than CAPTCHA, funnier than 2FA.</p>
            <p>Privacy-first. No biometric storage; on-device checks where possible.</p>
          </div>
        </div>

        {/* Installation Code Section */}
        <div className="w-full max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6 md:px-8" data-testid="installation-code">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="display-font text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Get started in seconds</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">Copy the code below to integrate CaptchaRizz into your project</p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <CodeBlock>
                <CodeBlockGroup className="border-border border-b px-3 sm:px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-medium">
                      JavaScript
                    </div>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Installation & Setup
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 touch-manipulation"
                    onClick={handleCopy}
                    data-testid="button-copy-code"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </CodeBlockGroup>
                <CodeBlockCode code={installCode} language="javascript" theme="github-dark" />
              </CodeBlock>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="w-full max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6 md:px-8" data-testid="social-proof">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="display-font text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">What people are saying</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="glass-card" data-testid="testimonial-1">
              <CardContent className="p-5 sm:p-6">
                <p className="text-foreground/90 mb-4">"First time I wanted to take a CAPTCHA."</p>
                <p className="text-sm text-muted-foreground">@realuserlol</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card" data-testid="testimonial-2">
              <CardContent className="p-5 sm:p-6">
                <p className="text-foreground/90 mb-4">"Failed the first rizz check... humbling."</p>
                <p className="text-sm text-muted-foreground">@techbro</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div id="install" className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 pb-12 sm:pb-16" data-testid="final-cta">
          <h2 className="display-font text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Experience the future of <GradientText className="inline" colors={["#4B0FFF", "#7A2CFF", "#2AB3FF"]}>security</GradientText>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">AI-powered CAPTCHA that understands human culture.</p>
          
          <a href="/login">
            <Button 
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-semibold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl touch-manipulation"
              data-testid="button-get-started"
            >
              <span className="relative z-10 tracking-wide">Get Started</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 sm:py-8 px-4 border-t border-white/10 bg-black" data-testid="footer">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            © 2025 CaptchaRizz<br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            <a href="https://www.instagram.com/captcharizz/" className="hover:text-primary transition-colors ml-1 touch-manipulation" data-testid="link-instagram">Instagram</a> | 
            <a href="https://www.tiktok.com/@captcharizz?lang=en" className="hover:text-primary transition-colors ml-1 touch-manipulation" data-testid="link-tiktok">TikTok</a> | 
            <a href="https://www.linkedin.com/company/captcharizz/?viewAsMember=true" className="hover:text-primary transition-colors ml-1 touch-manipulation" data-testid="link-linkedin">LinkedIn</a><br className="sm:hidden" />
            <span className="hidden sm:inline"> | </span>
            <a href="#" className="hover:text-primary transition-colors ml-1 touch-manipulation" data-testid="link-contact">Contact</a> | 
            <a href="#" className="hover:text-primary transition-colors ml-1 touch-manipulation" data-testid="link-privacy">Privacy</a> | 
            <a href="#" className="hover:text-primary transition-colors ml-1 touch-manipulation" data-testid="link-terms">Terms</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
