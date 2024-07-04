'use server'

// Filter csv items by category, aplly some business rules and return the processed orders ordered by date ascending

import { CsvItem, CsvItemCategoryEnum } from '@/models/csv-file'

export async function processOrders(data: string) {
  // Parse data
  const parsedData: CsvItem[] = JSON.parse(data)

  // Filter only the stock orders that are related to positions
  const allStocks = parsedData.filter((item) =>
    item?.category === CsvItemCategoryEnum.LIQUIDATION ||
    item?.category === CsvItemCategoryEnum.SPREAD ||
    item?.category === CsvItemCategoryEnum.FRACTION ||
    item?.category === CsvItemCategoryEnum.SUBSCRIPTION ||
    item?.category === CsvItemCategoryEnum.BONUS ||
    item?.category === CsvItemCategoryEnum.GROUPING
  )

  // Process orders
  const processedOrders = allStocks.map((item) => {
    // Process grouping
    if (item.category === CsvItemCategoryEnum.GROUPING) {
      // Subtract 2 hour from date
      try {
        new Date(item.date).setHours(new Date(item.date).getHours() - 2)

      } catch (error) {
        console.error('Error subtracting 2 hours from date', error)
        console.log('Item:', item)
      }
    }

    // Process ITSA4 bonification
    if (item.ticker === 'ITSA4' && item.category === CsvItemCategoryEnum.BONUS) {
      // If date is between 2021-12-20 and 2021-12-23 set the price to 18.89
      if (item.date >= new Date('2021-12-20') && item.date <= new Date('2021-12-23')) {
        item.price = 18.89
        item.grossValue = item.quantity * item.price
      }
      // If date is between 2022-11-10 and 2022-11-16 set the price to 13,65
      if (item.date >= new Date('2022-11-10') && item.date <= new Date('2022-11-16')) {
        item.price = 13.65
        item.grossValue = item.quantity * item.price
      }
      // If date is between 2023-11-27 and 2023-12-02 set the price to 17,92
      if (item.date >= new Date('2023-11-27') && item.date <= new Date('2023-12-02')) {
        item.price = 17.92
        item.grossValue = item.quantity * item.price
      }
    }

    // Process MXRF12 subscription
    if (item.ticker === 'MXRF12' && item.category === CsvItemCategoryEnum.SUBSCRIPTION) {
      // If date is between 2023-12-10 and 2023-12-16 set the price to 10.29
      if (item.date >= new Date('2023-12-10') && item.date <= new Date('2023-12-16')) {
        item.price = 10.29
        item.grossValue = item.quantity * item.price
      }
    }

    return {
      stockTicker: item.ticker,
      orderType: item.type === 'Credito' || item.category === CsvItemCategoryEnum.SUBSCRIPTION ? 'BUY' : 'SELL',
      quantity: item.quantity,
      price: item.price,
      date: item.date,
      companyName: item.institution,
      orderGroup: item.category,
      grossValue: item.grossValue,
      broker: item.broker
    }
  })

  // Return processed orders sorted by date ascending as Json
  // return processedOrders.sort((a, b) => a.date.getTime() - b.date.getTime())
  return JSON.stringify(processedOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
}