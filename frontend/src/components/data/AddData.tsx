import { DataPriorities, DataTypes } from '@/models/dataType';
import { fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface addDataProps {
    group_id: string
}

const AddData: React.FC<addDataProps> = ({ group_id }) => {
    const [dataName, setDataName] = useState<string>("");
    const [dataType, setDataType] = useState<DataTypes[]>([]);
    const [dataPriority, setDataPriority] = useState<DataPriorities[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");

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
        await fetchBackendPOST('/data/add', { name: dataName, dataType: selectedType, dataPriority: selectedPriority, assignedUsers: [], groupId: group_id });
    };

    const selectPriority = (event: SelectChangeEvent) => {
        setSelectedPriority(event.target.value as string);
    };
    const selectType = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value as string);
    };

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
            <Button variant="contained" onClick={addData}>Add Data</Button>
        </Box>
    )
}

export default AddData