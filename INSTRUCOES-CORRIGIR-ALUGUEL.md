# 🔧 Correção dos Classificados - Adicionar Aluguel

## Problema identificado
Os classificados não estavam salvando os anúncios porque o banco de dados não tinha a opção "aluguel" no enum `classificado_categoria`.

## ✅ Alterações já realizadas no código:
1. ✅ Removido o botão "Debug: Forçar logout" (comentado plugin lovable-tagger)
2. ✅ Adicionado "aluguel" aos filtros dos classificados
3. ✅ Configurado cor amarela para categoria aluguel 
4. ✅ Atualizado tipos TypeScript para incluir "aluguel"
5. ✅ Atualizado AdminClassificados para incluir "aluguel"

## ⚠️ Ação necessária: Executar SQL no Supabase

**IMPORTANTE**: Você precisa executar o seguinte comando SQL no painel do Supabase:

### Passo 1: Acesse o Supabase
1. Acesse seu projeto no Supabase Dashboard
2. Vá para "SQL Editor" 

### Passo 2: Execute o SQL
```sql
ALTER TYPE public.classificado_categoria ADD VALUE 'aluguel';
```

### Passo 3: Verificar (opcional)
Para confirmar que foi adicionado, execute:
```sql
SELECT 
    t.typname AS enum_name,
    STRING_AGG(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public' AND t.typname = 'classificado_categoria'
GROUP BY t.typname;
```

### Passo 4: Testar
Após executar o SQL:
1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Tente criar um novo classificado com categoria "Aluguel"
3. Verifique se salva corretamente

## 🎉 Resultado esperado
Após executar o SQL, os classificados voltarão a funcionar normalmente e será possível:
- ✅ Criar anúncios de todas as categorias (incluindo aluguel)
- ✅ Filtrar por categoria "Aluguel" 
- ✅ Ver anúncios de aluguel com cor amarela
- ✅ Gerenciar anúncios de aluguel no painel administrativo

---

**💡 Dica**: Se ainda houver problemas após executar o SQL, verifique o console do navegador (F12) para mensagens de erro detalhadas.
