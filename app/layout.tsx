import type { Metadata } from 'next'
import { Creepster, Source_Sans_3 } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rick & Mortyt App',
  description: 'Generated by create next app',
}

const sourceSans = Source_Sans_3({
  weight: ['300', '600'],
  subsets: ['latin'],
  variable: '--font-sourceSans'
});

const creepster = Creepster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-creepster'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} ${creepster.variable} bg-rmLightBlue overflow-y-hidden`}>
        {children}
      </body>
    </html>
  )
}
