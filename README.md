# Fit Memory Game v2

Bem-vindo ao Fit Memory Game v2, um jogo da memória completo desenvolvido como parte das atividades do Fórum de Inovação e Tecnologia (FIT). Este projeto web full-stack apresenta um frontend interativo e um backend robusto com autenticação, placares e gerenciamento de perfis.

## 🧠 Sobre o Projeto

Este projeto vai além de um simples jogo da memória. Ele simula um ambiente de aplicação web completo, incluindo:

* Autenticação de usuário com tokens JWT.
* Gerenciamento de perfil com upload e recorte de avatar.
* Lógica de jogo com diferentes níveis de dificuldade.
* Persistência de dados com pontuações, tempo e histórico de partidas.
* Rankings globais separados por dificuldade.

## 👨‍💻 Desenvolvedor

* **Welington Sousa**
    * [sousawelington.ws@gmail.com]
    * [https://github.com/WelingtonSousaa]

## 🚀 Sobre o FIT (Fórum de Inovação e Tecnologia)

*Este ano com o tema "Internet das coisas e suas aplicações"*

O Fórum de Inovação e Tecnologia (FIT) é o maior evento universitário de tecnologia do Sertão de Crateús, unindo inovação, conhecimento e oportunidades em um só lugar

## ✨ Funcionalidades Principais

* **Autenticação Segura:** Sistema de Cadastro e Login usando `bcrypt` para hash de senhas e `JWT` (JSON Web Tokens) para gerenciamento de sessão.
* **Gerenciamento de Perfil:** O usuário pode editar suas informações (nome, e-mail, senha).
* **Recorte de Avatar:** Integração com `Cropper.js` para permitir que o usuário faça upload e recorte uma imagem de perfil personalizada.
* **Dois Modos de Jogo:** Intermediário e Difícil.
* **Lógica de Reembaralhamento:** No modo "Difícil", todas as cartas que ainda não formaram par são reembaralhadas visualmente a cada erro do jogador, aumentando o desafio.
* **Ranking e Histórico:** O backend salva cada partida, permitindo a exibição de um Ranking Global (Top 10) e um Histórico de Partidas Pessoais.
* **Componentização:** Header e Footer são carregados dinamicamente em todas as páginas do site.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia            | Propósito                                                    |
| :---      | :---                  | :---                                                         |
| **Frontend**|
| | HTML5                           | Estruturação das páginas.                                    |
| | TailwindCSS (CDN)               | Estilização rápida e responsiva.                             |
| | JavaScript (ES6+)               | Lógica do jogo, manipulação do DOM e chamadas de API.        |
| | Cropper.js                      | Biblioteca para recorte de imagem no perfil.                 |
| **Backend**|
| | Node.js                         | Ambiente de execução do servidor.                            |
| | Express.js                      | Gerenciamento de rotas e middlewares da API.                 |
| | MySQL2                          | Driver de conexão com o banco de dados MySQL.                |
| | CORS                            | Habilitação de Cross-Origin Resource Sharing.                |
| | JSON Web Token (`jsonwebtoken`) | Geração e verificação de tokens de autenticação.             |
| | Bcrypt.js (`bcryptjs`)          | Hash seguro de senhas de usuário.                            |
| | Multer (`multer`)               | Middleware para upload de arquivos (avatares).               |
| **Banco de Dados**| 
| | MySQL                           | Armazenamento de usuários, cartas e histórico de partidas.   |
| **Servidor**|
| | XAMPP (Local)                   | Para servir o MySQL e (opcionalmente) o frontend via Apache. |
| | `serve` (Radmin)                | Servidor estático Node.js para o frontend.                   |

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto completo.

### 1. Pré-requisitos

* **Node.js:** Versão 18 ou superior.
* **XAMPP:** Instalado e rodando os módulos **Apache** e **MySQL**.
* **`serve`:** Um servidor estático global para Node.js. Instale com:
    ```sh
    npm install -g serve
    ```
* **Radmin VPN (Opcional):** Necessário apenas para o "Método B".

### 2. Configuração do Banco de Dados (MySQL)

1.  Abra o painel de controle do XAMPP e inicie os serviços **Apache** e **MySQL**.
2.  Acesse o phpMyAdmin (normalmente `http://localhost/phpmyadmin`).
3.  Crie um novo banco de dados. O nome **deve ser** `fit_memorygame_v2`.
4.  Selecione o banco `fit_memorygame_v2`, vá para a aba "Importar", escolha o arquivo `database.sql` da raiz do projeto e execute-o. Isso criará as tabelas `users`, `cards` e `game_history` e inserirá os dados das cartas.

### 3. Configuração do Backend (API)

1.  Abra um terminal na pasta `backend/` do projeto.
2.  Instale as dependências:
    ```sh
    npm install
    ```
3.  Verifique o arquivo `backend/.env`. Assegure-se de que `DB_HOST`, `DB_USER`, `DB_PASSWORD` (geralmente vazia no XAMPP) e `DB_NAME` (`fit_memorygame_v2`) estão corretos.
4.  **Não inicie o backend ainda.** A próxima etapa depende do método de frontend que você escolher.

---

### 4. Executando o Projeto

Existem duas formas de rodar o sistema. O código no branch `back-teste` está **pronto para o Método B (Radmin VPN)**.

#### Método A: Setup para Radmin VPN (para jogar com amigos)

Este método usa `serve` para o frontend (porta `8080`) e `node` para o backend (porta `3000`).

1.  **Encontre seu IP do Radmin:** Abra o Radmin VPN e copie seu endereço de IP (ex: `26.106.165.16`).

2.  **Verifique os Arquivos (Já deve estar configurado):**
    * **`backend/src/app.js`**: Verifique se o `const seuIpDoRadmin` está com seu IP e se `originPermitida` aponta para a porta `8080`.
    * **`frontend/assets/js/api.js`**: Verifique se `API_BASE_URL` aponta para o seu IP do Radmin na porta `3000`.
    * **Caminhos do Frontend:** Verifique se todos os links (`href`), `fetch` de HTML e redirecionamentos (`window.location.href`) usam caminhos relativos à raiz (`/`), por exemplo: `/page/inicio.html` ou `/index.html`.

3.  **Inicie o Backend:**
    * Em um terminal na pasta `backend/`:
    ```sh
    npm start
    ```
    * O backend deve estar rodando em `http://<SEU_IP_RADMIN>:3000`.

4.  **Inicie o Frontend:**
    * Abra um **novo** terminal na pasta `frontend/`:
    ```sh
    serve -l tcp://0.0.0.0:8080
    ```
    * O `-l tcp://0.0.0.0:8080` é crucial para que o `serve` aceite conexões do seu IP de Radmin.

5.  **Acesse o Jogo:**
    * Você e seus amigos na mesma rede Radmin VPN podem acessar o jogo através do link:
    * **`http://<SEU_IP_DO_RADMIN>:8080`**

6.  **Firewall:**
    * Se houver problemas de conexão, certifique-se de que o **Firewall do Windows** está permitindo conexões de entrada nas portas `3000` (para Node.js) e `8080` (para `serve`).

---

#### Método B: Setup para Localhost (para testes solo com XAMPP)

Este método usa o Apache do XAMPP para servir o frontend (na porta 80) e o `node` para o backend (na porta 3000).

Para mudar do setup de Radmin (Método A) para este, você precisa **reverter 3 grupos de alterações**:

1.  **Alteração 1: Backend (CORS)**
    * **Arquivo:** `backend/src/app.js`
    * **Mude de:**
        ```javascript
        // const seuIpDoRadmin = '26.106.165.16'; 
        // const originPermitida = `http://${seuIpDoRadmin}:8080`;
        // const corsOptions = { origin: originPermitida, ... };
        // app.use(cors(corsOptions));
        ```
    * **Mude para:**
        ```javascript
        app.use(cors()); // Permite todas as origens
        ```
    * **Lembre-se de reiniciar o backend (`npm start`)** após esta alteração.

2.  **Alteração 2: Frontend (URL da API)**
    * **Arquivo:** `frontend/assets/js/api.js`
    * **Mude de:**
        ```javascript
        const API_BASE_URL = 'http://<SEU_IP_DO_RADMIN>:3000';
        ```
    * **Mude para:**
        ```javascript
        const API_BASE_URL = 'http://localhost:3000';
        ```

3.  **Alteração 3: Frontend (Caminhos de Navegação e Links)**
    * Como o XAMPP serve o projeto a partir da subpasta `/memorygamev2/`, todos os caminhos de raiz (`/`) estão errados. Você precisa adicionar o prefixo do seu projeto.
    * **Ação:** Faça uma busca e substituição em **toda** a pasta `frontend/`:
        * **Redirecionamentos JS:** Mude todos os `window.location.href = '/page/...'` para `window.location.href = 'http://localhost/memorygamev2/frontend/page/...'`.
            * *Arquivos afetados: `api.js`, `auth.js`, `game.js`, `endgame.js`, `header.js`.*
        * **Links HTML:** Mude todos os `<a href="/page/...">` para `<a href="/memorygamev2/frontend/page/...">`.
            * *Arquivos afetados: `header.html`, `inicio.html`, `edit_user.html`.*
        * **Fetch de Partials:** Mude `fetch('/page/site/...')` para `fetch('/memorygamev2/frontend/page/site/...')`.
            * *Arquivos afetados: `header.js`, `footer.js`.*

4.  **Inicie os Servidores:**
    * Inicie o **Apache** e o **MySQL** no XAMPP.
    * Inicie o backend no terminal: `npm start` (na pasta `backend/`).

5.  **Acesse o Jogo:**
    * Abra o navegador e acesse pela URL do XAMPP:
    * **`http://localhost/memorygamev2/frontend/index.html`**