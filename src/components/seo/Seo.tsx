import { useEffect } from "react";

type JsonLd = Record<string, unknown>;

interface SeoProps {
  title: string;
  description?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  jsonLd?: JsonLd;
}

function upsertMetaByName(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function upsertJsonLd(json: JsonLd | undefined) {
  const id = "seo-jsonld";
  const existing = document.getElementById(id);

  if (!json) {
    existing?.remove();
    return;
  }

  const script = (existing as HTMLScriptElement | null) ?? document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(json);
  if (!existing) document.head.appendChild(script);
}

export default function Seo({ title, description, canonicalPath, noIndex, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title;

    if (description) {
      upsertMetaByName("description", description);
      upsertMetaByProperty("og:description", description);
      upsertMetaByName("twitter:description", description);
    }

    upsertMetaByProperty("og:title", title);
    upsertMetaByName("twitter:title", title);

    if (canonicalPath) {
      const base = window.location.origin;
      upsertCanonical(`${base}${canonicalPath}`);
    }

    if (noIndex) {
      upsertMetaByName("robots", "noindex, nofollow");
    } else {
      const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (robots?.content === "noindex, nofollow") robots.remove();
    }

    upsertJsonLd(jsonLd);
  }, [title, description, canonicalPath, noIndex, jsonLd]);

  return null;
}
