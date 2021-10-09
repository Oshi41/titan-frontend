import LoginIcon from '@mui/icons-material/Login';
import SendIcon from '@mui/icons-material/Send';
import {LoadingButton} from "@mui/lab";
import {Grid, InputAdornment, TextField} from "@mui/material";
import * as React from 'react';
import {useCookieState} from "use-cookie-state";
import * as api from "../api/1.0";
import {TabRoutes} from "../App";
import {useControlledCookieState} from "../hook/useControlledCookieState";
import {ModalDialog} from "./ModalDialog";

interface Props {
    onRegister: (login: string) => void;
}

export const Registration = (props: Props): JSX.Element => {

    const [free, setFree] = React.useState<boolean | undefined>(undefined);
    const [isBusyLogin, setIsBusyLogin] = React.useState<boolean | undefined>(undefined);

    const [login, setLogin] = useControlledCookieState('titan_register_login', '');
    const [pass, setPass] = useControlledCookieState('titan_register_pass', '');
    const [pass2, setPass2] = useControlledCookieState('titan_register_pass2', '');
    const [registeredLogin, setRegisteredLogin] = useControlledCookieState('titan_login', '');

    const [passError, setPassError] = React.useState<string | undefined>(undefined);
    const [passError2, setPassError2] = React.useState<string | undefined>(undefined);

    const [sendRegister, setSendRegister] = React.useState(false);
    const [regCompleted, setRegCompleted] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        setFree(undefined);
    }, [login]);

    React.useEffect(() => {
        setPassError(getError(pass));
    }, [pass]);

    React.useEffect(() => {
        let result: string | undefined = undefined;
        if (pass2 && pass2 !== pass) {
            result = 'Пароли не совпадают'
        }

        setPassError2(result);
    }, [pass, pass2]);

    const onCheckBusy = React.useCallback(() => {
        setIsBusyLogin(false);
        setFree(undefined);

        api.get('/busy', ['login', login])
            .then(x => x.text())
            .then(x => {
                switch (x) {
                    case 'busy':
                        setFree(false);
                        return;

                    case 'free':
                        setFree(true);
                        return;

                    default:
                        throw new Error(x);
                }
            })
            .catch(x => {
                console.log('Error: ' + x);
                setFree(undefined);
            })
            .finally(() => {
                setIsBusyLogin(undefined);
            });
    }, [login]);

    const onRegister = React.useCallback(() => {
        setSendRegister(true);

        api.postJson('/register', {
            login,
            pass
        }).then(x => {
            if (x.status !== 200) {
                setRegCompleted(false);
                return x.text().then(x => {
                    throw new Error(x)
                });
            }

            return x.text();
        }).then(x => {
            setRegCompleted(true);
            props.onRegister(login);
            setLogin('');
            setPass('');
            setPass2('');
        })
            .catch(x => {
                console.log(x);
                setRegCompleted(false);
            })
            .finally(() => setSendRegister(false));
    }, [login, pass]);

    const cantRegister: boolean = (free === false
        || !login
        || !pass
        || !pass2
        || passError
        || passError2) as boolean;

    React.useEffect(() => {

    }, []);


    return (
        <Grid container
              direction='column'
              justifyContent="flex-start"
              alignItems="left"
              spacing={2}>

            <Grid item xs={6}>
                <TextField required
                           autoComplete='nickname'
                           defaultValue={login}
                           onChange={e => setLogin(e.target.value)}
                           id='login_field'
                           label='Имя пользователя'
                           helperText={free === false ? 'Это имя уже занято' : 'Это имя пользователя затем будет использовано в лаунчере'}
                           error={free === false}
                           InputProps={{
                               endAdornment: <InputAdornment position='end'>
                                   <LoadingButton loading={isBusyLogin === true}
                                                  onClick={onCheckBusy}
                                                  variant='text'
                                                  endIcon={<LoginIcon
                                                      color={free ? 'success' : free === false ? 'error' : 'inherit'}/>}
                                   />
                               </InputAdornment>
                           }}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField required
                           type='password'
                           defaultValue={pass}
                           autoComplete='new-password'
                           onChange={e => setPass(e.target.value)}
                           id='password_field'
                           label='Пароль'
                           helperText={passError ?? 'Этот пароль будет использован в лаунчере'}
                           error={passError !== undefined}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField required
                           type='password'
                           defaultValue={pass2}
                           autoComplete='new-password'
                           onChange={e => setPass2(e.target.value)}
                           id='password_field'
                           label='Повторите пароль'
                           helperText={passError2 ?? 'Этот пароль должен совпадать с введенным выше'}
                           error={passError2 !== undefined}
                />
            </Grid>

            <Grid item>
                <LoadingButton loading={sendRegister}
                               onClick={onRegister}
                               variant="contained"
                               loadingPosition="end"
                               disabled={cantRegister}
                               endIcon={<SendIcon/>}
                >
                    Зарегестрироваться
                </LoadingButton>
            </Grid>

            <ModalDialog open={regCompleted === false}
                         close={() => setRegCompleted(undefined)}
                         onAction={() => setRegCompleted(undefined)}
                         title={'Ошибка регистрации'}
                         description={'Произошла какая-то ошибка. На всякий случай, перед регистрацией проверьте имя пользователя на уникальность (кнопка в правой части поля ввода)'}
                         okText='Понял'
                         denyText='Закрыть'
            />
        </Grid>
    )
}

/**
 * Валидирую пароль
 * @param pass
 */
const getError = (pass: string) => {
    if (!pass)
        return undefined;

    if (pass.length < 5) {
        return 'Пароль должен содержать как минимум 5 символов';
    }

    return undefined;
}