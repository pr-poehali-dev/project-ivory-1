import { useState, useEffect } from "react"
import { Hero3DWebGL as Hero3D } from "@/components/hero-webgl"
import { FeaturesSection } from "@/components/features-section"
import { ServicesSection } from "@/components/services-section"
import { NewsSection } from "@/components/news-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileSection } from "@/components/profile-section"
import { AuthModal } from "@/components/auth-modal"

interface User {
  id: number
  email: string
  username: string
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null)
  const [activeSection, setActiveSection] = useState("home")
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("sunvpn_user")
    const token = localStorage.getItem("sunvpn_token")
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("sunvpn_user")
        localStorage.removeItem("sunvpn_token")
      }
    }
  }, [])

  const handleLoginSuccess = (u: User, token: string) => {
    setUser(u)
    localStorage.setItem("sunvpn_user", JSON.stringify(u))
    localStorage.setItem("sunvpn_token", token)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("sunvpn_user")
    localStorage.removeItem("sunvpn_token")
    setActiveSection("home")
  }

  const handleNavigate = (section: string) => {
    if (section === "profile" && !user) {
      setAuthOpen(true)
      return
    }
    setActiveSection(section)
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setTimeout(() => {
        const el = document.getElementById(section)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }, 50)
    }
  }

  const handleBuy = (planId: string) => {
    if (!user) {
      setAuthOpen(true)
      return
    }
    console.log("Buy plan:", planId)
  }

  return (
    <div className="dark">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />
      <main>
        {activeSection === "profile" && user ? (
          <ProfileSection user={user} onNavigate={handleNavigate} />
        ) : (
          <>
            <Hero3D onNavigate={handleNavigate} />
            <FeaturesSection />
            <ServicesSection onBuy={handleBuy} />
            <TestimonialsSection />
            <NewsSection />
            <FAQSection />
            <CTASection onNavigate={handleNavigate} />
          </>
        )}
      </main>
      <Footer onNavigate={handleNavigate} />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  )
}
