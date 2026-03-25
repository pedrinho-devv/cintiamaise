import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Clock, Calendar, User, ArrowLeft, Share2, Tag, ArrowRight } from 'lucide-react';
import { getPostBySlug, getPublishedPosts, seedInitialPosts, BlogPost as BlogPostType } from '@/lib/blogService';
import { setPageMeta, injectArticleSchema, removeArticleSchema } from '@/lib/seo';
import { motion } from 'framer-motion';

const formatDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      await seedInitialPosts();
      if (!slug) { setLoading(false); return; }

      const found = await getPostBySlug(slug);
      setPost(found);

      if (found) {
        const canonical = `https://cintiamaise.adv.br/blog/${found.slug}`;
        setPageMeta({
          title: `${found.title} | Cíntia Maise Advocacia`,
          description: found.metaDescription || found.excerpt,
          canonical,
          ogImage: found.image || undefined,
          ogType: 'article',
        });
        injectArticleSchema(found);
        const all = await getPublishedPosts();
        const rel = all
          .filter(p => p.slug !== slug && p.category === found.category)
          .slice(0, 2);
        setRelated(rel);
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };
    load();
    return () => { removeArticleSchema(); };
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white font-inter">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse space-y-5">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-72 bg-gray-200 rounded-2xl" />
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-4 bg-gray-200 rounded ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="min-h-screen bg-white font-inter">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Tag size={28} className="text-gray-300" />
            </div>
            <h1 className="font-playfair font-bold text-[#0B1D2E] text-2xl mb-3">
              Artigo não encontrado
            </h1>
            <p className="font-inter text-gray-500 mb-8 leading-relaxed">
              O artigo que você procura não existe ou foi removido. Explore nossos outros conteúdos.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate(-1)} className="btn-outline-gold flex items-center gap-2 px-6 py-3 text-sm">
                <ArrowLeft size={15} /> Voltar
              </button>
              <Link to="/blog" className="btn-gold px-6 py-3 text-sm">
                Ver todos os artigos
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Post ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />

      <article>
        {/* Header section */}
        <div className="pt-28 pb-0 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">

              {/* Breadcrumb */}
              <nav aria-label="Navegação" className="flex items-center gap-2 text-sm text-gray-400 font-inter mb-6">
                <Link to="/" className="hover:text-[#D4A843] transition-colors">Início</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-[#D4A843] transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-gray-600 line-clamp-1">{post.title}</span>
              </nav>

              {/* Category pill */}
              {post.category && (
                <span className="inline-block bg-[#D4A843]/10 text-[#D4A843] text-xs font-inter font-bold
                                 px-3 py-1 rounded-full uppercase tracking-wide mb-5">
                  {post.category}
                </span>
              )}

              {/* Title */}
              <h1
                className="font-playfair font-bold text-[#0B1D2E] leading-tight mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
              >
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 font-inter pb-8 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-[#D4A843]" /> {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#D4A843]" /> {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#D4A843]" /> {post.readingTime} min de leitura
                </span>
                <button
                  onClick={handleShare}
                  className="ml-auto flex items-center gap-1.5 text-gray-400 hover:text-[#D4A843] transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                  {copied ? 'Link copiado!' : 'Compartilhar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured image */}
        {post.image && (
          <div className="container mx-auto px-4 mt-8">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="container mx-auto px-4 mt-10 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-10">

              {/* Article content */}
              <div className="lg:col-span-3">
                <div
                  className="prose-legal"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-gray-100">
                    <Tag size={14} className="text-gray-400" />
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-inter">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Related posts */}
                {related.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="font-playfair font-bold text-[#0B1D2E] text-xl mb-5">
                      Artigos relacionados
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {related.map(r => (
                        <div
                          key={r.id}
                          onClick={() => { navigate(`/blog/${r.slug}`); window.scrollTo(0, 0); }}
                          className="group cursor-pointer p-4 rounded-xl border border-gray-100
                                     hover:border-[#D4A843]/40 hover:bg-[#D4A843]/5 transition-all duration-200"
                        >
                          <p className="font-inter font-semibold text-[#0B1D2E] text-sm leading-snug
                                        group-hover:text-[#D4A843] transition-colors line-clamp-2 mb-2">
                            {r.title}
                          </p>
                          <div className="flex items-center gap-1.5 text-[#D4A843] text-xs font-inter font-semibold">
                            Ler <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4A843] transition-colors text-sm font-inter"
                  >
                    <ArrowLeft size={15} />
                    Ver todos os artigos
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-5 lg:sticky lg:top-28 self-start">
                {/* CTA */}
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{ background: 'linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 100%)' }}
                >
                  <div className="w-11 h-11 bg-[#D4A843]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <User size={18} className="text-[#D4A843]" />
                  </div>
                  <p className="font-playfair font-bold text-white text-sm leading-snug mb-2">
                    Dúvidas sobre este tema?
                  </p>
                  <p className="font-inter text-white/50 text-xs mb-5 leading-relaxed">
                    Receba orientação personalizada da Dra. Cíntia Maise.
                  </p>
                  <a
                    href="https://wa.me/5586998155727"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
                  >
                    Consulta via WhatsApp
                  </a>
                  <Link
                    to="/#contato"
                    className="block text-white/40 hover:text-white/70 text-xs font-inter mt-3 transition-colors"
                  >
                    Outros contatos
                  </Link>
                </div>

                {/* Aviso legal */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-inter text-amber-800 text-xs leading-relaxed">
                    <strong>Aviso legal:</strong> Este artigo é informativo e educativo. Para casos
                    específicos, consulte sempre um advogado especializado.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPost;
