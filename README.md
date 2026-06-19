# 💸 Minhas Finanças

Controle de finanças pessoais. É uma **página única** (`index.html`) que guarda os dados
no **Supabase** (banco na nuvem, plano gratuito). Não precisa de servidor próprio.

- Sem Supabase configurado → roda em **modo prévia**, salvando só no navegador.
- Com Supabase configurado → dados na nuvem, **sincroniza** entre celular e PC.

## Passo a passo (tudo grátis, sem cartão)

### 1. Criar o projeto no Supabase
1. Crie conta em https://supabase.com (pode entrar com o GitHub).
2. **New project** → dê um nome e uma senha de banco (guarde-a) → **Create**.
3. Espere ~1 min o projeto subir.

### 2. Criar as tabelas
1. No projeto, menu lateral → **SQL Editor** → **New query**.
2. Cole TODO o conteúdo do arquivo [`supabase.sql`](./supabase.sql) e clique **Run**.
   Isso cria as tabelas, libera o acesso e cadastra as categorias iniciais.

### 3. Pegar as 2 chaves e colar no app
1. No Supabase: menu lateral → **Settings** → **API**.
2. Copie:
   - **Project URL** (ex: `https://abcdxyz.supabase.co`)
   - **anon public** (a chave longa marcada como `anon` / `public`)
3. Abra o `index.html` e, lá no início do `<script>`, preencha:
   ```js
   var SUPA = {
     url:  'https://abcdxyz.supabase.co',
     anon: 'a-sua-anon-key-aqui'
   };
   ```
   > Esses valores são **públicos** (feitos pra ficar no navegador), pode colar sem medo.

Pronto — abrindo o `index.html` agora, ele já lê e grava no Supabase.

### 4. Publicar online (Vercel — grátis)
Como virou página estática, qualquer host estático serve. Pela Vercel:

1. O código já está no GitHub. Entre em https://vercel.com e faça login com o GitHub.
2. **Add New → Project** → importe o repositório **Filipwee/financas**.
3. Em *Framework Preset* deixe **Other** (é HTML puro), não precisa configurar build.
4. **Deploy**. Em segundos você recebe uma URL pública (ex: `financas.vercel.app`).
5. Abra no celular e no PC: os dois mexem nos mesmos dados (estão no Supabase).

> Alternativas igualmente grátis: **Netlify** (arraste a pasta) ou **GitHub Pages**.

## Atenção (sem login)
O app está **sem senha**, então quem tiver o link da Vercel consegue ver/editar.
Para uso pessoal tudo bem; quando quiser proteger, dá para ligar o **login do Supabase**
(é nativo e gratuito) — me avise que eu configuro.

## Detalhe do plano gratuito do Supabase
Se o projeto ficar **1 semana inteira sem nenhum acesso**, ele "dorme" (os dados **não
somem**; você clica em *Restore* no painel para reativar). Usando toda semana, nem percebe.

## Estrutura
```
index.html   → o app inteiro (interface + lógica + conexão com o Supabase)
supabase.sql → script que cria as tabelas no Supabase
```
