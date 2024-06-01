import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../axios-instance.js';
import { zodResolver } from '@hookform/resolvers/zod';
import '../InscricaoForm.css';
import { schemaCadastroUsuario } from './InscricaoFormSchema';

const useModalCadastrese = () => {

    const { handleSubmit, register, setValue, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schemaCadastroUsuario),
        shouldFocusError: false,
    });

    const [openAlert, setOpenAlert] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const onSubmit = async (data) => {
        console.log('Dados do formulário:', data);
        const validationResult = schemaCadastroUsuario.safeParse(data);
        if (validationResult.success) {
    
            // Dados válidos, prosseguir com o envio
            console.log('Dados do formulário:', data);
            try {
                // Buscar o perfil de usuário com o nome "usuário padrão"
                const perfisResponse = await axiosInstance.get('perfis/');
                const usuarioPadraoPerfil = perfisResponse.data.find(perfil => perfil.per_nome === 'usuário padrão');
                
                if (!usuarioPadraoPerfil) {
                    console.error('Perfil de usuário "usuário padrão" não encontrado.');
                    return;
                }
                console.log(usuarioPadraoPerfil.per_id);
                const response = await axiosInstance.post('usuarios/', {
                    usu_usuario: data.usuario,
                    usu_nome_completo: data.nomeCompleto,
                    password: data.senha,
                    usu_perfil: usuarioPadraoPerfil.per_id,  // Usar o per_id do perfil de usuário "usuário padrão"
                    usu_ativo: true,
                    usu_data_criacao: new Date().toISOString(),
                    usu_data_alteracao: new Date().toISOString(),
                    usu_data_exclusao: new Date().toISOString(),
                });
                console.log(response);
                setOpenAlert(true);
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    setErrorMessage(null);
                    reset();
                }, 2000);
    
            } catch (error) {
                // Se ocorrer um erro na requisição, vamos acessar a mensagem de erro da API
                if (error.response && error.response.data && error.response.data.error) {
                    const errorMessage = error.response.data.error;
                    setErrorMessage('Erro ao criar usuário: '+ errorMessage);
                    console.error('Erro ao criar usuário: ', errorMessage);
                } else {
                    // Caso contrário, trata-se de um erro inesperado e você pode lidar com ele aqui
                    console.error('Erro inesperado ao criar usuário:', error);
                    setErrorMessage(`</br> Erro ao criar usuário. <br /><br />Detalhes do erro:<br />${error.message}`);
                }
               // console.error('Erro ao criar usuário:', error);
              //  setErrorMessage(`</br> Erro ao criar usuário. <br /><br />Detalhes do erro:<br />${error.message}`);
            }
        } else {
            // Dados inválidos, exibir erros
            console.error('Erro de validação:', validationResult.error.errors);
        }
    };    

    // Retorna um objeto com todos os valores que você deseja exportar
    return {
        handleSubmit,
        register,
        setValue,
        errors,
        onSubmit,
        openAlert,
        showSuccessMessage,
        setShowSuccessMessage,
        setErrorMessage ,
        errorMessage,
    };
};

export default useModalCadastrese; 