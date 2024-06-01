import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios-instance.js';
import { format } from 'date-fns';
import { useTable, useFilters } from 'react-table';
import './TabelaInscricoes.css'

function TabelaInscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    async function fetchInscricoes() {
      try {
        const response = await axiosInstance.get('inscricoes/');
        setInscricoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar inscrições:', error);
      }
    }

    fetchInscricoes();
  }, []);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const response = await axiosInstance.get('cursos/');
        setCursos(response.data);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
      }
    }

    fetchCursos();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: 'Curso inscrito', accessor: 'cursoTitulo' },
      { Header: 'Nome Completo', accessor: 'ins_nome_completo' },
      { Header: 'Data de Nascimento', accessor: 'ins_data_nascimento' },
      { Header: 'Número de Telefone', accessor: 'ins_numero_telefone' },
      { Header: 'Tipo de Pagamento', accessor: 'ins_tipo_pagamento' },
      { Header: 'Modalidade do Curso', accessor: 'ins_modalidade_curso' },
      { Header: 'Tipo de Pele', accessor: 'ins_tipo_pele' },
      { Header: 'Tem Alergia?', accessor: 'ins_alergia' },
      { Header: 'Quais Alergias?', accessor: 'ins_tipo_alergia' },
      { Header: 'Data da inscrição', accessor: 'ins_data_inscricao' },
    ],
    []
  );

  const data = React.useMemo(() => {
    return inscricoes.map((inscricao, index) => ({
      ...inscricao,
      cursoTitulo: cursos[index]?.cur_titulo || '',
      ins_data_nascimento: format(new Date(inscricao.ins_data_nascimento), 'dd/MM/yyyy'),
      ins_data_inscricao: format(new Date(inscricao.ins_data_inscricao), 'dd/MM/yyyy'),
      ins_alergia: inscricao.ins_alergia ? 'Sim' : 'Não',
    }));
  }, [inscricoes, cursos]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable({ columns, data }, useFilters);

  const handleCursoChange = (e) => {
    const cursoSelecionado = e.target.value;
    setCursoSelecionado(cursoSelecionado);
    setFilter('cursoTitulo', cursoSelecionado);
  };

  const handleStatusChange = (e) => {
    const filtroStatus = e.target.value;
    setFiltroStatus(filtroStatus);
    setCursoSelecionado('');
    setFilter('cursoTitulo', '');
  };

  const filteredCursos = cursos.filter((curso) => {
    if (filtroStatus === 'true') {
      return curso.cur_ativo === true;
    } else if (filtroStatus === 'false') {
      return curso.cur_ativo === false;
    }
    return curso.cur_ativo;
  });

  return (
    <div>
      <div style={{ display: 'flex' }}>
      <div>
          <label htmlFor="status">Filtrar por Status: </label>
          <select id="status" value={filtroStatus} onChange={handleStatusChange}>
            <option value="todos">Todos</option>
            <option value="true">Inscrições Abertas</option>
            <option value="false">Inscriçoes encerradas</option>
          </select>
        </div>

        <div>
          <label htmlFor="curso">Filtrar por Curso: </label>
          <select id="curso" value={cursoSelecionado} onChange={handleCursoChange}>
            <option value="">Todos</option>
            {filteredCursos.map((curso) => (
              <option key={curso.id} value={curso.cur_titulo}>
                {curso.cur_titulo}
              </option>
            ))}
          </select>
        </div>
        
      </div>

      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaInscricoes;