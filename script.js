document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente carregado!");

    // Variáveis
    const form = document.querySelector("#card-form");
    const fileInput = document.getElementById('file-input');
    const labelImagem = document.querySelector('.campo_imagem');
    const btnNovoFilme = document.querySelector(".cabecalho_btn-novo");
    const btnHome = document.querySelector(".cabecalho_btn-home");
    const formulario = document.querySelector(".formulario");
    const lista = document.querySelector(".lista");
    
    formulario.style.display = "none"; 
    lista.style.display = "block";    

    function alternarVisibilidade(event) {
        if (event.target === btnHome) {
            formulario.style.display = "none";  
            lista.style.display = "block";    
        } else if (event.target === btnNovoFilme) {
            lista.style.display = "none";  
            formulario.style.display = "block";  
        }
    }

    function adicionarCard(event) {
        event.preventDefault();
        const nomeFilme = document.querySelector("#movie-title").value.trim();
        const generoFilme = document.querySelector("#movie-gender").value.trim();
        const imagemFilme = fileInput.files[0];

        if (!nomeFilme || !generoFilme || !imagemFilme) {
            alert("Por favor, preencha todos os campos e selecione uma imagem!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            const imagemURL = reader.result;

            const novoCard = document.createElement("div");
            novoCard.classList.add("lista_catalogo_cards");
            novoCard.innerHTML = `
                <img class="lista_cards_img" src="${imagemURL}" alt="Poster do filme ${nomeFilme}">
                <div class="lista_cards_campo">
                    <p class="lista_cards_texto">${nomeFilme}</p>
                    <div class="lista_cards_campo_btns">
                        <button class="lista_cards_campo_excluir" alt="lixo">Excluir</button>
                        <button class="lista_cards_campo_editar" alt="lixo">Editar</button>
                    </div>
                </div>
            `;

            const generoElemento = document.querySelector(`#${generoFilme.toLowerCase()}`);
            if (generoElemento) {
                generoElemento.appendChild(novoCard);
            } else {
                alert("Gênero inválido ou não encontrado.");
            }

            alert(`O filme "${nomeFilme}" foi adicionado ao catálogo com sucesso!`);
            form.reset();  
            labelImagem.textContent = "Escolher imagem"; 

            salvarFilmesNoLocalStorage(nomeFilme, generoFilme, imagemURL);
        };
        reader.readAsDataURL(imagemFilme);
    }

    function excluirCard(event) {
        if (event.target.matches(".lista_cards_campo_excluir")) {
            const card = event.target.closest(".lista_catalogo_cards");
            if (card) {
                card.remove();
                alert("Filme excluído com sucesso!");
                atualizarLocalStorage();
            }
        }
    }

    function atualizarNomeArquivo(event) {
        const fileName = event.target.files[0] ? event.target.files[0].name : "Escolher imagem";
        labelImagem.textContent = fileName;
    }

    function carregarFilmes() {
        const listaCatalogoGeral = document.querySelectorAll(".catalogo_filmes .lista_catalogo");
        listaCatalogoGeral.forEach(catalogo => catalogo.innerHTML = '');

        let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
        filmes.forEach(filme => {
            const novoCard = document.createElement("div");
            novoCard.classList.add("lista_catalogo_cards");
            novoCard.innerHTML = `
                <img class="lista_cards_img" src="${filme.imagemURL}" alt="Poster do filme ${filme.nomeFilme}">
                <div class="lista_cards_campo">
                    <p class="lista_cards_texto">${filme.nomeFilme}</p>
                    <div class="lista_cards_campo_btns">
                        <button class="lista_cards_campo_excluir" alt="lixo">Excluir</button>
                        <button class="lista_cards_campo_editar" alt="lixo">Editar</button>
                    </div>
                </div>
            `;

            const generoElemento = document.querySelector(`#${filme.generoFilme.toLowerCase()}`);
            if (generoElemento) {
                generoElemento.appendChild(novoCard);
            }
        });
    }

    function salvarFilmesNoLocalStorage(nomeFilme, generoFilme, imagemURL) {
        const novoFilme = { nomeFilme, generoFilme, imagemURL };
        let filmes = JSON.parse(localStorage.getItem('filmes')) || [];
        filmes.push(novoFilme);
        localStorage.setItem('filmes', JSON.stringify(filmes));
    }

    function atualizarLocalStorage() {
        const filmes = Array.from(document.querySelectorAll(".lista_catalogo_cards")).map(card => {
            const nomeFilme = card.querySelector(".lista_cards_texto").textContent;
            const generoFilme = card.closest(".lista_catalogo").id;
            const imagemURL = card.querySelector("img").src;
            return { nomeFilme, generoFilme, imagemURL };
        });
        localStorage.setItem('filmes', JSON.stringify(filmes));
    }

    carregarFilmes();

    // Eventos
    if (form) form.addEventListener("submit", adicionarCard);
    if (fileInput) fileInput.addEventListener('change', atualizarNomeArquivo);

    const listaCatalogo = document.querySelectorAll(".lista_catalogo");
    listaCatalogo.forEach(catalogo => catalogo.addEventListener("click", excluirCard));

    btnHome.addEventListener("click", alternarVisibilidade);
    btnNovoFilme.addEventListener("click", alternarVisibilidade);
});
