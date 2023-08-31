import { AuthProvider } from './AuthContext'

export const metadata = {
  title: 'Sayings and Quotes',
  description: 'Sayings and Quotes',
}

export default function RootLayout({ children }) {
  return ( 
      <html>
        <AuthProvider>
          <body>{children}</body>
        </AuthProvider>
      </html>
  )
}
