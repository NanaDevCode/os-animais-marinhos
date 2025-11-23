// Seleciona os elementos importantes do HTML
const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("#search-container input");
const searchButton = document.querySelector("#botão-busca"); // Adicionado seletor para o botão
const filterContainer = document.querySelector("#filter-container");
let dados = []; // Array para armazenar os dados do JSON

// Função para carregar os dados do JSON e renderizar os cards iniciais
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCategorias();
        renderizarCards(dados); // Mostra todos os cards ao carregar a página
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar os dados. Tente novamente mais tarde.</p>";
    }
}

// Função para criar e renderizar o menu suspenso de categorias
function renderizarCategorias() {
    // Pega todas as categorias únicas e filtra para remover valores vazios ou nulos (como 'undefined')
    const categorias = ["Todos", ...new Set(dados.map(item => item.categoria).filter(Boolean))];

    const select = document.createElement("select");
    select.id = "category-select";
    select.addEventListener("change", (e) => filtrarPorCategoria(e.target.value));

    for (const categoria of categorias) {
        const option = document.createElement("option");
        option.value = categoria;
        option.innerText = categoria;
        select.appendChild(option);
    }
    filterContainer.innerHTML = ""; // Limpa o container
    filterContainer.appendChild(select);
}

// Função para filtrar os cards com base na categoria clicada
function filtrarPorCategoria(categoria) {
    searchInput.value = ""; // Limpa o campo de busca ao usar um filtro de categoria
    if (categoria === "Todos") {
        renderizarCards(dados); // Mostra todos os animais
    } else {
        const resultados = dados.filter(item => item.categoria === categoria);
        renderizarCards(resultados); // Mostra apenas os animais da categoria selecionada
    }
}

// Função que renderiza os cards na tela
function renderizarCards(items) {
    cardContainer.innerHTML = ""; // Limpa o container antes de adicionar novos cards
    if (items.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (const item of items) {
        const article = document.createElement("article");
        // Corrigido: Usa os dados do 'item' para preencher o HTML dinamicamente
        article.innerHTML = `
            <div class="card-category">${item.categoria}</div>
            <h2>${item.nome}</h2>
            <p><strong>Nome Científico:</strong> <em>${item.nome_científico}</em></p>
            <p>${item.descricao}</p>
            <a href="${item.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}

// Função de busca que é chamada pelo botão
function iniciarBusca() {
    // Pega o valor do input, converte para minúsculas e remove espaços extras
    const termoBusca = searchInput.value.toLowerCase().trim(); 

    // Filtra os dados. Agora, a busca verifica o nome, o nome científico e a descrição.
    const resultados = dados.filter(item => 
        item.nome.toLowerCase().includes(termoBusca) ||
        item.nome_científico.toLowerCase().includes(termoBusca) ||
        item.descricao.toLowerCase().includes(termoBusca)
    );
    renderizarCards(resultados); // Renderiza apenas os cards que correspondem à busca
}

// Adiciona um listener para o botão de busca
searchButton.addEventListener("click", iniciarBusca);
// Adiciona um listener que executa a busca a cada vez que o usuário digita algo
searchInput.addEventListener("input", iniciarBusca);

// Chama a função para carregar os dados assim que o script é executado
carregarDados();