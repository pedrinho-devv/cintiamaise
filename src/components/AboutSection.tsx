import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, GraduationCap, Scale, Stethoscope, BookOpen } from 'lucide-react';
import aboutImage from '@/assets/about.jpg';

// ── Animated counter ──────────────────────────────────────
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const STATS = [
  { value: 500, suffix: '+', label: 'Clientes\natendidos' },
  { value: 5, suffix: '+', label: 'Anos de\nexperiência' },
  { value: 98, suffix: '%', label: 'Clientes\nsatisfeitos' },
];

const EXPERTISE_TAGS = [
  'Aposentadoria Rural',
  'Aposentadoria Urbana',
  'BPC / LOAS',
  'Auxílio-Doença',
  'Pensão por Morte',
  'Revisão de Benefícios',
  'Benefícios por Incapacidade',
  'Ações Judiciais',
];

const TIMELINE = [
  {
    icon: Scale,
    title: 'Graduação em Direito',
    description: 'Formação jurídica com foco em Direito Previdenciário e Social.',
  },
  {
    icon: Stethoscope,
    title: 'Graduação em Enfermagem',
    description: 'Formação em saúde que enriquece a defesa em benefícios por incapacidade.',
  },
  {
    icon: GraduationCap,
    title: 'Pós-graduação em Direito Constitucional',
    description: 'Especialização aprofundada nas garantias fundamentais do cidadão.',
  },
  {
    icon: BookOpen,
    title: 'Pós-graduação em Direito Administrativo',
    description: 'Atuação eficiente frente ao INSS e demais órgãos públicos.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const c0 = useCounter(STATS[0].value, 2200, isInView);
  const c1 = useCounter(STATS[1].value, 1800, isInView);
  const c2 = useCounter(STATS[2].value, 2000, isInView);
  const counters = [c0, c1, c2];

  return (
    <section id="sobre" className="py-24 lg:py-32 bg-white overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ── Photo Column ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
            className="relative flex justify-center lg:justify-start"
          >
            {/* Geometric gold accent */}
            <div
              className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl opacity-15 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #D4A843, #E8C96A)' }}
            />
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-2xl opacity-10 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #D4A843, #E8C96A)' }}
            />

            {/* Main photo with golden frame */}
            <div className="relative max-w-md w-full">
              <div
                className="absolute inset-0 rounded-3xl translate-x-3 translate-y-3"
                style={{ background: 'linear-gradient(135deg, #D4A843 0%, #E8C96A 100%)' }}
              />
              <div
                className="relative rounded-3xl overflow-hidden border-2 border-[#D4A843]/40 gold-glow"
              >
                <img
                  src={aboutImage}
                  alt="Dra. Cíntia Maise — Advogada Previdenciária em Pedro II, PI"
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: '4/5', maxHeight: '600px' }}
                  loading="lazy"
                />
                {/* Subtle overlay */}
                <div
                  className="absolute bottom-0 inset-x-0 h-24"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(11,29,46,0.6) 0%, transparent 100%)',
                  }}
                />
              </div>

              {/* Stats overlay card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden sm:block absolute -right-4 lg:-right-6 top-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 lg:p-4 min-w-[130px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-[#D4A843]/15 rounded-full flex items-center justify-center">
                    <Scale size={12} className="text-[#D4A843]" />
                  </div>
                  <span className="font-inter text-xs text-gray-500">OAB/PI 19.605</span>
                </div>
                <p className="font-playfair font-bold text-[#0B1D2E] text-sm">Advogada</p>
                <p className="font-inter text-gray-400 text-[10px]">Direito Previdenciário</p>
              </motion.div>

              {/* Location badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="hidden sm:block absolute -left-3 lg:-left-5 bottom-10 bg-[#0B1D2E] rounded-2xl shadow-navy px-3 py-2 lg:px-4 lg:py-3"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#D4A843] animate-bounce-slow" />
                  <div>
                    <p className="font-inter font-semibold text-white text-xs">Pedro II, PI</p>
                    <p className="font-inter text-white/50 text-[10px]">Atend. presencial & online</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Content Column ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-8"
          >
            <motion.div variants={fadeUp}>
              <span className="section-label">Quem sou eu</span>
              <h2 className="section-title text-3xl lg:text-4xl">
                Dedicada a garantir <br />
                <span className="text-gold-gradient">seus direitos</span>
              </h2>
              <span className="section-divider" />
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4 font-inter text-gray-600 leading-relaxed text-[15px]">
              <p>
                Sou advogada especialista em <strong className="text-[#0B1D2E]">Direito Previdenciário</strong>,
                dedicada a oferecer orientação jurídica especializada a idosos, trabalhadores rurais,
                pessoas com deficiência e segurados urbanos que buscam acessar seus direitos junto ao{' '}
                <strong className="text-[#0B1D2E]">INSS</strong>.
              </p>
              <p>
                Minha dupla formação em <strong className="text-[#0B1D2E]">Direito e Enfermagem</strong>{' '}
                me permite compreender melhor as questões médicas envolvidas nos benefícios por
                incapacidade, proporcionando uma defesa mais sólida e eficiente.
              </p>
              <p>
                Acredito no atendimento <strong className="text-[#0B1D2E]">humanizado</strong> e na força da
                informação clara como ferramenta de transformação social. Cada cliente recebe atenção
                personalizada e comprometida com resultados reais.
              </p>
            </motion.div>

            {/* Stats counters */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="text-center py-4 px-2 rounded-2xl border border-gray-100 bg-[#F5F0E8]/50"
                >
                  <p className="font-playfair font-bold text-2xl lg:text-3xl text-[#D4A843]">
                    {counters[i]}{s.suffix}
                  </p>
                  <p className="font-inter text-gray-500 text-xs mt-1 leading-snug whitespace-pre-line">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Expertise tags */}
            <motion.div variants={fadeUp}>
              <p className="font-inter font-semibold text-[#0B1D2E] text-sm mb-3">
                Áreas de atuação
              </p>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_TAGS.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Formation timeline */}
            <motion.div variants={fadeUp}>
              <p className="font-inter font-semibold text-[#0B1D2E] text-sm mb-4">
                Formação acadêmica
              </p>
              <div className="relative space-y-4 pl-6">
                {/* Vertical line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#D4A843] to-[#D4A843]/20 rounded-full" />

                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className="flex gap-4 items-start"
                  >
                    {/* Dot */}
                    <div
                      className="absolute left-0 w-4 h-4 rounded-full border-2 border-[#D4A843] bg-white flex items-center justify-center"
                      style={{ marginTop: '2px' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                    </div>
                    <div className="ml-2">
                      <p className="font-inter font-semibold text-[#0B1D2E] text-sm">{item.title}</p>
                      <p className="font-inter text-gray-500 text-xs mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
