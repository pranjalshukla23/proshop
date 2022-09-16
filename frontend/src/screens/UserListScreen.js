import {useState, useEffect} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Table, Button} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getUsers, deleteUser} from '../features/users/userSlice'
import FormContainer from '../components/FormContainer';
import {LinkContainer} from 'react-router-bootstrap'



const UserListScreen = () =>{

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo, users, error, loading, isUserDeleted: successDelete} = useSelector((state) => state.users)


  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    if(userInfo && userInfo.isAdmin){
      //call redux thunk
      dispatch(getUsers())
    }else{
      //redirect
      navigate('/login')
    }


  },[dispatch, userInfo, successDelete])

  const deleteHandler = (id) => {

    if(window.confirm("Are you sure")){
      //call redux thunk
      dispatch(deleteUser(id))
    }
  }

  return (
      <>
        <h1>Users</h1>
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
            (
                <Table striped bordered  hover responsive className="table-sm">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.map(user => (
                      <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                        <td>
                          {user.isAdmin ? <i className="fas fa-check" style={{color:"green"}}></i> :
                              (
                                  <i className="fas fa-times" style={{color:"red"}}></i>
                              )}
                        </td>
                        <td>
                          <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant="light" className="btn-sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </LinkContainer>
                          <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
            )}
      </>
  )


}

export default UserListScreen
