import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/format-currency'
import { cn } from '@/lib/utils'
import { Stock } from '@/models/stock'
import { ClassNameValue } from 'tailwind-merge'

interface Props {
  stocks?: Stock[]
  className?: ClassNameValue
}

export default function StocksTable({ stocks, className }: Props) {
  return (
    <section className={cn('', className)}>
      {stocks && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>Ativo</TableHead>
              <TableHead className='text-right'>Quantidade</TableHead>
              <TableHead className='text-right'>Preço Médio</TableHead>
              <TableHead className='text-right'>Valor Investido</TableHead>
              <TableHead className='text-right'>Valor Retirado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.ticker}>
                <TableCell className='text-left'>{stock.ticker}</TableCell>
                <TableCell className='text-right'>{stock.stockQuantity}</TableCell>
                <TableCell className='text-right'>{formatCurrency(stock.averageStockBuyPrice)}</TableCell>
                <TableCell className='text-right'>{formatCurrency(stock.totalDepositValue)}</TableCell>
                <TableCell className='text-right'>{formatCurrency(stock.totalWithdrawValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
