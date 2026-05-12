// @source PublicLayout.tsx /vagas
// @component PublicAuthHeader / @tipo organismo / @page login,cadastro,recuperação
// @rule Balha DS v6.0: bg-background | border-b | sticky | h-20 | font-semibold

import * as React from "react"
import { Link } from "@src/lib/router-compat"
import { Icon } from "@iconify/react"

export function PublicAuthHeader() {
  return (
    <header className="h-20 bg-background border-b border-border sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
      <Link to="/vagas" className="outline-none group">
        <img src="https://incibrasil.com.br/i.inci.com.br/storage/site/img/inci-site-logo.png" alt="INCI Recruta" className="h-8 w-auto" />
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/vagas">
          <button className="h-11 px-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-all">
            Vagas
          </button>
        </Link>
        <Link to="/login">
          <button className="h-11 px-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-all">
            Acessar
          </button>
        </Link>
        <Link to="/cadastro">
          <button className="h-11 px-8 bg-primary text-primary-foreground text-[11px] font-semibold uppercase tracking-wide rounded-lg transition-all hover:opacity-90 active:scale-95">
            Criar Conta
          </button>
        </Link>
      </div>
    </header>
  )
}
