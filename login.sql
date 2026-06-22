-- ============================================================
--  Minhas Finanças — ATIVAR LOGIN (dados privados por usuário)
--  Rode ISTO no Supabase → SQL Editor → Run.
--
--  ORDEM IMPORTANTE:
--   1) Faça o deploy do app novo (já com a tela de login).
--   2) Abra o app e CRIE SUA CONTA (e-mail + senha).
--      - Dica: em Authentication → Providers → Email, deixe
--        "Confirm email" DESLIGADO p/ entrar na hora (uso pessoal).
--   3) Só então rode este script (ele precisa que sua conta já exista).
--
--  Este script:
--   - adiciona a coluna user_id em todas as tabelas;
--   - DÁ os dados atuais (sem dono) para a SUA conta;
--   - tranca o acesso: cada um só vê os próprios dados.
--  Não apaga nenhum lançamento.
-- ============================================================

-- >>> TROQUE pelo e-mail com que você criou a conta no app, se for outro:
--     (deixei o seu e-mail já preenchido)
do $$
declare uid uuid;
begin
  select id into uid from auth.users where email = 'filipemottaw@gmail.com' limit 1;
  if uid is null then
    raise exception 'Conta não encontrada. Crie a conta no app primeiro (passo 2) e ajuste o e-mail acima.';
  end if;

  -- ---- coluna user_id + valor padrão (preenche sozinho nos próximos inserts) ----
  alter table lancamentos add column if not exists user_id uuid;
  alter table categorias  add column if not exists user_id uuid;
  alter table recorrentes add column if not exists user_id uuid;
  alter table planos      add column if not exists user_id uuid;
  alter table planejados  add column if not exists user_id uuid;

  alter table lancamentos alter column user_id set default auth.uid();
  alter table categorias  alter column user_id set default auth.uid();
  alter table recorrentes alter column user_id set default auth.uid();
  alter table planos      alter column user_id set default auth.uid();
  alter table planejados  alter column user_id set default auth.uid();

  -- ---- reivindica os dados existentes (sem dono) para a sua conta ----
  update lancamentos set user_id = uid where user_id is null;
  update categorias  set user_id = uid where user_id is null;
  update recorrentes set user_id = uid where user_id is null;
  update planos      set user_id = uid where user_id is null;
  update planejados  set user_id = uid where user_id is null;
end $$;

-- ---- categorias: chave primária passa a incluir o usuário ----
alter table categorias alter column user_id set not null;
alter table categorias drop constraint if exists categorias_pkey;
alter table categorias add primary key (user_id, nome);

-- ---- planos: idem ----
alter table planos alter column user_id set not null;
alter table planos drop constraint if exists planos_pkey;
alter table planos add primary key (user_id, ano, mes, categoria);

-- ---- (lancamentos/recorrentes/planejados mantêm id como PK) ----
alter table lancamentos alter column user_id set not null;
alter table recorrentes alter column user_id set not null;
alter table planejados  alter column user_id set not null;

-- ============================================================
--  Tranca o acesso: troca as políticas PÚBLICAS por POR-USUÁRIO
-- ============================================================
alter table categorias  enable row level security;
alter table lancamentos enable row level security;
alter table recorrentes enable row level security;
alter table planos      enable row level security;
alter table planejados  enable row level security;

drop policy if exists "acesso publico categorias"  on categorias;
drop policy if exists "acesso publico lancamentos" on lancamentos;
drop policy if exists "acesso publico recorrentes" on recorrentes;
drop policy if exists "acesso publico planos"      on planos;
drop policy if exists "acesso publico planejados"  on planejados;

drop policy if exists "meus categorias"  on categorias;
drop policy if exists "meus lancamentos" on lancamentos;
drop policy if exists "meus recorrentes" on recorrentes;
drop policy if exists "meus planos"      on planos;
drop policy if exists "meus planejados"  on planejados;

create policy "meus categorias"  on categorias  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meus lancamentos" on lancamentos for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meus recorrentes" on recorrentes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meus planos"      on planos      for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meus planejados"  on planejados  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Pronto! Agora o app exige login e cada conta vê só os próprios dados.
-- (Não rode o supabase.sql de novo depois disto: ele recriaria o acesso público.)
