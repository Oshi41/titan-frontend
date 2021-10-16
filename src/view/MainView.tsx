import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {Button, Grid, Stack, Typography} from "@mui/material";
import * as React from 'react';
import {BaseUrl} from '../api/1.0';
import {TabRoutes} from '../App';
import {Roles, StoreType} from '../types';
import {getToken} from "../utils/index";
import {NewsFeed} from "./NewsFeed";

interface Props {
  setTab: (tab: TabRoutes) => void;
}

export const MainView = (props: Props): JSX.Element => {

  const token = getToken();

  const onClick = React.useCallback(() => {
    const filename = 'Titan Launcher.jar';
    const a = document.createElement("a");
    a.href = BaseUrl + '/download?' + new URLSearchParams([['file', filename]]).toString();
    a.setAttribute("download", filename);
    a.click();
  }, []);

  return (
    <Stack direction='column'
           spacing={2}>
      <Typography sx={{fontSize: 24}} gutterBottom>
        Добро пожаловать на проект Titan!
      </Typography>

      {!token?.login && (
        <Button variant="contained"
                onClick={() => props.setTab(TabRoutes.LOGIN)}
                sx={{fontSize: 18, maxWidth: 300}}
                endIcon={<FingerprintIcon/>}>
          Войти
        </Button>
      )}

      {!token?.login && (
        <Button variant="contained"
                onClick={() => props.setTab(TabRoutes.REGISTRATION)}
                sx={{fontSize: 18, maxWidth: 300}}
                endIcon={<PermIdentityIcon/>}>
          Зарегистрироваться
        </Button>
      )}

      {token?.login && (
        <Button variant="contained"
                onClick={onClick}
                sx={{fontSize: 18, maxWidth: 300}}
                endIcon={<SportsEsportsIcon/>}>
          Скачать лаунчер
        </Button>
      )}

      <NewsFeed canDelete={token?.roles?.includes(Roles.NewsDelete) === true}/>
    </Stack>
  );
}