import CreateGroup from '@/components/group/CreateGroup'
import ListGroup from '@/components/group/ListGroup'
import InviteBox from '@/components/user/InviteBox'
import { useAuth } from '@/context/AuthContext'
import { fetchBackendGET } from '@/utils/backendFetch'
import { Grid, } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [groups, setGroups] = useState<any[]>([])

  const GetGroups = async () => {
    if (currentUser === "loading") return
    const getGroups = await fetchBackendGET("/group/list")
    if (getGroups.ok) {
      const data = await getGroups.json()
      setGroups(data)
    }
  }

  useEffect(() => {
    GetGroups()
  }, [])

  return (
    <Grid>
      <CreateGroup setGroups={setGroups} groups={groups} />
      <ListGroup groups={groups} />
      <InviteBox />
    </Grid>
  )
}

export default Dashboard