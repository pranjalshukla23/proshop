import {Col, Row} from 'react-bootstrap';
import Product from '../components/Product';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Helmet} from 'react-helmet'
import {Link} from 'react-router-dom'
//import redux actions and functions
import {listProducts} from '../features/products/productsSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {useParams} from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {

  //get request parameters
  const {keyword} = useParams()

  //get request parameters
  const pageNumber = useParams().pageNumber || 1

  //get the state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {products, loading, error, page, pages} = useSelector((state) => state.products);

  //useDispatch hook is used to call actions or thunks defined in redux
  const dispatch = useDispatch();

  useEffect(() => {

    //call redux thunk
    dispatch(listProducts({keyword, pageNumber}));

  }, [dispatch, keyword, pageNumber]);

  return (
      <>
        <Meta />
        {!keyword ? <ProductCarousel /> : <Link to='/' className="btn btn-light">Go Back</Link>}
        <h1>Latest Products</h1>
        {loading ? <Loader /> : error ? <Message variant="red">{error}</Message> :
            (<>
                <Row>
              {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                  </Col>
              ))}
            </Row>
                  <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </>
            )
        }

      </>
  );
};

export default HomeScreen;
