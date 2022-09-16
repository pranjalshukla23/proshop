import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Card, Col, Image, ListGroup, Row, Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {getOrderDetails, payOrder, deliverOrder, reset} from '../features/order/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {PayPalButton} from 'react-paypal-button-v2';

const OrderScreen = () => {

  const [sdkReady, setSdkReady] = useState(false);

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch();

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {order, loading, error, successPay, loadingPay, loadingDeliverOrder, errorDeliverOrder, deliverSuccess} = useSelector(
      (state) => state.order);


  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo} = useSelector((state) => state.users)


  //get query parameters
  const {id} = useParams();

  const navigate = useNavigate();

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  let itemsPrice;

  if( order.orderItems && order.orderItems.length > 0) {
    //calculate prices
    itemsPrice = addDecimals(
        order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  }

  useEffect(() => {

    if(!userInfo){
      //redirect
      navigate('/login')
    }

    if (!order || order._id !== id || successPay || deliverSuccess) {


      //call redux thunk
      dispatch(getOrderDetails(id));

    }

  }, [successPay, deliverSuccess]);

  const deliverHandler = () => {

    //call redux thunk
    dispatch(deliverOrder(order))
  }
  const successPaymentHandler = (paymentResult) => {

    console.log('id is', id);

    console.log(paymentResult);

    //call redux thunk
    dispatch(payOrder({id, paymentResult}));
  };

  return loading ? <Loader/> : error ? <Message variant="danger">
    {error}
  </Message> : <>
    <h1>Order: {order._id}</h1>
    <Row>
      <Col md={8}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p><strong>Name: </strong> {order.user.name} </p>
            <p><strong>Email: </strong><a
                href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address},{order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ?
                <Message variant="success">Delivered
                  At {order.deliveredAt}</Message> :
                <Message variant="danger">Not Delivered </Message>}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Payment method</h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ?
                <Message variant="success">Paid on {order.paidAt}</Message> :
                <Message variant="danger">Not Paid </Message>}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ?
                <Message>Order is empty</Message> :
                (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                          <ListGroup.Item key={index}>
                            <Row>
                              <Col md={1}>
                                <Image src={item.image} alt={item.name} fluid
                                       rounded/>
                              </Col>
                              <Col>
                                <Link to={`/product/${item.product}`}>
                                  {item.name}
                                </Link>
                              </Col>
                              <Col md={4}>
                                {item.qty} x ${item.price} = ${item.qty *
                                  item.price}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                      ))}
                    </ListGroup>
                )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
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
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {!order.isPaid && (
                <ListGroup.Item>
                  <PayPalButton amount={order.totalPrice}
                                onSuccess={successPaymentHandler}/>
                </ListGroup.Item>
            )}

            {loadingDeliverOrder && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" className="btn btn-block" onClick={deliverHandler}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </>;
};

export default OrderScreen;
