import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import {logout} from '../features/users/userSlice';
import {reset} from '../features/order/orderSlice';
import {useEffect} from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import SearchBox from './SearchBox';


const Header = () =>{

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo, error, loading} = useSelector((state) => state.users)

  const navigate = useNavigate()


  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  console.log(userInfo)

  const logoutHandler = () =>{
    console.log('logout')

    //call redux action
    dispatch(logout())
    //call redux action
    dispatch(reset())

    //redirect
    navigate('/login')
  }

  return (
      <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>ProShop</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <SearchBox/>

                <LinkContainer to='/cart/:id'>
                  <Nav.Link href="/cart/:id"><i className="fa fa-shopping-cart"></i>Cart</Nav.Link>
                </LinkContainer>

                {userInfo && userInfo.name ? (
                    <NavDropdown title={userInfo.name} id='username'>
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>
                          Profile
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                ) :
                    (
                    <LinkContainer to='/login'>
                      <Nav.Link href="/login"><i className="fa fa-user"></i>Sign In</Nav.Link>
                    </LinkContainer>
                    )}
                {userInfo && userInfo.isAdmin && (
                    <NavDropdown title='Admin' id='adminmenu'>
                      <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>
                          Users
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>
                          Products
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>
                          Orders
                        </NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
  )
}

export default Header
