import { useState, useEffect } from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { fetchBackendDELETE, fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch'; // fetchBackendPOST'un yolu projenize göre değişebilir
import { Data, DataPriorities, DataTypes } from '@/models/dataType';

const Group = () => {
    const [text, setText] = useState<string>("");
    const [data, setData] = useState<Data[]>([]);
    const [dataType, setDataType] = useState<DataTypes[]>([]);
    const [dataPriority, setDataPriority] = useState<DataPriorities[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("");

    // WebSocket bağlantısını başlatma
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4001');

        ws.onopen = () => {
            console.log('WebSocket connected');
            // Veritabanından mevcut verileri çekme
            getData();
            getDataType()
            getDataPriority()
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setData((prevData) => [...prevData, message]);
        };

        return () => {
            ws.close();
        };
    }, []);

    const getData = async () => {
        const response = await fetchBackendGET("/get-data");
        if (response.ok) {
            const data = await response.json();
            setData(data);
            console.log(data)
        }
    };

    const getDataType = async () => {
        const response = await fetchBackendGET("/get-data-type");
        if (response.ok) {
            const data = await response.json();
            setDataType(data);
        }
    }
    const getDataPriority = async () => {
        const response = await fetchBackendGET("/get-data-priority");
        if (response.ok) {
            const data = await response.json();
            setDataPriority(data);
        }
    }

    const addData = async () => {
        await fetchBackendPOST('/add-data', { name: text,type:selectedType,priority:selectedPriority,assignedUsers:[] });
    };

    const selectPriority = (event: SelectChangeEvent) => {
        setSelectedPriority(event.target.value as string);
      };
      const selectType = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value as string);
      };

      const deleteData = async (id:string) => {
        const response = await fetchBackendDELETE("/delete-data",{id:id});
        if (response.ok) {
            const data = await response.json();
            setData((prevData) => prevData.filter((item) => item._id!== data._id));
            console.log(data)   
        }
      };

    return (
        <Grid container spacing={2} direction="column">
            <Grid item lg={12}>
                <TextField onChange={(e) => setText(e.target.value)} label={"data"} />
                <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={selectedPriority}
                        label="Priority"
                        onChange={selectPriority}
                    >
                        {dataPriority.map((value, index) =>{
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
                        {dataType.map((value, index) =>{
                            return <MenuItem key={index} value={value._id}>{value.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={addData}>Add Data</Button>
            </Grid>
            <Grid item>
                <div>
                    {data.map((item, index) => (
                        <Box key={index} sx={{display:"flex",alignItems:"center",justifyContent:"space-around"}}>
                            <Typography> {item.name}</Typography>
                            <Typography> {item.dataType.name}</Typography>
                            <Typography> {item.dataPriority.name}</Typography>
                            <Typography> {item.assignedUsers}</Typography>
                            <Button variant="contained" onClick={() => deleteData(item._id)}>Delete</Button>
                        </Box>
                        
                    ))}
                </div>
            </Grid>
        </Grid>
    );
};

export default Group;
