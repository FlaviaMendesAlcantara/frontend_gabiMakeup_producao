import React, {  useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-bootstrap';
import '../InscricaoForm.css';
import useNovoCursoFormulario from './useNovoCursoFormulario';

const NovoCursoFormulario = ({ handleClose, cursoSelecionado }) => {
    const { handleSubmit, register, control, errors, showSuccessMessage, setShowSuccessMessage, onSubmit, setErrorMessage, errorMessage } = useNovoCursoFormulario(handleClose);
    
    const { setValue } = useForm();

    useEffect(() => {
        if (cursoSelecionado) {
            // Preencha os campos do formulário com os valores do curso selecionado
            setValue('ativo', cursoSelecionado.ativo);
            setValue('titulo', cursoSelecionado.titulo);
            setValue('descricao', cursoSelecionado.descricao);
            setValue('cargaHoraria', cursoSelecionado.cargaHoraria);
            setValue('valor', cursoSelecionado.valor);
            setValue('dtInicialCurso', cursoSelecionado.dtInicialCurso);
            setValue('dtFinalCurso', cursoSelecionado.dtFinalCurso);
        }
    }, [cursoSelecionado,setValue]);

    return (
        <div className="modal-content">
            <div className="modal-header justify-content-center">
                <h5 className="modal-title">{cursoSelecionado ? 'Editar Curso' : 'Novo Curso'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label htmlFor="ativo" className='titulo'>
                                Abrir inscrição?
                            </label>
                            <input type="checkbox" id="ativo" className="form-check-input" {...register("ativo")} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label htmlFor="titulo" className='titulo'>
                                Título do Curso:
                                <span className='vermelho'>*</span>
                            </label>
                            <input type="text" id="titulo" className="form-control" {...register("titulo", { required: true })} />
                            {errors.titulo && <span className="error-message text-danger">Campo obrigatório</span>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label htmlFor='descricao' className='titulo'>
                                Descrição do Curso:
                                <span className='vermelho'>*</span>
                            </label>
                            <textarea id="descricao" className="form-control" {...register("descricao", { required: true })}></textarea>
                            {errors.descricao && <span className="error-message text-danger">Campo obrigatório</span>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor='cargaHoraria' className='titulo'>
                                Carga Horária (em horas):
                                <span className='vermelho'>*</span>
                            </label>
                            <input type="text" id="cargaHoraria" className="form-control" {...register("cargaHoraria", { required: true })} />
                            {errors.cargaHoraria && <span className="error-message text-danger">Campo obrigatório</span>}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor='valor' className='titulo'>
                                Valor:
                                <span className='vermelho'>*</span>
                            </label>
                            <input type="text" id="valor" className="form-control" {...register("valor", { required: true })} />
                            {errors.valor && <span className="error-message text-danger">Campo obrigatório</span>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Controller
                                name="dtInicialCurso"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor="dtInicialCurso" className="form-label titulo">
                                            Data Inicial do Curso:
                                            <span className='vermelho'>*</span>
                                        </label>
                                        <input {...field} type="date" className="form-control" />
                                    </div>
                                )}
                            />
                        </div>
                        <div className="col-md-6">
                            <Controller
                                name="dtFinalCurso"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor="dtFinalCurso" className="form-label titulo">
                                            Data Final do Curso:
                                            <span className='vermelho'>*</span>
                                        </label>
                                        <input {...field} type="date" className="form-control" />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-12 d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">{cursoSelecionado ? 'Salvar Edições' : 'Criar Curso'}</button>
                        </div>
                    </div>
                </form>
                {showSuccessMessage && (
                    <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
                        {cursoSelecionado ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!'}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                        <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default NovoCursoFormulario;
