import { Wallet } from "lucide-react";

function Balance() {
  return (
    <div className="group flex h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:gap-4">
      <div className="rounded-full bg-muted p-3 transition group-hover:bg-muted/80">
        <Wallet className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
      <div className="text-center text-foreground sm:text-left">
        <h2 className="text-sm font-bold sm:text-base">Saldo atual:</h2>
        <p className="text-xl font-semibold">0,00 R$</p>
      </div>
    </div>
  );
}

export default Balance;
