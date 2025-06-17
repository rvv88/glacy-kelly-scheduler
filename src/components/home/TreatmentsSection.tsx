
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';

const TreatmentsSection = () => {
  const { services, loading } = useServices();

  // Filtrar apenas serviços ativos
  const activeServices = services.filter(service => service.active);

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Tratamentos</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Procedimentos Oferecidos
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Oferecemos uma ampla gama de tratamentos odontológicos com tecnologia de ponta e profissionais especializados.
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando procedimentos...</span>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            {activeServices.map((service) => (
              <Card key={service.id} className="group relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && activeServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum procedimento disponível no momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TreatmentsSection;
