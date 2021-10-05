import {Chip, Divider, Stack, Tab, Tabs} from "@mui/material";
import {TabContext, TabPanel} from '@mui/lab';
import React from 'react';
import {BrowserRouter, Switch, Route, useHistory} from 'react-router-dom';
import {useControlledCookieState} from "./hook/useControlledCookieState";
import {MainView} from "./view/MainView";
import {ModalDialog} from "./view/ModalDialog";
import {Registration} from "./view/Registration";
import {Login} from "./view/Login";
import {ServersView} from "./view/ServersView";


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

    const [showLogOut, setShowLogOut] = React.useState(false);

    const changeTab = React.useCallback((t: TabRoutes) => {
        setTab(t);
        history.push(t);
    }, []);

    React.useEffect(() => {
        if (login && (tab === TabRoutes.REGISTRATION || tab === TabRoutes.LOGIN)) {
            changeTab(TabRoutes.MAIN);
        }
    }, [login]);

    return (
        <BrowserRouter>
            <div>
                <TabContext value={tab}>
                    <Stack direction="row"
                           spacing={2}
                           sx={{borderBottom: 1, borderColor: 'divider', mt: 1, ml: 1}}>
                        {login && (
                            <>
                                <Chip label={'Текущий пользователь: ' + login}
                                      sx={{ml: 1, mt: 1, mb: 1}}
                                      onDelete={() => setShowLogOut(true)}
                                />

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
                              }}>
                            <Tab label='Главная' value={TabRoutes.MAIN}/>
                            {!login && (<Tab label='Регистрация' value={TabRoutes.REGISTRATION}/>)}
                            {!login && (<Tab label='Вход' value={TabRoutes.LOGIN}/>)}
                            <Tab label='Сервера' value={TabRoutes.SERVERS}/>

                        </Tabs>


                    </Stack>

                    <TabPanel value={TabRoutes.MAIN}>
                        <MainView setTab={(value: TabRoutes) => {
                            changeTab(value);
                        }}/>
                    </TabPanel>
                    <TabPanel value={TabRoutes.REGISTRATION}>
                        <Registration onRegister={name => {
                            setLogin(name);
                            changeTab(TabRoutes.MAIN);
                        }}/>
                    </TabPanel>
                    <TabPanel value={TabRoutes.LOGIN}>
                        <Login onLogin={name => {
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
