import Head from 'next/head';
import Nav from '../components/Nav';

export default function Chat() {
  return (
    <>
      <Head>
        <title>Coming Soon – Document Generator</title>
        <meta name="description" content="We are building a new AI-powered document generator for your Ausbildung applications." />
        <meta property="og:title" content="Coming Soon – Document Generator" />
        <meta property="og:url" content="https://www.ausbildungingermany.org/chat" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.ausbildungingermany.org/icon-512.png" />
        <link rel="canonical" href="https://www.ausbildungingermany.org/chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--bg:#0d0f14;--surface:#14171f;--border:#252a38;--accent:#4f8ef7;--accent2:#f7c04f;--text:#e8eaf0;--text-muted:#737a96;}
          .coming-soon-page{position:fixed;top:68px;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;padding:40px 24px;}
          .coming-soon-box{text-align:center;max-width:520px;}
          .coming-soon-icon{font-size:72px;margin-bottom:20px;animation:float 3s ease-in-out infinite;}
          @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-12px)}}
          .coming-soon-box h1{font-size:32px;font-weight:800;letter-spacing:-0.5px;margin-bottom:16px;background:linear-gradient(135deg,var(--accent),#7b5ef7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
          .coming-soon-box p{font-size:16px;color:var(--text-muted);line-height:1.7;margin-bottom:32px;}
          .coming-soon-box a{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-weight:600;font-size:15px;transition:all 0.2s;}
          .coming-soon-box a:hover{background:#6aa0f9;transform:translateY(-2px);box-shadow:0 8px 20px rgba(79,142,247,0.3);}
          @media(max-width:640px){.coming-soon-page{top:60px;padding:24px 16px;}.coming-soon-icon{font-size:56px;}.coming-soon-box h1{font-size:26px;}.coming-soon-box p{font-size:14px;}}
        ` }} />
      </Head>
      <Nav />

      <div className="coming-soon-page">
        <div className="coming-soon-box">
          <div className="coming-soon-icon">🚀</div>
          <h1>Coming Soon</h1>
          <p>We&apos;re building a powerful AI document generator using Google Gemini to help you create perfect CVs and cover letters for your Ausbildung applications. Stay tuned!</p>
          <a href="/jobs">🔍 Browse Jobs Instead</a>
        </div>
      </div>
    </>
  );
}
