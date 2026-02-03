import { ArrowDown } from "lucide-react";

function Spent() {
  return (
    <div className="bg-white flex flex-col sm:flex-row w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-25 rounded-lg shadow-md items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4">
      <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8" />
      <div className="text-center sm:text-left">
        <h2 className="font-bold text-sm sm:text-base">Gastos:</h2>
        <p className="text-lg sm:text-xl font-semibold">0,00 R$</p>
      </div>
    </div>
  );
}

export default Spent;
