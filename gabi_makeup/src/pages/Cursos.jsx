import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios-instance.js';
import { format } from 'date-fns'; 
import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import "../Cursos.css";
import maquiagemIcon from "../img/curso1.jpg"; 
import InscricaoForm from "./InscricaoForm.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAuth } from '../contexto/useAuth.jsx'; // Importe useAuth

function Cursos() {
  const { userLoggedIn } = useAuth(); // Use o hook useAuth para obter informações de autenticação do usuário

  const [cursosData, setCursosData] = useState([]);
  const [inscricaoOpen, setInscricaoOpen] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const response = await axiosInstance.get('cursos/');
        const cursosFormatted = response.data
          .filter(curso => curso.cur_ativo)
          .map(curso => ({
            ...curso,
            cur_data_inicio: format(new Date(curso.cur_data_inicio), 'dd/MM/yyyy'),
            cur_data_fim: format(new Date(curso.cur_data_fim), 'dd/MM/yyyy'),
          }));
        setCursosData(cursosFormatted);
      } catch (error) {
        console.error('Erro ao buscar os cursos:', error);
      } finally {
        setLoading(false); 
      }
    }

    fetchCursos();
  }, []);

  const handleInscricaoOpen = (curso) => {
    setCursoSelecionado(curso);
    setInscricaoOpen(true);
  };

  const handleInscricaoClose = () => {
    setInscricaoOpen(false);
  };

  return (
    <div className="cursos-container">       
      <h1>Cursos Disponíveis</h1>

      {userLoggedIn ? ( // Verifique se o usuário está logado
        <>
          {loading && (
            <>
              <div className="emoji">🤚</div>
              <div>Carregando...</div>
              <div className="loading-indicator">
                  <CircularProgress />
              </div>
            </>
          )}

          {!loading && (
            <ul className="cursos-list">
              {cursosData.map((curso) => (
                <li key={curso.cur_id} className="curso-item">
                  <div className="curso-header">             
                    <img
                      src={maquiagemIcon}
                      alt="Ícone de Maquiagem"
                      className="maquiagem-icon"
                    />             
                  </div>
                  <div className="curso-content">
                    <h3>{curso.cur_titulo}</h3>
                    <p>{curso.cur_descricao}</p>               
                    <p>
                      <strong>Data do Curso:</strong> {curso.cur_data_inicio} até{" "}
                      {curso.cur_data_fim}
                    </p>
                    <p>
                      <strong>Carga Horária:</strong> {curso.cur_carga_horaria} hs
                    </p>
                    <p>
                      <strong>Valor do investimento:</strong> R${curso.cur_valor}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => handleInscricaoOpen(curso)}
                    variant="contained"
                    color="secondary"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Inscreva-se agora
                  </Button>

                </li>
              ))}
              
              <InscricaoForm
                open={inscricaoOpen}
                handleClose={handleInscricaoClose}
                curso={cursoSelecionado}
              />
            </ul>
          )}
        </>
      ) : (
        <p>Por favor, faça login para ver nossos cursos.</p> // Mostrar mensagem se o usuário não estiver logado
      )}
    </div>
  );
}

export default Cursos;
