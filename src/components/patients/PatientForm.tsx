
import React, { useEffect, useState, useRef } from 'react';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Camera, Upload, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import { useClinics } from '@/hooks/useClinics';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }),
  birthdate: z.string().min(1, { message: 'Data de nascimento é obrigatória' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' }),
  clinicId: z.string().min(1, { message: 'Selecione uma clínica' }),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof formSchema>;

interface PatientFormProps {
  initialData?: PatientFormValues;
}

const PatientForm: React.FC<PatientFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { patientProfile, hasProfile, savePatientProfile, loading: profileLoading } = usePatientProfile();
  const { clinics, loading: clinicsLoading } = useClinics();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: user?.email || '',
      phone: '',
      cpf: '',
      birthdate: '',
      address: '',
      clinicId: '',
      notes: '',
    }
  });

  // Preenche o formulário com dados existentes do perfil
  useEffect(() => {
    if (patientProfile && !initialData) {
      console.log('Filling form with existing patient profile:', patientProfile);
      form.reset({
        name: patientProfile.name,
        email: patientProfile.email,
        phone: patientProfile.phone,
        cpf: patientProfile.cpf,
        birthdate: patientProfile.birthdate,
        address: patientProfile.address,
        clinicId: patientProfile.clinicId,
        notes: patientProfile.notes || '',
      });
    }
    // Set initial avatar from profile
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [patientProfile, profile, form, initialData]);

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

  const onSubmit = async (data: PatientFormValues) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar os dados');
      return;
    }

    try {
      console.log('Submitting form with data:', data);
      await savePatientProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        birthdate: data.birthdate,
        address: data.address,
        clinicId: data.clinicId,
        notes: data.notes,
      });
      toast.success('Dados salvos com sucesso!');
      navigate('/patients');
    } catch (error) {
      toast.error('Erro ao salvar dados');
      console.error('Error submitting form:', error);
    }
  };

  const isFirstTime = !hasProfile;

  if (profileLoading || clinicsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Profile Picture Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarUrl} alt="Foto de perfil" />
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
              aria-label="Upload foto de perfil"
            />
            <Button 
              variant="outline" 
              onClick={handleAvatarClick} 
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Alterar foto
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Clique na foto ou no botão para fazer upload de uma nova imagem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Form Section */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {!isFirstTime && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/patients')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <CardTitle>
                  {isFirstTime ? 'Complete seu Perfil' : hasProfile ? 'Editar Meus Dados' : 'Meus Dados'}
                </CardTitle>
                <CardDescription>
                  {isFirstTime 
                    ? 'Complete suas informações para continuar'
                    : 'Visualize e edite suas informações pessoais'
                  }
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
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
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
                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                    name="clinicId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clínica</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma clínica" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clinics.map((clinic) => (
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
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Informações adicionais" 
                          className="h-24"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  {!isFirstTime && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/patients')}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {isFirstTime ? 'Completar Cadastro' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientForm;
