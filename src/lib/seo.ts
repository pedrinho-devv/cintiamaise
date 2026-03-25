const SITE_URL = 'https://cintiamaise.adv.br';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

interface MetaOptions {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
}

function setMeta(selector: string, content: string) {
  const el = document.querySelector(selector) as HTMLMetaElement | null;
  if (el) el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function setPageMeta({ title, description, canonical, ogImage, ogType = 'website' }: MetaOptions) {
  document.title = title;
  const image = ogImage || DEFAULT_IMAGE;

  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:type"]', ogType);
  setMeta('meta[property="og:url"]', canonical);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);
  setLink('canonical', canonical);
}

export function injectArticleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image?: string;
  slug: string;
  category?: string;
  tags?: string[];
}) {
  const existing = document.getElementById('article-schema');
  if (existing) existing.remove();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image || DEFAULT_IMAGE,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: `${SITE_URL}/#business`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cíntia Maise Advocacia',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-cintia.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', ') || 'direito previdenciário, INSS',
    articleSection: post.category || 'Direito Previdenciário',
    inLanguage: 'pt-BR',
  };

  const script = document.createElement('script');
  script.id = 'article-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

export function removeArticleSchema() {
  document.getElementById('article-schema')?.remove();
}
