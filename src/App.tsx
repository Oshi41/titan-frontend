import {Backdrop, Chip, Divider, Stack, Tab, Tabs, Avatar} from "@mui/material";
import {TabContext, TabPanel} from '@mui/lab';
import React from 'react';
import {BrowserRouter, Switch, Route, useHistory} from 'react-router-dom';
import {useControlledCookieState} from "./hook/useControlledCookieState";
import {MainView} from "./view/MainView";
import {ModalDialog} from "./view/ModalDialog";
import {Registration} from "./view/Registration";
import {Login} from "./view/Login";
import {ServersView} from "./view/ServersView";
import {StoreType} from './types';
import * as api from './api/1.0';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';


export enum TabRoutes {
    MAIN = '/main',
    REGISTRATION = '/registration',
    LOGIN = '/login',
    SERVERS = '/servers',
}

export const App = (): JSX.Element => {
    let history = useHistory();

    const [login, setLogin] = useControlledCookieState('titan_login', '');
    const [tab, setTab] = useControlledCookieState<TabRoutes>('titan_tab', TabRoutes.MAIN);

    const [storeType, setStoreType] = React.useState<StoreType | undefined>(undefined);

    const [loading, setLoading] = React.useState(false);
    const [showLogOut, setShowLogOut] = React.useState(false);

    const changeTab = React.useCallback((t: TabRoutes) => {

        if (storeType == 'ely.by' && t === TabRoutes.REGISTRATION) {
            window.location.href = 'https://account.ely.by/register';
            return;
        }

        setTab(t);
        history.push(t);
    }, [storeType]);

    // В случае успешного входа, надо  перейти с не нужных табов
    React.useEffect(() => {
        if (login && (tab === TabRoutes.REGISTRATION || tab === TabRoutes.LOGIN)) {
            changeTab(TabRoutes.MAIN);
        }
    }, [login]);

    // запрашиваю тип хранения
    React.useEffect(() => {
        setLoading(true);

        api.get('/storeType')
            .then(x => {
                if (x.status !== 200) {
                    return x.text().then(y => {
                        console.log(y);
                        throw new Error(y);
                    });
                }

                return x.text();
            })
            .then(x => setStoreType(x as StoreType))
            .catch(x => {
                console.log(x);
                setStoreType(undefined);
            })
            .finally(() => setLoading(false));
    }, []);

    const tabs = React.useMemo(() => {
        const result: JSX.Element[] = [<Tab label='Главная' value={TabRoutes.MAIN}/>];

        const add = storeType === 'ely.by'
            ? 'Ely.by'
            : '';

        if (!login) {
            if (!login) {
                result.push(
                    <Tab label={`Регистрация ${add}`} value={TabRoutes.REGISTRATION}/>,
                    <Tab label={`Вход ${add}`} value={TabRoutes.LOGIN}/>
                );
            }
        }


        result.push(<Tab label='Сервера' value={TabRoutes.SERVERS}/>);
        return result;
    }, [login, storeType]);

    const avatar = React.useMemo(() => {
        if (!login) {
            return undefined;
        }

        switch (storeType) {
            case 'sqlite':
                return <Avatar>own</Avatar>;

            case 'ely.by':
                return <Avatar variant='square'
                               src='https://avatars.githubusercontent.com/u/15382302?s=200&v=4'/>;
        }

        return undefined;
    }, [storeType, login]);

    return (
        <BrowserRouter>
            <div>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={loading}>
                    <CircularProgress color="inherit"/>
                </Backdrop>

                <TabContext value={tab}>
                    <Stack direction="row"
                           spacing={2}
                           sx={{borderBottom: 1, borderColor: 'divider', mt: 1, ml: 1}}>
                        {login && (
                            <>
                                <Chip label={'Текущий пользователь: ' + login}
                                      avatar={avatar}
                                      sx={{ml: 1, mt: 1, mb: 1}}
                                      onDelete={() => setShowLogOut(true)}/>


                                <Divider orientation="vertical" flexItem/>
                            </>
                        )}

                        <ModalDialog open={showLogOut}
                                     close={() => setShowLogOut(false)}
                                     onAction={() => setLogin('')}
                                     title='Подтверждение'
                                     description={`Вы точно хотите выйти из аккаунта ${login}?`}
                        />


                        <Tabs value={tab}
                              onChange={(e, value: TabRoutes) => {
                                  changeTab(value);
                              }}>{tabs}</Tabs>


                    </Stack>

                    <TabPanel value={TabRoutes.MAIN}>
                        <MainView setTab={changeTab} store={storeType}/>
                    </TabPanel>
                    <TabPanel value={TabRoutes.REGISTRATION}>
                        <Registration onRegister={name => {
                            setLogin(name);
                            changeTab(TabRoutes.MAIN);
                        }}/>
                    </TabPanel>
                    <TabPanel value={TabRoutes.LOGIN}>
                        <Login store={storeType}
                               onLogin={name => {
                                   setLogin(name);
                                   changeTab(TabRoutes.MAIN);
                               }}/>
                    </TabPanel>

                    <TabPanel value={TabRoutes.SERVERS}>
                        <ServersView/>
                    </TabPanel>

                </TabContext>
            </div>
        </BrowserRouter>
    );
};
