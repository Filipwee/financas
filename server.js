// Servidor de "Minhas Finanças" — Node puro + SQLite nativo (zero dependências).
// Requer Node 22.5+ (usa node:sqlite). Inicie com: npm start
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
// Trava de senha opcional: defina AUTH_PASSWORD para exigir senha (HTTP Basic, sem tela de login).
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || '';
// Caminho do banco. Em hospedagem, aponte para um volume persistente (ex: /data/financas.db).
const DB_PATH = process.env.DB_PATH || join(__dirname, 'financas.db');

// ---------- banco ----------
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS categorias (
    nome TEXT PRIMARY KEY,
    emoji TEXT,
    orcamento REAL DEFAULT 0,
    ordem INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS lancamentos (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    item TEXT,
    categoria TEXT,
    conta TEXT,
    descricao TEXT,
    valor REAL NOT NULL,
    mes INTEGER,
    ano INTEGER,
    tipo TEXT DEFAULT 'gasto'
  );
`);

// Semente inicial só se o banco estiver vazio
const temCat = db.prepare('SELECT COUNT(*) n FROM categorias').get().n;
if (!temCat) {
  const seed = [
    ['Dívidas', '💳', 730], ['Necessidades fixas cartão', '🏠', 270], ['Dízimo', '⛪', 200],
    ['Comida', '🍽️', 100], ['Vic', '🐾', 200], ['Amenidades', '🛋️', 300],
    ['Saída pra comer', '🍔', 120], ['Extras', '✨', 80], ['Parcelas', '📆', 200],
    ['Salário', '💼', 0],
  ];
  const ins = db.prepare('INSERT INTO categorias (nome, emoji, orcamento, ordem) VALUES (?,?,?,?)');
  seed.forEach((c, i) => ins.run(c[0], c[1], c[2], i));
}

// ---------- helpers de consulta ----------
function getCategorias() {
  return db.prepare('SELECT nome, emoji, orcamento FROM categorias ORDER BY ordem, nome').all()
    .map(c => ({ nome: c.nome, emoji: c.emoji, orcamento: c.orcamento }));
}
function getLancamentos() {
  return db.prepare('SELECT * FROM lancamentos ORDER BY data DESC, id DESC').all();
}
function partesData(iso) {
  const [a, m] = String(iso).split('-').map(Number);
  return { ano: a, mes: m };
}
function inserirLancamento(o) {
  const { ano, mes } = partesData(o.data);
  const id = o.id || ('l' + Date.now() + Math.floor(Math.random() * 1000));
  const reg = {
    id, data: o.data, item: o.item || '', categoria: o.categoria || '',
    conta: o.conta || '', descricao: o.descricao || '', valor: Number(o.valor) || 0,
    mes, ano, tipo: o.tipo === 'receita' ? 'receita' : 'gasto',
  };
  db.prepare(`INSERT OR REPLACE INTO lancamentos
    (id,data,item,categoria,conta,descricao,valor,mes,ano,tipo)
    VALUES (@id,@data,@item,@categoria,@conta,@descricao,@valor,@mes,@ano,@tipo)`).run(reg);
  return reg;
}

// ---------- roteamento da API ----------
async function lerCorpo(req) {
  return new Promise((res, rej) => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 1e6) req.destroy(); });
    req.on('end', () => { try { res(d ? JSON.parse(d) : {}); } catch (e) { rej(e); } });
    req.on('error', rej);
  });
}
function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

async function api(req, res, url) {
  const m = req.method;
  // GET /api/dados
  if (m === 'GET' && url.pathname === '/api/dados') {
    return json(res, 200, { categorias: getCategorias(), lancamentos: getLancamentos() });
  }
  // POST /api/lancamentos  (adicionar OU restaurar, se vier com id)
  if (m === 'POST' && url.pathname === '/api/lancamentos') {
    const body = await lerCorpo(req);
    return json(res, 200, inserirLancamento(body));
  }
  // PUT /api/lancamentos/:id
  if (m === 'PUT' && url.pathname.startsWith('/api/lancamentos/')) {
    const id = decodeURIComponent(url.pathname.split('/').pop());
    const body = await lerCorpo(req); body.id = id;
    return json(res, 200, inserirLancamento(body));
  }
  // DELETE /api/lancamentos/:id
  if (m === 'DELETE' && url.pathname.startsWith('/api/lancamentos/')) {
    const id = decodeURIComponent(url.pathname.split('/').pop());
    db.prepare('DELETE FROM lancamentos WHERE id = ?').run(id);
    return json(res, 200, { ok: true });
  }
  // PUT /api/categorias  (substitui a lista inteira)
  if (m === 'PUT' && url.pathname === '/api/categorias') {
    const lista = await lerCorpo(req);
    if (!Array.isArray(lista)) return json(res, 400, { erro: 'lista inválida' });
    db.exec('DELETE FROM categorias');
    const ins = db.prepare('INSERT INTO categorias (nome,emoji,orcamento,ordem) VALUES (?,?,?,?)');
    lista.forEach((c, i) => { if (c && c.nome) ins.run(c.nome, c.emoji || '🏷️', Number(c.orcamento) || 0, i); });
    return json(res, 200, getCategorias());
  }
  return json(res, 404, { erro: 'rota não encontrada' });
}

// ---------- estáticos ----------
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
async function estatico(res, pathname) {
  let p = pathname === '/' ? '/Index.html' : pathname;
  p = p.replace(/\.\./g, ''); // evita path traversal
  try {
    const buf = await readFile(join(__dirname, p));
    const ext = p.slice(p.lastIndexOf('.'));
    res.writeHead(200, { 'Content-Type': TIPOS[ext] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404); res.end('Não encontrado');
  }
}

// ---------- senha opcional (HTTP Basic) ----------
function autorizado(req) {
  if (!AUTH_PASSWORD) return true;
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const [, senha] = Buffer.from(h.slice(6), 'base64').toString().split(':');
  return senha === AUTH_PASSWORD;
}

const server = createServer(async (req, res) => {
  try {
    // healthcheck público (não exige senha) — usado pela hospedagem
    if (req.url === '/health') { res.writeHead(200); return res.end('ok'); }
    if (!autorizado(req)) {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Minhas Finanças"' });
      return res.end('Senha necessária');
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    return await estatico(res, url.pathname);
  } catch (e) {
    json(res, 500, { erro: String(e && e.message || e) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  💸 Minhas Finanças rodando`);
  console.log(`     Local:  http://localhost:${PORT}`);
  console.log(`     Banco:  ${DB_PATH}`);
  if (AUTH_PASSWORD) console.log('     🔒 Senha ATIVADA');
  else console.log('     ⚠️  Sem senha (defina AUTH_PASSWORD para proteger)');
  console.log('');
});
