import { FormControl, InputLabel, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react'


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


interface SelectUsersComponent {
    users:any[]
    filteredAndMappedUsers: React.JSX.Element[]
    userId:string[]
    setUserId:React.Dispatch<React.SetStateAction<string[]>>
}

const SelectUsersComponent:React.FC<SelectUsersComponent> = ({users,filteredAndMappedUsers,userId,setUserId}) => {

    const renderUsernames = (selectedIds: string[]) => {
        return selectedIds.map(id => {
            const user = users.find(user => user._id === id);
            return user ? user.username : '';
        }).join(', ');
    };

    const handleChange = (event: SelectChangeEvent<typeof userId>) => {
        const {
            target: { value },
        } = event;
        setUserId(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

  return (
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
  )
}

export default SelectUsersComponent