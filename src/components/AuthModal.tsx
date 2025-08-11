import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { signUp, signIn, confirmEmail, resetPasswordForEmail } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AuthModal = ({ open, onOpenChange, onSuccess }: AuthModalProps) => {
  const { loginAsAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('login');
  const [step, setStep] = useState('form'); // 'form' | 'verify' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Controle de tentativas de login
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 15 * 60; // 15 minutos em segundos

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isUsernameLogin = (input: string) => {
    // Se não tem @ é considerado username (admin, sindico, etc)
    return !input.includes('@');
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setTimeRemaining(LOCKOUT_TIME);
      setError(`Muitas tentativas de login falharam. Tente novamente em 15 minutos.`);
      
      // Countdown timer
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      const remaining = MAX_ATTEMPTS - newAttempts;
      setError(`Login inválido. Você tem ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setVerificationCode('');
    setResetEmail('');
    setError('');
    setMessage('');
    setStep('form');
  };

  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    if (!validatePassword(password)) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Um link de confirmação foi enviado para seu email. Clique no link para ativar sua conta.');
        // Não muda para step 'verify' - mantém na tela principal com mensagem
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (isLocked) {
      setError(`Conta temporariamente bloqueada. Tente novamente em ${formatTime(timeRemaining)}.`);
      return;
    }

    // Verificar se é login especial de admin
    if (email === 'admin' && password === 'Admin123') {
      console.log('✅ Login administrativo especial detectado');
      setLoading(true);
      
      // Aguardar um pouco para simular autenticação
      setTimeout(() => {
        loginAsAdmin(); // Usar a função do contexto
        setMessage('Login de administrador realizado com sucesso!');
        setAttempts(0);
        setLoading(false);
        onSuccess();
      }, 1000);
      return;
    }

    // Para emails normais, validar formato
    if (!isUsernameLogin(email) && !validateEmail(email)) {
      setError('Por favor, insira um email válido ou nome de usuário.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Email not confirmed')) {
          handleFailedAttempt();
        } else {
          setError(error.message);
        }
      } else {
        setMessage('Login realizado com sucesso!');
        setAttempts(0);
        onSuccess();
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (verificationCode.length !== 6) {
      setError('O código de verificação deve ter 6 dígitos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await confirmEmail(email, verificationCode);
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Email confirmado com sucesso! Você pode fazer login agora.');
        setStep('form');
        setCurrentTab('login');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateEmail(resetEmail)) {
      setError('Por favor, insira um email válido.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await resetPasswordForEmail(resetEmail);
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Um email com instruções para redefinir sua senha foi enviado.');
        setStep('form');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Condomínio Conectado</DialogTitle>
        </DialogHeader>

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold">Confirmar Email</h3>
            </div>

            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="verification">Código de Verificação (6 dígitos)</Label>
              <Input
                id="verification"
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleVerifyEmail}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Email
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep('form')}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        )}

        {step === 'reset' && (
          <div className="space-y-4">
            <div className="text-center">
              <Lock className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-lg font-semibold">Redefinir Senha</h3>
            </div>

            {message && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Email
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep('form')}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        )}

        {step === 'form' && (
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            {message && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLocked && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Conta bloqueada. Tempo restante: {formatTime(timeRemaining)}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email ou Usuário</Label>
                <Input
                  id="loginEmail"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com ou admin"
                  disabled={loading || isLocked}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Senha</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  disabled={loading || isLocked}
                />
              </div>
              <Button
                onClick={handleSignIn}
                disabled={loading || isLocked}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
              <Button
                variant="link"
                onClick={() => setStep('reset')}
                className="w-full text-sm"
                disabled={loading}
              >
                Esqueceu sua senha?
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email *</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerPassword">Senha * (mínimo 6 caracteres)</Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Conta
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
