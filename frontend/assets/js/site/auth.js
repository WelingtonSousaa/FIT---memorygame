document.addEventListener('DOMContentLoaded', () => {
    //* se não existir login, retorna para a tela inicial
    if (auth.isLoggedIn()) {
        window.location.href = '/page/inicio.html';
    }

    const form = document.getElementById('auth-form');
    const formSubtitle = document.getElementById('form-subtitle');
    const formTitle = document.getElementById('form-title');
    const nomeField = document.getElementById('nome-field');
    const vinculoField = document.getElementById('vinculo-field');
    const submitButton = document.getElementById('submit-button');
    const toggleProse = document.getElementById('toggle-prose');
    const toggleLink = document.getElementById('toggle-link');
    const errorMessage = document.getElementById('error-message');
    
    let isLoginMode = true;

    //* Alternar entre login e registro
    const toggleMode = (event) => {
        if(event) event.preventDefault();
        isLoginMode = !isLoginMode;
        errorMessage.classList.add('hidden'); //* Esconde mensagens de erro ao alternar
        
        if (isLoginMode) {
            formSubtitle.textContent = 'Faça login para continuar';
            formTitle.textContent = 'Login';
            submitButton.textContent = 'Entrar';
            toggleProse.textContent = 'Não tem uma conta? ';
            toggleLink.textContent = 'Cadastre-se';
            nomeField.classList.add('hidden');
            vinculoField.classList.add('hidden');
        } else {
            formSubtitle.textContent = 'Crie sua conta para começar';
            formTitle.textContent = 'Cadastro';
            submitButton.textContent = 'Cadastrar';
            toggleProse.textContent = 'Já tem uma conta? ';
            toggleLink.textContent = 'Entre';
            nomeField.classList.remove('hidden');
            vinculoField.classList.remove('hidden');
        }
    };
    
    toggleLink.addEventListener('click', toggleMode);

    //* Submissão do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.classList.add('hidden');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        //* Converte checkbox para boolean
        data.is_ufc_student = !!data.is_ufc_student;

        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const response = await fetch(API_BASE_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Ocorreu um erro.');
            }

            if (isLoginMode) {
                //* Se for login, salva o token e redireciona
                auth.login(result.token, result.user);
                window.location.href = '/page/inicio.html';
            } else {
                //* Se for registo, exibe mensagem de sucesso e muda para a tela de login
                alert('Registo realizado com sucesso! Faça o login para continuar.');
                toggleMode(); //* Volta para o modo de login
            }

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        }
    });
});