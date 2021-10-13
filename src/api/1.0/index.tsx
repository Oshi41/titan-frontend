import {getBearer, setBearer} from "../../utils";

export let BaseUrl = '/api/1.0';
const auth_header = 'Authorization';

/**
 * Получаю дефолные заголовки
 */
const getBaseHeaders = (): HeadersInit => {
  const bearer = getBearer();
  if (!bearer) {
    return {};
  }

  return {
    Authorization: bearer
  };
}

/**
 * Обрабатываю ответ от сервера
 * Если прислали Authorization, то выставляю токен
 * @param r - ответ от сервера
 */
const handleResp = (r: Response) => {
  if (r.headers.has(auth_header)) {
    setBearer(r.headers.get(auth_header) ?? '');
  }
}

/**
 * Post с json контентом
 * @param url - URI запроса после api текущей версии
 * @param content - json объект запроса
 */
export const postJson = (url: string, content: any): Promise<Response> => {
  return fetch(BaseUrl + url, {
    body: JSON.stringify(content),
    method: 'POST',
    headers: {
      ...getBaseHeaders(),
      'Accept': 'text/html, application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(value => {
      handleResp(value);
      return value;
    });
}

/**
 * GET запрос с параметрами
 * @param url - URI запроса после api текущей версии
 * @param params - query параметры запроса
 */
export const get = (url: string, ...params: [string, string][]): Promise<Response> => {
  if (params?.length > 0) {
    const qPrams: URLSearchParams = new URLSearchParams(params);
    url += '?' + qPrams.toString();
  }

  return fetch(BaseUrl + url, {
    headers: getBaseHeaders()
  })
    .then(value => {
      handleResp(value);
      return value;
    });
}

// /**
//  * Читаю контент и возвращаю текст
//  * @param stream
//  */
// export const readText = async (stream: ReadableStream): Promise<string> => {
//   let reader = stream.getReader();
//   let utf8Decoder = new TextDecoder();
//   let nextChunk;
//   let resultStr: string = '';
//
//   while (!(nextChunk = await reader.read()).done) {
//     let partialData = nextChunk.value;
//     resultStr += utf8Decoder.decode(partialData);
//   }
//
//   return resultStr;
// }