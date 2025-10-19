document.addEventListener("DOMContentLoaded", function() {
    if (!auth.isLoggedIn()) {
        auth.logout(); //* Garante que tudo está limpo e redireciona
        return; 
    }

    //* Carrega o HTML do header
    fetch('/page/site/header.html')
        .then(response => {
            if (!response.ok) throw new Error('Falha ao carregar o header.html');
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            //* Após o header carregar, adiciona os eventos
            setupHeaderEvents();
            
            //* Busca os dados REAIS do usuário no backend
            loadUserData();
        })
        .catch(error => {
            console.error("Erro crítico ao carregar o header:", error);
            auth.logout(); //* Desloga se o header não puder ser carregado
        });
});


async function loadUserData() {
    try {
        const response = await auth.authFetch('/api/users/me'); //* Rota protegida
        if (!response.ok) {
            throw new Error('Falha ao buscar dados do usuário.');
        }
        
        const user = await response.json();
        
        //* Salva o usuário mais recente no localStorage
        localStorage.setItem('current_user', JSON.stringify(user)); 

        //* Atualiza os elementos do header
        const welcomeText = document.getElementById('welcome-text');
        const userAvatar = document.getElementById('user-avatar');

        if (user) {
            const firstName = user.name.split(' ')[0];
            welcomeText.textContent = `Bem-vindo, ${firstName}!`;
            
            //* Atualiza o avatar
            if (user.avatar_url) {
                //* Monta a URL completa para a imagem
                userAvatar.src = `${API_BASE_URL}/avatares/${user.avatar_url}`;
            }
        }
    } catch (error) {
        console.error(error.message);
        //* Se falhar (ex: token expirado), o authFetch já vai deslogar
    }
}


function setupHeaderEvents() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const userMenuClose = document.getElementById('user-menu-close');
    const logoutButton = document.getElementById('logout-button');

    if (userMenuButton && userMenu && userMenuClose) {
        userMenuButton.addEventListener('click', () => {
            userMenu.classList.remove('hidden');
        });

        userMenuClose.addEventListener('click', () => {
            userMenu.classList.add('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!userMenu.classList.contains('hidden') && !userMenu.contains(e.target) && !userMenuButton.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }
}