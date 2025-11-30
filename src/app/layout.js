import { Montserrat } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import ServiceWorkerRegistrar from '../components/shared/ServiceWorkerRegistrar';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: 'L.U.C.I. - LeanData Unified Customer Intelligence',
  description: 'AI-powered customer sentiment analysis from Avoma transcripts and Salesforce context',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet" />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </head>
      <body className="bg-lean-almost-white">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}

