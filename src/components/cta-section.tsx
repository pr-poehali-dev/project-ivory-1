import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface CTASectionProps {
  onNavigate: (section: string) => void
}

export function CTASection({ onNavigate }: CTASectionProps) {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
            animation: "orb-pulse 4s ease-in-out infinite",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="slide-up">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-5 py-2 mb-8">
            <Icon name="Zap" size={15} className="text-purple-400" />
            <span className="text-sm font-geist text-purple-300">Начни прямо сейчас</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 font-orbitron leading-tight">
            Защити своё <span className="shimmer-text">соединение</span> уже сегодня
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-geist">
            Присоединяйтесь к тысячам пользователей, которые доверяют SUNVPN свою приватность в интернете.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
    </section>
  )
}
