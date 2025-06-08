import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServices, Service } from '@/hooks/useServices';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  duration: z.coerce.number().min(5, { message: 'Duração mínima de 5 minutos' }),
  description: z.string().min(5, { message: 'Descrição deve ter pelo menos 5 caracteres' }),
  active: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof formSchema>;

const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { services, saveService, updateService } = useServices();
  const isEditing = Boolean(id);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      duration: 30,
      description: '',
      active: true,
    }
  });

  // Load service data if editing
  useEffect(() => {
    if (isEditing && id && services.length > 0) {
      const service = services.find(s => s.id === id);
      if (service) {
        form.reset({
          name: service.name,
          duration: service.duration,
          description: service.description,
          active: service.active,
        });
      }
    }
  }, [isEditing, id, services, form]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      // Ensure all required fields are present with proper types
      const serviceData = {
        name: data.name,
        duration: data.duration,
        description: data.description,
        active: data.active,
      };

      if (isEditing && id) {
        await updateService(id, serviceData);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await saveService(serviceData);
        toast.success('Serviço criado com sucesso!');
      }
      navigate('/services');
    } catch (error) {
      toast.error('Erro ao salvar serviço. Tente novamente.');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/services')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle>
              {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? 'Atualização de tipo de atendimento'
                : 'Cadastro de novo tipo de atendimento'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do serviço</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do procedimento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (minutos)</FormLabel>
                    <FormControl>
                      <Input type="number" min="5" step="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o serviço ou procedimento" 
                      className="h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status</FormLabel>
                    <FormDescription>
                      {field.value ? 'Serviço ativo e disponível para agendamento' : 'Serviço inativo e indisponível para agendamento'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/services')}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServiceForm;
