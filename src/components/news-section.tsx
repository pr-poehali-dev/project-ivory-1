import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

interface NewsItem {
  id: number
  title: string
  content: string
  created_at: string
  author: string
}

const FUNC_URL = "/api/news"

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "SUNVPN запускает новые серверы в Азии",
    content: "Мы расширяем нашу сеть! Теперь доступны сервера в Японии, Южной Корее и Сингапуре. Подключайтесь с минимальной задержкой из любой точки Азии.",
    created_at: "2025-05-20T10:00:00Z",
    author: "Команда SUNVPN",
  },
  {
    id: 2,
    title: "Обновление протокола безопасности WireGuard",
    content: "Мы внедрили последнюю версию протокола WireGuard. Скорость соединения выросла до 40%, а надёжность шифрования достигла нового уровня.",
    created_at: "2025-05-15T14:30:00Z",
    author: "Команда SUNVPN",
  },
  {
    id: 3,
    title: "Акция: скидка 20% на тариф 12 месяцев",
    content: "До конца мая действует специальное предложение — скидка 20% на годовую подписку. Успейте воспользоваться выгодным предложением!",
    created_at: "2025-05-10T09:00:00Z",
    author: "Команда SUNVPN",
  },
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(FUNC_URL)
        if (res.ok) {
          const data = await res.json()
          setNews(data.news || mockNews)
        } else {
          setNews(mockNews)
        }
      } catch {
        setNews(mockNews)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="news" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">Новости</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-orbitron">
            Последние <span className="shimmer-text">обновления</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Следите за новостями SUNVPN — мы постоянно развиваемся
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-purple-500/20 bg-card p-6 animate-pulse">
                <div className="h-4 bg-purple-500/10 rounded mb-3 w-3/4" />
                <div className="h-3 bg-purple-500/10 rounded mb-2 w-full" />
                <div className="h-3 bg-purple-500/10 rounded mb-2 w-5/6" />
                <div className="h-3 bg-purple-500/10 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-geist">
            <Icon name="Newspaper" size={48} className="mx-auto mb-4 text-purple-500/30" />
            <p>Новостей пока нет. Заходите позже!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <Card
                key={item.id}
                className="glow-border card-hover bg-card/50 backdrop-blur-sm slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                      Новость
                    </Badge>
                    <span className="text-xs text-muted-foreground font-space-mono">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <h3 className="font-geist font-bold text-foreground text-lg leading-tight">
                    {item.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-geist text-sm leading-relaxed line-clamp-4">
                    {item.content}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-purple-400/60 font-geist">
                    <Icon name="User" size={12} />
                    {item.author}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
