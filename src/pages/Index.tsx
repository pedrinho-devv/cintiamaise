import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import CTASection from '@/components/CTASection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => (
  <div className="min-h-screen bg-white font-inter overflow-x-hidden">
    <Header />
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CTASection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
