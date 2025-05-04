
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Mail, MapPin, Phone } from 'lucide-react';
import { mockClinics, getFullAddress } from '@/models/clinic';

const ContactSection = () => {
  return (
    <section className="py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Contato</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Entre em Contato</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Estamos prontos para atender você em nossas unidades. Entre em contato para marcar uma consulta ou tirar dúvidas.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Fale Conosco</h3>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>contato@drakellybisaggio.com.br</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>(21) 99987-9186</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4">
              {mockClinics.map((clinic) => (
                <Card key={clinic.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Building className="h-5 w-5 mt-1 text-primary" />
                      <div>
                        <h3 className="text-lg font-bold mb-1">{clinic.name}</h3>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{getFullAddress(clinic)}</p>
                        </div>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Telefone:</span> {clinic.phone}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-background shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Envie uma Mensagem</h3>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <input
                    id="name"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    type="text"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    type="email"
                    placeholder="Seu email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    className="min-h-32 rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Como podemos ajudar?"
                    required
                  ></textarea>
                </div>
                <Button type="submit">Enviar Mensagem</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
