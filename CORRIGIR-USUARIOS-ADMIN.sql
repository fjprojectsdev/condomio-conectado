-- CORRIGIR USUÁRIOS ADMIN INCORRETOS
-- Execute este script no SQL Editor do Supabase para corrigir usuários que foram criados como admin incorretamente

-- 1. Verificar usuários atuais e suas roles
SELECT 
    p.email,
    p.full_name,
    ur.role,
    p.created_at
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
ORDER BY p.created_at DESC;

-- 2. Corrigir usuários que NÃO são fjprojects2025@gmail.com para role 'morador'
UPDATE user_roles 
SET 
    role = 'morador',
    updated_at = NOW()
WHERE 
    user_id IN (
        SELECT p.id 
        FROM profiles p 
        WHERE p.email != 'fjprojects2025@gmail.com'
    )
    AND role = 'admin';

-- 3. Verificar se a correção foi aplicada
SELECT 
    p.email,
    p.full_name,
    ur.role,
    p.created_at
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
ORDER BY p.created_at DESC;

-- 4. Garantir que apenas fjprojects2025@gmail.com tem role 'admin'
UPDATE user_roles 
SET 
    role = 'admin',
    updated_at = NOW()
WHERE 
    user_id IN (
        SELECT p.id 
        FROM profiles p 
        WHERE p.email = 'fjprojects2025@gmail.com'
    )
    AND role != 'admin';

-- 5. Verificação final
SELECT 
    'ADMIN' as tipo,
    p.email,
    p.full_name,
    ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE ur.role = 'admin'

UNION ALL

SELECT 
    'MORADORES' as tipo,
    p.email,
    p.full_name,
    ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE ur.role = 'morador'

ORDER BY tipo, p.created_at DESC;
