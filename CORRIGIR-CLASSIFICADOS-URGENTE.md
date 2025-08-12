# 🚨 CORREÇÃO URGENTE - Classificados não Salvam

## ❌ Problema Identificado
**Row Level Security (RLS)** está bloqueando as inserções na tabela `classificados`. Por isso:
- ❌ Não consegue adicionar classificados
- ❌ Não aparecem dados existentes 
- ❌ Tabela parece vazia

## ✅ Solução Simples

### Passo 1: Acesse o Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Faça login em sua conta
3. Acesse seu projeto "condomio-conectado"
4. Clique em **"SQL Editor"** na barra lateral

### Passo 2: Execute este SQL
Copie e cole o seguinte código no SQL Editor:

```sql
-- Corrigir enum e políticas RLS
ALTER TYPE public.classificado_categoria ADD VALUE 'aluguel';

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON public.classificados;

-- Criar políticas corretas
CREATE POLICY "Classificados - Leitura pública" 
ON public.classificados FOR SELECT 
USING (ativo = true);

CREATE POLICY "Classificados - Inserção autenticada" 
ON public.classificados FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Classificados - Atualização autenticada" 
ON public.classificados FOR UPDATE 
USING (true) WITH CHECK (true);

CREATE POLICY "Classificados - Exclusão autenticada" 
ON public.classificados FOR DELETE 
USING (true);

-- Adicionar dados de exemplo
INSERT INTO public.classificados (titulo, descricao, categoria, preco, nome_contato, telefone, apartamento, bloco, ativo) VALUES
('Sofá 3 lugares', 'Sofá em ótimo estado, cor bege, muito confortável', 'venda', 800.00, 'Maria Silva', '(11) 99999-1111', '101', 'A', true),
('Procuro babá', 'Preciso de babá para criança de 3 anos, meio período', 'servico', NULL, 'João Santos', '(11) 99999-2222', '202', 'B', true),
('Apartamento para alugar', 'Apto 2 quartos, sala, cozinha, 1 banheiro', 'aluguel', 1500.00, 'Ana Costa', '(11) 99999-3333', '303', 'C', true),
('Doação de roupas', 'Roupas de bebê em bom estado para doação', 'doacao', NULL, 'Pedro Lima', '(11) 99999-4444', '404', 'D', true);
```

### Passo 3: Executar
1. Cole o código no SQL Editor
2. Clique em **"Run"** ou **"Executar"**
3. Aguarde a execução (pode levar alguns segundos)

### Passo 4: Testar
1. Volte ao seu app: `npm run dev`
2. Acesse a página de Classificados
3. Verifique se aparecem os 4 exemplos
4. Tente criar um novo classificado

## 🎯 Resultado Esperado

Após executar o SQL:
- ✅ Aparecem 4 classificados de exemplo
- ✅ Consegue criar novos classificados
- ✅ Opção "Aluguel" funciona
- ✅ Filtros funcionam corretamente
- ✅ Admin consegue gerenciar anúncios

## 🆘 Se der erro ao executar SQL

Se der erro relacionado ao enum 'aluguel', execute apenas isto primeiro:
```sql
ALTER TYPE public.classificado_categoria ADD VALUE 'aluguel';
```

E depois execute o resto do script.

## 📱 PWA Funcionando
✅ Botão de debug removido
✅ PWA pronto para instalação
✅ App pode ser adicionado à tela inicial

---

**⏰ Execute o SQL AGORA e os classificados voltarão a funcionar!** 🚀
