import PageShell from "@/components/PageShell"

const transacoes = [
  { descricao: "Supermercado", categoria: "Alimentacao", tipo: "Saida", valor: "R$ 286,40", data: "24/02/2026" },
  { descricao: "Salario", categoria: "Receita", tipo: "Entrada", valor: "R$ 3.800,00", data: "20/02/2026" },
  { descricao: "Assinatura Streaming", categoria: "Lazer", tipo: "Saida", valor: "R$ 39,90", data: "19/02/2026" },
  { descricao: "Freelance", categoria: "Receita", tipo: "Entrada", valor: "R$ 850,00", data: "15/02/2026" },
]

function Transactions() {
  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header>
          <h2 className="text-xl font-semibold sm:text-2xl">Transacoes</h2>
          <p className="text-sm text-muted-foreground">
            Historico recente de entradas e saidas.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Entradas no mes</p>
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-2xl">R$ 4.650,00</p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saidas no mes</p>
            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400 sm:text-2xl">R$ 1.532,30</p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saldo de transacoes</p>
            <p className="text-xl font-semibold sm:text-2xl">R$ 3.117,70</p>
          </article>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border/70 bg-background/80">
          <table className="min-w-[680px] w-full text-left">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Descricao</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((item) => (
                <tr key={`${item.descricao}-${item.data}`} className="border-t border-border/60 text-sm">
                  <td className="px-4 py-3">{item.descricao}</td>
                  <td className="px-4 py-3">{item.categoria}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.tipo === "Entrada"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {item.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.valor}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  )
}

export default Transactions
