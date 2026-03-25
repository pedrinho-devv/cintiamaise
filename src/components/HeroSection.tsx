import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle } from 'lucide-react';
const aboutImage = '/hero.jpeg';

// Typewriter hook
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text === current) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

const TYPEWRITER_WORDS = [
  'aposentadoria segura.',
  'seus direitos no INSS.',
  'um futuro tranquilo.',
  'justiça previdenciária.',
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
};

const HeroSection = () => {
  const typed = useTypewriter(TYPEWRITER_WORDS, 75, 2200);
  const whatsappMsg = encodeURIComponent(
    'Olá, Dra. Cíntia! Vim pelo site e gostaria de agendar uma consulta.'
  );

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 50%, #0B1D2E 100%)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dots-gold opacity-60 pointer-events-none" />

      {/* Decorative blobs */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4A843 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center min-h-screen py-24 lg:py-32">

          {/* ── Left: Text Content (60%) ── */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="flex items-center gap-2 bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#E8C96A] text-xs font-inter font-semibold px-4 py-2 rounded-full">
                <CheckCircle size={13} className="text-[#D4A843]" />
                +500 clientes atendidos com sucesso
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-cormorant italic text-[#D4A843] text-xl md:text-2xl mb-3 tracking-wide"
            >
              Sou Cíntia Maise — Advogada Previdenciarista
            </motion.p>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-playfair font-bold text-white leading-[1.15] mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
            >
              Especialista em garantir seus{' '}
              <span className="text-gold-gradient">
                direitos previdenciários
              </span>{' '}
              com excelência.
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-playfair text-xl md:text-2xl text-white/60 mb-6 h-8"
            >
              Lutando pela sua{' '}
              <span className="text-[#E8C96A]">
                {typed}
                <span className="animate-pulse">|</span>
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="font-inter text-white/60 text-base md:text-lg leading-relaxed max-w-lg mb-10"
            >
              Planeje sua aposentadoria com segurança. Formação única em{' '}
              <strong className="text-white/80 font-medium">Direito e Enfermagem</strong>{' '}
              para uma assessoria completa em benefícios do INSS. Atendimento presencial em
              Pedro II, PI e online para todo o Brasil.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => scrollTo('contato')}
                className="btn-gold text-base px-8 py-4 font-semibold"
              >
                Agendar Consulta
              </button>
              <button
                onClick={() =>
                  window.open(`https://wa.me/5586998155727?text=${whatsappMsg}`, '_blank')
                }
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full
                           font-inter font-semibold text-base text-white border-2 border-white/20
                           hover:border-[#22C55E] hover:bg-[#22C55E]/10 transition-all duration-300"
              >
                {/* WhatsApp SVG */}
                <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chamar no WhatsApp
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/10"
            >
              {[
                { value: '+500', label: 'Clientes atendidos' },
                { value: '5+', label: 'Anos de experiência' },
                { value: '98%', label: 'Clientes satisfeitos' },
              ].map((stat) => (
                <div key={stat.value} className="flex flex-col">
                  <span className="font-playfair font-bold text-[#D4A843] text-2xl">{stat.value}</span>
                  <span className="font-inter text-white/50 text-xs">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Photo (40%) ── */}
          <div className="lg:col-span-2 order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              {/* Decorative ring */}
              <div
                className="absolute -inset-4 rounded-[2rem] opacity-40 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, #D4A843, #E8C96A, #D4A843, transparent, transparent)',
                  filter: 'blur(2px)',
                }}
              />
              {/* Decorative blob behind photo */}
              <div
                className="absolute -inset-6 rounded-[2.5rem] opacity-20 pointer-events-none animate-blob"
                style={{ background: 'radial-gradient(circle at 60% 40%, #D4A843, #1A3A5C)' }}
              />

              {/* Photo container */}
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-gold-lg border-2 border-[#D4A843]/30">
                <img
                  src={aboutImage}
                  alt="Cíntia Maise — Advogada Previdenciária"
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: '3/4', maxHeight: '480px' }}
                  loading="eager"
                />
                {/* Gradient overlay at bottom */}
                <div
                  className="absolute bottom-0 inset-x-0 h-32"
                  style={{
                    background:
                      'linear-gradient(to top, #0B1D2E 0%, rgba(11,29,46,0.4) 60%, transparent 100%)',
                  }}
                />
                {/* Name chip at bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
                    <p className="font-playfair font-bold text-white text-base">Dra. Cíntia Maise</p>
                    <p className="font-inter text-[#D4A843] text-xs mt-0.5">OAB/PI 19.605 · Direito Previdenciário</p>
                  </div>
                </div>
              </div>

              {/* Floating achievement badge — hidden on mobile */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:block absolute -right-3 lg:-right-4 top-10 bg-white rounded-2xl shadow-gold px-3 py-2 lg:px-4 lg:py-3 border border-[#D4A843]/20"
              >
                <p className="font-playfair font-bold text-[#0B1D2E] text-sm">+500</p>
                <p className="font-inter text-gray-500 text-[10px]">Clientes atendidos</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="hidden sm:block absolute -left-3 lg:-left-4 bottom-20 bg-[#D4A843] rounded-2xl shadow-gold px-3 py-2 lg:px-4 lg:py-3"
              >
                <p className="font-playfair font-bold text-[#0B1D2E] text-sm">Pedro II</p>
                <p className="font-inter text-[#0B1D2E]/70 text-[10px]">Piauí · Brasil</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollTo('sobre')}
      >
        <span className="font-inter text-white/30 text-xs uppercase tracking-widest">Rolar</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-[#D4A843]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
