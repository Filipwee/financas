# 🚂 Deploy na Railway — passo a passo

O projeto já está pronto: `railway.json`, `.nvmrc` (Node 24), rota `/health` e git inicializado.

Você precisa de duas coisas obrigatórias na Railway:
1. **Volume** montado em `/data` (pro banco SQLite não sumir a cada deploy).
2. **Variáveis**: `DB_PATH=/data/financas.db` e `AUTH_PASSWORD=suaSenha`.

Escolha **um** dos caminhos abaixo.

---

## Caminho A — via GitHub (recomendado, interface mais fácil)

1. **Crie um repositório no GitHub** (pode ser privado): https://github.com/new
   — não marque "add README"; deixe vazio.
2. No terminal, dentro da pasta do projeto, conecte e suba:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/minhas-financas.git
   git branch -M main
   git push -u origin main
   ```
3. Entre em https://railway.app → **Login** (pode usar a conta GitHub).
4. **New Project** → **Deploy from GitHub repo** → escolha o repositório.
   A Railway detecta o Node e começa o build sozinho.
5. Abra o serviço criado → aba **Variables** → **New Variable**, adicione:
   - `AUTH_PASSWORD` = uma senha forte sua
   - `DB_PATH` = `/data/financas.db`
6. Aba **Settings** → role até **Volumes** (ou botão **+ Volume**) →
   crie um volume com **Mount path** = `/data`.
7. Aba **Settings** → **Networking** → **Generate Domain**.
   Isso te dá uma URL pública (ex: `minhas-financas-production.up.railway.app`).
8. Pronto. Abra a URL no navegador; ele vai pedir a senha (qualquer usuário + sua `AUTH_PASSWORD`).

---

## Caminho B — via Railway CLI (sem GitHub)

1. Instale a CLI (precisa do Node, que você já tem):
   ```bash
   npm i -g @railway/cli
   ```
2. Faça login (abre o navegador):
   ```bash
   railway login
   ```
3. Dentro da pasta do projeto, crie o projeto e suba o código:
   ```bash
   railway init        # dê um nome, ex: minhas-financas
   railway up          # envia a pasta e faz o deploy
   ```
4. Defina as variáveis:
   ```bash
   railway variables --set "AUTH_PASSWORD=suaSenhaForte" --set "DB_PATH=/data/financas.db"
   ```
5. Crie o volume em `/data` (pode ser pelo painel web em **Settings → Volumes**,
   é mais simples que pela CLI).
6. Gere o domínio público:
   ```bash
   railway domain
   ```
7. Abra a URL que aparecer.

---

## Depois do deploy

- **Trocar a senha**: mude a variável `AUTH_PASSWORD` e re-deploye.
- **Backup do banco**: na Railway, o arquivo fica no volume em `/data/financas.db`.
  Pelo painel há acesso ao volume; ou rode `railway run` para abrir um shell.
- **Atualizar o app**: edite os arquivos, `git commit`, e:
  - Caminho A: `git push` (deploy automático).
  - Caminho B: `railway up`.

## Avisos

- **Sempre com `AUTH_PASSWORD` definido.** Sem isso, qualquer um com o link mexe nas finanças.
- O plano gratuito da Railway é um **crédito de teste**; depois disso pode exigir um plano pago
  (uso baixo costuma custar centavos/mês). Alternativas com nível gratuito: **Render** (use um
  "Disk" em `/data`) ou **Fly.io**.
