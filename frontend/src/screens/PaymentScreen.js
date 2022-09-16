import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form, Col} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {savePaymentMethod} from '../features/cart/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {shippingAddress} = useSelector((state) => state.cart);

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const navigate = useNavigate();

  if(!shippingAddress){
    //redirect
    navigate('/shipping')
  }

  const submitHandler = (e) => {
    e.preventDefault();
    //call redux thunk
    dispatch(savePaymentMethod(paymentMethod));
    //redirect
    navigate('/placeorder');
  };
  return (
      <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend'>
              Select Method
            </Form.Label>
          <Col>
            <Form.Check type='radio' label='PayPal or Credit Card' id='PayPal' name='paymentMethod' value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)}>
            </Form.Check>
            {/*<Form.Check type='radio' label='Stripe' id='Stripe' name='paymentMethod' value='Stripe' onChange={(e) => setPaymentMethod(e.target.value)}>*/}
            {/*</Form.Check>*/}
          </Col>
          </Form.Group>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
  );
};

export default PaymentScreen;
