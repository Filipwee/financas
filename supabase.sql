-- ============================================================
--  Minhas Finanças — estrutura do banco no Supabase
--  Cole tudo isto no Supabase → SQL Editor → Run
--  Pode rodar quantas vezes quiser: é seguro (NÃO apaga dados).
-- ============================================================

-- Tabela de categorias
create table if not exists categorias (
  nome      text primary key,
  emoji     text,
  orcamento numeric default 0,
  ordem     integer default 0
);

-- Tabela de lançamentos (gastos e receitas)
create table if not exists lancamentos (
  id        text primary key,
  data      date not null,
  item      text,
  categoria text,
  conta     text,
  descricao text,
  valor     numeric not null,
  mes       integer,
  ano       integer,
  tipo      text default 'gasto'
);

-- Colunas novas (parcelamento + vínculo com gasto fixo). Seguro rodar de novo.
alter table lancamentos add column if not exists parcela_id    text;
alter table lancamentos add column if not exists parcela_n     integer;
alter table lancamentos add column if not exists parcela_total integer;
alter table lancamentos add column if not exists recorrente_id text;

-- Tabela de gastos/receitas FIXOS (recorrentes) que o app gera todo mês
create table if not exists recorrentes (
  id         text primary key,
  descricao  text,
  item       text,
  categoria  text,
  conta      text,
  valor      numeric default 0,
  dia        integer default 1,     -- dia do mês (1..28)
  tipo       text default 'gasto',
  ativo      boolean default true,
  inicio     date,                  -- a partir de quando vale
  fim        date,                  -- opcional: até quando vale
  gerado_ate date                   -- controle interno (último mês já lançado)
);

-- Tabela do PLANO de gastos por mês (planejado por categoria)
--  categoria = '__renda__'  guarda a renda prevista do mês.
create table if not exists planos (
  ano       integer not null,
  mes       integer not null,
  categoria text    not null,
  valor     numeric default 0,
  primary key (ano, mes, categoria)
);

-- ------------------------------------------------------------
--  Acesso PÚBLICO (porque o app está SEM login).
--  Qualquer pessoa com a anon key pode ler/gravar.
--  Quando quiser proteger, troque por políticas com auth.
-- ------------------------------------------------------------
alter table categorias  enable row level security;
alter table lancamentos enable row level security;
alter table recorrentes enable row level security;
alter table planos      enable row level security;

drop policy if exists "acesso publico categorias"  on categorias;
drop policy if exists "acesso publico lancamentos" on lancamentos;
drop policy if exists "acesso publico recorrentes" on recorrentes;
drop policy if exists "acesso publico planos"      on planos;

create policy "acesso publico categorias"
  on categorias for all to anon, authenticated using (true) with check (true);
create policy "acesso publico lancamentos"
  on lancamentos for all to anon, authenticated using (true) with check (true);
create policy "acesso publico recorrentes"
  on recorrentes for all to anon, authenticated using (true) with check (true);
create policy "acesso publico planos"
  on planos for all to anon, authenticated using (true) with check (true);

-- ------------------------------------------------------------
--  Categorias iniciais (só insere se ainda não existir)
-- ------------------------------------------------------------
insert into categorias (nome, emoji, orcamento, ordem) values
  ('Dívidas','💳',730,0),
  ('Necessidades fixas cartão','🏠',270,1),
  ('Dízimo','⛪',200,2),
  ('Comida','🍽️',100,3),
  ('Vic','🐾',200,4),
  ('Amenidades','🛋️',300,5),
  ('Saída pra comer','🍔',120,6),
  ('Extras','✨',80,7),
  ('Parcelas','📆',200,8),
  ('Salário','💼',0,9)
on conflict (nome) do nothing;
