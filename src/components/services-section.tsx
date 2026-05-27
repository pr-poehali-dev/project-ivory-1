import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const plans = [
  {
    id: "month_1",
    period: "1 месяц",
    price: 179,
    perMonth: 179,
    popular: false,
    color: "from-purple-600/20 to-violet-600/20",
    border: "border-purple-500/30",
    features: ["50+ серверов", "AES-256 шифрование", "Без логов", "3 устройства"],
  },
  {
    id: "month_3",
    period: "3 месяца",
    price: 499,
    perMonth: 166,
    popular: true,
    color: "from-purple-600/30 to-violet-700/30",
    border: "border-purple-400/60",
    features: ["50+ серверов", "AES-256 шифрование", "Без логов", "5 устройств", "Kill Switch"],
  },
  {
    id: "month_6",
    period: "6 месяцев",
    price: 899,
    perMonth: 150,
    popular: false,
    color: "from-violet-600/20 to-purple-700/20",
    border: "border-purple-500/30",
    features: ["50+ серверов", "AES-256 шифрование", "Без логов", "7 устройств", "Kill Switch", "Приоритет поддержки"],
  },
  {
    id: "month_12",
    period: "12 месяцев",
    price: 1899,
    perMonth: 158,
    popular: false,
    color: "from-indigo-600/20 to-purple-700/20",
    border: "border-indigo-500/30",
    features: ["50+ серверов", "AES-256 шифрование", "Без логов", "10 устройств", "Kill Switch", "Приоритет поддержки", "Выделенный IP"],
  },
]

interface ServicesSectionProps {
  onBuy?: (planId: string) => void
}

export function ServicesSection({ onBuy }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">Тарифы</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-orbitron">
            Выберите свой <span className="shimmer-text">план</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Доступные цены для надёжной защиты вашей приватности
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-gradient-to-b ${plan.color} ${plan.border} p-6 card-hover slide-up transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0 px-4 py-1 font-geist">
                    🔥 Популярный
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="font-orbitron text-lg font-bold text-foreground mb-2">{plan.period}</div>
                <div className="flex items-end justify-center gap-1 mb-1">
                  <span className="font-orbitron text-4xl font-black shimmer-text">{plan.price}</span>
                  <span className="text-muted-foreground font-geist mb-1">₽</span>
                </div>
                <div className="text-sm text-muted-foreground font-geist">
                  {plan.perMonth} ₽/мес
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/80 font-geist">
                    <Icon name="Check" size={15} className="text-purple-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-geist font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 glow-purple"
                    : "bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-400"
                }`}
                onClick={() => onBuy?.(plan.id)}
              >
                <Icon name="ShoppingCart" size={16} className="mr-2" />
                Подключить
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground font-geist flex items-center justify-center gap-2">
          <Icon name="ShieldCheck" size={16} className="text-purple-400" />
          Безопасная оплата. Гарантия возврата 7 дней.
        </div>
      </div>
    </section>
  )
}
