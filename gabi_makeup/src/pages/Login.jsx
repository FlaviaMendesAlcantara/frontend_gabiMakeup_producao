import React, { useState } from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ModalCadastrese from './ModalCadastrese';
import axiosInstance from '../axios-instance.js';
//import bcrypt from 'bcryptjs';
import { useAuth } from '../contexto/useAuth';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// import FacebookLogin from 'react-facebook-login';
// import { blue } from '@material-ui/core/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffcccc',
    },
    secondary: {
      main: '#757171',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(#fff,#75717185)',
    
  },
  box: {
    padding: theme.spacing(3),
    boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.2)',
    borderRadius: '8px',
    textAlign: 'center',
    backgroundImage: 'linear-gradient( 30deg, #fff , #ffcccc )', 
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
      width: '250px',
    },
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing(2),
  },
  googleButton: {
    marginTop: theme.spacing(2),
  },

}));

function Login() {
  const history = useHistory();
  const [cadastreseOpen, setCadastreseOpen] = useState(false);
  const { setUserLoggedIn, setUserIsAdmin } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const classes = useStyles();

  const handleSignup = () => {
    setCadastreseOpen(true);
  };

  const handleCloseSignup = () => {
    setCadastreseOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);

    const data = {
      usu_usuario: formData.get('Usuário'),
      password: formData.get('Senha'),
    };
    
    try {
      const response = await axiosInstance.post('usuarios/authenticate/', data);
      console.log('Resposta do servidor:', response.data); 

      setUserLoggedIn(true);
      setIsLoggedIn(true);
      if (response.data.perfil_usuario.per_nome === 'Administrador') {
        setUserIsAdmin(true);
      }
      history.push('/home');

    } catch (error) {
      console.error('Erro ao autenticar:', error);
      setUserLoggedIn(false);
      setUserIsAdmin(false);
      // Lógica para lidar com erros de autenticação
      setErrorMessage('Usuário ou senha incorretos. Por favor, tente novamente.');
    }
  };  

  const responseMessage = (response) => {
    console.log(response);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>
        <Box className={classes.box}>
          <form className={classes.form} onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField id="standard-basic" label="Usuário" name="Usuário"/>
            <TextField id="standard-basic" label="Senha" type="password" name="Senha"/>
            <Box className={classes.buttonGroup}>
              <Button type="submit" variant="contained" color="primary">
                Entrar
              </Button>
              <Button variant="contained" color="secondary">
                Cancelar
              </Button>
            </Box>
            
            <Box className={classes.googleButton}>              
              <GoogleLogin
                onSuccess={credentialResponse => {
                  const decoded = jwtDecode(credentialResponse?.credential);
                  setUserLoggedIn(true);
                  setIsLoggedIn(true);
                  console.log(isLoggedIn)
                  history.push('/home');
                  console.log(decoded);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />;
            </Box>

            <Box>
              <Button variant="contained" color="primary" onClick={handleSignup}>
                Cadastre-se
              </Button>
            </Box>

            {/* Renderizar mensagem de erro */}
            {errorMessage && (
              <Box mt={4} color="red">
                {errorMessage}
              </Box>
            )}
          </form>
        </Box>
      </Box>
      <ModalCadastrese open={cadastreseOpen} onClose={handleCloseSignup} />
    </ThemeProvider>
  );
}

export default Login;