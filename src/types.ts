/**
 * Описание сервера от обычного запроса
 */
export interface ServerInfo {
  servericon: string;
  ip: string;
  port: number;
  debug: {
    ping: any;
    query: any;
    srv: any;
    querymismatch: any;
    ipinsrv: any;
    cnameinsrv: any;
    animatedmotd: any;
    cachetime: any;
    apiversion: string;
  };
  motd: {
    raw: string[];
    clean: string[];
    html: string[];
  };
  players: {
    online: number;
    max: number;
  };
  version: string;
  online: boolean;
  protocol: number;
  hostname: string;
}

/**
 * Описание forge сервера
 */
export interface ForgeInfo {
  description: string;
  players: {
    max: number;
    online: number;
    sample: { id: string, name: string }[];
  };
  version: {
    name: string;
    protocol: number;
  };
  modinfo: {
    type: string;
    modList: { modid: string, version: string }[];
  };
  latency: number;
}

/**
 * Доп инфа для своих серверов
 */
export interface ExtraServerInfo {

}

/**
 * Полное описание сервера
 */
export interface ServerDesciption {
  server: ServerInfo,
  forge: ForgeInfo,
  extra: ExtraServerInfo,
}

/**
 * Тип хранилища
 */
export type StoreType = 'sqlite' | 'ely.by';

/**
 * Токен пользователя
 */
export interface WebToken {
  /**
   * Поле из Users
   */
  login: string;

  /**
   * Поле из Users
   */
  id: string;

  /**
   * Тип аутентификации юзера
   */
  auth: UserAuthType;

  /**
   * Список ролей
   */
  roles: Roles[];
}

/**
 * Тип аутентифицированного клиента
 */
export enum UserAuthType {
  Own = 'own',
  ElyBy = 'elyby',
}

/**
 * Возможные типы данных
 */
export enum Roles {
  Moderator = 'moderator',
  Comment = 'comment',
}

/**
 * Представление новости
 */
export interface NewsItem {
  /**
   * uuid новости
   */
  id: string;

  /**
   * Автор новости
   */
  author: string;

  /**
   * Дата создания
   */
  date: string;

  /**
   * Заголовок новости
   */
  name: string;

  /**
   * Текст новости (в формате HTML)
   */
  html: string;

  /**
   * изображение
   */
  image: Blob;
}

/**
 * Описание пользователя
 */
export interface SqlUser {
  /**
   * Логин
   */
  login: string;

  /**
   * Пароль
   */
  pass: string;

  /**
   * UUID пользователя
   */
  uuid: string;

  /**
   * токен доступа
   */
  access: string;

  /**
   * Сервер
   */
  server?: string;

  /**
   * IP регистрации
   */
  ip?: string;
}

/**
 * Описание краш репорта
 */
export interface Report {
  login: string;
  date: string;
  comment: string;
  content: string;
  file: string;
}