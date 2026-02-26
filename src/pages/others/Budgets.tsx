import PageShell from "@/components/PageShell"

const orcamentos = [
  { nome: "Casa", gasto: 1240, limite: 1800 },
  { nome: "Transporte", gasto: 420, limite: 600 },
  { nome: "Lazer", gasto: 310, limite: 400 },
  { nome: "Saude", gasto: 220, limite: 500 },
]

function Budgets() {
  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header>
          <h2 className="text-xl font-semibold sm:text-2xl">Orcamentos</h2>
          <p className="text-sm text-muted-foreground">
            Controle seus limites mensais por categoria.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {orcamentos.map((item) => {
            const porcentagem = Math.round((item.gasto / item.limite) * 100)
            return (
              <article
                key={item.nome}
                className="rounded-xl border border-border/70 bg-background/80 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium">{item.nome}</h3>
                  <span className="text-sm text-muted-foreground">{porcentagem}% usado</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={`h-2 rounded-full ${
                      porcentagem >= 85 ? "bg-rose-500" : porcentagem >= 70 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(porcentagem, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  R$ {item.gasto.toFixed(2).replace(".", ",")} / R$ {item.limite.toFixed(2).replace(".", ",")}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}

export default Budgets
