import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

interface ListGroupProps {
    groups: any[]
}

const ListGroup: React.FC<ListGroupProps> = ({ groups }) => {
    const router = useRouter()
    const RouteGroup = async (groupdId: string) => {
        router.push(`/group/${groupdId}`)
    }

    return (
        <Box>
            {groups.map((group, index) => {
                return (
                    <Box key={index}>
                        <Typography>{group.name}</Typography>
                        <Button onClick={() => RouteGroup(group._id)}>Detail</Button>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ListGroup