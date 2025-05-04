
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-dental-50 to-dental-100 py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Consultório Odontológico <span className="text-primary">Dra. Glacy Kelly Bisaggio</span>
            </h1>
            <p className="text-xl text-gray-600">
              Cuidando do seu sorriso com excelência, tecnologia e atenção personalizada.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/calendar">Agendar Consulta</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">Conheça Nossa Clínica</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              alt="Dra. Glacy Kelly Bisaggio"
              className="aspect-video overflow-hidden rounded-xl object-cover object-center"
              src="https://drive.google.com/thumbnail?id=1NhS39G-de_bNXAmSe-baaY5fSjqOtVR9&sz=w550"
              width={550}
              height={310}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
