import { motion } from 'framer-motion';
import {
  Users, Cake, Factory, Wheat, Heart, Baby,
  Lock, HandHeart, LineChart, Scale, Lightbulb,
} from 'lucide-react';

const SERVICES = [
  {
    Icon: Users,
    title: 'Aposentadoria por Tempo de Contribuição',
    description:
      'Análise completa do seu histórico contributivo para garantir o melhor benefício possível.',
  },
  {
    Icon: Cake,
    title: 'Aposentadoria por Idade',
    description:
      'Orientação para aposentadoria por idade urbana e rural, com cálculo preciso dos valores.',
  },
  {
    Icon: Factory,
    title: 'Aposentadoria Especial',
    description:
      'Para trabalhadores expostos a agentes nocivos. Análise técnica com visão médico-jurídica.',
  },
  {
    Icon: Wheat,
    title: 'Aposentadoria Rural',
    description:
      'Comprovação de atividade rural e concessão de benefícios para trabalhadores do campo.',
  },
  {
    Icon: Heart,
    title: 'Auxílio-Doença',
    description:
      'Solicitação e recurso de auxílio-doença com acompanhamento médico-jurídico especializado.',
  },
  {
    Icon: Baby,
    title: 'Salário-Maternidade',
    description:
      'Garantia do salário-maternidade para mães trabalhadoras, autônomas e seguradas do INSS.',
  },
  {
    Icon: Lock,
    title: 'Auxílio-Reclusão',
    description:
      'Benefício para dependentes de segurados privados de liberdade. Defesa completa do direito.',
  },
  {
    Icon: HandHeart,
    title: 'BPC / LOAS',
    description:
      'Benefício de Prestação Continuada para pessoas com deficiência e idosos de baixa renda.',
  },
  {
    Icon: LineChart,
    title: 'Revisão de Benefícios',
    description:
      'Análise e revisão de benefícios concedidos para correção de valores e diferenças retroativas.',
  },
  {
    Icon: Scale,
    title: 'Ações Judiciais',
    description:
      'Representação em ações contra o INSS para garantia dos seus direitos previdenciários.',
  },
  {
    Icon: Lightbulb,
    title: 'Consultoria Previdenciária',
    description:
      'Planejamento estratégico para maximizar seus benefícios futuros e evitar perdas desnecessárias.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
};

const ServicesSection = () => (
  <section id="servicos" className="py-24 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F0E8 100%)' }}>
    <div className="container mx-auto px-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <span className="section-label">Especialidades</span>
        <h2 className="section-title text-3xl lg:text-4xl mb-4">Nossos Serviços</h2>

        {/* Animated divider */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-0.5 mx-auto mb-6 rounded-full"
          style={{ background: 'linear-gradient(90deg, #D4A843, #E8C96A)' }}
        />

        <p className="font-inter text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Assessoria jurídica completa em direito previdenciário com foco em
          <strong className="text-[#0B1D2E]"> garantir seus direitos</strong> junto ao INSS.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={cardVariants}
            className="card-glass group cursor-default"
          >
            <div className="p-6 lg:p-7">
              {/* Icon */}
              <div className="mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center
                             transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #D4A843 0%, #E8C96A 100%)' }}
                >
                  <service.Icon className="w-7 h-7 text-[#0B1D2E]" strokeWidth={1.8} />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-playfair font-bold text-[#0B1D2E] text-[17px] leading-tight mb-3">
                {service.title}
              </h3>
              <p className="font-inter text-gray-500 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Gold top border on hover (CSS transition via card-glass) */}
            <div
              className="absolute top-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, #D4A843, #E8C96A)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-16 text-center"
      >
        <p className="font-inter text-gray-500 mb-6">
          Não encontrou o que procura? Entre em contato e analisamos seu caso.
        </p>
        <button
          onClick={() => scrollTo('contato')}
          className="btn-gold px-10 py-4 text-base font-semibold"
        >
          Entre em Contato
        </button>
      </motion.div>
    </div>
  </section>
);

export default ServicesSection;
