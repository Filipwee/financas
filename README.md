# 💸 Minhas Finanças

Controle de finanças pessoais. Interface única em `Index.html` + servidor Node com
banco **SQLite nativo** (sem nenhuma dependência externa para instalar).

## Rodar no seu PC

Precisa do **Node 22.5 ou mais novo** (você tem o 24, então está ok).

```bash
npm start
```

Depois abra **http://localhost:3000** no navegador.

Os dados ficam salvos no arquivo `financas.db` (criado automaticamente na primeira vez).
Para fazer backup, basta copiar esse arquivo.

> Se abrir o `Index.html` direto (dois cliques, sem servidor), o app ainda funciona, mas
> salvando só no navegador (localStorage). Para os dados de verdade, use sempre o `npm start`.

## Acessar do celular na mesma rede (Wi-Fi de casa)

1. Rode `npm start` no PC.
2. Descubra o IP do PC: `ipconfig` (procure "Endereço IPv4", algo como `192.168.0.10`).
3. No celular, abra `http://192.168.0.10:3000` (com o PC ligado e na mesma rede).

## Proteger com senha (recomendado antes de publicar na internet)

A trava de senha já está embutida, **desligada por padrão**. Para ligar, defina a
variável de ambiente `AUTH_PASSWORD`:

```bash
# Windows (PowerShell)
$env:AUTH_PASSWORD="suaSenhaForte"; npm start

# Linux/macOS
AUTH_PASSWORD=suaSenhaForte npm start
```

O navegador vai pedir usuário e senha (use qualquer usuário + essa senha). Sem tela de login.

## Publicar na internet (acesso de qualquer lugar)

O servidor já lê `process.env.PORT` e `0.0.0.0`, então funciona direto em várias plataformas.
Como o banco é um arquivo SQLite, você precisa de um **disco/volume persistente** para os dados
não sumirem a cada deploy. Defina `DB_PATH` apontando para esse volume.

### Opção recomendada: Railway (tem volume e plano gratuito de teste)

1. Crie conta em https://railway.app e instale o GitHub (ou suba a pasta).
2. Crie um projeto a partir deste repositório.
3. Em **Variables**, defina:
   - `AUTH_PASSWORD` = sua senha (importante!)
   - `DB_PATH` = `/data/financas.db`
4. Em **Volumes**, crie um volume montado em `/data`.
5. Deploy. O Railway define `PORT` sozinho e roda `npm start`.

### Outras opções

- **Render** (https://render.com): "Web Service" + um "Disk" montado em `/data`,
  com `DB_PATH=/data/financas.db`. Start command: `npm start`.
- **Fly.io / VPS** (qualquer servidor Linux): instale Node 22+, copie a pasta,
  `npm start`. Para deixar no ar, use `pm2` ou um serviço systemd, e um proxy (Caddy/Nginx)
  com HTTPS na frente.

> **Sempre defina `AUTH_PASSWORD` ao publicar.** Sem isso, qualquer pessoa com o link
> consegue ver e editar suas finanças.

## Estrutura

```
Index.html   → app (interface + lógica no navegador)
server.js    → servidor HTTP + API + SQLite
package.json → script de start
financas.db  → banco (gerado automaticamente; faça backup dele)
```

## API (caso queira integrar outra coisa)

| Método | Rota                     | O que faz                          |
|--------|--------------------------|------------------------------------|
| GET    | `/api/dados`             | retorna `{categorias, lancamentos}`|
| POST   | `/api/lancamentos`       | adiciona (ou restaura, se vier `id`)|
| PUT    | `/api/lancamentos/:id`   | edita um lançamento                |
| DELETE | `/api/lancamentos/:id`   | apaga um lançamento                |
| PUT    | `/api/categorias`        | substitui a lista de categorias    |
