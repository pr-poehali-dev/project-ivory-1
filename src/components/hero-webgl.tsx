import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface HeroProps {
  onNavigate: (section: string) => void
}

export const Hero3DWebGL = ({ onNavigate }: HeroProps) => {
  const titleWords = ["SUN", "VPN"]
  const subtitle = "Свобода в сети. Безопасность в каждом байте."
  const [visibleWords, setVisibleWords] = useState(0)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 500)
      return () => clearTimeout(timeout)
    } else {
      const t1 = setTimeout(() => setSubtitleVisible(true), 600)
      const t2 = setTimeout(() => setButtonsVisible(true), 1200)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [visibleWords, titleWords.length])

  // WebGL particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; pulse: number
    }[] = []

    const colors = [
      "rgba(168,85,247,", "rgba(139,92,246,", "rgba(196,181,253,",
      "rgba(216,180,254,", "rgba(147,51,234,",
    ]

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      })
    }

    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    canvas.addEventListener("mousemove", handleMouse)

    let t = 0
    const draw = () => {
      t += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      )
      grad.addColorStop(0, "rgba(88,28,220,0.12)")
      grad.addColorStop(0.5, "rgba(60,10,120,0.08)")
      grad.addColorStop(1, "rgba(10,4,30,0)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Orb glow
      const orbGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.5, 0,
        canvas.width / 2, canvas.height * 0.5, 280
      )
      const orbPulse = Math.sin(t * 0.8) * 0.15 + 0.35
      orbGrad.addColorStop(0, `rgba(168,85,247,${orbPulse})`)
      orbGrad.addColorStop(0.4, `rgba(139,92,246,${orbPulse * 0.4})`)
      orbGrad.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = orbGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Mouse reactive orb
      const mGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180)
      mGrad.addColorStop(0, "rgba(196,181,253,0.12)")
      mGrad.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = mGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid lines
      ctx.strokeStyle = "rgba(168,85,247,0.04)"
      ctx.lineWidth = 1
      const spacing = 60
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / 100) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.pulse += 0.02
        const sz = p.size + Math.sin(p.pulse) * 0.5
        const op = p.opacity + Math.sin(p.pulse * 1.3) * 0.15

        // Mouse attraction
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          p.vx += (dx / dist) * 0.015
          p.vy += (dy / dist) * 0.015
        }

        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.min(op, 1)})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, sz * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.min(op * 0.15, 0.15)})`
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouse)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <div id="home" className="min-h-screen relative overflow-hidden" style={{ background: "hsl(265 25% 5%)" }}>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(265_25%_5%)] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[hsl(265_25%_5%)] to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16"
        style={{ zIndex: 10 }}
      >
        {/* Logo */}
        <div
          className="mb-8 fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <img
            src="https://cdn.poehali.dev/files/13335a1a-9b0e-43bc-b9fa-1b3eb3a84430.png"
            alt="SUNVPN"
            className="w-28 h-28 rounded-3xl mx-auto"
            style={{
              boxShadow: "0 0 60px rgba(168,85,247,0.5), 0 0 120px rgba(139,92,246,0.3)",
              animation: "float 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-4">
          {titleWords.map((word, index) => (
            <div
              key={index}
              className={`font-orbitron text-6xl md:text-8xl xl:text-9xl font-black ${index < visibleWords ? "fade-in" : ""}`}
              style={{
                animationDelay: `${index * 0.2}s`,
                opacity: index < visibleWords ? undefined : 0,
                background: index === 0
                  ? "linear-gradient(135deg, #e9d5ff 0%, #a855f7 40%, #7c3aed 100%)"
                  : "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #6d28d9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(168,85,247,0.6))",
              }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div
          className={`text-lg md:text-2xl text-purple-200/80 font-geist font-medium max-w-2xl leading-relaxed mb-3 ${subtitleVisible ? "fade-in-subtitle" : ""}`}
          style={{ opacity: subtitleVisible ? undefined : 0 }}
        >
          {subtitle}
        </div>

        <div
          className={`text-sm md:text-base text-purple-300/50 font-space-mono mb-12 ${subtitleVisible ? "fade-in-subtitle" : ""}`}
          style={{ opacity: subtitleVisible ? undefined : 0, animationDelay: "0.3s" }}
        >
          🌍 50+ серверов &nbsp;•&nbsp; 🔒 AES-256 шифрование &nbsp;•&nbsp; ⚡ Безлимитный трафик
        </div>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 items-center ${buttonsVisible ? "fade-in" : ""}`}
          style={{ opacity: buttonsVisible ? undefined : 0 }}
        >
          <Button
            size="lg"
            onClick={() => onNavigate("services")}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 text-lg px-10 py-6 font-geist font-semibold rounded-2xl glow-purple transition-all duration-300 hover:scale-105"
          >
            <Icon name="Shield" size={20} className="mr-2" />
            Выбрать тариф
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate("news")}
            className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 bg-transparent text-lg px-10 py-6 font-geist rounded-2xl transition-all duration-300"
          >
            Узнать больше
          </Button>
        </div>

        {/* Stats row */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 max-w-lg ${buttonsVisible ? "fade-in" : ""}`}
          style={{ opacity: buttonsVisible ? undefined : 0, animationDelay: "0.4s" }}
        >
          {[
            { val: "50+", label: "Серверов" },
            { val: "10K+", label: "Пользователей" },
            { val: "99.9%", label: "Uptime" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-orbitron text-2xl font-bold shimmer-text">{s.val}</div>
              <div className="text-sm text-purple-300/60 font-geist mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: "bounce 2s infinite", zIndex: 10 }}
        >
          <Icon name="ChevronDown" size={24} className="text-purple-400/50" />
        </div>
      </div>
    </div>
  )
}

export default Hero3DWebGL
