import { DataPriorities, DataTypes } from '@/models/dataType';
import { fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch';
import { Box, Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SelectUsersComponent from '../user/SelectUsers';

interface addDataProps {
    group_id: string
    users:any[]
}
const quantitiyUnitData = ["KG","PIECES","LITER"]

const AddData: React.FC<addDataProps> = ({ group_id,users }) => {
    const [dataName, setDataName] = useState<string>("");
    const [dataType, setDataType] = useState<DataTypes[]>([]);
    const [dataPriority, setDataPriority] = useState<DataPriorities[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");
    const [placeToBuy, setPlaceToBuy] = useState<string>("");
    const [userId, setUserId] = useState<string[]>([]);
    const [quantityValue, setQuantityValue] = useState<number>(0);
    const [quantitiyUnit, setQuantityUnit] = useState<string>("Pieces");

    const getDataPriority = async () => {
        const response = await fetchBackendGET("/data/list-priority");
        if (response.ok) {
            const data = await response.json();
            setDataPriority(data);
        }
    }
    const getDataType = async () => {
        const response = await fetchBackendGET("/data/list-type");
        if (response.ok) {
            const data = await response.json();
            setDataType(data);
        }
    }

    const addData = async () => {
        await fetchBackendPOST('/data/add', { name: dataName, dataType: selectedType, dataPriority: selectedPriority, assignedUsers: userId,placeToBuy:placeToBuy, groupId: group_id,quantity:{value:quantityValue,unit:quantitiyUnit} });
    };

    const selectPriority = (event: SelectChangeEvent) => {
        setSelectedPriority(event.target.value as string);
    };
    const selectType = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value as string);
    };
    const selectQuantitiyUnit = (event: SelectChangeEvent) => {
        setQuantityUnit(event.target.value as string);
    };
    const filteredAndMappedUsers = users.map((user) => (
      <MenuItem key={user._id} value={user._id}>
        <Checkbox checked={userId.indexOf(user._id) > -1} />
        <ListItemText primary={user.username} />
      </MenuItem>
    ));

    useEffect(() => {
        getDataType()
        getDataPriority()
    }, [])

    return (
        <Box>
            <TextField onChange={(e) => setDataName(e.target.value)} label={"data"} />
            <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                    value={selectedPriority}
                    label="Priority"
                    onChange={selectPriority}
                >
                    {dataPriority.map((value, index) => {
                        return <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                    })}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                    value={selectedType}
                    label="Type"
                    onChange={selectType}
                >
                    {dataType.map((value, index) => {
                        return <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                    })}
                </Select>
            </FormControl>
            <TextField onChange={(e) => setQuantityValue(Number(e.target.value))} label={"quantity"} />
            <FormControl fullWidth>
                <InputLabel>Quantitiy unit</InputLabel>
                <Select
                    value={quantitiyUnit}
                    label="Quantitiy unit"
                    onChange={selectQuantitiyUnit}
                >
                    {quantitiyUnitData.map((value, index) => {
                        return <MenuItem key={index} value={value}>{value}</MenuItem>
                    })}
                </Select>
            </FormControl>
            <TextField onChange={(e) => setPlaceToBuy(e.target.value)} label={"place to buy"} />
            <SelectUsersComponent users={users} userId={userId} setUserId={setUserId} filteredAndMappedUsers={filteredAndMappedUsers}/>
            <Button variant="contained" onClick={addData}>Add Data</Button>
        </Box>
    )
}

export default AddData