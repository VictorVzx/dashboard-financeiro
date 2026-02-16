import { Wallet } from "lucide-react";

function Balance() {
  return (
    <div className="bg-card flex flex-col sm:flex-row w-full h-40 rounded-lg shadow-md items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4">
      <Wallet className="w-6 h-6 sm:w-8 sm:h-8" />
      <div className="text-center sm:text-left text-foreground">
        <h2 className="font-bold text-sm sm:text-base">Saldo atual:</h2>
        <p className="text-lg sm:text-xl font-semibold">0,00 R$</p>
      </div>
    </div>
  );
}

export default Balance;
