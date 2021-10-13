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
import {NewsItem, Roles, StoreType, UserAuthType} from './types';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import {getToken, setBearer} from "./utils";
import { NewsEdit } from "./view/NewsEdit";
import {UsersEdit} from "./view/UsersEdit";

export enum TabRoutes {
  MAIN = '/main',
  REGISTRATION = '/registration',
  LOGIN = '/login',
  SERVERS = '/servers',
  NEWS_EDIT = '/news_edit',
  USERS_EDIT = '/users_edit',
}

export const App = (): JSX.Element => {
  let history = useHistory();

  const [tab, setTab] = useControlledCookieState<TabRoutes>('titan_tab', TabRoutes.MAIN);
  const [storeType, setStoreType] = React.useState<StoreType | undefined>('sqlite');
  const token = getToken();

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
    if (token?.login && (tab === TabRoutes.REGISTRATION || tab === TabRoutes.LOGIN)) {
      changeTab(TabRoutes.MAIN);
    }
  }, [token?.login]);

  const tabs = React.useMemo(() => {
    const result: JSX.Element[] = [<Tab label='Главная' value={TabRoutes.MAIN}/>];

    const add = storeType === 'ely.by'
      ? 'Ely.by'
      : '';

    if (!token?.login) {
      result.push(
        <Tab label={`Регистрация ${add}`} value={TabRoutes.REGISTRATION}/>,
        <Tab label={`Вход ${add}`} value={TabRoutes.LOGIN}/>
      );
    }


    result.push(<Tab label='Сервера' value={TabRoutes.SERVERS}/>);

    if (token?.roles?.includes(Roles.Moderator)) {
      result.push(<Tab label='Редактор новостей' value={TabRoutes.NEWS_EDIT}/>);
      result.push(<Tab label='Редактор пользователей' value={TabRoutes.USERS_EDIT}/>);
    }
    return result;
  }, [token?.login, storeType]);

  const avatar = React.useMemo(() => {
    if (!token?.auth) {
      return undefined;
    }

    switch (token.auth) {
      case UserAuthType.Own:
        return <Avatar>own</Avatar>;

      case UserAuthType.ElyBy:
        return <Avatar variant='square'
                       src='https://avatars.githubusercontent.com/u/15382302?s=200&v=4'/>;
    }

    return undefined;
  }, [storeType, token?.auth]);

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
            {token?.login && (
              <>
                <Chip label={'Текущий пользователь: ' + token?.login}
                      avatar={avatar}
                      sx={{ml: 1, mt: 1, mb: 1}}
                      onDelete={() => setShowLogOut(true)}/>


                <Divider orientation="vertical" flexItem/>
              </>
            )}

            <ModalDialog open={showLogOut}
                         close={() => setShowLogOut(false)}
                         onAction={() => setBearer('')}
                         title='Подтверждение'
                         description={`Вы точно хотите выйти из аккаунта ${token?.login}?`}
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
              changeTab(TabRoutes.MAIN);
            }}/>
          </TabPanel>
          <TabPanel value={TabRoutes.LOGIN}>
            <Login store={storeType}
                   onLogin={name => {
                     changeTab(TabRoutes.MAIN);
                   }}/>
          </TabPanel>

          <TabPanel value={TabRoutes.SERVERS}>
            <ServersView/>
          </TabPanel>

          <TabPanel value={TabRoutes.NEWS_EDIT}>
            <NewsEdit source={{} as NewsItem}/>
          </TabPanel>

          <TabPanel value={TabRoutes.USERS_EDIT}>
            <UsersEdit/>
          </TabPanel>

        </TabContext>
      </div>
    </BrowserRouter>
  );
};
