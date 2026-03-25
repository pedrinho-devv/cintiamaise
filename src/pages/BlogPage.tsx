import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getPublishedPosts, BlogPost, CATEGORIES, seedInitialPosts } from '@/lib/blogService';
import { setPageMeta } from '@/lib/seo';
import { Clock, Search, ArrowRight, BookOpen, X } from 'lucide-react';
import { motion } from 'framer-motion';

const formatDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      await seedInitialPosts();
      const published = await getPublishedPosts();
      setPosts(published);
      setPageMeta({
        title: 'Blog Jurídico de Direito Previdenciário | Cíntia Maise Advocacia',
        description: 'Artigos e orientações sobre aposentadoria rural, BPC/LOAS, auxílio-doença e benefícios do INSS. Conteúdo jurídico acessível pela Dra. Cíntia Maise — OAB/PI 19.605.',
        canonical: 'https://cintiamaise.adv.br/blog',
      });
      window.scrollTo(0, 0);
    };
    load();
  }, []);

  // Categorias que realmente têm posts
  const usedCategories = useMemo(
    () => [...new Set(posts.map(p => p.category).filter(Boolean))],
    [posts]
  );

  const filtered = useMemo(() => {
    let result = posts;
    if (category) result = result.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, search, category]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const hasFilters = search || category;

  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />

      {/* Hero */}
      <div
        className="pt-28 pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 100%)' }}
      >
        <div className="absolute inset-0 bg-dots-gold opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label text-[#D4A843]/70 mb-3">Conteúdo Jurídico</span>
            <h1 className="font-playfair font-bold text-white text-4xl lg:text-5xl mb-4">
              Blog Jurídico
            </h1>
            <p className="font-inter text-white/60 max-w-xl mx-auto text-lg">
              Artigos, orientações e informações sobre direito previdenciário para você
              conhecer e defender seus direitos.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-lg mx-auto mt-8"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar artigos..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20
                         text-white placeholder:text-white/40 font-inter
                         focus:outline-none focus:ring-2 focus:ring-[#D4A843]/50 focus:bg-white/15
                         backdrop-blur-sm transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">

        {/* Category filters */}
        {usedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => { setCategory(''); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-inter font-medium border transition-all duration-200 cursor-pointer ${
                !category
                  ? 'bg-[#D4A843] text-[#0B1D2E] border-[#D4A843]'
                  : 'border-gray-200 text-gray-600 hover:border-[#D4A843] hover:text-[#D4A843]'
              }`}
            >
              Todos ({posts.length})
            </button>
            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-inter font-medium border transition-all duration-200 cursor-pointer ${
                  category === cat
                    ? 'bg-[#D4A843] text-[#0B1D2E] border-[#D4A843]'
                    : 'border-gray-200 text-gray-600 hover:border-[#D4A843] hover:text-[#D4A843]'
                }`}
              >
                {cat} ({posts.filter(p => p.category === cat).length})
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-full text-sm font-inter text-red-500 border border-red-200 hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1"
              >
                <X size={12} /> Limpar filtros
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {hasFilters && (
          <p className="font-inter text-gray-500 text-sm mb-6">
            {filtered.length} artigo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            {category && ` em "${category}"`}
            {search && ` para "${search}"`}
          </p>
        )}

        {/* Posts grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="font-playfair font-bold text-[#0B1D2E] text-2xl mb-2">
              Nenhum artigo encontrado
            </h2>
            <p className="font-inter text-gray-500 mb-6">
              {hasFilters
                ? 'Tente outros termos de busca ou remova os filtros.'
                : 'Ainda não há artigos publicados. Volte em breve!'}
            </p>
            {hasFilters && (
              <button onClick={resetFilters} className="btn-gold px-6 py-3">
                Ver todos os artigos
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden
                           border border-gray-100 shadow-sm hover:shadow-xl
                           transition-all duration-300"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={
                      post.image ||
                      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-[#D4A843] text-[#0B1D2E] text-[10px] font-inter font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-inter mb-3">
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readingTime} min
                    </span>
                  </div>

                  <h2 className="font-playfair font-bold text-[#0B1D2E] text-lg leading-snug mb-2
                                group-hover:text-[#D4A843] transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="font-inter text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1.5 text-[#D4A843] text-sm font-semibold font-inter">
                    Ler artigo
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-inter
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:border-[#D4A843] hover:text-[#D4A843] transition-colors cursor-pointer"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 rounded-lg text-sm font-inter font-medium transition-all cursor-pointer ${
                  n === page
                    ? 'bg-[#D4A843] text-[#0B1D2E]'
                    : 'border border-gray-200 text-gray-600 hover:border-[#D4A843] hover:text-[#D4A843]'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-inter
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:border-[#D4A843] hover:text-[#D4A843] transition-colors cursor-pointer"
            >
              Próximo
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-16 rounded-3xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 100%)' }}
        >
          <h3 className="font-playfair font-bold text-white text-2xl mb-3">
            Ficou com dúvidas?
          </h3>
          <p className="font-inter text-white/60 mb-6 max-w-md mx-auto">
            Cada caso é único. Agende uma consulta e receba orientação
            jurídica personalizada da Dra. Cíntia Maise.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/#contato" className="btn-gold px-8 py-3.5 text-base font-semibold">
              Agendar Consulta
            </Link>
            <a
              href="https://wa.me/5586998155727"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full
                         border-2 border-white/20 text-white font-inter font-semibold text-base
                         hover:border-[#22C55E] hover:bg-[#22C55E]/10 transition-all duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BlogPage;
