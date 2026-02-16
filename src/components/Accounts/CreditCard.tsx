import React from 'react'
import { CreditCard as CreditCardIcon } from 'lucide-react'

function CreditCard() {
  return (
    <div className="bg-card flex flex-col sm:flex-row w-full h-40 rounded-lg shadow-md items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4">
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