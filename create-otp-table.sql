-- SISTEMA OTP PERSONALIZADO PARA CONDOMÍNIO CONECTADO
-- Execute este SQL no Supabase SQL Editor

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.otp_verification (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.otp_verification ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (simplificado para desenvolvimento)
CREATE POLICY "Allow all access to otp_verification" 
ON public.otp_verification 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_verification_email ON public.otp_verification(email);
CREATE INDEX IF NOT EXISTS idx_otp_verification_expires ON public.otp_verification(expires_at);

-- Function to generate random 6-digit OTP
CREATE OR REPLACE FUNCTION generate_otp()
RETURNS TEXT AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.otp_verification WHERE expires_at < NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run cleanup after inserts
DROP TRIGGER IF EXISTS clean_expired_otps ON public.otp_verification;
CREATE TRIGGER clean_expired_otps
    AFTER INSERT ON public.otp_verification
    EXECUTE FUNCTION cleanup_expired_otps();

-- Function to create/update OTP for email
CREATE OR REPLACE FUNCTION create_otp_for_email(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    new_otp TEXT;
BEGIN
    -- Generate new OTP
    new_otp := generate_otp();
    
    -- Insert or update OTP
    INSERT INTO public.otp_verification (email, otp, expires_at, verified)
    VALUES (user_email, new_otp, NOW() + INTERVAL '10 minutes', false)
    ON CONFLICT (email) 
    DO UPDATE SET 
        otp = new_otp,
        created_at = NOW(),
        expires_at = NOW() + INTERVAL '10 minutes',
        verified = false;
    
    RETURN new_otp;
END;
$$ LANGUAGE plpgsql;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION verify_otp(user_email TEXT, user_otp TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    is_valid BOOLEAN := false;
BEGIN
    -- Check if OTP is valid and not expired
    SELECT EXISTS(
        SELECT 1 FROM public.otp_verification 
        WHERE email = user_email 
        AND otp = user_otp 
        AND expires_at > NOW() 
        AND verified = false
    ) INTO is_valid;
    
    -- If valid, mark as verified
    IF is_valid THEN
        UPDATE public.otp_verification 
        SET verified = true 
        WHERE email = user_email AND otp = user_otp;
    END IF;
    
    RETURN is_valid;
END;
$$ LANGUAGE plpgsql;

-- Test the functions
SELECT 'Sistema OTP criado com sucesso!' as resultado;
SELECT 'OTP de teste gerado: ' || generate_otp() as teste_otp;
