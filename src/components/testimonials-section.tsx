import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const testimonials = [
  {
    name: "Алексей К.",
    role: "Разработчик, Москва",
    avatar: "А",
    content: "SUNVPN — лучший VPN, которым я пользовался. Скорость не падает, всё работает стабильно. Рекомендую!",
    stars: 5,
  },
  {
    name: "Мария Г.",
    role: "Фрилансер, Санкт-Петербург",
    avatar: "М",
    content: "Использую SUNVPN уже полгода. Нравится простота подключения и то, что он работает на всех моих устройствах.",
    stars: 5,
  },
  {
    name: "Дмитрий Т.",
    role: "IT-специалист",
    avatar: "Д",
    content: "Отличная скорость и надёжное шифрование. Kill Switch особенно ценю — спокойно работаю из любой точки мира.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">Отзывы</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-orbitron">
            Нам <span className="shimmer-text">доверяют</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-geist">
            Что говорят пользователи о SUNVPN
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <Card key={index} className="glow-border card-hover slide-up bg-card/50 backdrop-blur-sm" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed font-geist italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white font-orbitron">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-purple-300 font-geist">{t.name}</p>
                    <p className="text-sm text-muted-foreground font-geist">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
