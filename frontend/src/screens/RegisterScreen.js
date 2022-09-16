import {useState, useEffect} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {register} from '../features/users/userSlice'
import FormContainer from '../components/FormContainer';

const RegisterScreen = () =>{

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
  const {userInfo, error, loading} = useSelector((state) => state.users)

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  //for redirection
  const navigate = useNavigate()


  useEffect(() =>{
    if(userInfo){
      //redirect
      navigate(redirect)
    }
  },[userInfo, navigate, redirect])

  const submitHandler = (e) =>{
    e.preventDefault()
    if(password !== confirmPassword){
      setMessage('passwords do not match')
    }else{
      // call redux thunk
      dispatch(register({
        name,
        email,
        password
      }))
    }

  }

  return (
      <FormContainer>
        <h1>Sign Up</h1>
        {message && <Message>{message}</Message>}
        {error && <Message variant='danger'>Invalid credentials</Message>}
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
            Register
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Have an Account?
            <Link to={redirect ? `/login?redirect=${redirect}` : `/register`}>Login</Link>
          </Col>
        </Row>
      </FormContainer>
  )

}


export default RegisterScreen
