import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {
  getUserDetails,
  updateUserDetails,
} from '../features/users/userSlice';

const UserEditScreen = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  //for getting query string defined in url
  const [searchParams, setSearchParams] = useSearchParams();

  //get query string with name qty
  const redirect = searchParams.get('redirect') ?
      searchParams.get('redirect') :
      '/';

  //get request parameters
  const {id} = useParams();

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {user, error, loading, loadingUpdated, updateError, isUserUpdated} = useSelector((state) => state.users);

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch();

  //for redirection
  const navigate = useNavigate();

  useEffect(() => {
    if(isUserUpdated){
      //redirect
      navigate('/admin/userlist')
    }else{
      if(!user.name || user._id !== id){
        //call redux thunk
        dispatch(getUserDetails(id))
      }else{
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, dispatch, id, isUserUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();
    //call redux thunk
    dispatch(updateUserDetails({
      _id: id,
      name,
      email,
      isAdmin
    }))
  };

  return (
      <>
        <Link to="/admin/userlist" className="btn btn-light my-3">
          Go Back
        </Link>

        <h1>Edit User</h1>
        {loadingUpdated && <Loader />}
        {updateError && <Message variant="danger">{updateError} </Message>}
        {loading ?
            <Loader/> :
            error ? <Message variant="danger">{error}</Message> :
                (
                    <FormContainer>
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" placeholder="Enter name"
                                        value={name} onChange={(e) => setName(
                              e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control type="text" placeholder="Enter email"
                                        value={email} onChange={(e) => setEmail(
                              e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="isAdmin">
                          <Form.Check type="checkbox"
                                        label="Is Admin"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(
                                            e.target.checked)}>
                          </Form.Check>
                        </Form.Group>

                        <Button type="submit" variant="primary">
                          Update
                        </Button>
                      </Form>
                    </FormContainer>

                )}

      </>

  );

};

export default UserEditScreen;
