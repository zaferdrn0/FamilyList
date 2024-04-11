import { fetchBackendPOST } from '@/utils/backendFetch'
import { Button, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Register = () => {
  const [username,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const UserRegister =  async ()  =>{
// Create user object
    const userData = {
      username:username,
      password:password
    }

    // Post user data to backend
    const register = await fetchBackendPOST("/user-register",userData)
    if(register.ok){
        
       const data = await register.json()
       console.log(data)

    }
}

  return (
    <Grid>
      <Grid>
        <TextField type='text' label="username" onChange={(e)=>setUsername(e.target.value)}/>
        <TextField type='password' label="password" onChange={(e)=>setPassword(e.target.value)}/>
        <Button onClick={UserRegister}>Register</Button>
      </Grid>
    </Grid>
  )
}

export default Register