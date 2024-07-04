export function formatCurrency(value: number = 0) {
  return `R$ ${Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)}`
}