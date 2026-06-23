# 💸 Minhas Finanças — Guia completo de funcionalidades

Documento de referência para o **vídeo tutorial**. Explica **tudo** o que o app faz,
tela por tela, na ordem sugerida de gravação. Cada seção tem: **o que é**, **como usar**
e **detalhes importantes** para você não esquecer nada na hora de gravar.

> App de controle de finanças pessoais (PWA — funciona como aplicativo no celular).
> Visual navy & menta, com login, saudação, dashboard, plano, gastos fixos e gráficos.

---

## 0. Visão geral (abertura do vídeo)

- **O que é:** um app para organizar quanto entra e quanto sai do seu dinheiro a cada mês.
- **Onde roda:** no navegador ou instalado como aplicativo (PWA) no celular/PC.
- **Como os dados são guardados:**
  - Com **login** (e-mail e senha), os dados ficam na nuvem (Supabase) e **sincronizam** entre aparelhos — cada usuário só vê os próprios dados.
  - Sem login configurado (modo prévia), os dados ficam salvos **no próprio navegador**.
- **Estrutura da tela:**
  - **Topo (cabeçalho):** navegação entre meses e botão de ação que muda conforme a tela.
  - **Meio:** conteúdo da tela atual.
  - **Rodapé (barra de navegação):** Início · Plano · **＋** · Fixos · Gráficos.

---

## 1. Login e cadastro (tela de entrada)

**O que é:** a primeira tela, com fundo de **aurora animada** (luzes verdes/azuis se movendo).

**Como usar:**
- **Entrar:** digite e-mail e senha e toque em **Entrar**.
- **Criar conta:** toque em **"Criar agora"**. Aparece o campo **Seu nome** (além de e-mail e senha). Esse nome é o que aparece na saudação.
- **Mostrar/ocultar senha:** ícone do olho 👁.
- **Esqueci a senha:** envia um link de redefinição para o seu e-mail.

**Detalhes importantes:**
- Ao criar conta, dependendo da configuração, pode ser preciso **confirmar pelo link no e-mail** antes de entrar.
- As mensagens de erro são “amigáveis” (ex.: “E-mail ou senha incorretos”, “A senha precisa ter pelo menos 6 caracteres”).
- Dá para enviar com a tecla **Enter** no campo de senha.

---

## 2. Saudação (splash de boas-vindas)

**O que é:** uma telinha rápida que aparece **depois de entrar**, antes do app.

**O que mostra:**
- **Bom dia / Boa tarde / Boa noite** (muda conforme o horário) + emoji (☀️ / 🌤️ / 🌙).
- **Seu nome** em destaque.
- Frase “Vamos organizar seu mês.” e uma barrinha de carregamento.

**Detalhe:** o nome vem do seu cadastro. Para alterar depois, use **Menu → Meu nome** (seção 11).

---

## 3. Navegação geral (vale para todas as telas)

### Cabeçalho (topo)
- No centro fica o **mês e ano** atuais (ex.: “Junho 2026”).
- **‹** à esquerda: volta um mês. **›** à direita: avança um mês.
- O **botão da direita muda conforme a tela**:
  - **Início** e **Plano:** seta **›** (navegar entre meses).
  - **Fixos:** **＋** (abre o cadastro de gastos fixos).
  - **Gráficos:** **⋯** (abre o menu: nome, categorias, contas, exportar PDF, sair).

### Barra de navegação (rodapé)
Cinco pontos: **Início**, **Plano**, o botão central **＋**, **Fixos** e **Gráficos**.
O item ativo fica em verde (menta).

### Botão central **＋** (FAB)
- Em **Início, Fixos e Gráficos:** abre **Novo lançamento**.
- Na aba **Plano → Planejado:** abre **Novo planejamento**.

---

## 4. Tela INÍCIO (dashboard)

**O que é:** o resumo do mês e a lista de lançamentos.

**O que mostra:**
1. **Saldo do mês** (número grande no topo): `entradas − saídas`. Fica vermelho se for negativo.
2. **Pílulas ↑ / ↓:** total de entradas (↑ verde) e de saídas (↓ vermelho) do mês.
3. **Lançamentos:** a lista de tudo que entrou e saiu, **agrupada por dia** (Hoje, Segunda, etc.), com o total gasto do dia ao lado.
   - Cada item mostra: ícone da categoria, nome, categoria · conta, e o valor (verde para entrada, com sinal − para saída).
   - **Etiquetas:** 📆 “2/10” (parcela) e 🔁 “fixo” (gerado por um gasto fixo).

**Como usar:**
- **Buscar:** campo 🔎 filtra por texto (item, categoria, conta, descrição).
- **Filtrar por categoria:** chips logo abaixo da busca (aparecem quando há mais de uma categoria no mês). Toque em “Todas” para limpar.
- **Editar/apagar:** toque em qualquer lançamento para abrir e editar (ou apagar pelo 🗑).
- **Trocar de mês:** setas ‹ › no topo.

**Detalhe:** o aviso de **contas a vencer** e a lista de **planejados** ficam na aba **Plano → Planejado** (seção 7).

