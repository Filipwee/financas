-- ============================================================
--  Minhas Finanças — estrutura do banco no Supabase
--  Cole tudo isto no Supabase → SQL Editor → Run
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

-- ------------------------------------------------------------
--  Acesso PÚBLICO (porque o app está SEM login).
--  Qualquer pessoa com a anon key pode ler/gravar.
--  Quando quiser proteger, troque por políticas com auth.
-- ------------------------------------------------------------
alter table categorias  enable row level security;
alter table lancamentos enable row level security;

drop policy if exists "acesso publico categorias"  on categorias;
drop policy if exists "acesso publico lancamentos" on lancamentos;

create policy "acesso publico categorias"
  on categorias for all
  to anon, authenticated
  using (true) with check (true);

create policy "acesso publico lancamentos"
  on lancamentos for all
  to anon, authenticated
  using (true) with check (true);

-- ------------------------------------------------------------
--  Categorias iniciais (só insere se a tabela estiver vazia)
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
