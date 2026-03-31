import '../styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import { LangProvider } from '../context/LangContext';

export default function App({ Component, pageProps }) {
  return (
    <LangProvider>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BEV3ZNRJ2P"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BEV3ZNRJ2P');
      `}</Script>
      <Component {...pageProps} />
      <SpeedInsights />
    </LangProvider>
  );
}
