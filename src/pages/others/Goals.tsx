import PageShell from "@/components/PageShell"

const metas = [
  { titulo: "Reserva de emergencia", atual: 4200, alvo: 10000, prazo: "Dez/2026" },
  { titulo: "Viagem de ferias", atual: 1800, alvo: 4500, prazo: "Ago/2026" },
  { titulo: "Novo notebook", atual: 950, alvo: 6500, prazo: "Nov/2026" },
]

function Goals() {
  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header>
          <h2 className="text-xl font-semibold sm:text-2xl">Metas</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe seu progresso financeiro por objetivo.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {metas.map((meta) => {
            const percentual = Math.round((meta.atual / meta.alvo) * 100)
            return (
              <article
                key={meta.titulo}
                className="rounded-xl border border-border/70 bg-background/80 p-4"
              >
                <h3 className="text-lg font-semibold">{meta.titulo}</h3>
                <p className="mb-3 text-sm text-muted-foreground">Prazo: {meta.prazo}</p>

                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-sky-500" style={{ width: `${Math.min(percentual, 100)}%` }} />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span>R$ {meta.atual.toFixed(2).replace(".", ",")}</span>
                  <span className="text-muted-foreground">Meta: R$ {meta.alvo.toFixed(2).replace(".", ",")}</span>
                </div>
                <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">{percentual}% concluido</p>
              </article>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}

export default Goals
