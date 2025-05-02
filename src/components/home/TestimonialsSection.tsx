
import React from 'react';
import { Heart } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Depoimentos
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              O que nossos pacientes dizem
            </h2>
            <p className="text-muted-foreground mt-2">
              <a href="https://g.co/kgs/ERU3vcL" target="_blank" rel="noopener noreferrer" className="text-dental-700 hover:underline">
                Ver todas as avaliações no Google
              </a>
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <Card className="transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm/relaxed italic text-muted-foreground mb-4">
                "Excelente profissional! Dra. Kelly é muito atenciosa e competente. Estou muito satisfeita com meu tratamento de Invisalign e meus procedimentos estéticos."
              </p>
              <div className="flex items-center justify-between">
                <p className="font-medium">Maria Souza</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-dental-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm/relaxed italic text-muted-foreground mb-4">
                "A Dra. Kelly transformou meu sorriso e minha autoestima! Atendimento de altíssima qualidade, ambiente acolhedor e resultados impressionantes."
              </p>
              <div className="flex items-center justify-between">
                <p className="font-medium">Pedro Oliveira</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-dental-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm/relaxed italic text-muted-foreground mb-4">
                "Recomendo muito a Dra. Kelly! O tratamento com Invisalign superou minhas expectativas. Além disso, o atendimento é sempre pontual e a equipe muito atenciosa."
              </p>
              <div className="flex items-center justify-between">
                <p className="font-medium">Carla Mendes</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-dental-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
