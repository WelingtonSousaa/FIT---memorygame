const input = document.querySelector('.login__input-name');
const passwordInput = document.querySelector('.login__input-password');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login-form');

const validadeInput = () => {
    const username = input.value;
    const password = passwordInput.value;

    if (username.length > 2 && password.length > 3) {
        button.removeAttribute('disabled');
        return;
    }
    button.setAttribute('disabled', '');
}

const handleSubmit = async (event) => {
    event.preventDefault();

    const username = input.value;
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            sessionStorage.setItem('player', username)
            window.location = 'pages/game.html';
        } else {
            alert(data.message || "Algo deu errado. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        alert("Erro ao tentar se conectar ao servidor.");
    }
};

input.addEventListener('input', validadeInput);
passwordInput.addEventListener('input', validadeInput);
form.addEventListener('submit', handleSubmit);
