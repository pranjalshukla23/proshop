import {useState, useEffect} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {login} from '../features/users/userSlice'
import FormContainer from '../components/FormContainer';

const LoginScreen = () =>{

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //for getting query string defined in url
  const [searchParams, setSearchParams] = useSearchParams()

  //get query string with name qty
  const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/'


  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo, error, loading} = useSelector((state) => state.users)

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  //for redirection
  const navigate = useNavigate()


  useEffect(() =>{
    if(userInfo && userInfo.name){
      //redirect
      navigate('/')
    }else{
      navigate('/login')
    }
  },[userInfo, navigate, redirect])

  const submitHandler = (e) =>{
    e.preventDefault()
    //call redux thunk
     dispatch(login({
       email,
       password
     }))
  }

  return (
      <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant='danger'>Invalid credentials</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
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

          <Button type='submit' variant='primary'>
            Sign In
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            New Customer?
            <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>Register</Link>
          </Col>
        </Row>
      </FormContainer>
  )

}


export default LoginScreen
