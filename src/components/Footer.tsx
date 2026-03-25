import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Instagram, ArrowUp } from 'lucide-react';
import logo from '@/assets/logo-cintia.png';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
};

const NAV_LINKS = ['inicio', 'sobre', 'servicos', 'blog', 'contato'];
const NAV_LABELS: Record<string, string> = {
  inicio: 'Início',
  sobre: 'Sobre',
  servicos: 'Serviços',
  blog: 'Blog',
  contato: 'Contato',
};

const SERVICES = [
  'Aposentadoria Rural',
  'Aposentadoria por Idade',
  'Auxílio-Doença',
  'BPC / LOAS',
  'Pensão por Morte',
  'Revisão de Benefícios',
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/cintiamaise',
    Icon: Instagram,
  },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden" style={{ background: '#0B1D2E' }}>
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-dots-gold opacity-30 pointer-events-none" />

      {/* Gold separator top */}
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #D4A843 30%, #E8C96A 50%, #D4A843 70%, transparent 100%)',
        }}
      />

      {/* Main content */}
      <div className="container mx-auto px-4 pt-14 pb-10 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="space-y-5">
            <div>
              <img
                src={logo}
                alt="Cíntia Maise Advocacia"
                className="h-14 w-auto object-contain"
              />
            </div>

            <p className="font-inter text-white/50 text-sm leading-relaxed max-w-xs">
              Assessoria jurídica especializada em Direito Previdenciário, com atendimento
              humano e foco em resultados reais para cada cliente.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center
                             text-white/40 hover:text-[#D4A843] hover:border-[#D4A843]/40
                             hover:bg-[#D4A843]/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="font-inter font-semibold text-white text-sm uppercase tracking-widest mb-5">
              Navegação
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="font-inter text-white/50 text-sm hover:text-[#D4A843] transition-colors duration-200 cursor-pointer"
                  >
                    {NAV_LABELS[id]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <p className="font-inter font-semibold text-white text-sm uppercase tracking-widest mb-5">
              Serviços
            </p>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo('servicos')}
                    className="font-inter text-white/50 text-sm hover:text-[#D4A843] transition-colors duration-200 cursor-pointer text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <p className="font-inter font-semibold text-white text-sm uppercase tracking-widest mb-5">
              Contato
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/5586998155727"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-white/50 text-sm hover:text-[#D4A843] transition-colors"
                >
                  (86) 99815-5727
                </a>
              </li>
              <li>
                <a
                  href="mailto:cintia.nunesgalvao@gmail.com"
                  className="font-inter text-white/50 text-sm hover:text-[#D4A843] transition-colors"
                >
                  cintia.nunesgalvao@gmail.com
                </a>
              </li>
              <li>
                <p className="font-inter text-white/50 text-sm">Pedro II, Piauí</p>
                <p className="font-inter text-white/30 text-xs mt-0.5">Seg–Sex: 8h às 18h</p>
              </li>
            </ul>

            <button
              onClick={() => scrollTo('contato')}
              className="mt-6 inline-flex items-center gap-2 btn-gold text-sm px-5 py-2.5"
            >
              <Mail size={14} />
              Fale Conosco
            </button>
          </div>
        </div>
      </div>

      {/* Gold separator bottom */}
      <div
        className="h-px w-full relative z-10"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #D4A843 30%, #E8C96A 50%, #D4A843 70%, transparent 100%)',
          opacity: 0.3,
        }}
      />

      {/* Bottom bar */}
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs font-inter">
          <p>© {year} Cíntia Maise Advocacia. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>OAB/PI 19.605 — Advocacia Previdenciária</span>
            <button
              onClick={() => scrollTo('inicio')}
              className="text-white/20 hover:text-white/60 transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
          </div>
        </div>
      </div>

      {/* Back-to-top button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Voltar ao topo"
            className="fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full
                       bg-[#D4A843] text-[#0B1D2E] shadow-gold
                       flex items-center justify-center
                       hover:bg-[#E8C96A] transition-all duration-200
                       hover:scale-110 cursor-pointer"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
