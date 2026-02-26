import { CreditCard as CreditCardIcon } from 'lucide-react'

function CreditCard() {
  return (
    <div className="bg-card flex w-full min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-border/70 p-4 shadow-sm sm:min-h-40 sm:flex-row sm:gap-4">
      <CreditCardIcon className="w-6 h-6 sm:w-8 sm:h-8" />
      <div className="text-center sm:text-left text-foreground">
        <h2 className="font-bold text-sm sm:text-base">Cartão de Crédito</h2>
        <p className="text-lg sm:text-xl font-semibold">0,00 R$</p>
        <p className="text-sm sm:text-base">Banco A · 1234</p>
      </div>
    </div>
  )
}

export default CreditCard
