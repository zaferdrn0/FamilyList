import { useAuth } from '@/context/AuthContext'
import { fetchBackendPOST } from '@/utils/backendFetch'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'

const InviteBox = () => {
    const { currentUser } = useAuth()

    const InviteGroupResponse = async (groupId: string, reply: string) => {
        if (currentUser === "loading") return
        const groupData = {
            groupId: groupId,
            reply: reply,
        }
        const createGroup = await fetchBackendPOST("/user/invite-group-reply", groupData)
        if (createGroup.ok) {
            const data = await createGroup.json()
            console.log(data)
        }
    }

    return (
        <Box>
            {currentUser !== "loading" && currentUser?.invites.map((invite) => {
                return (
                    <Box key={invite._id}>
                        <Typography>{invite.invitedBy.username}</Typography>
                        <Typography>{invite.groupId.name}</Typography>
                        <Button onClick={() => InviteGroupResponse(invite.groupId._id, "accepted")}>Accept</Button>
                        <Button onClick={() => InviteGroupResponse(invite.groupId._id, "rejected")}>Decline</Button>
                    </Box>
                )
            })}
        </Box>
    )
}

export default InviteBox