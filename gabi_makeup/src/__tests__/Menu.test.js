import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from '../componentes/Menu';
import * as auth from '../contexto/useAuth';

// Mock do hook useAuth
jest.mock('../contexto/useAuth', () => ({
  useAuth: jest.fn(),
}));

test('Menu renderizado sem erros', () => {
  // Definindo o retorno mockado para useAuth
  auth.useAuth.mockImplementation(() => ({ userLoggedIn: true, userIsAdmin: false }));

  render(
    <Router>
      <Menu />
    </Router>
  );
});
