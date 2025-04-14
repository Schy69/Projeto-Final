const usuarios = {
    "usuario1": {
        "email": "enzo123@gmail.com",
        "senha": "123",
    },
    "usuario2": {
        "email": "marosio@gmail.com",
        "senha": "2304",
    },
    "usuario3": {
        "email": "jaquelinemedevolvemeusfilhos@saudadesdaex.com",
        "senha": "amomeusfilhos123",
    }
};

function login() {
    const email = document.querySelector("#caixaEmail").value.trim();
    const senha = document.querySelector("#exemploInputSenha").value;
    const erroElemento = document.querySelector("#textoErro");
    
    // Limpa mensagem de erro anterior
    erroElemento.textContent = "";
    
    // Validação básica
    if (!email || !senha) {
        erroElemento.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    for (const [nomeUsuario, dados] of Object.entries(usuarios)) {
        if (dados.email === email && dados.senha === senha) {
            window.location.href = "/assets/paginas/catalogo.html";
            return;
        }
    }
    
    erroElemento.textContent = "E-mail ou senha incorretos.";
}

async function getRandomGameCover() {
    const API_KEY = '8f678949e8554b28973aa62d271d1f3d'; // Substitua pela sua chave API
    let coverUrl = null;
    
    try {
        // Primeiro, vamos pegar uma lista de jogos populares
        const currentDate = new Date().toISOString().split('T')[0];
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const formattedLastMonthDate = lastMonthDate.toISOString().split('T')[0];
        
        const gamesResponse = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&dates=${formattedLastMonthDate},${currentDate}&page_size=40`
        );
        
        if (!gamesResponse.ok) {
            throw new Error(`Erro na requisição: ${gamesResponse.status}`);
        }
        
        const gamesData = await gamesResponse.json();
        const games = gamesData.results;
        
        if (!games || games.length === 0) {
            throw new Error('Nenhum jogo encontrado');
        }
        
        // Selecionar um jogo aleatório
        const randomGame = games[Math.floor(Math.random() * games.length)];
        
        // Verificar se tem imagem de capa
        if (randomGame.background_image) {
            coverUrl = randomGame.background_image;
        } else {
            // Se não tiver capa, tentar pegar detalhes completos do jogo
            const gameDetailsResponse = await fetch(
                `https://api.rawg.io/api/games/${randomGame.id}?key=${API_KEY}`
            );
            
            if (gameDetailsResponse.ok) {
                const gameDetails = await gameDetailsResponse.json();
                if (gameDetails.background_image) {
                    coverUrl = gameDetails.background_image;
                }
            }
        }
        
        if (!coverUrl) {
            throw new Error('Jogo não possui imagem de capa disponível');
        }
        
        return coverUrl;
        
    } catch (error) {
        console.error('Erro ao buscar capa do jogo:', error);
        // Retornar uma imagem padrão em caso de erro
        return 'https://via.placeholder.com/600x400?text=No+Cover+Available';
    }
}
