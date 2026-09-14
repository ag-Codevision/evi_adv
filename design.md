# Design System & Guia de Estilo: EVI Sociedade de Advogados

**Arquivo:** `design.md`  
**Cliente:** EVI Sociedade de Advogados  
**Versão:** 1.2 (Edição Comemorativa 25 Anos — Atualizada com Tipografia Serifada no Menu, Menubar Centralizada e Refinamento do Rodapé)  
**Propósito:** Fonte Única da Verdade (*Single Source of Truth*) para garantir consistência estética, arquitetural e visual em todas as páginas, componentes e futuras implementações da plataforma web.

---

## 1. Visão Geral e Filosofia de Design (*Atmosphere & Mood*)

O design da **EVI Sociedade de Advogados** traduz autoridade jurídica, modernidade e sofisticação sóbria. O estilo adotado combina o rigor ético da advocacia corporativa com elementos visuais de ponta do design contemporâneo (*Executive Platinum & Glass Architecture*).

* **Tom e Voz:** Seguro, ético, corporativo, transparente, acolhedor e altamente resolutivo.
* **Sensação Visual:** Profundidade elegante, acabamentos metálicos escovados, vidro fosco reflexivo (*frosted glass*), tipografia clássica com contraste equilibrado e ausência total de poluição visual.
* **Diretriz de Conversão:** Acessos imediatos e diretos para o WhatsApp oficial e canais de contato, sem agressividade comercial, preservando a dignidade da advocacia (em conformidade com o Código de Ética e Disciplina da OAB).

---

## 2. Diretriz Mandatória de Identidade: Paleta Prata / Platina

> [!IMPORTANT]
> **REGRA CRÍTICA DE MARCA: ESTREITAMENTE PRATA / PLATINA (NÃO DOURADO)**  
> A identidade visual oficial da EVI Sociedade de Advogados é fundamentada em **tons prateados, platina e aço escovado**, em perfeita harmonia com o selo e logotipo comemorativo de 25 anos em metal prateado.  
> **É estritamente proibido** utilizar tons amarelados, mostarda, ocre, dourado ou bronze (`#a3834d`, `#d8b368`, `#e3c88f`, `#e6b042`, etc.).

---

## 3. Tokens Globais de Cor (*Design Tokens*)

Os tokens de cor estão definidos no `:root` e são reaproveitados em todo o ecossistema CSS da aplicação.

### 3.1. Cores Primárias e Metálicas

| Variável | Valor Hex / RGBA | Nome Descritivo | Aplicação / Papel Semântico |
| :--- | :--- | :--- | :--- |
| `--deep` | `#18283a` | Azul Petróleo Profundo | Cor institucional principal, fundos nobres, tipografia de menu e contraste forte. |
| `--accent` | `#728699` | Aço Prateado Acinzentado | Acentos executivos, ícones primários, estados ativos e bordas refinadas. |
| `--silver` | `#b8c7d6` | Prata Suave Metálica | Destaques intermediários, ícones na barra superior e badges. |
| `--silver-bright` | `#e2e8f0` | Platina Luminosa | Pontos de luz, seletores ativos, indicadores do slider e hover. |
| `--soft` | `#f1f4f6` | Gelo / Platina Branda | Fundos de cards, superfícies secundárias e alternância de seções. |

### 3.2. Cores de Suporte, Texto e Conversão

| Variável | Valor Hex / RGBA | Nome Descritivo | Aplicação / Papel Semântico |
| :--- | :--- | :--- | :--- |
| `--ink` | `#192229` | Grafite Titânio Escuro | Tipografia corrida, textos secundários e alto contraste de leitura. |
| `--muted` | `#66727c` | Cinza Neutro Corporativo | Legendas, descrições secundárias, metadados e textos de apoio. |
| `--line` | `#e1e7e9` | Linha Prateada Sutil | Separadores de seção, contornos de tabela e bordas delicadas. |
| `--white` | `#ffffff` | Branco Puro | Fundo principal da página e elementos com elevação nítida. |
| `--green` | `#25d366` | Verde Oficial WhatsApp | Botão principal de ação/conversão e canal direto de orientação. |

### 3.3. Transparências e Efeitos Metálicos (*Glass & Translucency*)

