-- CONFIGURAR OTP (6 DÍGITOS) EM VEZ DE LINKS
-- Execute no SQL Editor do Supabase

-- Configurar para usar OTP por email
UPDATE auth.config 
SET email_confirm_template = 'confirmation'
WHERE key = 'email_confirm_template';

-- Ou desabilitar confirmação por email temporariamente
-- (permite login imediato após cadastro)
UPDATE auth.config 
SET email_confirmation_required = false
WHERE key = 'email_confirmation_required';

SELECT 'Configuração OTP aplicada!' as resultado;
