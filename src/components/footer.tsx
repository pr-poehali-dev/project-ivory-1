import Icon from "@/components/ui/icon"

interface FooterProps {
  onNavigate: (section: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[hsl(265_25%_4%)] border-t border-purple-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onNavigate("home")}>
              <img
                src="https://cdn.poehali.dev/files/13335a1a-9b0e-43bc-b9fa-1b3eb3a84430.png"
                alt="SUNVPN"
                className="w-9 h-9 rounded-xl"
              />
              <span className="font-orbitron text-2xl font-bold shimmer-text">SUNVPN</span>
            </div>
            <p className="font-geist text-gray-400 mb-6 max-w-md leading-relaxed">
              Надёжная защита вашей приватности в интернете. AES-256 шифрование, 50+ серверов, без логов.
            </p>
            <div className="flex space-x-3">
              {["Twitter", "Github", "MessageCircle", "Mail"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-gray-400 hover:text-purple-300 hover:border-purple-400/40 transition-all duration-200"
                >
                  <Icon name={icon as "Mail"} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-orbitron text-white font-semibold mb-4 text-sm">Навигация</h3>
            <ul className="space-y-2">
              {[
                { id: "home", label: "Главная" },
                { id: "services", label: "Услуги" },
                { id: "news", label: "Новости" },
                { id: "faq", label: "FAQ" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="font-geist text-gray-400 hover:text-purple-300 transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-orbitron text-white font-semibold mb-4 text-sm">Поддержка</h3>
            <ul className="space-y-2">
              {["Конфиденциальность", "Условия использования", "Политика Cookie", "Контакты"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-geist text-gray-400 hover:text-purple-300 transition-colors duration-200 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-purple-500/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-geist text-gray-500 text-sm">© 2025 SUNVPN. Все права защищены.</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-geist">
              <Icon name="Shield" size={13} className="text-purple-400" />
              Ваша приватность — наш приоритет
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
