import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const WHATSAPP_MSG = encodeURIComponent(
  'Olá, Dra. Cíntia! Vim pelo site e gostaria de agendar uma consulta sobre meus direitos previdenciários.'
);
const WHATSAPP_URL = `https://wa.me/5586998155727?text=${WHATSAPP_MSG}`;

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '(86) 99815-5727',
    link: WHATSAPP_URL,
    linkLabel: 'Chamar agora →',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'cintia.nunesgalvao@gmail.com',
    link: 'mailto:cintia.nunesgalvao@gmail.com',
    linkLabel: 'Enviar e-mail →',
  },
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'Pedro II, Piauí',
    sub: 'Atendimento presencial e online',
    link: null,
    linkLabel: null,
  },
  {
    icon: Clock,
    label: 'Horário',
    value: 'Seg–Sex: 8h às 18h',
    sub: null,
    link: null,
    linkLabel: null,
  },
];

const ContactSection = () => (
  <section id="contato" className="py-24 lg:py-32 bg-white">
    <div className="container mx-auto px-4">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <span className="section-label">Fale conosco</span>
        <h2 className="section-title text-3xl lg:text-4xl">Entre em Contato</h2>
        <span className="section-divider mx-auto" />
        <p className="font-inter text-gray-500 max-w-xl mx-auto">
          Precisa de orientação jurídica? Entre em contato e agende sua consulta com a Dra. Cíntia Maise.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* Contact cards */}
        {CONTACT_ITEMS.map(({ icon: Icon, label, value, sub, link, linkLabel }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ x: 4 }}
            className="flex gap-4 items-start p-5 rounded-2xl border border-gray-100 bg-[#F5F0E8]/40 hover:border-[#D4A843]/30 transition-colors duration-200"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4A843 0%, #E8C96A 100%)' }}
            >
              <Icon size={18} className="text-[#0B1D2E]" />
            </div>
            <div>
              <p className="font-inter font-semibold text-[#0B1D2E] text-sm">{label}</p>
              <p className="font-inter text-gray-600 mt-0.5">{value}</p>
              {sub && <p className="font-inter text-gray-400 text-xs mt-0.5">{sub}</p>}
              {link && linkLabel && (
                <a
                  href={link}
                  target={link.startsWith('http') ? '_blank' : undefined}
                  rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="font-inter text-[#D4A843] text-sm font-medium hover:underline mt-1 inline-block transition-colors"
                >
                  {linkLabel}
                </a>
              )}
            </div>
          </motion.div>
        ))}

        {/* Google Maps embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        >
          <iframe
            title="Localização — Pedro II, Piauí"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63530.0!2d-41.4586!3d-4.4289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x78f2b3e4e4e4e4e5%3A0x1234567890abcdef!2sPedro%20II%2C%20PI!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="240"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* WhatsApp CTA */}
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.42 }}
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 justify-center py-4 rounded-2xl
                     bg-[#22C55E] hover:bg-[#16A34A] text-white font-inter font-semibold
                     transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Falar agora no WhatsApp
        </motion.a>
      </div>
    </div>
  </section>
);

export default ContactSection;
