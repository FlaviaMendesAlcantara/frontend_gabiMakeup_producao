// TabelaCursos.jsx
import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal';
import NovoCursoFormulario from './NovoCursoFormulario';
import { format } from 'date-fns'; 

function TabelaCursos({ cursos, onSave }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const handleAbrirModal = (curso) => {
    setCursoSelecionado(curso);
    setModalAberto(true);
  };

  if(handleAbrirModal){
    
  }

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID do Curso</th>
            <th>Permitir Inscrição</th>
            <th>Título do Curso</th>
            <th>Descrição do Curso</th>
            <th>Carga Horária do Curso</th>
            <th>Valor do Curso</th>
            <th>Data de Início do Curso</th>
            <th>Data de Fim do Curso</th>
            {/* Outros cabeçalhos da tabela conforme necessário */}
            {/* <th>Ações</th> */}
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.cur_id}>
              <td>{curso.cur_id}</td>
              <td>{curso.cur_ativo ? 'Sim' : 'Não'}</td>
              <td>{curso.cur_titulo}</td>
              <td>{curso.cur_descricao}</td>
              <td>{curso.cur_carga_horaria}</td>
              <td>{curso.cur_valor}</td>
              <td>{format(new Date(curso.cur_data_inicio), 'dd/MM/yyyy')}</td>
              <td>{format(new Date(curso.cur_data_fim), 'dd/MM/yyyy')}</td>
              {/* Outras células da tabela conforme necessário */}
              {/* <td>
                <Button onClick={() => handleAbrirModal(curso)} variant="contained" color="primary">
                  Editar
                </Button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={modalAberto} onHide={handleFecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Renderize o formulário de NovoCursoFormulario */}
          {cursoSelecionado && (
            <NovoCursoFormulario
              initialValues={cursoSelecionado} // Passe os dados do curso selecionado para o componente
              handleClose={handleFecharModal}
              onSave={onSave}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TabelaCursos;
