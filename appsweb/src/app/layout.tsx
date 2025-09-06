import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Footer from '@/components/ui/Footer';
import { AuthProvider } from '@/components/AuthProvider';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'SWO Admin Panel',
  description: 'Don Bosco College Admin Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
