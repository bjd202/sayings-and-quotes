
export const metadata = {
  title: 'Sayings and Quotes',
  description: 'Sayings and Quotes',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
