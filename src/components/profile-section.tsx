import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface User {
  id: number
  email: string
  username: string
}

interface Subscription {
  active: boolean
  plan: string | null
  expires_at: string | null
  days_left: number | null
}

interface ProfileSectionProps {
  user: User
  onNavigate: (section: string) => void
}

export function ProfileSection({ user, onNavigate }: ProfileSectionProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("sunvpn_token")
        const res = await fetch("/api/profile/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setSubscription(data)
        } else {
          setSubscription({ active: false, plan: null, expires_at: null, days_left: null })
        }
      } catch {
        setSubscription({ active: false, plan: null, expires_at: null, days_left: null })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id])

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric", month: "long", year: "numeric"
    })
  }

  const getDaysColor = (days: number) => {
    if (days > 30) return "text-green-400"
    if (days > 7) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <section id="profile" className="min-h-screen py-24 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-3">Личный кабинет</Badge>
          <h1 className="text-4xl font-bold font-orbitron shimmer-text">
            Привет, {user.username}!
          </h1>
        </div>

        <div className="grid gap-6">
          {/* Profile card */}
          <Card className="glow-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-orbitron text-lg flex items-center gap-2 text-foreground">
                <Icon name="User" size={20} className="text-purple-400" />
                Профиль
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white font-orbitron">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-geist font-semibold text-foreground text-lg">{user.username}</div>
                  <div className="font-geist text-muted-foreground">{user.email}</div>
                  <div className="font-space-mono text-xs text-purple-400/60 mt-1">ID: {user.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription card */}
          <Card className={`glow-border bg-card/50 backdrop-blur-sm ${loading ? "animate-pulse" : ""}`}>
            <CardHeader>
              <CardTitle className="font-orbitron text-lg flex items-center gap-2 text-foreground">
                <Icon name="Shield" size={20} className="text-purple-400" />
                Подписка
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 bg-purple-500/10 rounded w-1/2" />
                  <div className="h-4 bg-purple-500/10 rounded w-1/3" />
                </div>
              ) : subscription?.active ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)] animate-pulse" />
                    <span className="font-geist font-semibold text-green-400 text-lg">Активна</span>
                    <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20 ml-auto">
                      {subscription.plan}
                    </Badge>
                  </div>

                  {subscription.days_left !== null && (
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground font-geist">Осталось дней</span>
                        <span className={`font-orbitron text-2xl font-bold ${getDaysColor(subscription.days_left)}`}>
                          {subscription.days_left}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-purple-500/10 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all duration-1000"
                          style={{ width: `${Math.min((subscription.days_left / 365) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {subscription.expires_at && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-geist">
                      <Icon name="Calendar" size={14} className="text-purple-400" />
                      Истекает: {formatDate(subscription.expires_at)}
                    </div>
                  )}

                  <Button
                    className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 hover:from-purple-600/30 hover:to-violet-600/30 border border-purple-500/30 text-purple-300 hover:text-white font-geist w-full"
                    onClick={() => onNavigate("services")}
                  >
                    <Icon name="RefreshCw" size={15} className="mr-2" />
                    Продлить подписку
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name="ShieldOff" size={28} className="text-red-400" />
                  </div>
                  <div className="font-geist font-semibold text-foreground mb-1">Подписка не активна</div>
                  <div className="text-sm text-muted-foreground font-geist mb-5">
                    Подключите VPN-подписку для защиты вашего трафика
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 font-geist glow-purple"
                    onClick={() => onNavigate("services")}
                  >
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    Купить подписку
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "Shield", label: "Тарифы", section: "services" },
              { icon: "Newspaper", label: "Новости", section: "news" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.section)}
                className="flex items-center gap-3 p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/40 transition-all font-geist text-foreground/80 hover:text-foreground card-hover"
              >
                <Icon name={item.icon as "Shield"} size={20} className="text-purple-400" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
