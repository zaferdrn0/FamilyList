import { fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
interface InviteUsersProps {
    group_id: string;
    setInviteUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    inviteUserModalOpen: boolean;
    groupInformation: any | undefined
}

const InviteUsers: React.FC<InviteUsersProps> = ({ setInviteUserModalOpen, inviteUserModalOpen, group_id, groupInformation }) => {
    const [userId, setUserId] = useState<string[]>([]);
    const [users, setUsers] = useState<any[]>([])

    const GetUsers = async () => {
        const response = await fetchBackendGET("/user/list");
        if (response.ok) {
            const data = await response.json();
            setUsers(data)
        }
    }

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

    const handleChange = (event: SelectChangeEvent<typeof userId>) => {
        const {
            target: { value },
        } = event;
        setUserId(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const renderUsernames = (selectedIds: string[]) => {
        return selectedIds.map(id => {
            const user = users.find(user => user._id === id);
            return user ? user.username : '';
        }).join(', ');
    };

    const filteredAndMappedUsers = users
    .filter(user => !groupInformation?.users?.includes(user._id)) 
    .map((user) => (
      <MenuItem key={user._id} value={user._id}>
        <Checkbox checked={userId.indexOf(user._id) > -1} />
        <ListItemText primary={user.username} />
      </MenuItem>
    ));
  

    useEffect(() => {
        GetUsers()
    }, [])

    return (
        <Dialog open={inviteUserModalOpen} onClose={CloseInviteUserModal} maxWidth={"md"} fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Invite Users
            </DialogTitle>
            <DialogContent>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel>Select Users</InputLabel>
                    <Select
                        multiple
                        value={userId}
                        onChange={handleChange}
                        input={<OutlinedInput label="Select Users" />}
                        renderValue={(selected) => renderUsernames(selected)}
                        MenuProps={MenuProps}
                    >
                        {filteredAndMappedUsers}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: "3rem" }}>
                <Button onClick={InviteUsers}>Invite Users</Button>
            </DialogActions>
        </Dialog>)
}

export default InviteUsers