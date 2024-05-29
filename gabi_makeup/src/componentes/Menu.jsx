
import React, { useEffect, useState } from 'react';
import {Navbar, Nav, Button, } from 'react-bootstrap'; //Button
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Menu.css'; // Importe o arquivo CSS para aplicar os estilos
import { SocialIcon } from 'react-social-icons';
import { useAuth } from '../contexto/useAuth';
/**
 * Componente funcional que representa a página de Menu.
 * @return {JSX.Element} O componente JSX da página de Menu.
 */
function Menu() {

  const { userLoggedIn, userIsAdmin } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);//showAdminPanel

  useEffect(() => {
    setShowAdminPanel(userLoggedIn && userIsAdmin);
  }, [userLoggedIn, userIsAdmin]);

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/gabrielasilvanno/', '_blank');
  };

  const handleWhatsappClick = () => {
    window.open ('https://api.whatsapp.com/send?phone=3192619618', '_blank');
  };

  const handleTiktokClick = () => {
    window.open ('https://www.tiktok.com/@gabrielasilvanno', '_blank');
  };
  return (
    <Navbar expand="lg" bg="light" className="custom-navbar">
      <Navbar.Brand href="#">Gabi Makeup</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home" className="menu-link">Início</Nav.Link>
          <Nav.Link as={Link} to="/sobre" className="menu-link">Sobre Mim</Nav.Link>
          <Nav.Link as={Link} to="/galeria" className="menu-link">Galeria</Nav.Link>
          <Nav.Link as={Link} to="/cursos" className="menu-link">Catálogo de Cursos</Nav.Link>
          <Nav.Link as={Link} to="/tutoriais" className="menu-link">Tutoriais</Nav.Link>
          {showAdminPanel && (
            <Nav.Link as={Link} to="/painel" className="menu-link">Painel de Administração</Nav.Link>
          )}
        </Nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          {userLoggedIn ? (
            <span className="logged-in-message">Bem-vindo de volta!</span>
          ) : (
            <Link to="/login">
              <Button variant='light' className="botao-entrar">Entrar</Button>
            </Link>
          )}
          <Nav>
            <Nav.Link>
              <SocialIcon network="instagram" onClick={handleInstagramClick} style={{ height: 35, width: 35 }} />
            </Nav.Link>
            <Nav.Link>
              <SocialIcon network="whatsapp" onClick={handleWhatsappClick} style={{ height: 35, width: 35 }} />
            </Nav.Link>
            <Nav.Link>
              <SocialIcon network="tiktok" onClick={handleTiktokClick} style={{ height: 35, width: 35 }} />
            </Nav.Link>
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Menu;
