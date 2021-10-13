import * as React from "react";

import {Grid, TextField} from "@mui/material";
import {useControlledCookieState} from "../hook/useControlledCookieState";
import {LoadingButton} from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';
import * as api from "../api/1.0";
import {StoreType} from '../types';

interface Props {
  onLogin: (login: string) => void;
  store: StoreType | undefined;
}

export const Login = (props: Props): JSX.Element => {

  const [login, setLogin] = useControlledCookieState('log_login', '');
  const [pass, setPass] = useControlledCookieState('log_pass', '');

  const [loginErr, setLoginErr] = React.useState<string | undefined>(undefined);

  // сбиваю ошибку в логине
  React.useEffect(() => {
    setLoginErr(undefined);
  }, [login]);

  const [sending, setSending] = React.useState(false);

  const onRegister = React.useCallback(() => {
    setSending(true);

    api.get('/login', ['login', login], ['pass', pass], ['token', ''])
      .then(x => {
        if (x.status !== 200) {
          return x.json()
            .then(x => {
              throw new Error(x)
            });
        }

        return x.json();
      })
      .then(x => props.onLogin(login))
      .catch(x => {
        console.log(x);
        setLoginErr('Логин или пароль неверен');
      })
      .finally(() => setSending(false));

  }, [login, pass]);

  return (
    <Grid container
          direction='column'
          justifyContent="flex-start"
          alignItems="left"
          spacing={2}>

      <Grid item xs={6}>
        <TextField required
                   autoComplete='username'
                   defaultValue={login}
                   onChange={e => setLogin(e.target.value)}
                   id='login_field'
                   label='Имя пользователя'
                   error={loginErr !== undefined}
                   helperText={loginErr ?? 'Введите имя пользователя'}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField required
                   type='password'
                   autoComplete='current-password'
                   defaultValue={pass}
                   onChange={e => setPass(e.target.value)}
                   id='password_field'
                   label='Пароль'
                   helperText={'Введите свой пароль'}
        />
      </Grid>

      <Grid item>
        <LoadingButton loading={sending}
                       onClick={onRegister}
                       variant="contained"
                       loadingPosition="end"
                       disabled={!login || !pass}
                       endIcon={<SendIcon/>}
        >
          Войти
        </LoadingButton>
      </Grid>
    </Grid>
  );
}