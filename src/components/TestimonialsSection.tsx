import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  role: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Maria das Graças S.',
    location: 'Pedro II, PI',
    role: 'Aposentadoria Rural',
    text:
      'A Dra. Cíntia foi fundamental para eu conseguir minha aposentadoria rural. Passei anos tentando sozinha e em poucos meses com ela resolvi tudo. Atendimento humano, explicou tudo com clareza e nunca me deixou com dúvidas.',
    rating: 5,
    initials: 'MG',
    color: '#1A3A5C',
  },
  {
    id: 2,
    name: 'José Antônio L.',
    location: 'Campo Maior, PI',
    role: 'Auxílio-Doença',
    text:
      'Meu auxílio-doença foi negado pelo INSS e eu não sabia o que fazer. A Dra. Cíntia entrou com recurso e conseguiu meu benefício em tempo recorde. Sua formação em Enfermagem fez toda a diferença na hora de apresentar os laudos médicos.',
    rating: 5,
    initials: 'JA',
    color: '#D4A843',
  },
  {
    id: 3,
    name: 'Ana Beatriz M.',
    location: 'Teresina, PI',
    role: 'BPC / LOAS',
    text:
      'Consegui o BPC/LOAS para minha mãe que tem deficiência. A Dra. Cíntia foi muito atenciosa, explicou cada etapa do processo e o resultado veio com direito a retroativo. Indico sem hesitar para qualquer pessoa que precise.',
    rating: 5,
    initials: 'AB',
    color: '#0B1D2E',
  },
  {
    id: 4,
    name: 'Francisco R.',
    location: 'Piripiri, PI',
    role: 'Revisão de Benefício',
    text:
      'Fiz a revisão da minha aposentadoria e tive um aumento significativo, além de receber os valores retroativos. A Dra. Cíntia foi extremamente profissional e transparente durante todo o processo. Recomendo a todos!',
    rating: 5,
    initials: 'FR',
    color: '#1A3A5C',
  },
  {
    id: 5,
    name: 'Raimunda T.',
    location: 'Pedro II, PI',
    role: 'Pensão por Morte',
    text:
      'Após perder meu marido, a Dra. Cíntia me orientou sobre a pensão por morte e consegui o benefício rapidamente. Além de competente, ela foi muito humana num momento tão difícil da minha vida. Gratidão eterna!',
    rating: 5,
    initials: 'RT',
    color: '#D4A843',
  },
];

const QuoteIcon = () => (
  <svg
    className="w-12 h-12 text-[#D4A843] opacity-25"
    fill="currentColor"
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <path d="M10 8C5.6 8 2 11.6 2 16s3.6 8 8 8c.8 0 1.6-.1 2.4-.4C11 26.4 9 28.9 6.5 30.5L8 32c4-2 7.5-5.6 7.5-11.5C15.5 13.9 13.3 8 10 8zm18 0c-4.4 0-8 3.6-8 8s3.6 8 8 8c.8 0 1.6-.1 2.4-.4C29 26.4 27 28.9 24.5 30.5L26 32c4-2 7.5-5.6 7.5-11.5C33.5 13.9 31.3 8 28 8z" />
  </svg>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1" aria-label={`${rating} estrelas de 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={15}
        className={i < rating ? 'text-[#D4A843] fill-[#D4A843]' : 'text-gray-300'}
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [paused, next]);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, transition: { duration: 0.3 } }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section
      id="depoimentos"
      className="py-24 lg:py-32 overflow-hidden"
      style={{ background: '#F5F0E8' }}
    >
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-label">Depoimentos</span>
          <h2 className="section-title text-3xl lg:text-4xl">
            O que dizem nossos <span className="text-gold-gradient">clientes</span>
          </h2>
          <span className="section-divider mx-auto" />
          <p className="font-inter text-gray-500 max-w-xl mx-auto">
            A satisfação dos nossos clientes é o melhor reflexo do trabalho que realizamos.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[300px] flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={t.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                  {/* Decorative quote */}
                  <div className="absolute top-6 right-8">
                    <QuoteIcon />
                  </div>

                  {/* Stars */}
                  <div className="mb-5">
                    <StarRating rating={t.rating} />
                  </div>

                  {/* Text */}
                  <blockquote className="font-inter text-gray-700 text-base md:text-lg leading-relaxed italic mb-8 relative z-10">
                    "{t.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center
                                 font-playfair font-bold text-white text-sm shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-[#0B1D2E]">{t.name}</p>
                      <p className="font-inter text-gray-500 text-sm">{t.location}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-block bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] text-xs font-inter font-semibold px-3 py-1 rounded-full">
                        {t.role}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Depoimento anterior"
              className="w-11 h-11 rounded-full border-2 border-[#D4A843]/40 text-[#D4A843]
                         hover:bg-[#D4A843] hover:text-[#0B1D2E] transition-all duration-200
                         flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === current
                      ? 'w-6 h-2.5 bg-[#D4A843]'
                      : 'w-2.5 h-2.5 bg-[#D4A843]/30 hover:bg-[#D4A843]/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Próximo depoimento"
              className="w-11 h-11 rounded-full border-2 border-[#D4A843]/40 text-[#D4A843]
                         hover:bg-[#D4A843] hover:text-[#0B1D2E] transition-all duration-200
                         flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-8 mt-14 pt-10 border-t border-[#D4A843]/20"
        >
          {[
            { value: '5.0', label: 'Avaliação média' },
            { value: '+500', label: 'Casos resolvidos' },
            { value: '100%', label: 'Comprometimento' },
          ].map((item) => (
            <div key={item.value} className="text-center">
              <p className="font-playfair font-bold text-2xl text-[#D4A843]">{item.value}</p>
              <p className="font-inter text-gray-500 text-sm">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
