import { SiteFooter } from '@/components/site-footer';
import { SiteFrame } from '@/components/site-frame';
import './globals.css';

export const metadata = {
  title: {
    default: 'SDA - Sustainable Development Advocates',
    template: '%s | SDA',
  },
  description:
    'Sustainable Development Advocates at the University of Lagos — youth-led initiatives for the SDGs.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="motion">
      <body className="font-sans bg-white text-gray-800 antialiased">
        <SiteFrame footer={<SiteFooter />}>{children}</SiteFrame>
        <noscript>
          <style>{'[data-anim]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </body>
    </html>
  );
}
