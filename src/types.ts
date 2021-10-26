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
 * Описание мода
 */
export interface ModInfo {
  /**
   * ID мода
   */
  modid: string;

  /**
   * Wiki страница
   */
  page: string;

  /**
   * Описание
   */
  desc: string;
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
    modList: ModInfo [];
  };
  latency: number;
}

/**
 * Доп инфа для своих серверов
 */
export interface ExtraServerInfo {
  /**
   * адрес сервера
   */
  address: string;

  /**
   * HTML виджет для статистики
   */
  htmlWidget: string;
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
  //
  // CRUD для таблицы пользователей
  // + View привилегия
  //
  UserView = 'user_v',
  UserCreate = 'user_c',
  UserEdit = 'user_e',
  UserDelete = 'user_d',

  //
  // CRUD для таблицы новостей
  //
  NewsCreate = 'news_c',
  NewsEdit = 'news_u',
  NewsDelete = 'news_d',

  //
  // Для таблицы crash reports
  //
  CrashReportView = 'crash_v',
  CrashReportCreate = 'crash_c',
  CrashReportDelete = 'crash_d',

  Comment = 'comment',
}

export const RolesNames = new Map<Roles, string>([
  [Roles.UserView, 'Просмотр пользователей'],
  [Roles.UserCreate, 'Создание пользователей'],
  [Roles.UserEdit, 'Редактирование пользователей'],
  [Roles.UserDelete, 'Удаление пользователей'],

  [Roles.NewsCreate, 'Создание новостей'],
  [Roles.NewsEdit, 'Редактирование новостей'],
  [Roles.NewsDelete, 'Удаление новостей'],

  [Roles.CrashReportView, 'Просмотр отчетов об ошибке'],
  [Roles.CrashReportCreate, 'Создание отчета об ошибке'],
  [Roles.CrashReportDelete, 'Удаление отчетов об ошибке'],

  [Roles.Comment, 'Комментарии'],
])

/**
 * Представление новости
 */
export interface NewsItem {
  /**
   * Уникальная 16-сивольная строка
   */
  _id: string;

  /**
   * Автор новости
   */
  author: string;

  /**
   * Дата создания
   */
  date: Date;

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
  image64: string;
}

/**
 * Описание пользователя
 */
export interface UserInfo {
  /**
   * Уникальный ID пользователя
   */
  _id: string;

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

  /**
   * Список ролей
   */
  roles: Roles[];

  /**
   * Входит ли в белый список
   */
  whitelisted?: boolean;
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