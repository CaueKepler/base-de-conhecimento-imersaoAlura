let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("#campo-busca");
let infoResultados = document.querySelector("#info-resultados");
let statsContainer = document.querySelector("#stats-container");
let categoriasContainer = document.querySelector("#categorias-container");
let btnFavoritos = document.querySelector("#btn-favoritos");
let sugestoesBotoes = document.querySelectorAll(".sugestao-btn");
let btnTopo = document.querySelector("#btn-topo");
let btnImprimir = document.querySelector("#btn-imprimir");
let selectOrdenacao = document.querySelector("#select-ordenacao");
let btnSobre = document.querySelector("#btn-sobre");
let modalSobre = document.querySelector("#modal-sobre");
let btnModalFechar = document.querySelector("#modal-sobre-fechar");
let btnLimpar = document.querySelector("#btn-limpar");
let btnTema = document.querySelector("#btn-tema");

let dados = [];

// =================== ESTADO GLOBAL ===================

const estado = {
    termoBusca: "",
    categoriaSelecionada: "todas",
    mostrarFavoritos: false,
    favoritos: new Set(),
    ordenacao: "az"
};

// =================== CATEGORIAS ===================

const categoriasConfig = [
    {
        id: "sustentabilidade",
        label: "Sustentabilidade",
        emoji: "🌱",
        matchTags: [
            "sustentabilidade",
            "consumo consciente",
            "meio ambiente",
            "reciclagem",
            "upcycling",
            "orgânico"
        ]
    },
    {
        id: "processos",
        label: "Processos & Produção",
        emoji: "⚙️",
        matchTags: [
            "processos",
            "produção",
            "confecção",
            "engenharia",
            "tempo padrão",
            "ficha técnica",
            "pilotagem",
            "cadeia têxtil",
            "logística"
        ]
    },
    {
        id: "materiais",
        label: "Materiais & Tecidos",
        emoji: "🧵",
        matchTags: [
            "fibra",
            "algodão",
            "poliéster",
            "malha",
            "denim",
            "tecido",
            "tecelagem",
            "malharia"
        ]
    },
    {
        id: "negocios",
        label: "Negócios & Varejo",
        emoji: "🛍️",
        matchTags: [
            "fast fashion",
            "slow fashion",
            "negócios",
            "varejo",
            "marca própria",
            "private label",
            "coleção cápsula"
        ]
    },
    {
        id: "tecnologia",
        label: "Tecnologia & Indústria 4.0",
        emoji: "🤖",
        matchTags: [
            "4.0",
            "dados",
            "automação",
            "tecnologia",
            "digital",
            "indústria 4.0"
        ]
    },
    {
        id: "outros",
        label: "Outros temas",
        emoji: "📚",
        matchTags: []
    }
];

// Mapa nome -> imagem
const imagensPorTema = {
    "Moda sustentável": "img/moda-sustentavel.jpeg",
    "Denim e Jeanswear": "img/denim.jpeg",
    "Malharia circular": "img/malharia.jpeg",
    "Tecidos planos": "img/tecidos-planos.jpeg",
    "Estamparia digital": "img/estamparia.jpeg",
    "Lavanderia de denim": "img/lavanderia.jpeg",
    "Ficha técnica de produto": "img/ficha-tecnica.jpeg",
    "Modelagem e pilotagem": "img/modelagem.jpeg",
    "Fast fashion": "img/fast-fashion.jpeg",
    "Slow fashion": "img/slow-fashion.jpeg",
    "Upcycling": "img/upcycling.jpeg",
    "Algodão orgânico": "img/algodao-organico.jpeg",
    "Poliéster reciclado": "img/poliester-reciclado.jpeg",
    "Coleção cápsula": "img/colecao-capsula.jpeg",
    "Tabela de medidas e grade": "img/tabela-medidas.jpeg",
    "Engenharia de processos na confecção": "img/engenharia-processos.jpeg",
    "Logística na cadeia têxtil": "img/logistica.jpeg",
    "Tendências de moda": "img/tendencias.jpeg",
    "Confecção 4.0": "img/confeccao-4-0.jpeg",
    "Private label": "img/private-label.jpeg"
};

// =================== TEMA (LIGHT / DARK) ===================

function aplicarTema(tema) {
    const body = document.body;
    body.setAttribute("data-theme", tema === "dark" ? "dark" : "light");

    if (btnTema) {
        const icone = btnTema.querySelector(".btn-tema-icone");
        if (!icone) return;
        icone.textContent = tema === "dark" ? "☀️" : "🌙";
    }
}

function carregarTema() {
    const salvo = localStorage.getItem("temaModa");
    let tema = salvo;

    if (!tema) {
        const prefereDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        tema = prefereDark ? "dark" : "light";
    }

    aplicarTema(tema);
}

