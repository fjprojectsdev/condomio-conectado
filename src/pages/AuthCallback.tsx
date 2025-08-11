import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Processar o hash/query params do callback
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Verificar se há tokens nos parâmetros
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');

        console.log('🔄 Processando callback de autenticação:', { type, hasAccessToken: !!accessToken });

        if (type === 'signup' && accessToken && refreshToken) {
          // Confirmar a sessão com os tokens recebidos
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Erro ao confirmar sessão:', error);
            setStatus('error');
            setMessage('Erro ao confirmar email. Tente fazer login novamente.');
          } else {
            console.log('✅ Email confirmado com sucesso!', data.user?.email);
            setStatus('success');
            setMessage('Email confirmado com sucesso! Redirecionando...');
            
            // Redirecionar após 3 segundos
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 3000);
          }
        } else if (type === 'recovery') {
          // Processo de recuperação de senha
          setStatus('success');
          setMessage('Redirecionando para redefinir senha...');
          setTimeout(() => {
            navigate('/update-password', { replace: true });
          }, 2000);
        } else {
          // Link inválido ou expirado
          setStatus('error');
          setMessage('Link inválido ou expirado. Tente se cadastrar novamente.');
        }
      } catch (error) {
        console.error('💥 Erro ao processar callback:', error);
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-elevated border-0 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-condo-blue mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-semibold mb-2">Confirmando Email</h1>
            <p className="text-muted-foreground">
              Aguarde enquanto confirmamos seu email...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-condo-green mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2 text-condo-green">Sucesso!</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-condo-green hover:bg-condo-green/90"
            >
              Ir para o App
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2 text-destructive">Erro</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Voltar ao Início
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Tentar Novamente
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AuthCallback;
