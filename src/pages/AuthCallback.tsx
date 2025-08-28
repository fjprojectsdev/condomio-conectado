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
        console.log('🔄 Processando callback de autenticação...');
        
        // Processar parâmetros da URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        console.log('📋 Parâmetros recebidos:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          error,
          errorDescription
        });

        // Verificar se há erro na URL
        if (error) {
          console.error('❌ Erro no callback:', error, errorDescription);
          setStatus('error');
          setMessage(`Erro de autenticação: ${errorDescription || error}`);
          return;
        }

        // Se temos tokens, tentar estabelecer a sessão
        if (accessToken && refreshToken) {
          console.log('🔑 Tokens recebidos, estabelecendo sessão...');
          
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('❌ Erro ao estabelecer sessão:', sessionError);
            setStatus('error');
            setMessage('Erro ao confirmar autenticação. Tente fazer login novamente.');
          } else {
            console.log('✅ Sessão estabelecida com sucesso!', data.user?.email);
            setStatus('success');
            setMessage('Login realizado com sucesso! Redirecionando...');
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
          }
        } else {
          // Verificar se é um callback de confirmação de email
          const type = searchParams.get('type');
          
          if (type === 'signup') {
            console.log('📧 Callback de confirmação de email');
            setStatus('success');
            setMessage('Email confirmado com sucesso! Redirecionando...');
            
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 2000);
          } else if (type === 'recovery') {
            console.log('🔐 Callback de recuperação de senha');
            setStatus('success');
            setMessage('Redirecionando para redefinir senha...');
            
            setTimeout(() => {
              navigate('/update-password', { replace: true });
            }, 2000);
          } else {
            // Callback inválido
            console.log('❌ Callback inválido ou incompleto');
            setStatus('error');
            setMessage('Link inválido ou expirado. Tente se cadastrar novamente.');
          }
        }
      } catch (error) {
        console.error('💥 Erro inesperado ao processar callback:', error);
        setStatus('error');
        setMessage('Erro inesperado. Tente novamente.');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <div className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h2 className="text-xl font-semibold">Processando...</h2>
              <p className="text-muted-foreground">Aguarde enquanto processamos sua autenticação.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h2 className="text-xl font-semibold text-green-700">Sucesso!</h2>
              <p className="text-green-600">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
              <h2 className="text-xl font-semibold text-red-700">Erro</h2>
              <p className="text-red-600">{message}</p>
              <Button 
                onClick={() => navigate('/')} 
                className="mt-4"
                variant="outline"
              >
                Voltar ao Início
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthCallback;
