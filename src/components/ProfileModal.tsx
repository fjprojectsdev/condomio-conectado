import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFirstTime?: boolean;
}

export const ProfileModal = ({ open, onOpenChange, isFirstTime = false }: ProfileModalProps) => {
  const { user, userProfile, supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bloco, setBloco] = useState('');
  const [apartamento, setApartamento] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.first_name || '');
      setLastName(userProfile.last_name || '');
      setBloco(userProfile.apartamento?.split('-')[0] || '');
      setApartamento(userProfile.apartamento?.split('-')[1] || '');
      setPhotoUrl(userProfile.avatar_url || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!firstName.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const apartamentoCompleto = bloco && apartamento ? `${bloco}-${apartamento}` : '';
      
      await supabase.from('users').upsert({
        uid: user?.id,
        email: user?.email,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        apartamento: apartamentoCompleto,
        avatar_url: photoUrl
      });

      onOpenChange(false);
      window.location.reload(); // Atualizar contexto
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const blocos = Array.from({ length: 17 }, (_, i) => `Bloco ${String(i + 1).padStart(2, '0')}`);
  const apartamentos = Array.from({ length: 99 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Dialog open={open} onOpenChange={isFirstTime ? () => {} : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isFirstTime ? 'Complete seu Perfil' : 'Editar Perfil'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Foto */}
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={photoUrl} />
              <AvatarFallback>
                {firstName.charAt(0)}{lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex space-x-2">
              <Input
                placeholder="URL da foto (opcional)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="text-sm"
              />
              <Button variant="outline" size="icon">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Nome */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="João"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Silva"
              />
            </div>
          </div>

          {/* Bloco e Apartamento */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="bloco">Bloco (opcional)</Label>
              <Select value={bloco} onValueChange={setBloco}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {blocos.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="apartamento">Apto (opcional)</Label>
              <Select value={apartamento} onValueChange={setApartamento}>
                <SelectTrigger>
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  {apartamentos.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isFirstTime ? 'Criar Perfil' : 'Salvar Alterações'}
          </Button>

          {!isFirstTime && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Cancelar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};