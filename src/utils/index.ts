import Cookies from "js-cookie";
import {WebToken} from "../types";

const bearer_name = 'access_token';

/**
 * Возаращает текущий токен
 */
export const getBearer = (): string => {
  return Cookies.get(bearer_name) ?? '';
};

/**
 * Выставляем токен
 * @param s
 */
export const setBearer = (s: string) => {
  if (s) {
    Cookies.set(bearer_name, s);
  } else {
    Cookies.remove(bearer_name);
  }
};

/**
 * Получаю контент токена
 */
export const getToken = (): WebToken | undefined => {
  let token = getBearer();
  if (token) {
    try {
      token = token.replace('Bearer ', '');
      const payload = token.split('.')[1];
      const json = atob(payload);
      return JSON.parse(json);
    } catch (e) {
      console.log(e);
    }
  }

  return undefined;
}