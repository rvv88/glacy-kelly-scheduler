
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockClinics, Clinic } from '@/models/clinic';
import { toast } from 'sonner';
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
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
});

type ClinicFormValues = z.infer<typeof formSchema>;

const ClinicsPage: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>(mockClinics);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
    }
  });

  const openDialog = (clinic?: Clinic) => {
    if (clinic) {
      setEditingClinic(clinic);
      form.reset({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
      });
    } else {
      setEditingClinic(null);
      form.reset({
        name: '',
        address: '',
        phone: '',
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClinic(null);
  };

  const onSubmit = (data: ClinicFormValues) => {
    if (editingClinic) {
      // Update existing clinic
      setClinics(prevClinics => 
        prevClinics.map(c => 
          c.id === editingClinic.id 
            ? { ...c, ...data } 
            : c
        )
      );
      toast.success('Clínica atualizada com sucesso!');
    } else {
      // Add new clinic
      const newClinic: Clinic = {
        id: `${Date.now()}`,
        ...data,
      };
      setClinics(prevClinics => [...prevClinics, newClinic]);
      toast.success('Clínica cadastrada com sucesso!');
    }
    closeDialog();
  };

  const handleDelete = (clinic: Clinic) => {
    setClinics(prevClinics => prevClinics.filter(c => c.id !== clinic.id));
    toast.success('Clínica removida com sucesso!');
  };

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
                <strong>Endereço:</strong> {clinic.address}
              </div>
              <div className="text-sm">
                <strong>Telefone:</strong> {clinic.phone}
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
        <DialogContent>
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
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da clínica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo" {...field} />
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
