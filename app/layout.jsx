import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata = {
  title: {
    default: 'SDA - Sustainable Development Advocate',
    template: '%s | SDA',
  },
  description:
    'Sustainable Development Advocate at the University of Lagos — youth-led initiatives for the SDGs.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-800 antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
