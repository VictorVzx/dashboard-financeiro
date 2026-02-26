import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const notificacoes = [
  {
    titulo: "Pagamento de fatura em 2 dias",
    descricao: "Seu cartao final 4451 vence em 28/02.",
    tempo: "Agora",
    tipo: "alerta",
  },
  {
    titulo: "Meta atualizada",
    descricao: "Voce atingiu 54% da meta de pagar cartao.",
    tempo: "Ha 1 hora",
    tipo: "meta",
  },
  {
    titulo: "Entrada recebida",
    descricao: "Transferencia de R$ 850,00 confirmada.",
    tempo: "Ha 3 horas",
    tipo: "entrada",
  },
]

export function Notification() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-fit cursor-pointer px-2 sm:px-3"
          >
            <Bell className="size-4" />
            <span className="hidden sm:inline">Notificacoes</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Notificações</PopoverTitle>
            <PopoverDescription>Atualizacoes recentes da sua conta.</PopoverDescription>
          </PopoverHeader>
          <div className="mt-3 space-y-2">
            {notificacoes.map((item) => (
              <div
                key={`${item.titulo}-${item.tempo}`}
                className="rounded-md border border-border/70 bg-background/70 p-3"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.titulo}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      item.tipo === "alerta"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : item.tipo === "meta"
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {item.tipo}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.descricao}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{item.tempo}</p>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
