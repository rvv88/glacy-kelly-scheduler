
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Smile,
  Heart,
  Sparkles,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
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

const treatments = [
  {
    title: 'Limpeza Dental',
    description: 'Remoção de tártaro e placa bacteriana para manter seus dentes saudáveis.',
  },
  {
    title: 'Tratamento de Canal',
    description: 'Procedimento para tratar infecções na polpa do dente e aliviar a dor.',
  },
  {
    title: 'Implantes Dentários',
    description: 'Substitutos artificiais para raízes dentárias, oferecendo uma solução permanente.',
  },
  {
    title: 'Clareamento',
    description: 'Tratamento estético para deixar seus dentes mais brancos e brilhantes.',
  },
];

const testimonials = [
  {
    name: 'Ana Silva',
    text: 'Atendimento excepcional. A Dra. Glacy é extremamente profissional e gentil. Recomendo a todos!',
  },
  {
    name: 'Pedro Oliveira',
    text: 'Ambiente acolhedor e equipe muito atenciosa. Meus tratamentos foram rápidos e sem dor!',
  },
  {
    name: 'Carla Mendes',
    text: 'O consultório tem equipamentos modernos e o atendimento é sempre pontual. Estou muito satisfeita!',
  },
];

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
                alt="Consultório Odontológico"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1000&auto=format&fit=crop"
                width={550}
                height={310}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Treatments Section */}
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

      {/* Testimonials Section */}
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
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm/relaxed italic text-muted-foreground mb-4">
                    "{testimonial.text}"
                  </p>
                  <p className="font-medium">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
                  <span>Rua Exemplo, 123 - Centro - Cidade/UF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>(00) 12345-6789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Segunda a Sexta: 08h às 18h</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/calendar">Agendar Consulta</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                alt="Mapa de localização"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1000&auto=format&fit=crop"
                width={550}
                height={310}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Consultório Odontológico Dra. Glacy Kelly Bisaggio. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
