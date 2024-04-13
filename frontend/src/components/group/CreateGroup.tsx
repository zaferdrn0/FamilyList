import { useAuth } from '@/context/AuthContext'
import { fetchBackendPOST } from '@/utils/backendFetch'
import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'

interface CreateGroupProps {
  setGroups: React.Dispatch<React.SetStateAction<any[]>>
  groups: any[]
}

const CreateGroup: React.FC<CreateGroupProps> = ({ setGroups, groups }) => {
  const [groupName, setGroupName] = useState<string>("")
  const { currentUser } = useAuth()

  const CreateGroup = async () => {
    if (currentUser === "loading") return
    const groupData = {
      name: groupName,
      users: [currentUser?._id],
    }
    const createGroup = await fetchBackendPOST("/group/create", groupData)
    if (createGroup.ok) {
      const data = await createGroup.json()
      setGroups([...groups, data])
    }
  }

  return (
    <Box>
      <TextField onChange={(e) => setGroupName(e.target.value)} label="Group Name" />
      <Button onClick={CreateGroup}>Create Group</Button>
    </Box>
  )
}

export default CreateGroup