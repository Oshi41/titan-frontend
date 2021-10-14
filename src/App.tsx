import {TabContext, TabPanel} from '@mui/lab';
import {Avatar, Backdrop, Chip, Divider, Stack, Tab, Tabs} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import React from 'react';
import {BrowserRouter, useHistory} from 'react-router-dom';
import {useControlledCookieState} from "./hook/useControlledCookieState";
import {NewsItem, Roles, StoreType, UserAuthType} from './types';
import {getToken, setBearer} from "./utils";
import {AddNews} from "./view/AddNews";
import {AllCrashesView} from "./view/AllCrashesView";
import {CrashView} from "./view/CrashView";
import {Login} from "./view/Login";
import {MainView} from "./view/MainView";
import {ModalDialog} from "./view/ModalDialog";
import {Registration} from "./view/Registration";
import {ServersView} from "./view/ServersView";
import {UsersEdit} from "./view/UsersEdit";

export enum TabRoutes {
  MAIN = '/main',
  REGISTRATION = '/registration',
  LOGIN = '/login',
  SERVERS = '/servers',
  ADD_NEWS = '/add_news',
  USERS_EDIT = '/users_edit',
  CRASH_VIEW = '/crash',
  CRASH_VIEW_ALL = '/crash_all',
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

    if ((!token?.login || !token.roles.includes(Roles.Moderator)) && (tab === TabRoutes.ADD_NEWS || tab === TabRoutes.USERS_EDIT)) {
      changeTab(TabRoutes.MAIN);
    }

  }, [token?.login]);

  const tabs = React.useMemo(() => {
    const result: JSX.Element[] = [<Tab label='Главная' value={TabRoutes.MAIN}/>];
    result.push(<Tab label='Сервера' value={TabRoutes.SERVERS}/>);

    const add = storeType === 'ely.by'
      ? 'Ely.by'
      : '';

    if (!token?.login) {
      result.push(
        <Tab label={`Регистрация ${add}`} value={TabRoutes.REGISTRATION}/>,
        <Tab label={`Вход ${add}`} value={TabRoutes.LOGIN}/>
      );
    } else {
      result.push(<Tab label='Отчеты об ошибках' value={TabRoutes.CRASH_VIEW}/>);
    }


    if (token?.roles?.includes(Roles.Moderator)) {
      result.push(<Tab label='Добавление новостей' value={TabRoutes.ADD_NEWS}/>);
      result.push(<Tab label='Просмотр отчетов' value={TabRoutes.CRASH_VIEW_ALL}/>);

      // result.push(<Tab label='Редактор пользователей' value={TabRoutes.USERS_EDIT}/>);
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

          <TabPanel value={TabRoutes.ADD_NEWS}>
            <AddNews source={{} as NewsItem}/>
          </TabPanel>

          <TabPanel value={TabRoutes.USERS_EDIT}>
            <UsersEdit/>
          </TabPanel>

          <TabPanel value={TabRoutes.CRASH_VIEW}>
            <CrashView/>
          </TabPanel>

          <TabPanel value={TabRoutes.CRASH_VIEW_ALL}>
            <AllCrashesView/>
          </TabPanel>
        </TabContext>
      </div>
    </BrowserRouter>
  );
};