function alternarTema() {
    const atual = document.body.getAttribute("data-theme") || "light";
    const novo = atual === "light" ? "dark" : "light";
    aplicarTema(novo);
    localStorage.setItem("temaModa", novo);
}

// =================== INTRO (sempre que carregar) ===================

function mostrarIntro() {
    const introOverlay = document.querySelector("#intro-overlay");
    if (!introOverlay) return;

    introOverlay.classList.add("intro-overlay--visivel");
    introOverlay.classList.remove("intro-overlay--escondida");
}

function fecharIntro() {
    const introOverlay = document.querySelector("#intro-overlay");
    if (!introOverlay) return;

    introOverlay.classList.remove("intro-overlay--visivel");
    introOverlay.classList.add("intro-overlay--escondida");
}

// =================== UTIL ===================

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function destacarTermo(texto, termo) {
    if (!termo || !termo.trim()) return texto;

    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${termoEscapado})`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
}

function obterCategoriasDoTema(dado) {
    const texto = normalizar(
        `${dado.nome} ${dado.descricao} ${(dado.tags || []).join(" ")}`
    );

    const categoriasEncontradas = [];

    categoriasConfig.forEach(cat => {
        if (cat.id === "outros") return;

        const bateu = cat.matchTags.some(tag =>
            texto.includes(normalizar(tag))
        );
        if (bateu) categoriasEncontradas.push(cat.id);
    });

    if (categoriasEncontradas.length === 0) {
        categoriasEncontradas.push("outros");
    }

    return categoriasEncontradas;
}

// =================== DADOS ===================

async function carregarDadosSeNecessario() {
    if (dados.length === 0) {
        try {
            const resposta = await fetch("data.json");
            const bruto = await resposta.json();

            dados = bruto.map(d => ({
                ...d,
                categorias: obterCategoriasDoTema(d)
            }));
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
        }
    }
}

function carregarFavoritos() {
    try {
        const salvo = localStorage.getItem("favoritosModa");
        if (salvo) {
            const lista = JSON.parse(salvo);
            estado.favoritos = new Set(lista);
        }
    } catch (e) {
        console.error("Erro ao carregar favoritos:", e);
    }
}

function salvarFavoritos() {
    const lista = Array.from(estado.favoritos);
    localStorage.setItem("favoritosModa", JSON.stringify(lista));
}

// =================== CATEGORIAS / RESUMO ===================

function renderizarCategorias() {
    categoriasContainer.innerHTML = "";

    const todasBtn = document.createElement("button");
    todasBtn.type = "button";
    todasBtn.className = "categoria-chip categoria-chip--active";
    todasBtn.dataset.categoria = "todas";
    todasBtn.textContent = "Todas as categorias";
    categoriasContainer.appendChild(todasBtn);

    categoriasConfig.forEach(cat => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "categoria-chip";
        btn.dataset.categoria = cat.id;
        btn.innerHTML = `${cat.emoji} ${cat.label}`;
        categoriasContainer.appendChild(btn);
    });

    categoriasContainer.addEventListener("click", event => {
        const btn = event.target.closest("button[data-categoria]");
        if (!btn) return;

        const categoria = btn.dataset.categoria;
        estado.categoriaSelecionada = categoria;

        document
            .querySelectorAll(".categoria-chip")
            .forEach(b => b.classList.remove("categoria-chip--active"));
        btn.classList.add("categoria-chip--active");

        aplicarFiltrosEAtualizarTela();
    });
}

function atualizarBotaoFavoritos() {
    const qtd = estado.favoritos.size;
    const sufixo = `(${qtd})`;

    if (estado.mostrarFavoritos) {
        btnFavoritos.classList.add("btn-favoritos--ativo");
        btnFavoritos.textContent = `⭐ Mostrando só favoritos ${sufixo}`;
    } else {
        btnFavoritos.classList.remove("btn-favoritos--ativo");
        btnFavoritos.textContent = `⭐ Ver só favoritos ${sufixo}`;
    }
}

function renderizarResumo(listaFiltrada) {
    if (!listaFiltrada || listaFiltrada.length === 0) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <span class="stat-label">Temas neste contexto</span>
                <span class="stat-value">0</span>
            </div>
        `;
        return;
    }

    const total = listaFiltrada.length;
    const contagemPorCategoria = {};

    categoriasConfig.forEach(cat => {
        contagemPorCategoria[cat.id] = 0;
    });

    listaFiltrada.forEach(d => {
        (d.categorias || []).forEach(catId => {
            if (contagemPorCategoria[catId] != null) {
                contagemPorCategoria[catId]++;
            }
        });
    });

    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-label">Temas neste contexto</span>
            <span class="stat-value">${total}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Sustentabilidade & impacto</span>
            <span class="stat-value">${contagemPorCategoria["sustentabilidade"] || 0}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Processos & produção</span>
            <span class="stat-value">${contagemPorCategoria["processos"] || 0}</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Tecnologia & Indústria 4.0</span>
            <span class="stat-value">${contagemPorCategoria["tecnologia"] || 0}</span>
        </div>
    `;
}

// =================== FILTROS & CARDS ===================

function aplicarFiltrosEAtualizarTela() {
    const termoBruto = estado.termoBusca.trim();
    const termoBuscaNormalizado = normalizar(termoBruto);

    let lista = dados.slice();

    // Busca
    if (termoBuscaNormalizado) {
        lista = lista.filter(dado => {
            const nome = normalizar(dado.nome);
            const descricao = normalizar(dado.descricao);
            const tags = dado.tags ? normalizar(dado.tags.join(" ")) : "";
            return (
                nome.includes(termoBuscaNormalizado) ||
                descricao.includes(termoBuscaNormalizado) ||
                tags.includes(termoBuscaNormalizado)
            );
        });
    }

    // Categoria
    if (estado.categoriaSelecionada !== "todas") {
        lista = lista.filter(d =>
            (d.categorias || []).includes(estado.categoriaSelecionada)
        );
    }

    // Favoritos
    if (estado.mostrarFavoritos) {
        lista = lista.filter(d => estado.favoritos.has(d.nome));
    }

    // Ordenação
    if (estado.ordenacao === "az") {
        lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    } else if (estado.ordenacao === "ano") {
        lista.sort((a, b) => {
            const aa = (a.data_criacao || "").toString();
            const bb = (b.data_criacao || "").toString();
            return aa.localeCompare(bb, "pt-BR");
        });
    }

    // Texto de contexto
    if (!termoBruto && estado.categoriaSelecionada === "todas" && !estado.mostrarFavoritos) {
        infoResultados.textContent = `Mostrando ${lista.length} temas sobre moda e indústria têxtil.`;
    } else {
        let partes = [];

        if (termoBruto) partes.push(`para "${termoBruto}"`);
        if (estado.categoriaSelecionada !== "todas") {
            const cat = categoriasConfig.find(c => c.id === estado.categoriaSelecionada);
            if (cat) partes.push(`na categoria "${cat.label}"`);
        }
        if (estado.mostrarFavoritos) partes.push("apenas favoritos");

        const contexto = partes.join(" e ");
        infoResultados.textContent =
            lista.length === 0
                ? `Nenhum resultado ${contexto || ""}.`
                : `Encontramos ${lista.length} tema(s) ${contexto || ""}.`;
    }

    renderizarResumo(lista);
    renderizarCards(lista);
}

function renderizarCards(lista) {
    cardContainer.innerHTML = "";

    if (!lista || lista.length === 0) {
        cardContainer.innerHTML = `
            <p class="mensagem-vazia">
                Ops! Não encontramos nada com esse termo ou filtro. Experimente pesquisar por
                <strong>jeans</strong>, <strong>malha</strong>, <strong>ficha técnica</strong> ou <strong>sustentabilidade</strong>.
            </p>
        `;
        return;
    }

    const termoHighlight = estado.termoBusca.trim();

    lista.forEach((dado, index) => {
        const article = document.createElement("article");
        article.classList.add("card", "card-animada");
        article.style.animationDelay = `${index * 40}ms`;

        const caminhoImagem = imagensPorTema[dado.nome];
        const inicial = dado.nome.charAt(0).toUpperCase();
        const favorito = estado.favoritos.has(dado.nome);

        const mediaHtml = caminhoImagem
            ? `<img src="${caminhoImagem}" alt="${dado.nome}" class="card-img">`
            : `<div class="card-placeholder">${inicial}</div>`;

        const tagsHtml =
            dado.tags && dado.tags.length
                ? `<ul class="tag-list">
                        ${dado.tags
                            .map(tag => `<li class="tag-chip">${destacarTermo(tag, termoHighlight)}</li>`)
                            .join("")}
                   </ul>`
                : "";

        const tituloDestacado = destacarTermo(dado.nome, termoHighlight);
        const descricaoDestacada = destacarTermo(dado.descricao, termoHighlight);

        article.innerHTML = `
            <div class="card-media">
                ${mediaHtml}
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h2>${tituloDestacado}</h2>
                    <button
                        type="button"
                        class="favorite-btn ${favorito ? "favorite-btn--ativo" : ""}"
                        data-nome="${dado.nome}"
                        aria-label="${favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
                    >
                        ★
                    </button>
                </div>
                <p class="meta"><strong>Ano / referência:</strong> ${dado.data_criacao}</p>
                <p>${descricaoDestacada}</p>
                ${tagsHtml}
                <a href="${dado.link_oficial}" target="_blank" rel="noopener noreferrer">
                    Saiba mais
                </a>
            </div>
        `;

        cardContainer.appendChild(article);
    });

    document.querySelectorAll(".favorite-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const nome = btn.dataset.nome;
            if (!nome) return;

            if (estado.favoritos.has(nome)) {
                estado.favoritos.delete(nome);
            } else {
                estado.favoritos.add(nome);
            }
            salvarFavoritos();
            atualizarBotaoFavoritos();
            aplicarFiltrosEAtualizarTela();
        });
    });
}

// =================== AÇÕES ===================

async function iniciarBusca() {
    await carregarDadosSeNecessario();
    estado.termoBusca = campoBusca.value;
    aplicarFiltrosEAtualizarTela();
    document.querySelector("main").scrollIntoView({ behavior: "smooth" });
}

function limparFiltros() {
    estado.termoBusca = "";
    estado.categoriaSelecionada = "todas";
    estado.mostrarFavoritos = false;
    estado.ordenacao = "az";

    campoBusca.value = "";
    selectOrdenacao.value = "az";

    document
        .querySelectorAll(".categoria-chip")
        .forEach(b => b.classList.remove("categoria-chip--active"));

    const chipTodas = document.querySelector('.categoria-chip[data-categoria="todas"]');
    if (chipTodas) chipTodas.classList.add("categoria-chip--active");

    atualizarBotaoFavoritos();
    aplicarFiltrosEAtualizarTela();
    document.querySelector("main").scrollIntoView({ behavior: "smooth" });
}

// Modal
function abrirModalSobre() {
    modalSobre.classList.add("modal--aberto");
    modalSobre.setAttribute("aria-hidden", "false");
}

function fecharModalSobre() {
    modalSobre.classList.remove("modal--aberto");
    modalSobre.setAttribute("aria-hidden", "true");
}

// =================== BOOTSTRAP ===================

document.addEventListener("DOMContentLoaded", async () => {
    // Tema
    carregarTema();

    // Intro (sempre que carregar)
    mostrarIntro();

    // Favoritos
    carregarFavoritos();
    atualizarBotaoFavoritos();

    // Dados + UI
    await carregarDadosSeNecessario();
    renderizarCategorias();
    aplicarFiltrosEAtualizarTela();

    // ENTER na busca
    campoBusca.addEventListener("keydown", event => {
        if (event.key === "Enter") iniciarBusca();
    });

    // Botão favoritos
    btnFavoritos.addEventListener("click", () => {
        estado.mostrarFavoritos = !estado.mostrarFavoritos;
        atualizarBotaoFavoritos();
        aplicarFiltrosEAtualizarTela();
    });

    // Limpar filtros
    btnLimpar.addEventListener("click", () => {
        limparFiltros();
    });

    // Sugestões
    sugestoesBotoes.forEach(btn => {
        btn.addEventListener("click", () => {
            const termo = btn.dataset.termo || "";
            campoBusca.value = termo;
            estado.termoBusca = termo;
            aplicarFiltrosEAtualizarTela();
            document.querySelector("main").scrollIntoView({ behavior: "smooth" });
        });
    });

    // Ordenação
    selectOrdenacao.addEventListener("change", () => {
        estado.ordenacao = selectOrdenacao.value;
        aplicarFiltrosEAtualizarTela();
    });

    // Imprimir
    btnImprimir.addEventListener("click", () => {
        window.print();
    });

    // Voltar ao topo
    btnTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnTopo.classList.add("btn-topo--visivel");
        } else {
            btnTopo.classList.remove("btn-topo--visivel");
        }
    });

    // Modal
    btnSobre.addEventListener("click", abrirModalSobre);
    btnModalFechar.addEventListener("click", fecharModalSobre);

    modalSobre.addEventListener("click", event => {
        if (event.target.hasAttribute("data-fechar-modal")) {
            fecharModalSobre();
        }
    });

    // ESC fecha modal e intro
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            fecharModalSobre();
            fecharIntro();
        }
    });

    // Tema toggle
    if (btnTema) {
        btnTema.addEventListener("click", alternarTema);
    }

    // Intro: clique fecha + timeout
    const introEl = document.querySelector("#intro-overlay");
    if (introEl) {
        introEl.addEventListener("click", fecharIntro);

        setTimeout(() => {
            fecharIntro();
        }, 2600);
    }
});
