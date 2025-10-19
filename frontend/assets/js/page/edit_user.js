document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('edit-profile-form');
    const changeAvatarButton = document.getElementById('change-avatar-button');
    const cropModal = document.getElementById('crop-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const modalCancelButton = document.getElementById('modal-cancel-button');
    const modalConfirmButton = document.getElementById('modal-confirm-button');
    const avatarUploadInput = document.getElementById('avatar-upload-input');
    const imageToCrop = document.getElementById('image-to-crop');
    const cropPlaceholderText = document.getElementById('crop-placeholder-text');
    const pageAvatar = document.querySelector('.flex.flex-col.items-center img');

    let cropper = null; //* Variável para guardar a instância do Cropper
    let selectedFile = null; //* Armazena o arquivo original selecionado

    //* CARREGAR DADOS ATUAIS DO USUÁRIO
    const user = auth.getUser();
    if (user) {
        document.getElementById('name').value = user.name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('matricula').value = user.student_id || '';
        document.getElementById('vinculo_ufc').checked = user.is_ufc_student || false;
        
        if (pageAvatar && user.avatar_url) {
            //! Usa API_BASE_URL definida em api.js
            pageAvatar.src = `${API_BASE_URL}/avatares/${user.avatar_url}`;
        }
    }

    //* LÓGICA DE EDIÇÃO DE PERFIL (Formulário Principal)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            name: data.name,
            email: data.email
        };
        if (data.password) {
            payload.password = data.password;
        }

        try {
            const response = await auth.authFetch('/api/users/profile', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Erro ao atualizar perfil.');
            }

            const result = await response.json();
            localStorage.setItem('current_user', JSON.stringify(result.user));
            alert('Perfil atualizado com sucesso!');
            window.location.reload(); 

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    });

    // LÓGICA DO MODAL DE CORTE / UPLOAD COM CROPPER.J

    //* 1. Botão "Alterar Avatar" abre o seletor de arquivos
    if (changeAvatarButton) {
        changeAvatarButton.addEventListener('click', (e) => {
            e.preventDefault();
            avatarUploadInput.click(); 
        });
    }

    //* 2. Arquivo selecionado -> Mostrar no modal e INICIAR CROPPER
    avatarUploadInput.addEventListener('change', () => {
        selectedFile = avatarUploadInput.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageToCrop.src = e.target.result;
                imageToCrop.classList.remove('hidden');
                cropPlaceholderText.classList.add('hidden');
                
                //* Destruir instância anterior, se existir
                if (cropper) {
                    cropper.destroy();
                }
                
                //* INICIALIZAR CROPPER.JS
                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1 / 1,     //* Proporção quadrada para avatar
                    viewMode: 1,            //* Restringe a área de corte aos limites da imagem
                    dragMode: 'move',       //* Permite mover a imagem por baixo da área de corte
                    background: false,      //* Sem fundo quadriculado
                    cropBoxResizable: true,
                    cropBoxMovable: false,
                    autoCropArea: 0.8,      //* Começa com 80% da área selecionada
                    // Adicionar mais opções conforme necessário: https://github.com/fengyuanchen/cropperjs
                });
            };
            reader.readAsDataURL(selectedFile);
            cropModal.classList.remove('hidden');
        } else if (selectedFile) {
            alert('Por favor, selecione um arquivo de imagem válido.');
            resetModalState();
        }
    });

    //* 3. Confirmar Upload (Botão "Confirmar Corte")
    if (modalConfirmButton) {
        modalConfirmButton.addEventListener('click', async () => {
            if (!cropper || !selectedFile) return;

            //* Desabilita o botão para evitar cliques múltiplos
            modalConfirmButton.disabled = true;
            modalConfirmButton.textContent = 'Enviando...';

            //* Obter o canvas recortado do Cropper.js
            const canvas = cropper.getCroppedCanvas({
                width: 256, //! Define o tamanho da imagem final
                height: 256,
                imageSmoothingQuality: 'high',
            });

            //* Converter o canvas para Blob (arquivo)
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert('Erro ao processar a imagem cortada.');
                    resetModalState(); //* Reabilita botão e limpa estado
                    return;
                }

                //* Criar FormData para enviar o Blob
                const formData = new FormData();
                //! Adiciona o Blob como um arquivo, dando um nome
                //* Usa o nome original, mas forçamos uma extensão jpg, jpeg, jpeg ...
                const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
                const fileName = `avatar.${fileExtension === 'png' ? 'png' : 'jpeg'}`; 
                formData.append('avatar', blob, fileName); //* 'avatar' é o nome do campo esperado pelo Multer

                try {
                    //! Envia o FormData usando fetch (NÃO authFetch, pois Content-Type é diferente)
                    const response = await fetch(API_BASE_URL + '/api/users/avatar', {
                        method: 'POST',
                        headers: {
                            //! NÃO defir 'Content-Type': 'multipart/form-data', o browser faz isso automaticamente com FormData
                            'Authorization': `Bearer ${auth.getToken()}`
                        },
                        body: formData
                    });

                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.message || 'Erro ao enviar imagem.');
                    }

                    const result = await response.json();
                    
                    localStorage.setItem('current_user', JSON.stringify(result.user));
                    alert('Avatar atualizado com sucesso!');
                    closeModal();
                    window.location.reload();

                } catch (error) {
                    console.error(error);
                    alert(`Erro ao atualizar avatar: ${error.message}`);
                    resetModalState(); //* Reabilita botão e limpa estado
                }

            }, selectedFile.type); //* Mantém o tipo de imagem original

        });
    }

    //* Funções para fechar o modal e limpar o estado
    const resetModalState = () => {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        avatarUploadInput.value = null;
        selectedFile = null;
        imageToCrop.src = '#';
        imageToCrop.classList.add('hidden');
        cropPlaceholderText.classList.remove('hidden');
        
        //* Reabilita o botão de confirmação
        modalConfirmButton.disabled = false;
        modalConfirmButton.textContent = 'Confirmar Corte';
    }
    
    const closeModal = () => {
        cropModal.classList.add('hidden');
        resetModalState();
    };

    if (modalCloseButton) modalCloseButton.addEventListener('click', closeModal);
    if (modalCancelButton) modalCancelButton.addEventListener('click', closeModal);
    if (cropModal) {
        cropModal.addEventListener('click', (event) => {
            //* Fecha se clicar no fundo cinza
            if (event.target === cropModal) closeModal();
        });
    }
});