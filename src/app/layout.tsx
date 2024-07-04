import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calculadora CEI',
  description: 'Calcule o preço médio de suas ações e fundos imobiliários a partir do arquivo csv da CEI da B3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-Br">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