---

## 5. Novo lançamento (o botão **＋**)

**O que é:** a tela para registrar um **gasto** ou uma **receita**.

**Campos, de cima para baixo:**
1. **Gasto / Receita** — segmento no topo (Gasto em vermelho, Receita em verde).
2. **Ditar por voz** 🎤 — toque e fale algo como *“gastei 30 no mercado”*. O app tenta preencher sozinho valor, categoria e descrição. (Confira antes de salvar.)
3. **Valor** — número grande e centralizado.
4. **O que foi** — descrição curta (ex.: “Mercado Extra”).
5. **Categoria** — chips para escolher; a chip tracejada **“＋ Nova”** cria uma categoria na hora (pede nome e emoji).
6. **Conta** — chips das suas contas; a chip **“＋ Nova”** adiciona uma conta nova.
7. **Data** — campo compacto.
8. **Parcelar em (vezes)** — só para **gasto novo** (ver seção 6).
9. **Descrição (opcional)** — uma observação.

**Botões:** **Cancelar** e **Salvar** (botão com brilho).
Ao editar um lançamento existente, aparece o **🗑** para apagar.

**Detalhe:** ao salvar, o app já te leva para o mês do lançamento e mostra a confirmação (com opção de **Desfazer** ao apagar).

---

## 6. Parcelas (compras divididas)

**O que é:** dividir um gasto em várias vezes (ex.: um celular em 10x).

**Como funciona:**
- No **Novo lançamento**, preencha **“Parcelar em (vezes)”** com um número maior que 1.
- O app **divide o valor** pelas vezes (ajustando os centavos na última parcela).
- As parcelas **vão para o Planejado** (aba **Plano → Planejado**), **uma por mês**, como **pendentes**.
- Cada parcela vira **gasto real** só quando você toca em **✓ Pagar** (inclusive a 1ª).

**Por que assim:** você acompanha o parcelamento mês a mês e confirma quando cada parcela realmente sai.

---

## 7. Tela PLANO

Tem **duas abas** no topo: **Orçamento** e **Planejado**.

### 7.1. Orçamento (teto de gastos do mês)
**O que é:** quanto você **pretende** gastar em cada categoria.

**O que mostra:**
- **Renda prevista** do mês e **“A planejar”** (`renda − soma dos tetos`): verde = ainda sobra renda; vermelho = planejou gastar mais do que ganha.
- Uma **barra por categoria** comparando **planejado** (teto) × **real** (o que já saiu):
  - a barra enche conforme o gasto se aproxima do teto e fica **vermelha** se estourar;
  - **“sobra”** = ainda cabe; **“falta”** = passou do teto.

**Como usar:** botão **✎ Editar plano** abre o editor para digitar a **renda prevista** e o **teto de cada categoria**. É salvo **por mês**.

### 7.2. Planejado (contas futuras previstas)
**O que é:** lançamentos que você **prevê**, antes de acontecerem (ex.: uma conta que vai vencer; e as **parcelas**).

**O que mostra:**
- Card de topo: **total planejado**, quanto já foi **pago** e quantos estão **pendentes**.
- Aviso **“⏰ Contas a vencer (próximos 7 dias)”**, com botão de pagar rápido.
- Lista dos planejados, com etiqueta **pendente** / **✓ pago**.

**Como usar:**
- **＋** (FAB) nessa aba cria um **novo planejamento**.
- **✓ Pagar:** transforma o planejado em **lançamento real** (passa a contar no saldo e no “real” do Orçamento). Dá para **desfazer**.

---

## 8. Tela FIXOS (gastos fixos / recorrentes)

**O que é:** contas que se repetem **todo mês** (aluguel, internet, assinaturas, salário…). Você cadastra **uma vez** e o app **lança sozinho** a cada mês.

**O que a tela mostra:**
- **Total mensal** dos fixos, com barra de **pago × pendente** (baseado no dia de vencimento e no dia de hoje).
- Lista de **Recorrentes**, ordenada por dia de vencimento, com status **● pago** ou **○ a vencer**.

**Cadastro (botão ＋ no topo direito):** abre a página em **tela cheia**, onde cada gasto fixo é um **card**:
- **Cabeçalho:** número do item, toggle **ATIVO** (liga/desliga sem apagar) e **🗑** para remover.
- **NOME**, **VALOR**, **DIA** do vencimento.
- **CATEGORIA** e **CONTA** (seletores).
- **TIPO** (Gasto / Receita).
- Botão **＋ Novo gasto fixo** e, no rodapé, **Salvar fixos**.

**Detalhes importantes:**
- O app gera os lançamentos automaticamente **até o mês atual**; eles aparecem no Início com a etiqueta 🔁 “fixo”.
- **Apagar** um lançamento já gerado **não** faz ele voltar — o controle é por “já gerado até tal mês”.
- Desativar (toggle) **para** de gerar dali pra frente, sem apagar o histórico.

---

## 9. Tela GRÁFICOS

