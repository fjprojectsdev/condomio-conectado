import { useState } from 'react';
import { signUp, confirmEmail } from '../lib/auth';

export default function SignUpForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState('signup'); // 'signup' or 'verify'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(formData.email)) {
      setError('Por favor, insira um email válido.');
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { user, error } = await signUp(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Um código de confirmação foi enviado para seu email. Por favor, verifique sua caixa de entrada.');
        setStep('verify');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (verificationCode.length !== 6) {
      setError('O código de verificação deve ter 6 dígitos.');
      setLoading(false);
      return;
    }

    try {
      const { session, error } = await confirmEmail(formData.email, verificationCode);
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Email confirmado com sucesso! Você pode fazer login agora.');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Email</h2>
        
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

        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Código de Verificação (6 dígitos)
            </label>
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="000000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
          >
            {loading ? 'Verificando...' : 'Confirmar Email'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setStep('signup')}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Voltar ao registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Senha * (mínimo 6 caracteres)
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
    </div>
  );
}
