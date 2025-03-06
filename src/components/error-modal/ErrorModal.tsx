import { Typography, Modal, Button, Stack, Divider, Box, CardMedia } from "@mui/material";
import { useState } from "react";
import { errorFromConfig } from "../../utils/errorServices";

const ErrorModal = ({ error } : any) => {
    const [open, setOpen] = useState(true);

    if (!error) {
        return null
    }

    const {name, description, solution, code} = errorFromConfig(error);
    
    const handleClose = () => setOpen(false);
  
    return (    
        <Modal open={open}>
            <Box  className="notification-modal modal-window">
                <Stack sx={{ marginBottom : `20px` }} alignItems="center">
                    <CardMedia sx={{ width:`100px` }} alt="warning" component="img" src="images/general/warning.svg" />
                </Stack>
                <Divider/>
                <Typography className="title" variant="h6" component="h2">{name}</Typography>
                <Typography className="text">{description}</Typography>
                <Typography className="text">Fehlercode: {code}</Typography>
                <Divider/>
                <Typography className="title">Lösung</Typography>
                <Typography className="text">{solution}</Typography>
                <Divider/>
                <Button className="button" onClick={handleClose}>Close</Button>
            </Box>
        </Modal>
    );
}

export default ErrorModal