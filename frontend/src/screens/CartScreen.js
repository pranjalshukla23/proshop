import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
//import redux actions and thunks
import {addCartItem, removeItem} from '../features/cart/cartSlice';
import Message from '../components/Message'
import {Link, useParams, useSearchParams, useNavigate} from 'react-router-dom';
import {Row, Col, ListGroup, Image, Form, Button, Card} from 'react-bootstrap'
import product from '../components/Product';


const CartScreen = () =>{

  //get query parameters
  const {id} = useParams()

  //for redirection
  const navigate = useNavigate()

  //for getting query string defined in url
  const [searchParams, setSearchParams] = useSearchParams()

  //get query string with name qty
  const qty = Number(searchParams.get('qty'))

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {cartItems, error, loading} = useSelector((state) => state.cart)


  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo} = useSelector((state) => state.users)



  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  useEffect(() => {
    if(id){
      //call redux thunk
      dispatch(addCartItem({
        id,
        qty
      }))
    }
  },[dispatch, id, qty])

  const onChangeHandler = (id,qty) =>{

    //call redux thunk
    dispatch(addCartItem({id,qty}))
  }

  const removeFromCartHandler = (id) =>{
    //call redux action
    dispatch(removeItem(id))
  }

  const checkoutHandler = () => {

    if(userInfo){
      //redirect
      navigate('/shipping')
    }else{
      //redirect
      navigate('/login?redirect=shipping')
    }

  }


  return (
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? <Message>Your cart is empty <Link to='/'>Go Back </Link></Message> :
              (
                  <ListGroup variant="flush">
                    {cartItems.map((item) => (
                        <ListGroup.Item key={item.product}>
                          <Row>
                            <Col md={2}>
                              <Image src={item.image} alt={item.name} fluid rounded />
                            </Col>
                            <Col md={3}>
                              <Link to={`/product/${item.product}`}>{item.name}</Link>
                            </Col>
                            <Col md={2}>${item.price}</Col>
                            <Col md={2}>
                              <Form.Control as="select" value={item.qty}
                                            onChange={(e) => onChangeHandler(item.product,Number(e.target.value))}>
                                {[
                                  ...Array(item.countInStock).
                                      keys()].map(x => (
                                    <option key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </option>
                                ))}
                              </Form.Control>
                            </Col>
                            <Col md={2}>
                              <Button type="button" variant='light' onClick={() => removeFromCartHandler(item.product)}>
                                <i className="fas fa-trash"></i>
                              </Button>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                    ))}
                  </ListGroup>
              )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
  )
}

export default CartScreen
