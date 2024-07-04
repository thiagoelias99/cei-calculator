'use server'

// Filter csv items by category, aplly some business rules and return the processed orders ordered by date ascending

import { CsvItem, CsvItemCategoryEnum, CsvItemTypeEnum } from '@/models/csv-file'

export async function processOrders(data: string): Promise<string> {
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
    let processedItem: CsvItem = item

    // Process grouping
    if (processedItem.category === CsvItemCategoryEnum.GROUPING) {
      // Subtract 2 hour from date
      new Date(processedItem.date).setHours(new Date(processedItem.date).getHours() - 2)
    }

    // Process ITSA4 bonification
    if (processedItem.ticker === 'ITSA4' && processedItem.category === CsvItemCategoryEnum.BONUS) {
      // If date is between 2021-12-20 and 2021-12-23 set the price to 18.89
      if (processedItem.date >= new Date('2021-12-20') && processedItem.date <= new Date('2021-12-23')) {
        processedItem.price = 18.89
        processedItem.grossValue = processedItem.quantity * processedItem.price
      }
      // If date is between 2022-11-10 and 2022-11-16 set the price to 13,65
      if (processedItem.date >= new Date('2022-11-10') && processedItem.date <= new Date('2022-11-16')) {
        processedItem.price = 13.65
        processedItem.grossValue = processedItem.quantity * processedItem.price
      }
      // If date is between 2023-11-27 and 2023-12-02 set the price to 17,92
      if (processedItem.date >= new Date('2023-11-27') && processedItem.date <= new Date('2023-12-02')) {
        processedItem.price = 17.92
        processedItem.grossValue = processedItem.quantity * processedItem.price
      }
    }

    // Process MXRF12 subscription
    if (processedItem.ticker === 'MXRF12' && processedItem.category === CsvItemCategoryEnum.SUBSCRIPTION) {
      // If date is between 2023-12-10 and 2023-12-16 set the price to 10.29
      if (processedItem.date >= new Date('2023-12-10') && processedItem.date <= new Date('2023-12-16')) {
        processedItem.price = 10.29
        processedItem.grossValue = processedItem.quantity * processedItem.price
      }
    }

    // Substitute XXXX12, XXXX13, XXXX14, XXXX15 to XXXX11 (FIIs)
    processedItem.ticker = processedItem.ticker.replace(/\d{2}$/, '11')

    // Substitute VIVT3 to VIVT4
    processedItem.ticker = processedItem.ticker.replace('VIVT3', 'VIVT4')

    // Ignore IVVB11 from Clear Broker
    if (processedItem.broker.startsWith('CLEAR') && processedItem.ticker === 'IVVB11') {
      return
    }

    // Consider MGLU3 only from Clear Broker
    if (processedItem.ticker === 'MGLU3' && !processedItem.broker.startsWith('CLEAR')) {
      return
    }
    
    return {
      ticker: processedItem.ticker,
      type: processedItem.type === 'Credito' || processedItem.category === CsvItemCategoryEnum.SUBSCRIPTION ? CsvItemTypeEnum.CREDIT : CsvItemTypeEnum.DEBIT,
      quantity: processedItem.quantity,
      price: processedItem.price,
      date: processedItem.date,
      companyName: processedItem.institution,
      orderGroup: processedItem.category,
      grossValue: processedItem.grossValue,
      broker: processedItem.broker
    }
  })

  // Return processed orders sorted by date ascending as Json
  return JSON.stringify(processedOrders.filter(item => item).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
}