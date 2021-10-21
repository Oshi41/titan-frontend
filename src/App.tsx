import { TabContext, TabPanel } from '@mui/lab';
import { Avatar, Backdrop, Chip, Divider, Stack, Tab, Tabs } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress/CircularProgress';
import React from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { useControlledCookieState } from './hook/useControlledCookieState';
import { NewsItem, Roles, StoreType, UserAuthType } from './types';
import { getToken, setBearer } from './utils';
import { AddNews } from './view/AddNews';
import { AllCrashesView } from './view/AllCrashesView';
import { CrashCreateView } from './view/CrashCreateView';
import { Login } from './view/Login';
import { MainView } from './view/MainView';
import { ModalDialog } from './view/ModalDialog';
import { Registration } from './view/Registration';
import { ServersView } from './view/ServersView';
import { UsersView } from './view/UsersView';

export enum TabRoutes {
  MAIN = '/main',
  REGISTRATION = '/registration',
  LOGIN = '/login',
  SERVERS = '/servers',
  ADD_NEWS = '/add_news',
  USERS_VIEW = '/users_view',
  CRASH_VIEW = '/crash',
  CRASH_VIEW_ALL = '/crash_all',
}

export const App = (): JSX.Element => {
  let history = useHistory();
  const { location: { pathname } } = history;


  const [ tab, setTab ] = React.useState('');
  const token = getToken();

  const [ loading, setLoading ] = React.useState(false);
  const [ showLogOut, setShowLogOut ] = React.useState(false);

  const changeTab = React.useCallback((t: TabRoutes) => {
    history.push(t);
    setTab(t);
  }, []);

  const tabs = React.useMemo(() => {
    const result: JSX.Element[] = [
      <Tab label="Главная" value={TabRoutes.MAIN} />,
      <Tab label="Сервера" value={TabRoutes.SERVERS} />
    ];

    if (!token?.login) {
      result.push(
        <Tab key={1} label={`Регистрация`} value={TabRoutes.REGISTRATION} />,
        <Tab key={2} label={`Вход`} value={TabRoutes.LOGIN} />
      );
    }

    if (token?.roles?.includes(Roles.CrashReportCreate)) {
      result.push(<Tab key={3} label="Отчеты об ошибках" value={TabRoutes.CRASH_VIEW} />);
    }

    if (token?.roles?.includes(Roles.NewsCreate)) {
      result.push(<Tab key={5} label="Добавление новостей" value={TabRoutes.ADD_NEWS} />);
    }

    if (token?.roles?.includes(Roles.CrashReportView)) {
      result.push(<Tab key={6} label="Просмотр отчетов" value={TabRoutes.CRASH_VIEW_ALL} />);
    }

    if (token?.roles?.includes(Roles.UserView)) {
      result.push(<Tab key={7} label="Пользователи" value={TabRoutes.USERS_VIEW} />);
    }

    return result;
  }, [ token?.login, ]);

  // Исопльзую url навигацию
  // Должна быть первой в очереди!
  React.useEffect(() => {
    let referred = TabRoutes.MAIN;

    // @ts-ignore
    if (Object.values(TabRoutes).map(x => x + '').includes(pathname)) {
      // @ts-ignore
      referred = pathname as TabRoutes;
    }

    if (referred !== tab) {
      changeTab(referred);
    }

  }, [ pathname ]);

  // В случае успешного входа, надо  перейти с не нужных табов
  React.useEffect(() => {

    const result = tabs.map(x => x.props.value);
    if (!result?.includes(tab)) {
      changeTab(TabRoutes.MAIN);
    }
  }, [ tabs ]);

  const avatar = React.useMemo(() => {
    if (!token?.auth) {
      return undefined;
    }

    switch (token.auth) {
      case UserAuthType.Own:
        return <Avatar variant="square"
                       src="https://icons.iconarchive.com/icons/bokehlicia/captiva/256/rocket-icon.png" />;

      case UserAuthType.ElyBy:
        return <Avatar variant="square"
                       src="https://avatars.githubusercontent.com/u/15382302?s=200&v=4" />;
    }

    return undefined;
  }, [ token?.auth ]);

  return (
    <BrowserRouter>
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <TabContext value={tab}>
          <Stack direction="row"
                 spacing={2}
                 sx={{ borderBottom: 1, borderColor: 'divider', mt: 1, ml: 1 }}>
            {token?.login && (
              <>
                <Chip label={'Текущий пользователь: ' + token?.login}
                      avatar={avatar}
                      sx={{ ml: 1, mt: 1, mb: 1 }}
                      onDelete={() => setShowLogOut(true)} />


                <Divider orientation="vertical" flexItem />
              </>
            )}

            <ModalDialog open={showLogOut}
                         close={() => setShowLogOut(false)}
                         onAction={() => setBearer('')}
                         title="Подтверждение"
                         description={`Вы точно хотите выйти из аккаунта ${token?.login}?`}
            />


            <Tabs value={tab}
                  variant="fullWidth"
                  onChange={(e, value: TabRoutes) => {
                    changeTab(value);
                  }}>{tabs}</Tabs>


          </Stack>

          <TabPanel value={TabRoutes.MAIN}>
            <MainView setTab={changeTab} />
          </TabPanel>
          <TabPanel value={TabRoutes.REGISTRATION}>
            <Registration onRegister={name => {
              changeTab(TabRoutes.MAIN);
            }} />
          </TabPanel>
          <TabPanel value={TabRoutes.LOGIN}>
            <Login onLogin={name => {
              changeTab(TabRoutes.MAIN);
            }} />
          </TabPanel>

          <TabPanel value={TabRoutes.SERVERS}>
            <ServersView />
          </TabPanel>

          <TabPanel value={TabRoutes.ADD_NEWS}>
            <AddNews source={{} as NewsItem} />
          </TabPanel>

          <TabPanel value={TabRoutes.CRASH_VIEW}>
            <CrashCreateView />
          </TabPanel>

          <TabPanel value={TabRoutes.CRASH_VIEW_ALL}>
            <AllCrashesView />
          </TabPanel>

          <TabPanel value={TabRoutes.USERS_VIEW}>
            <UsersView />
          </TabPanel>
        </TabContext>
      </div>
    </BrowserRouter>
  );
};
