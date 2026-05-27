import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const features = [
  {
    title: "AES-256 Шифрование",
    description: "Военный уровень шифрования данных. Ваш трафик защищён так же, как секреты государств.",
    icon: "Lock",
    badge: "Безопасность",
  },
  {
    title: "50+ Серверов по миру",
    description: "Сервера в Европе, Азии и США. Выбирайте локацию и получайте максимальную скорость.",
    icon: "Globe",
    badge: "Скорость",
  },
  {
    title: "Без логов",
    description: "Политика полного отсутствия журналов. Мы не храним и не передаём данные о вашей активности.",
    icon: "EyeOff",
    badge: "Приватность",
  },
  {
    title: "Все устройства",
    description: "Windows, macOS, Android, iOS. Одна подписка — защита на всех ваших устройствах.",
    icon: "Monitor",
    badge: "Multi-Device",
  },
  {
    title: "Kill Switch",
    description: "Автоматическое отключение интернета при обрыве VPN. Ваш IP никогда не окажется под угрозой.",
    icon: "Zap",
    badge: "Защита",
  },
  {
    title: "Разблокировка сайтов",
    description: "Доступ к любому контенту в интернете: стриминг, соцсети, мессенджеры — без ограничений.",
    icon: "Unlock",
    badge: "Свобода",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">Возможности</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-orbitron">
            Почему выбирают{" "}
            <span className="shimmer-text">SUNVPN</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Надёжная защита и максимальная скорость — всё, что нужно для комфортной работы в сети
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border card-hover slide-up bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/20 flex items-center justify-center">
                    <Icon name={feature.icon as "Lock"} size={22} className="text-purple-400" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground font-geist">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
