import { createContext, useContext, useState, useEffect } from 'react';

const LangCtx = createContext({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('aig_lang') || 'en';
    setLangState(saved);
  }, []);

  function setLang(code) {
    localStorage.setItem('aig_lang', code);
    setLangState(code);
    window.dispatchEvent(new CustomEvent('aig:langchange', { detail: { lang: code } }));
  }

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
