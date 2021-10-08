import * as React from 'react';
import {Grid, Button, Link, Stack, TextareaAutosize} from "@mui/material";
import {useControlledCookieState} from "../hook/useControlledCookieState";
import * as api from '../api/1.0';
import {Typography} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {TabRoutes} from '../App';
import {StoreType} from '../types';

interface Props {
    setTab: (tab: TabRoutes) => void;
    store: StoreType | undefined;
}

export const MainView = (props: Props): JSX.Element => {

    const [login, setLogin] = useControlledCookieState('titan_login', '');

    const onClick = React.useCallback(() => {
        api.get('/launcher', ['file', 'Titan Launcher.jar'])
            .then(x => {
                if (x.status == 200){
                    return x.blob();
                }

                throw new Error(x.status + '');
            })
            .then(x => {
                const url = window.URL.createObjectURL(x);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Titan Launcher.jar');
                document.body.appendChild(link);
                link.click();
            });
    }, []);

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

            {props.store === 'ely.by' && (
                <Grid item>
                    <Typography sx={{fontSize: 18}} gutterBottom>
                        Проект использует авторизацию ely.by. Чтобы играть на проекте, необходимо использовать
                        существующий аккаунт.
                    </Typography>
                </Grid>
            )}

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

            {login && (
                <Grid item>
                    <Button variant="contained"
                            onClick={onClick}
                            sx={{fontSize: 18}}
                            endIcon={<SportsEsportsIcon/>}>
                        Скачать лаунчер
                    </Button>
                </Grid>
            )}

        </Grid>
    );
}