import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../axios-instance.js';
import { zodResolver } from '@hookform/resolvers/zod';
import '../InscricaoForm.css';
import { schema } from './InscricaoFormSchema';

const useInscricaoForm = (handleClose,curso) => { // Adicionei handleClose como parâmetro

    const { handleSubmit, register, setValue, control, formState: { errors }, watch, reset } = useForm({
        resolver: zodResolver(schema),
        shouldFocusError: false,
    });
    const [openAlert, setOpenAlert] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    
    const watchTemAlergia = watch("temAlergia");

    const onSubmit = async (data) => {
        const watchTemAlergia = watch("temAlergia");
        const validationResult = schema.safeParse(data);
        if (validationResult.success) {
            // Validar se tem alergia apenas se a opção "sim" foi selecionada
            if (watchTemAlergia === "sim" && !data.alergia) {
                console.error('Erro de validação: Informe quais tipos de alergia você tem.');
                return;
            }

            // Dados válidos, prosseguir com o envio
            console.log('Dados do formulário:', data);
            try {
                const response = await axiosInstance.post('inscricoes/', {
                    ins_nome_completo: data.nome,
                    ins_data_nascimento: data.dataNascimento,
                    ins_numero_telefone: data.telefone,
                    ins_tipo_pagamento: data.tipoPagamento,
                    ins_modalidade_curso: data.modalidadeCurso,
                    ins_tipo_pele: data.tipoPele,
                    ins_alergia: data.temAlergia === 'sim',
                    ins_tipo_alergia: data.temAlergia === 'sim' ? data.alergia : null,
                    ins_codigo_curso: curso.cur_id // Substitua 0 pelo código do curso selecionado
                });
                console.log('Resposta da API:', response.data);
                setOpenAlert(true); // Abre o alerta
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    setErrorMessage(null);
                    handleClose();
                    reset();
                }, 2000);

            } catch (error) {
                console.error('Erro ao enviar inscrição:', error);
                setErrorMessage(`Erro ao criar o curso. Por favor, tente novamente.<br /><br />Detalhes do erro:<br />${error.message}`);
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
        control,
        errors,
        onSubmit,
        watchTemAlergia,
        openAlert,
        showSuccessMessage,
        setShowSuccessMessage,
        setErrorMessage ,
        errorMessage,
    };
};

export default useInscricaoForm;
