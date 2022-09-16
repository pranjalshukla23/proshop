import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {Table, Button, Row, Col} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  listProducts,
  deleteProduct,
  createProduct,
  reset,
} from '../features/products/productsSlice';
import FormContainer from '../components/FormContainer';
import {LinkContainer} from 'react-router-bootstrap'
import product from '../components/Product';
import Paginate from '../components/Paginate';



const ProductListScreen = () =>{

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {products, loading, error, productDeleted, loadingDelete, errorDelete, isProductCreated, createdProduct, loadingCreateProduct, errorCreateProduct, pages, page} = useSelector((state) => state.products)


  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {userInfo} = useSelector((state) => state.users)

  const {pageNumber} = useParams() || 1

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    if(!userInfo.isAdmin){
      //redirect
      navigate('/login')
    }
    if(isProductCreated){
      //redirect
      navigate(`/admin/product/${createdProduct._id}/edit`)
    }else{

      //call redux thunk
      dispatch(listProducts({keyword:'',pageNumber}))
    }


  },[dispatch, userInfo, productDeleted, isProductCreated, createdProduct, pageNumber])

  const deleteHandler = (id) => {

    if(window.confirm("Are you sure")){

      //call redux thunk
      dispatch(deleteProduct(id))

    }
  }

  const createProductHandler = (product) => {
    //call redux thunk
    dispatch(createProduct())
  }

  return (
      <>
        <Row className="align-items-center">
          <Col>
            <h1>Products</h1>
          </Col>
          <Col className="text-right">
            <Button className="my-3" onClick={createProductHandler}>
              <i className="fas fa-plus"></i>Create Product
            </Button>
          </Col>
        </Row>
        {loadingCreateProduct && <Loader />}
        {errorCreateProduct && <Message variant="danger">{errorCreateProduct}</Message>}
        {errorDelete && <Message variant="danger">{errorDelete}</Message>}
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
            (
                <>
                <Table striped bordered  hover responsive className="table-sm">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>PRICE</th>
                    <th>CATEGORY</th>
                    <th>Brand</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {products.map(product => (
                      <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>
                          {product.category}
                        </td>
                        <td>{product.brand}</td>
                        <td>
                          <LinkContainer to={`/admin/product/${product._id}/edit`}>
                            <Button variant="light" className="btn-sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </LinkContainer>
                          <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
                  <Paginate pages={pages} page={page} isAdmin={true}/>
                  </>
            )}
      </>
  )


}

export default ProductListScreen
