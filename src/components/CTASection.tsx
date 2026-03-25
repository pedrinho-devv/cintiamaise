import { motion } from 'framer-motion';
import { Shield, Award, Clock } from 'lucide-react';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
};

const TRUST_ITEMS = [
  { icon: Shield, label: 'Sigilo Garantido' },
  { icon: Award, label: 'OAB/PI 19.605' },
  { icon: Clock, label: 'Resposta Rápida' },
];

const CTASection = () => (
  <section className="relative py-20 lg:py-28 overflow-hidden">
    {/* Background */}
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(135deg, #0B1D2E 0%, #1A3A5C 60%, #0B1D2E 100%)' }}
    />
    <div className="absolute inset-0 bg-dots-gold opacity-40 pointer-events-none" />

    {/* Glow */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 opacity-10 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse, #D4A843, transparent)' }}
    />

    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-label text-[#D4A843]/70 mb-4">Dê o primeiro passo</span>
        <h2
          className="font-playfair font-bold text-white leading-tight mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
        >
          Precisa de ajuda com seus{' '}
          <span className="text-gold-gradient">direitos previdenciários?</span>
        </h2>
        <p className="font-inter text-white/60 text-lg max-w-2xl mx-auto mb-10">
          Não perca seu direito por falta de informação. Consulte a Dra. Cíntia
          Maise e descubra o que você tem direito junto ao INSS.
        </p>

        {/* CTA Button with ripple */}
        <motion.button
          onClick={() => scrollTo('contato')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="btn-gold text-lg px-12 py-5 font-semibold animate-gold-pulse"
        >
          Agendar Consulta
        </motion.button>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-10">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/50">
              <Icon size={15} className="text-[#D4A843]/70" />
              <span className="font-inter text-sm">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
