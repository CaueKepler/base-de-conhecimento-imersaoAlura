# 🌎 Moda & Indústria Têxtil – Base de Conhecimento

Aplicação web desenvolvida para uma competição da **Alura**, com o desafio de construir uma solução completa usando apenas **HTML, CSS, JavaScript e JSON**, consumindo os dados localmente no navegador (sem backend, sem banco de dados externo).

A ideia foi trazer o desafio para a realidade da **indústria da moda e da confecção**, criando uma **Base de Conhecimento de Moda & Indústria Têxtil**, simulando um portal interno que poderia ser usado por times de:

- Engenharia de Processos  
- Desenvolvimento de Produto  
- Produção / Confecção  
- Qualidade e Treinamento  

---

## 🧩 Visão geral

A aplicação permite pesquisar e navegar por temas importantes do universo têxtil, como:

- Moda sustentável  
- Denim e jeanswear  
- Malharia  
- Ficha técnica de produto  
- Confecção 4.0  
- Processos e engenharia  
- Sustentabilidade e materiais  

Tudo isso consumindo dados de um arquivo `data.json`, que funciona como um **“mini banco de dados local”**.

---

## ✨ Funcionalidades

- 🔍 **Busca inteligente**  
  - Pesquisa por nome, descrição e tags dos temas.  
  - Suporte a termos combinados (ex.: `jeans`, `malha`, `ficha técnica`, `sustentabilidade`).

- 🧠 **Base de conhecimento em JSON**  
  - Cada registro possui: `nome`, `descricao`, `data_criacao`, `link_oficial` e `tags`.  
  - Fácil de estender e manter.

- 🏷️ **Filtros por categoria**  
  - Sustentabilidade  
  - Processos & Produção  
  - Materiais & Tecidos  
  - Negócios & Varejo  
  - Tecnologia & Indústria 4.0  
  - Outros temas  

- ⭐ **Favoritos com `localStorage`**  
  - Usuário pode marcar temas como favoritos.  
  - Favoritos são salvos no navegador (persistem entre sessões).  
  - Botão para **ver apenas favoritos**.

- 📊 **Mini-dashboard (resumo)**  
  - Cards de resumo mostrando:
    - Quantos temas estão sendo exibidos no contexto atual  
    - Quantos temas de Sustentabilidade  
    - Quantos de Processos & Produção  
    - Quantos de Tecnologia & Indústria 4.0  

- 🧽 **Limpar filtros**  
  - Botão dedicado para:
    - Limpar campo de busca  
    - Voltar para “Todas as categorias”  
    - Desligar “somente favoritos”  
    - Resetar ordenação  

- ↕️ **Ordenação de resultados**  
  - Ordenar por:
    - Nome (A–Z)  
    - Ano / referência (`data_criacao`)

- 💡 **Sugestões rápidas de pesquisa**  
  - Botões com termos prontos (ex.: `jeans`, `malha`, `ficha técnica`, `sustentabilidade`, `confecção 4.0`).

- 🖼️ **Cards com imagens temáticas**  
  - Cada tema pode ter uma imagem associada (pasta `img/`).  
  - Quando não há imagem, é exibido um “avatar” com a inicial do título.

- 🖨️ **Versão para impressão**  
  - Botão “Versão para impressão” que aciona `window.print()`.  
  - CSS com `@media print` para gerar uma visualização limpa e sem elementos de navegação.

- 🪟 **Modal “Sobre o projeto”**  
  - Explica o objetivo da aplicação.  
  - Destaca o uso de HTML, CSS, JavaScript e JSON.

- 🔝 **Botão “Voltar ao topo”**  
  - Aparece ao rolar a página.  
  - Rolagem suave de volta ao topo.

- 📱 **Layout responsivo**  
  - Ajustes de layout para tablets e smartphones.  
  - Cards responsivos e reorganização de filtros no mobile.

---

## 🛠️ Tecnologias utilizadas

- **HTML5** – estrutura da aplicação  
- **CSS3** – layout, responsividade e identidade visual  
- **JavaScript (Vanilla)** – busca, filtros, favoritos, ordenação, modal, interação geral  
- **JSON** – base de conhecimento local (`data.json`)  
- **LocalStorage** – armazenamento de favoritos no navegador  

---

## 📂 Estrutura do projeto

```text
/
├─ index.html       # Estrutura principal da aplicação
├─ style.css        # Estilos e responsividade
├─ script.js        # Lógica da interface (busca, filtros, favoritos, etc.)
├─ data.json        # Base de conhecimento (temas de moda & indústria têxtil)
└─ img/             # Imagens usadas nos cards
   ├─ moda-sustentavel.jpg
   ├─ denim.jpg
   ├─ malharia.jpg
   ├─ ficha-tecnica.jpg
   └─ ...
