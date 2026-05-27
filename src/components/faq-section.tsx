import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faqs = [
  {
    question: "Насколько безопасен SUNVPN?",
    answer: "SUNVPN использует военное шифрование AES-256, протокол WireGuard и политику нулевых логов. Ваши данные полностью защищены — мы не храним историю активности.",
  },
  {
    question: "На скольких устройствах можно использовать?",
    answer: "Зависит от тарифа: 1 месяц — 3 устройства, 3 месяца — 5 устройств, 6 месяцев — 7 устройств, 12 месяцев — 10 устройств. Поддерживаются Windows, macOS, Android и iOS.",
  },
  {
    question: "Как быстро подключается VPN?",
    answer: "Подключение занимает менее 2 секунд. Наши сервера оптимизированы для минимальной задержки — средний пинг составляет 15–40 мс.",
  },
  {
    question: "Что такое Kill Switch?",
    answer: "Kill Switch автоматически блокирует интернет-соединение, если VPN-туннель неожиданно обрывается. Это гарантирует, что ваш реальный IP-адрес никогда не будет раскрыт.",
  },
  {
    question: "Можно ли смотреть стриминговые сервисы?",
    answer: "Да! SUNVPN отлично справляется с разблокировкой Netflix, YouTube, Spotify, Disney+ и других стриминговых сервисов в различных регионах.",
  },
  {
    question: "Есть ли гарантия возврата денег?",
    answer: "Да, мы предоставляем гарантию возврата в течение 7 дней с момента покупки без объяснения причин.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">FAQ</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-orbitron">
            Частые <span className="shimmer-text">вопросы</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-geist">
            Ответы на популярные вопросы о SUNVPN
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-purple-500/20 rounded-xl bg-card/50 backdrop-blur-sm px-2 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-purple-300 font-geist px-4 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed px-4 pb-4 font-geist">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
