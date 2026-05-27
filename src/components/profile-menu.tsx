import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

interface ProfileMenuProps {
  user: { id: number; email: string; username: string }
  onLogout: () => void
  onNavigate: (section: string) => void
}

export function ProfileMenu({ user, onLogout, onNavigate }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 hover:from-purple-600/30 hover:to-violet-600/30 border border-purple-500/30 text-purple-300 hover:text-white font-geist gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
          {user.username[0].toUpperCase()}
        </div>
        <span className="hidden sm:block max-w-24 truncate">{user.username}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={14} />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-52 bg-[hsl(265_20%_8%)] border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-900/50 overflow-hidden">
            <div className="p-3 border-b border-purple-500/10">
              <div className="font-geist text-sm font-semibold text-foreground truncate">{user.username}</div>
              <div className="font-geist text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <div className="p-2">
              <button
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-geist text-foreground/80 hover:text-foreground hover:bg-purple-500/10 transition-colors"
                onClick={() => { onNavigate("profile"); setOpen(false) }}
              >
                <Icon name="User" size={16} className="text-purple-400" />
                Личный кабинет
              </button>
              <button
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-geist text-foreground/80 hover:text-foreground hover:bg-purple-500/10 transition-colors"
                onClick={() => { onNavigate("services"); setOpen(false) }}
              >
                <Icon name="ShoppingCart" size={16} className="text-purple-400" />
                Купить подписку
              </button>
              <div className="border-t border-purple-500/10 mt-1 pt-1">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-geist text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  onClick={() => { onLogout(); setOpen(false) }}
                >
                  <Icon name="LogOut" size={16} />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
