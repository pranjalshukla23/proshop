import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams,} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {
  getProductDetails,
  updateProduct,
} from '../features/products/productsSlice';
import axios from 'axios'
const ProductEditScreen = () => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

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
  const {
    product,
    loading,
    error,
    loadingUpdatedProduct,
    errorUpdatedProduct,
    isProductUpdated,
  } = useSelector((state) => state.products);

  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch();

  //for redirection
  const navigate = useNavigate();

  useEffect(() => {

    if (isProductUpdated) {
      //redirect
      navigate('/admin/productlist');
    } else {
      if (!product.name || product._id !== id) {
        //call redux thunk
        dispatch(getProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [product, dispatch, id, isProductUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    //call redux thunk
    dispatch(updateProduct({
      _id: id,
      name,
      price,
      description,
      brand,
      category,
      image,
      countInStock,
    }));
  };

  const uploadFileHandler = async (e) => {
      const file = e.target.files[0]
      const formData = new FormData()
    console.log(file)
      formData.append('image',file)
      setUploading(true)

      try{

        const config = {
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        }

        const {data} = await axios.post(`/api/upload`,formData,config)

        setImage(data)
        setUploading(false)
      }catch(err){
        console.log(err)
        setUploading(false)
      }

  };
  return (
      <>
        <Link to="/admin/productlist" className="btn btn-light my-3">
          Go Back
        </Link>

        <h1>Edit Product</h1>
        {loadingUpdatedProduct && <Loader/>}
        {errorUpdatedProduct &&
            <Message variant="danger">{errorUpdatedProduct}</Message>}
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

                        <Form.Group controlId="price">
                          <Form.Label>Price</Form.Label>
                          <Form.Control type="number" placeholder="Enter price"
                                        value={price} onChange={(e) => setPrice(
                              e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="image">
                          <Form.Label>Image</Form.Label>
                          <Form.Control type="text"
                                        placeholder="Enter image url"
                                        value={image} onChange={(e) => setImage(
                              e.target.value)}>
                          </Form.Control>
                          <Form.Control
                              type="file"
                              label="Choose file"
                              onChange={uploadFileHandler}
                          />
                          {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId="brand">
                          <Form.Label>Brand</Form.Label>
                          <Form.Control type="text" placeholder="Enter brand"
                                        value={brand} onChange={(e) => setBrand(
                              e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="countInStock">
                          <Form.Label>Count In Stock</Form.Label>
                          <Form.Control type="number"
                                        placeholder="Enter count in stock"
                                        value={countInStock}
                                        onChange={(e) => setCountInStock(
                                            e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category">
                          <Form.Label>Category</Form.Label>
                          <Form.Control type="text" placeholder="Enter category"
                                        value={category}
                                        onChange={(e) => setCategory(
                                            e.target.value)}>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="description">
                          <Form.Label>Description</Form.Label>
                          <Form.Control type="text"
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDescription(
                                            e.target.value)}>
                          </Form.Control>
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

export default ProductEditScreen;
