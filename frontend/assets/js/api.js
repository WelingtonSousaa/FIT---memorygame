const API_BASE_URL = 'http://26.106.165.16:3000'; 

//* Objeto 'auth' para gerenciar o estado de autenticação
const auth = {
    login: (token, user) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
    },

    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('current_user');
        window.location.href = '/index.html';
    },

    isLoggedIn: () => {
        const token = localStorage.getItem('jwt_token');
        // TODO:  Futuramente, poderíamos validar esse token com o backend
        return !!token; 
    },

    getToken: () => {
        return localStorage.getItem('jwt_token');
    },

    getUser: () => {
        try {
            //! Pega o usuário do localStorage (rápido, mas pode estar desatualizado)
            return JSON.parse(localStorage.getItem('current_user'));
        } catch (e) {
            return null;
        }
    },

    authFetch: async (endpoint, options = {}) => {
        const token = auth.getToken();
        
        //* Configura os headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers, //* Permite sobrescrever headers
        };

        //! Adiciona o token de autorização se estiver logado
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        //* Monta as opções finais do fetch
        const fetchOptions = {
            ...options,
            headers: headers,
        };

        const response = await fetch(API_BASE_URL + endpoint, fetchOptions);

        //! Se o token for inválido ou expirado (401 ou 403), desloga o usuário
        if (response.status === 401 || response.status === 403) {
            console.error('Token inválido ou expirado. Deslogando...');
            auth.logout();
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        return response;
    }
};