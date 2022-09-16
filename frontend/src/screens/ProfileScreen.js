import {useState, useEffect} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Form, Button, Row, Col, Table} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getUserDetails,updateUserProfile} from '../features/users/userSlice'
import {getMyOrders} from '../features/order/orderSlice'

const ProfileScreen = () =>{

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  //for getting query string defined in url
  const [searchParams, setSearchParams] = useSearchParams()

  //get query string with name qty
  const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/'


  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo, user, error, loading, success} = useSelector((state) => state.users)

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {orders, loading: loadingOrders, error: errorOrders} = useSelector((state) => state.order)

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  //for redirection
  const navigate = useNavigate()


  useEffect(() =>{
    if(!userInfo){
      //redirect
      navigate(`/login`)
    }else{
      if(!user.name || !user || success){


        //call redux thunk
        dispatch(getUserDetails('profile'))
        //call redux thunk
        dispatch(getMyOrders())
      }else{
        setName(user.name)
        setEmail(user.email)
      }
    }
  },[dispatch, navigate, user, success])

  const submitHandler = (e) =>{
    e.preventDefault()
    if(password !== confirmPassword){
      setMessage('passwords do not match')
    }else{
      //call redux thunk
      dispatch(updateUserProfile({
        id: user._id,
        name,
        email,
        password
      }))
    }

  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='text' placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type='text' placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type='password' placeholder="Enter confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
            </Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> :
            (
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {orders.map(order => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(0,10)}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.isPaid ? order.paidAt.substring(0,10) : (
                            <i className="fas fa-times" style={{color:'red'}}></i>
                        )}</td>
                        <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : (
                            <i className="fas fa-times" style={{color:'red'}}></i>
                        )}</td>
                        <td>
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button className="btn-sm" variant="light">Details</Button>
                          </LinkContainer>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
            )
        }
      </Col>
    </Row>
  )

}


export default ProfileScreen
