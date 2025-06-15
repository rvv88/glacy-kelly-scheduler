
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Clinic } from '@/models/clinic';
import { toast } from 'sonner';
import { useClinics } from '@/hooks/useClinics';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  street: z.string().min(3, { message: 'Logradouro deve ter pelo menos 3 caracteres' }),
  number: z.string().min(1, { message: 'Número é obrigatório' }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: 'Bairro deve ter pelo menos 2 caracteres' }),
  city: z.string().min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' }),
  state: z.string().min(2, { message: 'Estado deve ter pelo menos 2 caracteres' }),
  zipCode: z.string().min(8, { message: 'CEP inválido' }),
  phone: z.string().optional().or(z.literal('')),
});

type ClinicFormValues = z.infer<typeof formSchema>;

const ClinicsPage: React.FC = () => {
  const { clinics, loading, saveClinic, updateClinic, deleteClinic } = useClinics();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    }
  });

  const openDialog = (clinic?: Clinic) => {
    if (clinic) {
      setEditingClinic(clinic);
      form.reset({
        name: clinic.name,
        street: clinic.street,
        number: clinic.number,
        complement: clinic.complement || '',
        neighborhood: clinic.neighborhood,
        city: clinic.city,
        state: clinic.state,
        zipCode: clinic.zipCode,
        phone: clinic.phone || '',
      });
    } else {
      setEditingClinic(null);
      form.reset({
        name: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClinic(null);
  };

  const onSubmit = async (data: ClinicFormValues) => {
    try {
      const clinicData: Omit<Clinic, 'id'> = {
        name: data.name,
        street: data.street,
        number: data.number,
        complement: data.complement || undefined,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone || '',
      };

      console.log('Enviando dados da clínica:', clinicData);

      if (editingClinic) {
        await updateClinic(editingClinic.id, clinicData);
        toast.success('Clínica atualizada com sucesso!');
      } else {
        await saveClinic(clinicData);
        toast.success('Clínica cadastrada com sucesso!');
      }
      closeDialog();
    } catch (error) {
      console.error('Erro ao salvar clínica:', error);
      toast.error('Erro ao salvar clínica. Tente novamente.');
    }
  };

  const handleDelete = async (clinic: Clinic) => {
    try {
      await deleteClinic(clinic.id);
      toast.success('Clínica removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover clínica. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando clínicas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clínicas</h2>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Clínica
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{clinic.name}</CardTitle>
              <CardDescription>Unidade de atendimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Endereço:</strong> {clinic.street}, {clinic.number}
                {clinic.complement && `, ${clinic.complement}`}
                <br />
                {clinic.neighborhood}, {clinic.city} - {clinic.state}
              </div>
              <div className="text-sm">
                <strong>CEP:</strong> {clinic.zipCode}
              </div>
              <div className="text-sm">
                <strong>Telefone:</strong> {clinic.phone || 'Não informado'}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => openDialog(clinic)}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(clinic)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingClinic ? 'Editar Clínica' : 'Nova Clínica'}
            </DialogTitle>
            <DialogDescription>
              {editingClinic 
                ? 'Atualize as informações da clínica.' 
                : 'Preencha os dados para adicionar uma nova clínica.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da clínica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Avenida, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Sala, Andar, etc. (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicsPage;
