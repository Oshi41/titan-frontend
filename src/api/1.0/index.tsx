const baseUrl = 'http://localhost:5001/api/1.0';

/**
 * Post с json контентом
 * @param url - URI запроса после api текущей версии
 * @param content - json объект запроса
 */
export const postJson = (url: string, content: any): Promise<Response> => {
    return fetch(baseUrl + url, {
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

    return fetch(baseUrl + url);
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