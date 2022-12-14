import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {createOrder} from '../features/order/orderSlice'
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';


const PlaceOrderScreen = () =>{

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {cartItems, shippingAddress, paymentMethod} = useSelector((state) => state.cart);

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {order, loading, error, success} = useSelector((state) => state.order);

  const navigate = useNavigate()

  useEffect(() => {
    if(success){
      //redirect
      navigate(`/order/${order._id}`)
    }
  },[navigate, success])

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch();

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  //calculate prices
  const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100)
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)))
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)


  const placeOrderHandler = () =>{

    //call redux thunk
    dispatch(createOrder({
      orderItems: cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    }))
  }

  return (
      <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Address: </strong>
                  {shippingAddress.address},{shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment method</h2>
                <strong>Method: </strong>
                {paymentMethod}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {cartItems.length === 0 ? <Message>Your cart is empty</Message> : (
                    <ListGroup variant="flush">
                      {cartItems.map((item, index) => (
                          <ListGroup.Item key={index}>
                            <Row>
                              <Col md={1}>
                                <Image src={item.image} alt={item.name} fluid rounded />
                              </Col>
                              <Col>
                                <Link to={`/product/${item.product}`}>
                                  {item.name}
                                </Link>
                              </Col>
                              <Col md={4}>
                                {item.qty} x ${item.price} = ${item.qty * item.price}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                      ) )}
                    </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  {error && <Message variant='danger'>{error}</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button type='button' className='btn-block' disabled={cartItems === 0} onClick={placeOrderHandler}>
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
  )
}

export default PlaceOrderScreen
