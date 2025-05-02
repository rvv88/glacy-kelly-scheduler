
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
  Instagram,
  Facebook,
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
                alt="Dra. Glacy Kelly Bisaggio"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                src="/public/lovable-uploads/91c20e90-3d9d-4e9e-af71-d502738e19df.png"
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
