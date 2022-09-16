import {useState, useEffect} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getOrders} from '../features/order/orderSlice'
import FormContainer from '../components/FormContainer';
import {LinkContainer} from 'react-router-bootstrap'



const OrderListScreen = () =>{

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {orders, loadingGetOrders, errorGetOrders} = useSelector((state) => state.order)

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo, loading, error} = useSelector((state) => state.users)

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    if(userInfo && userInfo.isAdmin){
      //call redux thunk
      dispatch(getOrders())
    }else{
      //redirect
      navigate('/login')
    }


  },[dispatch, userInfo])


  return (
      <>
        <h1>Orders</h1>
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
            (
                <Table striped bordered  hover responsive className="table-sm">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
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
                        <td>{order.user && order.user.name}</td>
                        <td>{order.createdAt.substring(0,10)}</td>
                        <td>${order.totalPrice}</td>
                        <td>
                          {order.isPaid ? order.paidAt.substring(0,10) :
                              (
                                  <i className="fas fa-times" style={{color:"red"}}></i>
                              )}
                        </td>
                        <td>
                          {order.isDelivered ? order.deliveredAt.substring(0,10) :
                              (
                                  <i className="fas fa-times" style={{color:"red"}}></i>
                              )}
                        </td>
                        <td>
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button variant="light" className="btn-sm">
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
            )}
      </>
  )


}

export default OrderListScreen
