import { ArrowDown } from "lucide-react";

function Spent() {
  return (
    <div className="group flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:gap-4">
      <div className="rounded-full bg-muted p-3 text-rose-500 transition group-hover:bg-muted/80 dark:text-rose-400">
        <ArrowDown className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <div className="text-center text-foreground sm:text-left">
        <h2 className="text-sm font-bold sm:text-base">Gastos:</h2>
        <p className="text-xl font-semibold">0,00 R$</p>
        <p className="text-sm text-muted-foreground">Último mês</p>
      </div>
    </div>
  );
}

export default Spent;
