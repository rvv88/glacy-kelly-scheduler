
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sobre</h2>
        <p className="text-muted-foreground mt-2">
          Conheça a Dra. Glacy Kelly Bisaggio e sua trajetória profissional
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 md:p-10 flex items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-dental-700">Excelência em Odontologia</h3>
                <div className="space-y-4 text-balance">
                  <p>
                    Com uma trajetória sólida e dedicada à saúde e ao bem-estar de seus pacientes, 
                    a Dra. Glacy Kelly Bisaggio atua há mais de 35 anos nas áreas de harmonização 
                    orofacial e ortodontia. Reconhecida por sua excelência técnica, sensibilidade 
                    estética e atendimento humanizado, ela une experiência e constante atualização 
                    científica para oferecer tratamentos personalizados, seguros e eficazes.
                  </p>
                  
                  <p>
                    Seu consultório é um espaço acolhedor, pensado para proporcionar conforto 
                    e confiança a quem busca melhorar sua qualidade de vida, autoestima e saúde 
                    bucal. Cada procedimento é realizado com responsabilidade, atenção aos detalhes 
                    e respeito às necessidades individuais de cada paciente.
                  </p>
                  
                  <p>
                    A Dra. Glacy acredita que o sorriso vai além da estética — é uma expressão 
                    de bem-estar e confiança. Por isso, coloca sua expertise a serviço de resultados 
                    naturais e harmônicos, valorizando a beleza única de cada rosto.
                  </p>
                  
                  <p>
                    Seja para cuidar da saúde dos seus dentes ou para realçar sua beleza de forma 
                    equilibrada e segura, você pode contar com a experiência e o profissionalismo 
                    da Dra. Glacy Kelly Bisaggio.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:h-auto">
              <img 
                src="https://drive.google.com/thumbnail?id=1GEsRrCsVdC5oS1erjyOGsbrHhKX98CrG&sz=w600" 
                alt="Dra. Kelly Bisaggio" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold text-dental-700 mb-4">Especialidades</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Harmonização Orofacial</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Ortodontia Digital</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Clareamento Dental</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Tratamento com Invisalign</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Procedimentos Estéticos</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dental-700 mb-4">Formação e Qualificações</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Graduação em Odontologia</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Especialização em Ortodontia</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Especialização em Harmonização Orofacial</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Certificação em Tecnologias Digitais para Ortodontia</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-dental-500"></span>
                  <span>Membro de Sociedades Odontológicas Nacionais e Internacionais</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
