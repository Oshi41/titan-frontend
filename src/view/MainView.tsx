import * as React from 'react';
import {Grid, Button, Link, Stack, TextareaAutosize} from "@mui/material";
import {useControlledCookieState} from "../hook/useControlledCookieState";
import * as api from '../api/1.0';
import {Typography} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {TabRoutes} from '../App';

interface Props {
    setTab: (tab: TabRoutes) => void;
}

export const MainView = (props: Props): JSX.Element => {

    const [login, setLogin] = useControlledCookieState('titan_login', '');
    
    return (
        <Grid container
              direction="column"
              justifyContent="space-between"
              alignItems="flex-start"
              rowSpacing={1}>
            <Grid item>
                <Typography sx={{fontSize: 24}} gutterBottom>
                    Добро пожаловать на проект Titan!
                </Typography>
            </Grid>

            {!login && (
                <Grid item>
                    <Button variant="contained"
                            onClick={() => props.setTab(TabRoutes.LOGIN)}
                            sx={{fontSize: 18}}
                            endIcon={<FingerprintIcon/>}>
                        Войти
                    </Button>
                </Grid>
            )}

            {!login && (
                <Grid item>
                    <Button variant="contained"
                            onClick={() => props.setTab(TabRoutes.REGISTRATION)}
                            sx={{fontSize: 18}}
                            endIcon={<PermIdentityIcon/>}>
                        Зарегистрироваться
                    </Button>
                </Grid>
            )}


            <Grid item>
                <Button variant="contained"
                        onClick={() => api.get('/launcher', ['file', 'TitanLauncher.jar'])}
                        sx={{fontSize: 18}}
                        endIcon={<SportsEsportsIcon/>}>
                    Скачать лаунчер
                </Button>
            </Grid>

        </Grid>
    );
}