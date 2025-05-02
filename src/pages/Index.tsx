
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TreatmentsSection from '@/components/home/TreatmentsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TreatmentsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