* **Bordas Prateadas Translúcidas:** `rgba(180, 195, 210, 0.22)` a `rgba(180, 195, 210, 0.44)`
* **Reflexos e Brilhos de Platina:** `rgba(226, 232, 240, 0.60)`
* **Fundos Escuros Noturnos (*Dark Mode / Sub-bases*):** `#090b0e`, `#07090c`, `#0c1015`
* **Superfície Vidro Desfocado (*Glassmorphism*):** `rgba(255, 255, 255, 0.94)` com `backdrop-filter: blur(18px)`

---

## 4. Tipografia & Hierarquia de Texto

O sistema tipográfico une a seriedade da tradição jurídica à modernidade da comunicação digital.

### 4.1. Famílias Tipográficas

* **Fonte Principal (Sans-serif):**  
  `var(--sans)` = `Inter, 'Segoe UI', Arial, sans-serif`  
  *Uso:* Textos corridos, parágrafos explicativos, botões de ação, metadados e elementos utilitários de interface.
* **Fonte de Prestígio e Autoridade (Serif):**  
  `var(--serif)` = `Georgia, 'Times New Roman', serif`  
  *Uso:* Títulos principais (`H1`), subtítulos de seção (`H2`), títulos dos cards de atuação (`H3`), títulos de coluna do rodapé e **links da navegação principal do menu (`.nav-item`)**, consolidando uma assinatura editorial nobre e homogênea.

### 4.2. Escala Tipográfica e Estilos

* **Títulos Principais (H1):** `clamp(2.6rem, 4.8vw, 4.3rem)`, peso `500`, `line-height: 1.04`, `var(--serif)`, `letter-spacing: -0.04em`.
* **Títulos de Seção (H2):** `clamp(2.35rem, 4.8vw, 4.3rem)`, peso `500`, `line-height: 1.05`, `var(--serif)`, `letter-spacing: -0.045em`.
* **Títulos de Cards de Atuação (H3):** `1.4rem`, peso `600`, `var(--serif)`, cor `var(--deep)`.
* **Itens de Navegação do Menu (`.nav-item`):** `1.08rem`, peso `600`, `var(--serif)`, cor `var(--deep)` (`#18283a`), espaçamento entre letras `.01em`.
* **Texto de Apoio / Parágrafos (`p`):** `1rem` a `1.05rem`, peso `400`, `line-height: 1.7`, `var(--sans)`.
* **Eyebrow (Chapeuzinho / Selo de Contexto):** `0.76rem`, caixa alta (`uppercase`), peso `900`, `letter-spacing: 0.14em`, acompanhado por traço decorativo horizontal de 29px em platina.
* **Metadados e Legendas (`small`):** `0.72rem` a `0.80rem`, peso `500`.

---

## 5. Geometria, Espaçamento e Elevação (*Depth & Elevation*)

### 5.1. Formas e Arredondamentos (*Border Radius*)

* **Pílula Completa (`999px`):** Utilizada em todos os botões de ação (`.btn`, `.btn-wa`, `.btn-outline`).
* **Cartões e Painéis (`16px` a `22px`):** Cantos suaves para caixas de conteúdo, cards de área de atuação e container de contato.
* **Emblema do Rodapé (`10px`):** Caixa de apoio ao logotipo no rodapé com cantos discretos e elevação balanceada.
* **Assimetria Arquitetural de Fotos:** `border-radius: 110px 23px 23px 23px` em fotos da Hero e da seção institucional, criando a assinatura visual proprietária da EVI.
* **Círculo Perfeito (`50%`):** Ícones sociais, indicadores do slider e botão flutuante do WhatsApp.

### 5.2. Sombras (*Shadows*)

* **Sombra de Elevação Primária:**  
  `--shadow: 0 20px 55px rgba(18, 34, 42, 0.11)`
* **Sombra Suave de Superfície:**  
  `--soft-shadow: 0 12px 32px rgba(0, 0, 0, 0.06)`
* **Brilho Platina Hover:**  
  `box-shadow: 0 0 12px rgba(226, 232, 240, 0.60)`
* **Sombra de Conversão (WhatsApp):**  
  `box-shadow: 0 15px 34px rgba(37, 211, 102, 0.38)`

### 5.3. Layout e Grid

* **Container Central:** `width: min(1180px, calc(100% - 40px)); margin: auto;`
* **Gaps Padrão:** `16px`, `24px`, `36px`, `52px`.
* **Seções Verticais:** `padding: 92px 0;` (desktop) e `padding: 78px 0;` (mobile).

---

