import { Data } from '@/models/dataType';
import { fetchBackendDELETE } from '@/utils/backendFetch';
import { Box, Button, Typography } from '@mui/material'
import React from 'react'

interface ListDataProps {
    data: Data[]
    setData: React.Dispatch<React.SetStateAction<Data[]>>
}

const ListData: React.FC<ListDataProps> = ({ data, setData }) => {

    const deleteData = async (id: string) => {
        const response = await fetchBackendDELETE("/data/delete", { id: id });
        if (response.ok) {
            const data = await response.json();
            setData((prevData) => prevData.filter((item) => item._id !== data._id));
        }
    };

    return (
        <Box>
            <div>
                {data.map((item, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <Typography> {item.name}</Typography>
                        <Typography> {item.dataType.name}</Typography>
                        <Typography> {item.dataPriority.name}</Typography>
                        <Typography> {item.assignedUsers}</Typography>
                        <Button variant="contained" onClick={() => deleteData(item._id)}>Delete</Button>
                    </Box>

                ))}
            </div>
        </Box>
    )
}

export default ListData