import { fetchBackendGET } from '@/utils/backendFetch'
import React, { useEffect } from 'react'

const Login = () => {

    const fetchData =  async ()  =>{
        const test = await fetchBackendGET("/test")
        if(test.ok){
            
           const data = await test.json()
           console.log(data)
        }
    }

    useEffect(() => {
        fetchData()
      },[]);

  return (
    <div>Login</div>
  )
}

export default Login