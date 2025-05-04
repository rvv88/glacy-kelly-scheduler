
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { mockClinicsList } from '@/models/clinic';
import { mockCurrentUser, User } from '@/models/user';
import { User as UserIcon, Upload, Camera } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Digite um e-mail válido.' }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido. Formato: 123.456.789-00' }),
  phone: z.string().min(10, { message: 'Telefone inválido.' }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida. Use o formato: AAAA-MM-DD' }),
  clinicId: z.string({ required_error: 'Selecione uma clínica.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const [user, setUser] = useState<User>(mockCurrentUser);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      birthDate: user.birthDate,
      clinicId: user.clinicId,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Update user with form data
    const updatedUser = {
      ...user,
      ...data,
      clinicName: mockClinicsList.find(clinic => clinic.id === data.clinicId)?.name || user.clinicName,
      avatarUrl,
    };
    
    setUser(updatedUser);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="p-6 flex flex-col items-center">
            <div className="relative mb-6 cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-primary/10">
                  <UserIcon className="h-16 w-16 text-primary/80" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              aria-label="Upload avatar"
            />
            <Button 
              variant="outline" 
              onClick={handleAvatarClick} 
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Alterar foto
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Clique na foto ou no botão para fazer upload de uma nova imagem
            </p>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123.456.789-00" />
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
                          <Input {...field} placeholder="(11) 98765-4321" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="seu.email@exemplo.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de nascimento</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="clinicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clínica principal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma clínica" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockClinicsList.map((clinic) => (
                            <SelectItem key={clinic.id} value={clinic.id}>
                              {clinic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Salvar alterações
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