## 6. Especificação dos Componentes Chave

### 6.1. Topbar Executiva (`.topbar`)
* **Fundo:** `var(--deep)` (`#18283a`) com borda inferior em `rgba(180, 195, 210, 0.14)`.
* **Lado Esquerdo:**
  * Tagline de atuação: `"São Paulo · SP · Atendimento Nacional"`.
  * Telefone institucional com ícone SVG: `(11) 4362-3533` (`tel:+551143623533`).
  * E-mail institucional com ícone SVG: `contato@evi.adv.br` (`mailto:contato@evi.adv.br`).
* **Lado Direito:**
  * Redes sociais em botões circulares de 28px com borda metálica: Facebook, Instagram, LinkedIn e YouTube.

### 6.2. Header & Menubar Simétrica Centralizada (`.header`, `.nav-split`)
* **Posicionamento:** `position: sticky; top: 0; z-index: 50;`.
* **Materialidade:** Fundo translúcido `rgba(255, 255, 255, 0.95)` com `backdrop-filter: blur(18px)` e borda inferior sutil `rgba(225, 231, 233, .85)`.
* **Arquitetura Visual Centralizada (*Harmonic Centered Split*):**
  * Em vez de esticar os links para as bordas periféricas da tela, o layout desktop adota alinhamento flexível concentrado no centro (`display: flex; align-items: center; justify-content: center; gap: 52px;`).
  * **Flanco Esquerdo (`.nav-left`):** 2 links de navegação (`Atuação`, `O escritório`), com `gap: 36px`, tipografia serifada de prestígio (`1.08rem`, peso `600`) e alinhamento voltado ao centro.
  * **Centro (`.brand-center`):** Logotipo oficial da EVI no coração da barra, com `height: 54px` (topo) e `max-width: 180px`, preservando o protagonismo da marca.
  * **Flanco Direito (`.nav-right`):** 2 links de navegação (`Dúvidas`, `Contato`), com `gap: 36px`, tipografia serifada de prestígio e alinhamento voltado ao centro.
  * **Gaveta Mobile (`.nav-mobile-drawer`):** Oculta por padrão no desktop (`display: none;`) e ativada exclusivamente via menu hambúrguer em resoluções `<= 980px`.
* **Comportamento Dinâmico no Scroll:**
  * **Topo (Estado Inicial):** Logo com `height: 54px` em menubar de `min-height: 86px`.
  * **Ao Rolar a Página (`.header.scrolled`):** A menubar reduz suavemente para `min-height: 66px` e o logo para `height: 42px` via curva cúbica `cubic-bezier(.16, 1, .3, 1)`.
* **Mobile (`<= 980px`):** O `.nav-split` adota `justify-content: space-between;`, o logo posiciona-se à esquerda/centro e o botão hambúrguer assume a interação à direita.

### 6.3. Hero Section com Carrossel Duplo
* **Slide 1 (Institucional & Autoridade):**
  * Eyebrow prateado + H1 em fonte serifada + Parágrafo contextual.
  * Duplo CTA: Botão WhatsApp (`.btn-wa`) + Botão de contorno prateado (`.btn-outline`).
  * Selo de reputação Google com 5 estrelas em prata refinada (`#cbd5e1`).
* **Slide 2 (Edição Comemorativa 25 Anos):**
  * Logotipo comemorativo de 25 Anos em destaque de escala ampla (`max-width: min(390px, 92vw)`), acabamento prateado e sombra de profundidade.
  * Mensagem comemorativa sintetizada + CTA direto de orientação jurídica.
* **Navegação do Slider:**
  * Barras horizontais dinâmicas com transição suave e brilho em platina.

### 6.4. Cards de Áreas de Atuação (`.area`)
* **Alinhamento do Cabeçalho (`.section-head-center`):** Eyebrow, H2 e parágrafo perfeitamente centralizados no eixo visual da seção.
* **Grid Simétrico no Desktop (`min-width: 992px`):** Sistema de 6 colunas onde:
  * Linha 1: 3 cards (Direito Médico, Direito Cível, Direito de Família), cada um ocupando 2 colunas.
  * Linha 2: 2 cards (Direito Trabalhista, Direito Empresarial), perfeitamente centralizados nas colunas 2 a 5.
