import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageContents } from "../content/pages";

function normalizeSource(source: string) {
  const base = import.meta.env.BASE_URL;
  return source
    .replace(/(src|href)=("|')\/assets\//g, `$1=$2${base}assets/`)
    .replace(/href=("|')\/(?!\/|assets\/)([^"']*)("|')/g, (_match, quote, path, endQuote) => `href=${quote}${base}${path}${endQuote}`);
}

export default function WikiPage() {
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, "") || "/";
  const page = pageContents.find(item => item.path === path) ?? pageContents.find(item => item.path === "/404")!;

  useEffect(() => {
    document.title = page.title;
  }, [page.title]);

  return <div className="page-content" dangerouslySetInnerHTML={{ __html: normalizeSource(page.source) }} />;
}
