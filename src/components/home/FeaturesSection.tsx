
import React from 'react';
import { Calendar, Clock, CheckCircle2, Smile } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: 'Agendamento Online',
    description: 'Agende suas consultas de forma rápida e fácil, direto pelo nosso sistema.',
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: 'Lembretes',
    description: 'Receba lembretes sobre suas consultas para não perder nenhum compromisso.',
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
    title: 'Tratamentos Modernos',
    description: 'Utilizamos as técnicas mais avançadas em odontologia para o seu cuidado.',
  },
  {
    icon: <Smile className="h-8 w-8 text-primary" />,
    title: 'Atendimento Humanizado',
    description: 'Tratamos cada paciente com cuidado, atenção e carinho em cada etapa.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nossos Diferenciais
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Conheça os serviços exclusivos que oferecemos para garantir seu conforto e satisfação.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
