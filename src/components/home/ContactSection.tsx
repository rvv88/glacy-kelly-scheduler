
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
} from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-dental-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Entre em Contato
            </h2>
            <p className="text-gray-500">
              Estamos disponíveis para esclarecer suas dúvidas e agendar sua consulta.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Av. Jornalista Ricardo Marinho, 360, sala 218, Barra da Tijuca, Rio de Janeiro-RJ. CEP 22631-350</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span>(21) 99987-9186</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Segunda a Sexta: 08h às 18h - Mediante Agendamento</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <a 
                  href="https://instagram.com/dra.kellybisaggio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-dental-700 hover:text-dental-800"
                >
                  <Instagram className="h-5 w-5" />
                  <span>@dra.kellybisaggio</span>
                </a>
                <a 
                  href="https://facebook.com/kellybisaggio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-dental-700 hover:text-dental-800"
                >
                  <Facebook className="h-5 w-5" />
                  <span>kellybisaggio</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row mt-2">
              <Button size="lg" asChild>
                <Link to="/calendar">Agendar Consulta</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.6622533086544!2d-43.36375592534702!3d-22.9758563791654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bda2ed54ec2e1%3A0x4431d4d25c8ac6f1!2sAv.%20Jornalista%20Ricardo%20Marinho%2C%20360%20-%20Barra%20da%20Tijuca%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022631-350!5e0!3m2!1spt-BR!2sbr!4v1714901943869!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="350" 
              style={{ border: 0, borderRadius: '0.5rem' }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Consultório"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
