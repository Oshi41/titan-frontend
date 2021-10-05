import * as React from 'react';
import {useControlledCookieState} from "../hook/useControlledCookieState";
import {ServerDesciption} from '../types';
import * as api from "../api/1.0";
import Grid from '@mui/material/Grid';
import {Accordion, AccordionDetails, AccordionSummary, Backdrop, Link, Stack, Typography} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ServersView = (): JSX.Element => {

    const [servers, setServers] = React.useState<ServerDesciption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [controls, setControls] = React.useState<JSX.Element[]>([]);

    const refresh = React.useCallback(() => {
        setLoading(true);

        api.get('/myServers')
            .then(x => {
                if (x.status !== 200) {
                    return x.json().then(y => {
                        throw new Error(y);
                    })
                }

                return x.json();
            })
            .then(x => {
                const addresses = x as string[];

                const promises = addresses.map(x => api.get('/minecraftServer', ['server', x]).then(x => {
                    if (x.status !== 200) {
                        return x.json().then(y => {
                            throw new Error(y);
                        })
                    }

                    return x.json();
                }));

                return Promise.all(promises)
                    .then(x => x.map(y => (y as ServerDesciption)));
            })
            .then(x => {
                setServers(x);
            })
            .catch(x => {
                console.log(x);
                setControls([]);
            })
            .finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        setControls(servers.map(getControl));
    }, [servers]);

    React.useEffect(refresh, []);

    return (
        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start">
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <div>
                {controls[0]}
            </div>
        </Grid>
    );
};

const getControl = (s: ServerDesciption): JSX.Element => {
    const {server, forge, extra} = s;

    const modsList = forge?.modinfo?.modList?.map(x => {
        return x.version
            ? <Link href={x.version} sx={{fontSize: 16}}>{x.modid}</Link>
            : <Typography sx={{fontSize: 16}}>
                {x.modid}
            </Typography>
    });

    return (
        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            rowSpacing={1}>

            <Grid item>
                <Typography sx={{fontSize: 42}} gutterBottom>
                    Сервер {server.hostname}
                </Typography>
            </Grid>

            {forge?.description && (
                <Grid item>
                    <Typography sx={{fontSize: 16}} gutterBottom>
                        {forge.description}
                    </Typography>
                </Grid>
            )}

            <Grid item>
                <Typography sx={{fontSize: 24, mt: 5, color: 'accent'}} gutterBottom>
                    Информация о сервере:
                </Typography>
            </Grid>

            <Grid item>
                <Typography sx={{fontSize: 16}} gutterBottom>
                    Версия Minecraft: {forge?.version?.name ?? server?.version}
                </Typography>
            </Grid>

            <Grid item>
                <Typography sx={{fontSize: 16}} gutterBottom>
                    Адрес сервера: {server.ip + ':' + server.port}
                </Typography>
            </Grid>

            {forge?.latency && (
                <Grid item>
                    <Typography sx={{fontSize: 16}} gutterBottom>
                        Пинг: {forge.latency} млс
                    </Typography>
                </Grid>
            )}

            <Grid item>
                <Typography sx={{fontSize: 16}} gutterBottom>
                    Онлайн: {forge?.players?.online ?? server?.players?.online} из {forge?.players?.max ?? server?.players?.max}
                </Typography>
            </Grid>

            {forge?.players?.sample?.length > 0 && (
                <Grid item>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            Список игроков на сервере
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                <Typography sx={{fontSize: 16}} gutterBottom>
                                    {forge.players.sample.map(x => x.name)}
                                </Typography>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            )}

            {modsList?.length > 0 && (
                <>
                    <Grid item>
                        <Typography sx={{fontSize: 24, mt: 5, color: 'accent'}} gutterBottom>
                            Список Forge модификаций:
                        </Typography>
                    </Grid>

                    {modsList.map(x => {
                        return <Grid item>{x}</Grid>
                    })}
                </>
            )}
        </Grid>
    );
}