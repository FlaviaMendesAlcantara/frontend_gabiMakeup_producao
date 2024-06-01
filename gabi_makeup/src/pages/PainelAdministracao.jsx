import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import "../PainelAdministracao.css";
import NovoCursoFormulario from './NovoCursoFormulario.jsx';
import { Modal } from 'react-bootstrap';
import TabelaInscricoes from './TabelaInscricoes'; 
import TabelaCursos from './TabelaCursos'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axios-instance.js';

function PainelAdminstracao() {
  const [modalAberto, setModalAberto] = useState(false);
  const [mostrarTabelaInscricoes, setMostrarTabelaInscricoes] = useState(false);
  const [mostrarTabelaCursos, setMostrarTabelaCursos] = useState(false);
  const [cursos, setCursos] = useState([]);

    // Função para buscar os cursos
    useEffect(() => {
      async function fetchCursos() {
        try {
          const response = await axiosInstance.get('/cursos/');
          setCursos(response.data);
        } catch (error) {
          console.error('Erro ao buscar cursos:', error);
        }
      }
  
      fetchCursos();
    }, []);

  const handleNovoCurso = () => {
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
  };

  const handleMostrarTabelaInscricoes = () => {
    setMostrarTabelaInscricoes(true);
    setMostrarTabelaCursos(false);
  };

  const handleMostrarTabelaCursos = () => {
    setMostrarTabelaCursos(true);
    setMostrarTabelaInscricoes(false);
  };

  return (
    <div className="painel-container">
      <h1>Painel de Administração</h1>
      <div className="button-container">
        <div>
          <Button onClick={handleNovoCurso} variant="contained" color="primary">
            Criar Novo Curso
          </Button>
          <Button onClick={handleMostrarTabelaInscricoes} variant="contained" color="primary">
            Lista de Inscrições
          </Button>
          <Button onClick={handleMostrarTabelaCursos} variant="contained" color="primary">
            Lista de Cursos
          </Button>
        </div>
      </div>
      {mostrarTabelaInscricoes && !mostrarTabelaCursos && ( 
        <TabelaInscricoes /> 
      )}
      {mostrarTabelaCursos && !mostrarTabelaInscricoes && (
  <TabelaCursos cursos={cursos} /> 
)}


      {/* Modal para criar novo curso */}
      <Modal show={modalAberto} onHide={handleFecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Novo Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NovoCursoFormulario handleClose={handleFecharModal} />
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default PainelAdminstracao;
