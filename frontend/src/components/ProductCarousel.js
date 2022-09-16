import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react';
import {Carousel, Image} from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import {getTopProducts} from '../features/products/productsSlice'
import {useDispatch, useSelector} from 'react-redux'

const ProductCarousel = () =>{

  //get state defined in redux
  //useSelector takes reducer name defined in store as argument
  const {topProducts, loadingTopProducts, errorTopProducts} = useSelector((state) => state.products)

   console.log("top products fetched", topProducts)
  //useDispatch hook is used to call an action or function defined in redux
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(getTopProducts())
  },[dispatch])


  return loadingTopProducts ? <Loader /> : errorTopProducts ? <Message variant="danger">{errorTopProducts}</Message> :
      (
          <Carousel pause="hover" className="bg-dark">
            {topProducts.map(product => (
                <Carousel.Item key={product._id}>
                  <Link to={`/product/${product._id}`}>
                    <Image src={product.image} alt={product.name} fluid />
                    <Carousel.Caption className='carousel-caption'>
                      <h2>
                        {product.name} (${product.price})
                      </h2>
                    </Carousel.Caption>
                  </Link>
                </Carousel.Item>
            ))}
          </Carousel>
      )

}

export default ProductCarousel
