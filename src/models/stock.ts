export class Stock {
  ticker: string
  stockQuantity: number
  totalDepositValue: number
  totalWithdrawValue: number
  averageStockBuyPrice: number

  constructor(data: Stock) {
    Object.assign(this, data)
  }
}