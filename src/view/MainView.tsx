import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {Button, Grid, Typography} from "@mui/material";
import * as React from 'react';
import {BaseUrl} from '../api/1.0';
import {TabRoutes} from '../App';
import {Roles, StoreType} from '../types';
import {getToken} from "../utils/index";
import {NewsFeed} from "./NewsFeed";

interface Props {
  setTab: (tab: TabRoutes) => void;
  store: StoreType | undefined;
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

    <Grid container direction='row'>
      <Grid item xs={true}>
        <NewsFeed managing={token?.roles?.includes(Roles.Moderator) === true}/>
      </Grid>

      <Grid item sx={{minWidth: 300, maxWidth: 500}}>
        <Grid container
              item
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

          {!token?.login && (
            <Grid item>
              <Button variant="contained"
                      onClick={() => props.setTab(TabRoutes.LOGIN)}
                      sx={{fontSize: 18}}
                      endIcon={<FingerprintIcon/>}>
                Войти
              </Button>
            </Grid>
          )}

          {!token?.login && (
            <Grid item>
              <Button variant="contained"
                      onClick={() => props.setTab(TabRoutes.REGISTRATION)}
                      sx={{fontSize: 18}}
                      endIcon={<PermIdentityIcon/>}>
                Зарегистрироваться
              </Button>
            </Grid>
          )}

          {token?.login && (
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
      </Grid>
    </Grid>
  );
}