* **Tablet e Mobile:** Transição para 2 colunas (com o 5º card centralizado) e 1 coluna em telas menores.
* **Estilo do Card:** Fundo branco, cantos de `22px`, numeração destacada em platina (`01` a `05`), título em `var(--serif)` (`1.4rem`) e link de conversão direta para o WhatsApp da área.

### 6.5. Rodapé Institucional e Sub-rodapé (`.footer`)
* **Fundo & Atmosfera:** `var(--deep)` (`#18283a`) com tipografia de apoio em `#94a3b8` e `#cbd5e1`.
* **Grid de 3 Colunas:**
  1. **Identidade Institucional:** Logotipo oficial da EVI em caixa de proteção refinada (`.footer-brand`) com cantos de `10px`, fundo branco, sombra de profundidade (`box-shadow: 0 4px 20px rgba(0,0,0,.2)`) e parágrafo institucional com respiro de `16px`.
  2. **Navegação:** Título em `var(--serif)` (`1.12rem`) com links em microinteração hover.
  3. **Canais Oficiais:** Telefone, e-mail institucional, localização (`São Paulo · SP`) e botões circulares das redes sociais.
* **Sub-rodapé Fixo (`.footer-bottom`):**
  * Elemento **estático e livre de deslocamentos de scroll**, garantindo que o copyright e o aviso legal permaneçam sempre perfeitamente visíveis, legíveis e integrados no fundo azul petróleo, sem cortes ou vazamentos sobre o fundo da página.

---

## 7. Responsividade e Breakpoints Oficiais

* **Desktop Grande (`> 1180px`):** Layout completo com largura máxima restrita a 1180px.
* **Tablet / Notebook Compacto (`980px`):**
  * Menubar transita para layout móvel com menu hambúrguer.
  * Grade de 2 colunas para áreas de atuação e footer.
* **Tablet Vertical (`820px`):** Ocultação da tagline textual na topbar, mantendo contatos e ícones sociais.
* **Smartphones Médios / Grandes (`650px`):**
  * Menu móvel ativado com drawer vertical (`.nav-mobile-drawer`).
  * Hero empilhada: texto acima e imagem/canvas abaixo.
  * Cards de atuação em 1 coluna única.
  * Botões de ação em largura total (100%).
* **Smartphones Pequenos (`<= 440px`):**
  * Ocultação do label textual de e-mail na topbar (mantendo ícone clicável), preservando telefone e redes sociais sem quebra desalinhada de linha.

---

## 8. Diretrizes de Motion: Rolagem em Tempo Real & Convergência das Extremidades (*Edge-to-Center*)

Para preservar o aspecto **clean, arejado e sofisticado** de todas as seções, o sistema de animação é orientado pela física de movimento contínuo acoplado à rolagem do usuário (*Scroll-Linked / Scroll-Driven Realtime Motion*), sem disparos estáticos ou engasgos.

### 8.1. Princípio de Convergência das Extremidades ao Centro (*Edge-to-Center Dynamics*)

* **Entrada (Scroll Down):**
  * À medida que uma seção entra no campo de visão (*viewport*), seus elementos componentes partem suavemente das extremidades periféricas em direção ao seu ponto de ancoragem natural no centro da tela.
  * **Elementos do flanco esquerdo** (ex: títulos de seções, textos institucionais, colunas ímpares): iniciam deslocados para a esquerda (`translateX(-75px)` no mobile e `translateX(-160px)` no desktop) com opacidade reduzida e deslizam para a posição neutra (`translateX(0)`).
  * **Elementos do flanco direito** (ex: cards de destaque, fotos, painéis de contato): iniciam deslocados para a direita (`translateX(75px)` no mobile e `translateX(160px)` no desktop) com opacidade reduzida e convergem para a posição neutra (`translateX(0)`).
  * **Elementos centrais** (ex: badges de processo, botões centrais, divisores): convergem com elevação vertical suave (`translateY(38px)` a `translateY(65px) -> translateY(0)`).

### 8.2. Movimento de Entrada Cinematográfico da Hero Section

* **Animação Escalonada (*Staggered Entrance*):**
  Ao carregar a página e em cada transição de painel ativo do carrossel da Hero, os elementos internos executam uma entrada fluida vindo da lateral esquerda (`translate3d(-70px, 0, 0) -> translate3d(0, 0, 0)`) com curva cúbica suave `cubic-bezier(.16, 1, .3, 1)`:
  * Eyebrow: entrada em 0.75s (atraso de 0.06s).
  * H1 / Selo de 25 Anos: entrada em 0.90s (atraso de 0.18s).
  * Parágrafo de descrição: entrada em 0.90s (atraso de 0.30s).
  * Botões de ação (WhatsApp & Contorno): entrada em 0.95s (atraso de 0.44s).
  * Bloco de reputação Google (5 estrelas): entrada em 1.00s (atraso de 0.58s).

