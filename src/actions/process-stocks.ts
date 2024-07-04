'use server'

import { CsvItem, CsvItemCategoryEnum, CsvItemTypeEnum } from '@/models/csv-file'
import { Stock } from '@/models/stock'

export async function processStocks(data: string): Promise<string> {
  // Parse data
  const stockOrders: CsvItem[] = JSON.parse(data)

  const stocksMap = new Map<string, Stock>()

  stockOrders.forEach((order) => {
    if (stocksMap.has(order.ticker)) {
      const currentStock = stocksMap.get(order.ticker)

      let stockQuantity = 0
      // Affect CASH3
      if (order.category === CsvItemCategoryEnum.GROUPING) {
        stockQuantity = order.quantity
      } else {
        stockQuantity = currentStock.stockQuantity + order.quantity * (order.type === CsvItemTypeEnum.CREDIT ? 1 : -1)
      }

      // Calculate average stock buy price
      let averageStockBuyPrice = currentStock.averageStockBuyPrice
      if (order.type === CsvItemTypeEnum.CREDIT) {
        if (currentStock.stockQuantity === 0) {
          averageStockBuyPrice = order.price
        } else {
          averageStockBuyPrice = (((currentStock.averageStockBuyPrice * currentStock.stockQuantity) + (order.grossValue)) / stockQuantity)
        }
      }

      stocksMap.set(order.ticker, {
        ...currentStock,
        stockQuantity,
        totalDepositValue: currentStock.totalDepositValue + (order.type === CsvItemTypeEnum.CREDIT ? order.grossValue : 0),
        totalWithdrawValue: currentStock.totalWithdrawValue + (order.type === CsvItemTypeEnum.CREDIT ? 0 : order.grossValue),
        averageStockBuyPrice
      })

    } else {
      stocksMap.set(order.ticker, new Stock({
        ticker: order.ticker,
        stockQuantity: order.quantity * (order.type === CsvItemTypeEnum.CREDIT ? 1 : -1),
        totalDepositValue: order.grossValue,
        totalWithdrawValue: 0,
        averageStockBuyPrice: order.price
      }))
    }
  })

  const noZeroStocks = Array
    .from(stocksMap.values())
    .filter(stock => stock.stockQuantity !== 0)
    .sort((a, b) => {
      if (a.ticker < b.ticker) {
        return -1
      }
      if (a.ticker > b.ticker) {
        return 1
      }
      return 0
    })

  // Return stock map as string
  return JSON.stringify([...noZeroStocks])
} 