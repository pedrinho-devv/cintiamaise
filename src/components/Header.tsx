import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo-cintia.png';

const NAV_LINKS = [
  { label: 'Início', section: 'inicio' },
  { label: 'Sobre', section: 'sobre' },
  { label: 'Serviços', section: 'servicos', hasDropdown: true },
  { label: 'Blog', section: 'blog' },
  { label: 'Contato', section: 'contato' },
];

const SERVICES = [
  'Aposentadorias',
  'BPC / LOAS',
  'Auxílio-Doença',
  'Revisão de Benefícios',
  'Pensão por Morte',
  'Ações Judiciais',
];

const staggerItem = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.3 },
  }),
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={[
          'transition-all duration-500 ease-in-out',
          scrolled
            ? 'bg-[#0B1D2E]/95 backdrop-blur-xl shadow-navy border-b border-white/5'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.button
              aria-label="Início"
              onClick={() => scrollTo('inicio')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="shrink-0 flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src={logo}
                alt="Cíntia Maise Advocacia"
                className="h-8 md:h-10 w-auto drop-shadow-lg"
              />
            </motion.button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu principal">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={() => scrollTo(link.section)}
                      className="nav-link flex items-center gap-1 px-3 py-2"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-full pt-2 min-w-[220px]"
                        >
                          <div className="bg-[#0B1D2E]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-navy-lg overflow-hidden">
                            <div className="p-2">
                              {SERVICES.map((s, i) => (
                                <button
                                  key={s}
                                  onClick={() => scrollTo('servicos')}
                                  className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-[#D4A843] hover:bg-white/5 rounded-xl transition-all duration-150 font-inter"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.section)}
                    className="nav-link px-3 py-2"
                  >
                    {link.label}
                  </button>
                )
              )}
            </nav>

            {/* CTA Button — desktop */}
            <div className="hidden lg:block">
              <motion.button
                onClick={() => scrollTo('contato')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-gold px-5 py-2.5 text-sm"
              >
                Agendar Consulta
              </motion.button>
            </div>

            {/* Hamburger — mobile */}
            <button
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 text-white/90 hover:text-[#D4A843] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
              className="fixed right-0 top-0 h-screen w-80 max-w-[88vw] z-50
                         bg-[#0B1D2E] border-l border-white/10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-[#D4A843]/20 rounded-lg flex items-center justify-center">
                    <Scale size={16} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <p className="text-white font-playfair font-bold text-sm leading-tight">Cíntia Maise</p>
                    <p className="text-[#D4A843] text-[10px] font-inter">Advocacia Previdenciária</p>
                  </div>
                </div>
                <button
                  aria-label="Fechar menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1" aria-label="Menu mobile">
                {NAV_LINKS.map((link, i) =>
                  link.hasDropdown ? (
                    <div key={link.label}>
                      <motion.button
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={staggerItem}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                                   text-white/80 hover:text-white hover:bg-white/5 transition-all
                                   font-inter text-base"
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                        />
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 space-y-0.5"
                          >
                            {SERVICES.map((s) => (
                              <li key={s}>
                                <button
                                  onClick={() => scrollTo('servicos')}
                                  className="w-full text-left px-4 py-2.5 text-sm text-white/60
                                             hover:text-[#D4A843] hover:bg-white/5 rounded-lg
                                             transition-all font-inter"
                                >
                                  {s}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.button
                      key={link.label}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={staggerItem}
                      onClick={() => scrollTo(link.section)}
                      className="w-full text-left px-4 py-3 rounded-xl
                                 text-white/80 hover:text-white hover:bg-white/5 transition-all
                                 font-inter text-base"
                    >
                      {link.label}
                    </motion.button>
                  )
                )}
              </nav>

              {/* Bottom CTA */}
              <div className="px-6 py-6 border-t border-white/10">
                <button
                  onClick={() => scrollTo('contato')}
                  className="btn-gold w-full text-center text-sm"
                >
                  Agendar Consulta
                </button>
                <p className="text-white/30 text-xs font-inter text-center mt-3">
                  (86) 99815-5727 · Pedro II, PI
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
