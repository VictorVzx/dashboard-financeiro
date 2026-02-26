import PageShell from "@/components/PageShell"
import { Landmark, CreditCard, PiggyBank, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const contas = [
  {
    nome: "Conta corrente",
    banco: "Banco A",
    final: "1234",
    saldo: "R$ 1.450,00",
    variacao: "+8% no mes",
    tipo: "corrente",
  },
  {
    nome: "Conta poupanca",
    banco: "Banco A",
    final: "9876",
    saldo: "R$ 3.320,00",
    variacao: "+5% no mes",
    tipo: "poupanca",
  },
  {
    nome: "Cartao de credito",
    banco: "Banco A",
    final: "4451",
    saldo: "R$ 830,00",
    variacao: "82% do limite",
    tipo: "cartao",
  },
]

function contaIcon(tipo: string) {
  if (tipo === "poupanca") return PiggyBank
  if (tipo === "cartao") return CreditCard
  return Landmark
}

function Accounts() {
  return (
    <PageShell>
      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-sm md:p-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Contas</h2>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie todas as suas contas em um unico lugar.
            </p>
          </div>
          <Button className="w-full cursor-pointer sm:w-auto">
            <Plus className="size-4" />
            Adicionar conta
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saldo total</p>
            <p className="text-xl font-semibold sm:text-2xl">R$ 4.770,00</p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Entradas previstas</p>
            <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
              R$ 2.280,00
            </p>
          </article>
          <article className="rounded-xl border border-border/70 bg-background/80 p-4">
            <p className="text-sm text-muted-foreground">Saidas previstas</p>
            <p className="text-xl font-semibold text-rose-600 dark:text-rose-400 sm:text-2xl">
              R$ 830,00
            </p>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {contas.map((conta) => {
            const Icon = contaIcon(conta.tipo)
            const isCartao = conta.tipo === "cartao"
            return (
              <article
                key={conta.nome}
                className="rounded-xl border border-border/70 bg-background/80 p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-muted p-2">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{conta.nome}</h3>
                      <p className="text-xs text-muted-foreground">
                        {conta.banco} - final {conta.final}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isCartao
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {isCartao ? "Atencao" : "Saudavel"}
                  </span>
                </div>

                <p className="text-2xl font-semibold">{conta.saldo}</p>
                <p
                  className={`mt-1 text-sm ${
                    isCartao
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-sky-600 dark:text-sky-400"
                  }`}
                >
                  {conta.variacao}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md border border-border/70 bg-card/60 p-2">
                    <p className="mb-1 text-muted-foreground">Entradas</p>
                    <p className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <ArrowDownLeft className="size-3.5" />
                      R$ 1.450,00
                    </p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-card/60 p-2">
                    <p className="mb-1 text-muted-foreground">Saidas</p>
                    <p className="inline-flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                      <ArrowUpRight className="size-3.5" />
                      R$ 830,00
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}

export default Accounts
