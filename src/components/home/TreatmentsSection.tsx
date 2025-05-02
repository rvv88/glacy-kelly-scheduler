
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const treatments = [
  {
    title: 'Limpeza',
    description: 'Remoção de tártaro e placa bacteriana para manter seus dentes saudáveis.',
  },
  {
    title: 'Clareamento Dental',
    description: 'Procedimento estético para clarear os dentes.',
  },
  {
    title: 'Avaliação Invisalign',
    description: 'Consulta para avaliação de tratamento com alinhadores transparentes.',
  },
  {
    title: 'Botox',
    description: 'Aplicação de toxina botulínica para fins estéticos e terapêuticos.',
  },
];

const TreatmentsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-dental-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Serviços
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tratamentos Oferecidos
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça os principais serviços disponíveis em nosso consultório.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {treatments.map((treatment, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {treatment.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {treatment.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link to="/services">Ver Todos os Serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TreatmentsSection;
