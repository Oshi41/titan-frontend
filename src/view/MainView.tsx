import * as React from 'react';
import {Box, Link, Stack, TextareaAutosize} from "@mui/material";
import {useControlledCookieState} from "../hook/useControlledCookieState";
import * as api from '../api/1.0';

export const MainView = (): JSX.Element => {

    const [login, setLogin] = useControlledCookieState('titan_login', '');

    const downloadClient = React.useCallback(() => {
        api.get('/launcher')
    }, []);

    return (
        <Box sx={{
            margin: 2
        }}>
            <Stack direction="column"
                   spacing={2}>

                <div>Добро пожаловать на проект Titan!</div>
                {!login && (<div>Для начала необходимо <Link href='/registration'>Зарегистрироваться</Link>.</div>)}
                <div>Потом надо <Link onClick={downloadClient}>скачать лаунчер</Link>  </div>
            </Stack>

        </Box>
    );
}