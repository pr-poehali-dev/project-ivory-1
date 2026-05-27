import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { AuthModal } from "@/components/auth-modal"
import { ProfileMenu } from "@/components/profile-menu"

interface NavbarProps {
  user: { id: number; email: string; username: string } | null
  onLogout: () => void
  onLoginSuccess: (user: { id: number; email: string; username: string }, token: string) => void
  onNavigate: (section: string) => void
  activeSection: string
}

export function Navbar({ user, onLogout, onLoginSuccess, onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "services", label: "Услуги" },
    { id: "news", label: "Новости" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer flex-shrink-0"
              onClick={() => onNavigate("home")}
            >
              <img
                src="https://cdn.poehali.dev/files/13335a1a-9b0e-43bc-b9fa-1b3eb3a84430.png"
                alt="SUNVPN"
                className="w-9 h-9 rounded-xl"
              />
              <span className="font-orbitron text-xl font-bold shimmer-text">SUNVPN</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`font-geist text-sm font-medium transition-all duration-200 relative pb-1
                    ${activeSection === link.id
                      ? "text-purple-400"
                      : "text-white/80 hover:text-purple-300"
                    }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <ProfileMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
              ) : (
                <Button
                  onClick={() => setAuthOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 font-geist glow-purple"
                >
                  <Icon name="User" size={16} className="mr-2" />
                  Войти
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {user ? (
                <ProfileMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
              ) : (
                <Button
                  size="sm"
                  onClick={() => setAuthOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0"
                >
                  Войти
                </Button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-purple-400 transition-colors duration-200 ml-2"
              >
                <Icon name={isOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-4 space-y-1 border-t border-purple-500/20">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    className={`block w-full text-left px-3 py-2 font-geist transition-colors duration-200 rounded-lg
                      ${activeSection === link.id ? "text-purple-400 bg-purple-500/10" : "text-white/80 hover:text-purple-300"}`}
                    onClick={() => { onNavigate(link.id); setIsOpen(false) }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={onLoginSuccess} />
    </>
  )
}