### 8.3. Bidirecionalidade e Reversibilidade Contínua (*Scroll Up & Down*)

* O movimento **não é um gatilho único (*one-shot*)**. Ele é uma interpolação paramétrica proporcional à posição da rolagem da página.
* **Ao rolar para baixo:** Os elementos convergem com precisão matemática em direção ao centro da tela conforme ganham visibilidade.
* **Ao rolar para cima:** O movimento acontece no sentido **exatamente inverso**, com os elementos recuando nitidamente em direção às suas extremidades de origem (`-160px` à esquerda e `+160px` à direita) ao longo de uma ampla janela de rolagem (`0.95 * wh` até `0.40 * wh`).
* **Detecção de Fim de Página (*Bottom Boundary Detection*):** Quando o usuário atinge a extremidade inferior da página (`docHeight - scrollBottom < 140px`), todos os elementos visíveis do rodapé recebem garantia de atingir a posição neutra `p = 1`, eliminando cortes visuais ou estados intermediários indesejados.

### 8.4. Performance de Alta Fluidez sem Engasgos (*Zero-Jank GPU Execution*)

1. **Prevenção de Barras de Rolagem Duplas:**
   * Utilização estrita de `overflow-x: clip;` no `html` e no `body`, evitando a duplicação de barras de rolagem verticais no Windows/Chromium.
2. **Rolagem Nativa Desimpedida:**
   * Ausência de `scroll-behavior: smooth` global no seletor `html` para evitar conflito com os eventos da roda do mouse (*mouse wheel*) e trackpads, aplicando o smooth scroll exclusivamente via cliques em links âncora.
3. **Aceleração por Hardware (GPU Only):**
   * Animar estritamente `transform: translate3d(x, y, 0)` e `opacity`. Proibido animar propriedades com custo de layout (*reflow*).
4. **Pipelines Otimizados:**
   * Loop acionado por `requestAnimationFrame` + *passive scroll listeners* com interpolação linear ágil (`diff * 0.16`), desligando automaticamente a execução quando em repouso.

---

## 9. Acessibilidade (A11y) & Performance

* **Contraste de Cor:** Garantia de conformidade WCAG AA/AAA em todos os textos sobre fundos claros (`--ink` sobre `--white`) e fundos escuros (`--silver-bright` sobre `--deep`).
* **Suporte a Movimento Reduzido:**  
  Implementação completa de `@media (prefers-reduced-motion: reduce)`, desativando transições bruscas, rotação automática do slider e animações para usuários com sensibilidade vestibular.
* **Links Semânticos e ARIA:**  
  Todos os elementos interativos contêm atributos `aria-label`, `aria-expanded` ou `aria-selected` onde aplicável.

---

## 10. Checklist para Criação de Novas Páginas e Telas

Ao desenvolver novas páginas (ex: páginas de artigos, áreas de atuação individuais, página institucional de equipe ou formulários):

- [ ] Importar e manter os tokens de cor do `:root` sem criar variáveis isoladas.
- [ ] Garantir que nenhum elemento utilize tons dourados ou amarelos (manter estritamente prata/platina).
- [ ] Adotar a topbar padrão com os mesmos links oficiais de telefone, e-mail e redes sociais.
- [ ] Utilizar a menubar sticky translúcida com links em tipografia serifada de prestígio (`var(--serif)`) e logotipo centralizado.
- [ ] Aplicar a tipografia oficial (`Inter` para interface corrida e `Georgia` para títulos e navegação institucional).
- [ ] Utilizar botões em formato pílula (`border-radius: 999px`).
- [ ] Estruturar seções com estética *clean*, amplo respiro e grid equilibrado.
- [ ] Aplicar animações de rolagem em tempo real (*edge-to-center* bidirecionais e reversíveis via GPU com tolerância no rodapé).
- [ ] Replicar o padrão de rodapé com as 3 colunas, caixa de logo refinada e copyright estático integrado.
- [ ] Validar a experiência em telas de 360px até 1920px e em modo `prefers-reduced-motion`.