**O que é:** a visão visual do mês. Tudo é referente ao **mês selecionado** no topo.

**Conteúdo (de cima para baixo):**
1. **Para onde foi** — gráfico **rosca (donut)** das saídas por categoria, com legenda em % e o total no centro.
2. **Evolução do saldo** — gráfico de **área** com o saldo acumulado dia a dia no mês, mostrando **saldo atual** e o **pico** (melhor dia).
3. **Maiores gastos do mês** — ranking dos 5 maiores, em barras.
4. **Calendário de gastos** — **mapa de calor** (heatmap): quanto mais escuro/verde o dia, mais você gastou. O dia atual fica destacado.

**Exportar relatório:** toque nos **⋯** (no topo direito desta tela) → **Exportar PDF do mês**.
Gera um relatório com entradas/saídas/saldo, o plano (planejado × real) e a lista completa de lançamentos, pronto para **imprimir ou salvar como PDF**.

---

## 10. Categorias e orçamentos

**Onde:** **⋯** (na tela Gráficos) → **Categorias e orçamentos**. Ou pela chip **“＋ Nova”** no formulário.

**O que dá pra fazer:**
- Criar/renomear categorias, escolher o **emoji** e definir um **orçamento** padrão.
- **＋ Nova categoria** para adicionar; **🗑** para remover.

**Detalhe:** o orçamento da categoria é usado como base do Plano quando o mês ainda não tem um plano próprio.

---

## 11. Menu (⋯) — itens

Disponível pelos **⋯** na tela **Gráficos**:
- **👤 Meu nome** — define/edita o nome que aparece na saudação (funciona inclusive em conta já existente).
- **🏷️ Categorias e orçamentos** — editor de categorias (seção 10).
- **💳 Minhas contas** — editor de contas: renomear, remover e adicionar.
- **📄 Exportar PDF do mês** — relatório do mês (seção 9).
- **🚪 Sair da conta** — faz logout (aparece quando há login).

---

## 12. Minhas contas

**Onde:** **Menu → Minhas contas**.

**O que dá pra fazer:** renomear, remover e adicionar contas (ex.: Pix, Dinheiro, Cartão, Conta corrente, Inter…). Elas aparecem como **chips** ao lançar.

**Detalhes:**
- A lista começa com algumas contas padrão e inclui automaticamente as contas que você já usou.
- Renomear aqui muda a lista de chips, mas **não** renomeia lançamentos antigos.
- Uma conta ainda usada em algum lançamento volta a aparecer na lista (contas sem uso somem de vez).

---

## 13. Ditar por voz (detalhe)

No **Novo lançamento**, o botão 🎤 usa o reconhecimento de voz do navegador (pt-BR).
- Fale naturalmente: *“gastei 142 e 90 no mercado”*, *“recebi 4500 de salário”*.
- O app tenta preencher **valor**, **tipo** (receita/gasto), **categoria** e **descrição**.
- Funciona melhor no **Chrome**; sempre **confira** antes de salvar.

---

## 14. PWA — instalar e usar offline

- **Instalar:** no navegador do celular, use **“Adicionar à tela inicial”**. O app abre em tela cheia, com **ícone próprio**.
- **Offline:** a interface abre mesmo sem internet (os **dados** precisam de internet para sincronizar com a nuvem).
- **Atualizações:** o app sempre busca a versão nova ao abrir; se algo não atualizar, feche e reabra.

---

## 15. Resumo dos três conceitos que confundem

| | 🔁 **Fixos** | 📆 **Parcelas** | 📋 **Planejados** |
|---|---|---|---|
| Repete? | Todo mês, sem fim | Número fixo de vezes | Item único |
| Quando é criado | Gerado automático, mês a mês | Tudo de uma vez, na frente | Um a um, manual |
| Vira gasto real | Sozinho | Só ao tocar **✓ Pagar** | Só ao tocar **✓ Pagar** |
| Onde aparece | Lançado (Início) | Plano → Planejado | Plano → Planejado |
| Exemplo | Aluguel, internet, salário | Celular em 10x | IPVA, compra futura |

---

## 16. Roteiro sugerido para o vídeo

1. Abertura: o que é o app e para que serve (seção 0).
2. Criar conta / entrar + a saudação (seções 1 e 2).
3. Passear pela navegação: meses, barra de baixo, botão ＋ (seção 3).
4. Tela Início: saldo, lançamentos, busca e filtros (seção 4).
5. Criar um gasto e uma receita, usando voz, categoria nova e conta nova (seção 5).
6. Mostrar um parcelamento indo para o Planejado (seção 6).
7. Tela Plano: montar o Orçamento e usar o Planejado (pagar uma conta) (seção 7).
8. Tela Fixos: cadastrar um gasto fixo e ver ele lançar sozinho (seção 8).
9. Tela Gráficos: rosca, evolução, maiores gastos, calendário e exportar PDF (seção 9).
10. Menu: nome, categorias, contas (seções 10–12).
11. Instalar como app no celular (seção 14).
12. Fechamento com o quadro Fixos × Parcelas × Planejados (seção 15).
