import { useQuery } from '@tanstack/react-query'
import { fetchPosts } from './api/api'
import Postlist from './components/postlist'
import './App.css'
function App() {

 const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })


  console.log(data, isLoading)
  return (
    <>
      <div className='title' >
     Misty's post
     
      
      </div>
      <Postlist/>
    </>
  )
}

export default App
