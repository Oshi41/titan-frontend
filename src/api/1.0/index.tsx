export let BaseUrl = '';
const apiVersion = '/api/1.0';

/**
 * Устанавливаю правильный адрес (при первом запуске!)
 */
export const initialize = () => {
    if (BaseUrl){
        return;
    }

    fetch('https://geolocation-db.com/json')
      .then(x => {
          console.log(x);
          if (x.status !== 200){
              throw new Error('Wrong answer');
          }
          return x.json();
      })
      .then((x: {IPv4: string}) => {
          console.log(x);
          BaseUrl = `http://${x.IPv4}` + apiVersion;
      })
      .catch(x => console.log(x));
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
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        }
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

    return fetch(BaseUrl + url);
}

/**
 * Читаю контент и возвращаю текст
 * @param stream
 */
export const readText = async (stream: ReadableStream): Promise<string> => {
    let reader = stream.getReader();
    let utf8Decoder = new TextDecoder();
    let nextChunk;
    let resultStr: string = '';

    while (!(nextChunk = await reader.read()).done) {
        let partialData = nextChunk.value;
        resultStr += utf8Decoder.decode(partialData);
    }

    return resultStr;
}