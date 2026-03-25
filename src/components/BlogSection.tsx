import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPublishedPosts, seedInitialPosts, BlogPost } from '@/lib/blogService';

const formatDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await seedInitialPosts();
      const published = await getPublishedPosts();
      setPosts(published.slice(0, 3));
    };
    load();
  }, []);

  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="py-24 lg:py-32" style={{ background: '#FAFAFA' }}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="section-label">Blog Jurídico</span>
            <h2 className="section-title text-3xl lg:text-4xl">Artigos e Orientações</h2>
            <p className="font-inter text-gray-500 mt-3 max-w-xl leading-relaxed">
              Conteúdo especializado em direito previdenciário para você conhecer
              e defender seus direitos junto ao INSS.
            </p>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="btn-outline-gold shrink-0 flex items-center gap-2 text-sm px-5 py-2.5"
          >
            Ver todos os artigos
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 group cursor-pointer bg-white rounded-3xl overflow-hidden
                       border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => navigate(`/blog/${featured.slug}`)}
          >
            <div className="relative overflow-hidden">
              <img
                src={
                  featured.image ||
                  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
                }
                alt={featured.title}
                className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {featured.category && (
                <span className="absolute top-4 left-4 bg-[#D4A843] text-[#0B1D2E] text-xs font-inter font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {featured.category}
                </span>
              )}
            </div>
            <div className="p-7">
              <div className="flex items-center gap-4 text-xs text-gray-400 font-inter mb-3">
                <span>{formatDate(featured.date)}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {featured.readingTime} min de leitura
                </span>
              </div>
              <h3 className="font-playfair font-bold text-[#0B1D2E] text-xl md:text-2xl leading-tight mb-3
                             group-hover:text-[#D4A843] transition-colors duration-200">
                {featured.title}
              </h3>
              <p className="font-inter text-gray-500 leading-relaxed line-clamp-2 mb-5">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-2 text-[#D4A843] text-sm font-inter font-semibold">
                Ler artigo completo
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {rest.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden
                           border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="relative overflow-hidden h-40">
                  <img
                    src={
                      post.image ||
                      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {post.category && (
                    <span className="absolute top-2.5 left-2.5 bg-[#D4A843]/90 text-[#0B1D2E] text-[10px] font-inter font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {post.category}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-inter mb-2">
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />{post.readingTime} min
                    </span>
                  </div>
                  <h3 className="font-playfair font-bold text-[#0B1D2E] leading-snug mb-2 line-clamp-2
                                 group-hover:text-[#D4A843] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="font-inter text-gray-500 text-sm line-clamp-2 flex-1 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-[#D4A843] text-xs font-inter font-semibold mt-auto">
                    Ler artigo
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl p-6 flex flex-col justify-between border border-white/5"
              style={{ background: 'linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 100%)' }}
            >
              <BookOpen size={22} className="text-[#D4A843] mb-4" />
              <div>
                <p className="font-playfair font-bold text-white mb-1.5">Tem dúvidas sobre seus direitos?</p>
                <p className="font-inter text-white/50 text-sm mb-4 leading-relaxed">
                  Consulte a Dra. Cíntia e descubra o que você tem direito junto ao INSS.
                </p>
                <button
                  onClick={() => { window.location.href = '/#contato'; }}
                  className="btn-gold w-full text-sm py-2.5 font-semibold"
                >
                  Falar com especialista
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
