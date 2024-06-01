import React from 'react';
import { useForm } from 'react-hook-form';
import { schemaNovoCurso } from './InscricaoFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import '../InscricaoForm.css';
import axiosInstance from '../axios-instance.js';

const useNovoCursoFormulario = (handleClose, cursoSelecionado) => {
    const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm({
        resolver: zodResolver(schemaNovoCurso), // Use o resolver Zod para validação
    });

    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    // Verifica se há um curso selecionado para edição
    React.useEffect(() => {
        if (cursoSelecionado) {
            // Define os valores dos campos com os dados do curso selecionado
            setValue('ativo', cursoSelecionado.cur_ativo);
            setValue('titulo', cursoSelecionado.cur_titulo);
            setValue('descricao', cursoSelecionado.cur_descricao);
            setValue('cargaHoraria', cursoSelecionado.cur_carga_horaria.toString()); // Converta para string
            setValue('valor', cursoSelecionado.cur_valor);
            setValue('dtInicialCurso', cursoSelecionado.cur_data_inicio);
            setValue('dtFinalCurso', cursoSelecionado.cur_data_fim);
        }
    }, [cursoSelecionado]);

    const onSubmitForm = async (data) => {
        try {
            // Ajuste os dados para corresponder ao formato esperado pela API
            const adjustedData = {
                cur_ativo: data.ativo, // Supondo que 'ativo' corresponde a 'cur_ativo'
                cur_titulo: data.titulo,
                cur_descricao: data.descricao,
                cur_carga_horaria: parseInt(data.cargaHoraria), // Converta para um número
                cur_valor: data.valor,
                cur_data_inicio: data.dtInicialCurso,
                cur_data_fim: data.dtFinalCurso,
                cur_data_exclusao: null // Se necessário, ajuste o valor para 'cur_data_exclusao'
            };
            //fazer a requisição post ou put, dependendo do caso
            if (cursoSelecionado) {
                // Se um curso selecionado existir, atualize-o (requisição PUT)
                await axiosInstance.put(`cursos/${cursoSelecionado.cur_id}/`, adjustedData);
            } else {
                // Caso contrário, crie um novo curso (requisição POST)
                await axiosInstance.post('cursos/', adjustedData);
            }

            // Defina a mensagem de sucesso
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setErrorMessage(null);
                handleClose();
                reset();
            }, 2000);

        } catch (error) {
            console.log(error);
            console.log(errorMessage);
            // Em caso de erro, exiba a mensagem de erro
            setErrorMessage(`Erro ao criar o curso. Por favor, tente novamente.<br /><br />Detalhes do erro:<br />${error.message}`);
        }
    }

    const onSubmit = async (data) => {
        const validationResult = schemaNovoCurso.safeParse(data);
        if (validationResult.success) {
            onSubmitForm(data);
        } else {
            // Dados inválidos, exibir erros
            console.error('Erro de validação:', validationResult.error.errors);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        control,
        reset,
        showSuccessMessage,
        setShowSuccessMessage,
        onSubmit,
        setErrorMessage,
        errorMessage
    }
};

export default useNovoCursoFormulario;
