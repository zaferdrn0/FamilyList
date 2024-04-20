import { fetchBackendPOST } from '@/utils/backendFetch';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import SelectUsersComponent from './SelectUsers';

interface InviteUsersProps {
    group_id: string;
    setInviteUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    inviteUserModalOpen: boolean;
    groupInformation: any | undefined
    users:any[]
}

const InviteUsers: React.FC<InviteUsersProps> = ({ setInviteUserModalOpen, inviteUserModalOpen, group_id, groupInformation,users }) => {
    const [userId, setUserId] = useState<string[]>([]);

    const CloseInviteUserModal = () => {
        setInviteUserModalOpen(false);
    }

    const InviteUsers = async () => {
        const response = await fetchBackendPOST("/user/invite-group", { groupId: group_id, users: userId });
        if (response.ok) {
            const data = await response.json();
            setInviteUserModalOpen(false);
            console.log(data)
        }
    }

    const invitedUsersSet = new Set(groupInformation?.invitedUsers);
    const filteredAndMappedUsers = users
      .filter(user => !groupInformation?.users?.includes(user._id))
      .map((user) => {
        const isInvited = invitedUsersSet.has(user._id);
        return (
          <MenuItem key={user._id} value={user._id} disabled={isInvited}>
            <Checkbox checked={userId.indexOf(user._id) > -1} />
            <ListItemText primary={`${user.username}${isInvited ? ' (invited)' : ''}`} />
          </MenuItem>
        );
      });

    return (
        <Dialog open={inviteUserModalOpen} onClose={CloseInviteUserModal} maxWidth={"md"} fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Invite Users
            </DialogTitle>
            <DialogContent>
<SelectUsersComponent users={users} userId={userId} setUserId={setUserId} filteredAndMappedUsers={filteredAndMappedUsers}/>
            </DialogContent>
            <DialogActions sx={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: "3rem" }}>
                <Button onClick={InviteUsers}>Invite Users</Button>
            </DialogActions>
        </Dialog>)
}

export default InviteUsers