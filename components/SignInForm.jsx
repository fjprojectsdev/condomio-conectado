import { useState, useEffect } from 'react';
import { signIn, resetPasswordForEmail } from '../lib/auth';

const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em milissegundos

export default function SignInForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Sistema de limitação de tentativas
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Verificar se há um bloqueio ativo ao carregar o componente
    const storedLockoutEndTime = localStorage.getItem('loginLockoutEndTime');
    const storedAttempts = localStorage.getItem('loginAttempts');
    
    if (storedLockoutEndTime) {
      const endTime = parseInt(storedLockoutEndTime);
      const now = Date.now();
      
      if (now < endTime) {
        setIsLocked(true);
        setLockoutEndTime(endTime);
        setTimeRemaining(Math.ceil((endTime - now) / 1000));
      } else {
        // Bloqueio expirado, limpar dados
        localStorage.removeItem('loginLockoutEndTime');
        localStorage.removeItem('loginAttempts');
      }
    }
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
  }, []);

  useEffect(() => {
    // Contador regressivo para o desbloqueio
    let interval;
    if (isLocked && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            setLockoutEndTime(null);
            localStorage.removeItem('loginLockoutEndTime');
            localStorage.removeItem('loginAttempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    localStorage.setItem('loginAttempts', newAttempts.toString());

    if (newAttempts >= MAX_ATTEMPTS) {
      const endTime = Date.now() + LOCKOUT_TIME;
      setIsLocked(true);
      setLockoutEndTime(endTime);
      setTimeRemaining(LOCKOUT_TIME / 1000);
      localStorage.setItem('loginLockoutEndTime', endTime.toString());
      
      setError(`Muitas tentativas de login falharam. Tente novamente em ${formatTime(LOCKOUT_TIME / 1000)}.`);
    } else {
      const remaining = MAX_ATTEMPTS - newAttempts;
      setError(`Login inválido. Você tem ${remaining} tentativa${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`);
    }
  };

  const handleSuccessfulLogin = () => {
    // Limpar dados de tentativas após login bem-sucedido
    setAttempts(0);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('loginLockoutEndTime');
    if (onSuccess) onSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Conta temporariamente bloqueada. Tente novamente em ${formatTime(timeRemaining)}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { session, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Email not confirmed')) {
          handleFailedAttempt();
        } else {
          setError(error.message);
        }
      } else {
        setMessage('Login realizado com sucesso!');
        handleSuccessfulLogin();
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await resetPasswordForEmail(resetEmail);
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Um email com instruções para redefinir sua senha foi enviado.');
        setShowResetPassword(false);
        setResetEmail('');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? 'Enviando...' : 'Enviar Email de Redefinição'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowResetPassword(false)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Fazer Login</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {isLocked && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="font-semibold">Conta temporariamente bloqueada</p>
          <p>Tempo restante: {formatTime(timeRemaining)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
            disabled={isLocked}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••"
            disabled={isLocked}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || isLocked}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
        >
          {loading ? 'Fazendo login...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setShowResetPassword(true)}
          className="text-blue-500 hover:text-blue-700 text-sm"
          disabled={loading}
        >
          Esqueceu sua senha?
        </button>
      </div>
    </div>
  );
}
