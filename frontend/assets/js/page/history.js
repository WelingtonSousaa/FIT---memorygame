document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.querySelector('.history-list');

    const loadHistory = async () => {
        try {
            const response = await auth.authFetch('/api/game/history');
            if (!response.ok) throw new Error('Falha ao buscar histórico.');

            const historyData = await response.json();

            if (historyData.length === 0) {
                historyList.innerHTML += '<p class="text-gray-500 text-center col-span-3">Você ainda não completou nenhuma partida.</p>';
                return;
            }

            //* Renderiza os itens
            historyData.forEach(item => {
                historyList.appendChild(createHistoryItem(item));
            });

        } catch (error) {
            console.error(error);
            historyList.innerHTML += `<p class="text-red-500 text-center col-span-3">${error.message}</p>`;
        }
    };

    const createHistoryItem = (item) => {
        const div = document.createElement('div');
        div.classList.add('history-item');

        //* Formata o tempo (ex: 92s -> 01:32s)
        const minutes = Math.floor(item.time / 60).toString().padStart(2, '0');
        const seconds = (item.time % 60).toString().padStart(2, '0');
        
        div.innerHTML = `
            <span class="difficulty">${item.difficulty}</span>
            <span class="time">${minutes}:${seconds}s</span>
            <span class="score">${item.score} pts</span>
        `;
        return div;
    };

    loadHistory();
});