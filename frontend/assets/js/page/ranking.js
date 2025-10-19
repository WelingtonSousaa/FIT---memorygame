document.addEventListener('DOMContentLoaded', () => {
    const tabIntermediario = document.getElementById('tab-intermediario');
    const tabDificil = document.getElementById('tab-dificil');
    const contentIntermediario = document.getElementById('content-intermediario');
    const contentDificil = document.getElementById('content-dificil');
    
    //* Containers das listas
    const listIntermediario = contentIntermediario.querySelector('.ranking-list');
    const listDificil = contentDificil.querySelector('.ranking-list');

    //* Função para buscar e renderizar o ranking
    const loadRanking = async (difficulty, container) => {
        container.innerHTML = '<p class="text-gray-500">Carregando ranking...</p>';
        try {
            const response = await auth.authFetch(`/api/game/ranking?difficulty=${difficulty}`);
            if (!response.ok) throw new Error('Falha ao buscar ranking.');

            const rankingData = await response.json();
            
            //* Limpa o container
            container.innerHTML = '';

            if (rankingData.length === 0) {
                container.innerHTML = '<p class="text-gray-500">Nenhum dado encontrado para esta dificuldade.</p>';
                return;
            }

            //* Renderiza os itens
            rankingData.forEach((item, index) => {
                container.appendChild(createRankingItem(item, index + 1));
            });

        } catch (error) {
            console.error(error);
            container.innerHTML = `<p class="text-red-500">${error.message}</p>`;
        }
    };

    //* Função para criar o HTML de cada item do ranking
    const createRankingItem = (item, position) => {
        const li = document.createElement('li');
        li.classList.add('ranking-item');
        
        let positionHtml;
        let rankClass = '';

        //* Aplica estilos e ícones do Top 3
        switch (position) {
            case 1:
                rankClass = 'rank-1';
                positionHtml = '<svg class="crown-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M11.05 3.001a1 1 0 00-2.1 0L8.1 7.207l-4.552.368a1 1 0 00-.55 1.705l3.4 3.11-1 4.392a1 1 0 001.449 1.054L10 15.13l3.854 2.69a1 1 0 001.45-1.054l-1-4.392 3.4-3.11a1 1 0 00-.55-1.705l-4.552-.368L11.05 3.001z"></path></svg>';
                break;
            case 2:
                rankClass = 'rank-2';
                positionHtml = '<svg class="crown-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M11.05 3.001a1 1 0 00-2.1 0L8.1 7.207l-4.552.368a1 1 0 00-.55 1.705l3.4 3.11-1 4.392a1 1 0 001.449 1.054L10 15.13l3.854 2.69a1 1 0 001.45-1.054l-1-4.392 3.4-3.11a1 1 0 00-.55-1.705l-4.552-.368L11.05 3.001z"></path></svg>';
                break;
            case 3:
                rankClass = 'rank-3';
                positionHtml = '<svg class="crown-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M11.05 3.001a1 1 0 00-2.1 0L8.1 7.207l-4.552.368a1 1 0 00-.55 1.705l3.4 3.11-1 4.392a1 1 0 001.449 1.054L10 15.13l3.854 2.69a1 1 0 001.45-1.054l-1-4.392 3.4-3.11a1 1 0 00-.55-1.705l-4.552-.368L11.05 3.001z"></path></svg>';
                break;
            default:
                positionHtml = `<span class="rank-position">${position}.</span>`;
        }
        
        if(rankClass) li.classList.add(rankClass);

        li.innerHTML = `
            ${positionHtml}
            <span class="rank-name">${item.name}</span>
            <span class="rank-score">${item.max_score} pts</span>
        `;
        return li;
    };

    //* Lógica das Abas
    const showIntermediario = () => {
        tabIntermediario.classList.add('active');
        tabDificil.classList.remove('active');
        contentIntermediario.classList.remove('hidden');
        contentDificil.classList.add('hidden');
        loadRanking('intermediario', listIntermediario);
    };

    const showDificil = () => {
        tabIntermediario.classList.remove('active');
        tabDificil.classList.add('active');
        contentIntermediario.classList.add('hidden');
        contentDificil.classList.remove('hidden');
        loadRanking('dificil', listDificil);
    };

    if(tabIntermediario) tabIntermediario.addEventListener('click', showIntermediario);
    if(tabDificil) tabDificil.addEventListener('click', showDificil);

    showIntermediario();
});