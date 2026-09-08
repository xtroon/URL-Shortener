import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clipboard,
  ExternalLink,
  Link2,
  Trash2,
} from "lucide-react";

interface LinkItem {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

const STORAGE_KEY = "url_history";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<LinkItem | null>(null);
  const [history, setHistory] = useState<LinkItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState("");
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const shortenUrl = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Paste a URL first. We promise to make it smaller.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("That URL needs a little fixing. Try adding https://");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Try again?");
        return;
      }

      const item: LinkItem = {
        shortCode: data.shortCode,
        originalUrl: data.originalUrl,
        shortUrl: data.shortUrl,
        createdAt: new Date().toISOString(),
      };
      setResult(item);
      setHistory((previous) => [item, ...previous]);
      setUrl("");
    } catch {
      setError("The server is taking a tiny break. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1600);
  };

  const deleteUrl = (code: string) => {
    setHistory((previous) => previous.filter((item) => item.shortCode !== code));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f5ef] bg-[radial-gradient(circle_at_85%_0%,#e5f0d1_0,transparent_29rem)] font-['Manrope',sans-serif] text-[#17211b]">
      <header className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-between px-7 max-sm:px-[18px]">
        <a className="flex items-center gap-2.5 text-[15px] font-extrabold tracking-[-.04em] text-[#17211b] no-underline" href="/" aria-label="urlshortener home">
            <span className="grid h-[24px] w-[24px] rotate-[-7deg] place-items-center rounded-[9px] bg-[#17211b] text-[#eff8df]"> </span>
          <span>urlshortener</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-[15px] text-[#778078]">
          <a className="flex items-center gap-[3px] text-[#17211b] no-underline hover:underline" href="https://github.com/xtroon/URL-Shortener" target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight size={18} />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[780px] px-7 pb-[100px] pt-[58px] max-sm:px-[18px] max-sm:pb-[75px] max-sm:pt-12">
        <section className="text-center">
          <h1 className="my-6 text-[clamp(44px,7vw,72px)] font-extrabold leading-[.98] tracking-[-.075em] max-sm:text-[40px]"><span className="whitespace-nowrap">Don't like long URLs?</span><br /><em className="whitespace-nowrap not-italic text-[#789e42]">Make them short.</em></h1>
          <p className="m-0 text-[15px] leading-[1.7] text-[#727b73]">Paste your URL below and get a clean link to share.</p>
        </section>

        <section className="mt-11 rounded-2xl border border-[#dfe4d9] bg-white/80 p-2 shadow-[0_16px_40px_rgba(54,74,43,.06)]">
          <div className="px-3.5 pb-2 pt-2.5 text-[11px] font-medium text-[#687268]">Long URL</div>
          <form onSubmit={shortenUrl} className="flex gap-2 max-sm:block">
            <div className="flex min-h-[52px] min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#d9e0d5] bg-[#fbfcfa] px-3.5 text-[#9aa59a] transition focus-within:border-[#9ab778] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e8f1df]">
              <Link2 size={18} />
              <input
                className="w-full min-w-0 border-0 bg-transparent py-3 text-sm text-[#17211b] outline-0 placeholder:text-[#9fa99e]"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="Paste a URL here"
                aria-label="Long URL"
              />
              {url && <button type="button" className="grid h-6 w-6 place-items-center rounded-full border-0 bg-transparent text-lg leading-none text-[#8e998e] hover:bg-[#edf2e9]" onClick={() => setUrl("")} aria-label="Clear URL">×</button>}
            </div>
            <button className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg border-0 bg-[#17211b] px-[18px] text-[12px] font-bold text-[#f5f8ec] transition hover:bg-[#38502d] disabled:cursor-wait cursor-pointer disabled:opacity-60 max-sm:mt-2 max-sm:min-h-[49px] max-sm:w-full" disabled={loading}>
              {loading ? "Shortening..." : "Shorten URL"}
              {!loading && <ArrowUpRight size={17} />}
            </button>
          </form>
          <div className="flex gap-[9px] px-3.5 pb-1 pt-[11px] font-mono text-[10px] text-[#9da59c] max-sm:text-[9px]">your short url is waiting for you.</div>
          {error && <p className="mx-3.5 mb-1 mt-[9px] text-[12px] text-[#b55e50]">{error}</p>}
        </section>

        {result && (
          <section className="mt-3 animate-[fade-in_.3s_ease-out] rounded-[15px] border border-[#cfe2b5] bg-[#edf6e2] p-[18px_20px]">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.07em] text-[#628735]"><span className="grid h-[23px] w-[23px] place-items-center rounded-full bg-[#83aa4e] text-white"><Check size={16} /></span> Your tiny link is ready</div>
            <div className="mt-[13px] flex items-center gap-3.5 max-sm:flex-col max-sm:items-stretch max-sm:gap-2.5">
              <a href={result.shortUrl} target="_blank" rel="noreferrer" className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-base font-medium text-[#426b28]">{result.shortUrl}</a>
              <button className="flex shrink-0 items-center gap-[7px] rounded-lg border border-[#c7dcb0] bg-[#f8fcf3] px-3 py-[9px] text-[11px] font-bold text-[#557b35] max-sm:justify-center" onClick={() => copyUrl(result.shortUrl, "result")}>
                {copied === "result" ? <><Check size={16} /> Copied</> : <><Clipboard size={16} /> Copy link</>}
              </button>
            </div>
            <p className="mt-[11px] text-[11px] text-[#829477]">Saved you {Math.max(result.originalUrl.length - result.shortUrl.length, 0)} characters. That feels better already.</p>
          </section>
        )}

        {history.length > 0 && (
          <section className="mt-[82px] max-sm:mt-[62px]">
            <div className="mb-[18px] flex items-end justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.13em] text-[#668d32]">Your links</div><h2 className="mt-2 text-[25px] tracking-[-.05em]">Recently made</h2></div><span className="font-mono text-[10px] text-[#9ca59c]">{history.length} total</span></div>
            <div className="grid gap-2">
              {history.map((item) => (
                <div className="flex items-center gap-[13px] rounded-xl border border-[#e1e5de] bg-white/60 p-[13px]" key={item.shortCode}>
                  <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[9px] bg-[#eaf2df] text-[#769b4b]"><Link2 size={17} /></div>
                  <div className="min-w-0 flex-1"><a className="flex items-center gap-[5px] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12px] text-[#47752e] no-underline" href={item.shortUrl} target="_blank" rel="noreferrer">{item.shortUrl} <ExternalLink size={12} /></a><p className="mt-[5px] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[#a0a69f]">{item.originalUrl}</p></div>
                  <button className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-lg border-0 bg-transparent text-[#8b958a] hover:bg-[#edf4e7] hover:text-[#47752e]" onClick={() => copyUrl(item.shortUrl, item.shortCode)} aria-label="Copy shortened URL">{copied === item.shortCode ? <Check size={16} /> : <Clipboard size={16} />}</button>
                  <button className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-lg border-0 bg-transparent text-[#8b958a] hover:bg-[#f9ece8] hover:text-[#b55e50]" onClick={() => deleteUrl(item.shortCode)} aria-label="Delete shortened URL"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>




      <footer className="mx-auto flex max-w-[1120px] justify-between px-7 pb-[30px] pt-[22px] font-mono text-[10px] text-[#a0a89f] max-sm:flex-wrap max-sm:gap-[15px] max-sm:px-[18px] max-sm:pb-[26px]"><span className="font-medium text-[#17211b]">urlshortener</span><span>Made by <a className="font-bold text-[#17211b] underline decoration-2 underline-offset-2" href="https://xtroon.vercel.app" target="_blank" rel="noreferrer">Xtroon</a></span></footer>
    </div>
  );
}

export default App;
