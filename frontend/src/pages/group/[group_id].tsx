import { useState, useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { fetchBackendGET } from '@/utils/backendFetch';
import { Data } from '@/models/dataType';
import { useRouter } from 'next/router';
import InviteUsers from '@/components/user/InviteUsers';
import AddData from '@/components/data/AddData';
import ListData from '@/components/data/ListData';

const Group = () => {
    const router = useRouter()
    const [data, setData] = useState<Data[]>([]);
    const [inviteUserModalOpen, setInviteUserModalOpen] = useState<boolean>(false);
    const [groupInformation,setGroupInformation] = useState<any | undefined>()
    const [users, setUsers] = useState<any[]>([])
    const { group_id } = router.query;

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4001');

        ws.onopen = () => {
            console.log('WebSocket connected');
            GetGroupInformation();
            GetUsers()
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setData((prevData) => [...prevData, message]);
        };

        return () => {
            ws.close();
        };
    }, []);

    const GetGroupInformation = async () => {
        const response = await fetchBackendGET(`/group/information/${group_id}`)
        if (response.ok) {
            const data = await response.json()
            setGroupInformation(data);
            setData(data.data)
        }
    }
    const GetUsers = async () => {
        const response = await fetchBackendGET("/user/list");
        if (response.ok) {
            const data = await response.json();
            setUsers(data)
        }
    }


    return (
        <Grid container spacing={2} direction="column">
            <Box>
                <InviteUsers group_id={group_id as string} setInviteUserModalOpen={setInviteUserModalOpen} inviteUserModalOpen={inviteUserModalOpen} groupInformation={groupInformation} users={users}/>
            </Box>
            <Grid item lg={12}>
                <Button onClick={() => router.push("/dashboard")}>Back To Dashboard</Button>
                <Button onClick={() => setInviteUserModalOpen(true)}>Invite User</Button>
            </Grid>
            <Grid>
                <AddData group_id={group_id as string} users={users} />
            </Grid>
            <Grid>
                <ListData data={data} setData={setData} />
            </Grid>

        </Grid>
    );
};

export default Group;
