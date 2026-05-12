// @component Pt24 | @tipo componente | @versao 1.0.0
// > Wrapper tipográfico pt-24 — padding top 6rem

import * as React from "react"

interface Pt24Props extends React.HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  description?: string
}

export function Pt24({
  children,
  className = "",
  title = "Terminal de Oportunidades",
  subtitle = "Construir o Futuro.",
  description = "Acesse o ecossistema de recrutamento da INCI. Tecnologia e inovação para conectar talentos e oportunidades.",
  ...props
}: Pt24Props) {
  return (
    <section
      className={`w-full bg-primary pt-24 pb-32 text-primary-foreground relative overflow-hidden ${className}`.trim()}
      {...props}
    >
      <div className="absolute inset-0 opacity-10" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {children ?? (
          <>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                {title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                {subtitle}
              </h2>
              <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto mb-8">
                {description}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
