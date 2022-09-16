import {Form, Button} from 'react-bootstrap'
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const SearchBox = () =>{
  const [keyword, setKeyword] = useState('')

  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    if(keyword.trim()){
      //redirect
      navigate(`/search/${keyword}`)
    }else{
      navigate('/')
    }
  }
  return (
      <Form onSubmit={submitHandler}>
        <Form.Control type="text" className="mr-sm-2 ml-sm-5" name='q' placeholder="Search Products..." onChange={(e) => setKeyword(e.target.value)}>
        </Form.Control>
        <Button type="submit" variant="outline-success" className="p-2">
          Submit
        </Button>
      </Form>
  )
}

export default SearchBox
