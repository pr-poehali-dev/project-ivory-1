import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (user: { id: number; email: string; username: string }, token: string) => void
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const AUTH_URL = "https://functions.poehali.dev/272e69a6-8256-4b7f-a305-df28788ea5eb"
      const path = mode === "login" ? "/login" : "/register"
      const bodyData = mode === "login"
        ? { email, password }
        : { email, password, username }

      const res = await fetch(`${AUTH_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Произошла ошибка")
        return
      }

      localStorage.setItem("sunvpn_token", data.token)
      localStorage.setItem("sunvpn_user", JSON.stringify(data.user))
      onSuccess(data.user, data.token)
      onClose()
    } catch {
      setError("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(265_20%_8%)] border border-purple-500/20 text-foreground max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://cdn.poehali.dev/files/13335a1a-9b0e-43bc-b9fa-1b3eb3a84430.png"
              alt="SUNVPN"
              className="w-10 h-10 rounded-xl"
            />
            <DialogTitle className="font-orbitron text-xl shimmer-text">
              {mode === "login" ? "Вход в аккаунт" : "Регистрация"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-purple-500/20 mb-4">
          <button
            className={`flex-1 py-2 text-sm font-geist font-medium transition-all ${mode === "login" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => { setMode("login"); setError("") }}
          >
            Войти
          </button>
          <button
            className={`flex-1 py-2 text-sm font-geist font-medium transition-all ${mode === "register" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => { setMode("register"); setError("") }}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <Label className="text-sm text-muted-foreground font-geist">Имя пользователя</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                className="mt-1 bg-purple-500/5 border-purple-500/20 focus:border-purple-400 text-foreground"
              />
            </div>
          )}
          <div>
            <Label className="text-sm text-muted-foreground font-geist">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1 bg-purple-500/5 border-purple-500/20 focus:border-purple-400 text-foreground"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground font-geist">Пароль</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="mt-1 bg-purple-500/5 border-purple-500/20 focus:border-purple-400 text-foreground"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm font-geist bg-red-500/10 rounded-lg p-3">
              <Icon name="AlertCircle" size={15} />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 font-geist font-semibold py-5 rounded-xl glow-purple"
          >
            {loading ? (
              <Icon name="Loader2" size={18} className="animate-spin mr-2" />
            ) : (
              <Icon name="LogIn" size={18} className="mr-2" />
            )}
            {mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}