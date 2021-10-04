import * as React from 'react';
import cookie from "cookie";

function getCookieValue(key: string, cookies: string, defaultValue: string) {
    const value = cookie.parse(cookies || "");

    return value[key] ?? defaultValue;
};

/**
 * Хук для работы с cookie
 * @param key - ключ к cookie
 * @param init - начальное значение
 */
export const useControlledCookieState = <T = string>(key: string, init: T): [T, ((value: (((prevState: T) => T) | T)) => void)] => {
    const getInitialValue = () => {
        // if we on the server just use an initial value
        if (typeof window === "undefined") return init;

        // otherwise get initial cookie value from `document.cookies`
        return getCookieValue(key, document.cookie, init + '') as unknown as T;
    };

    const current = getInitialValue();

    const [val, setVal] = React.useState(current);

    React.useEffect(() => {
        setVal(current);
    }, [current]);

    const onChange = <T>(args: ((prevState: T) => T) | T) => {
        let result: T;

        if (typeof args === 'function') {
            // @ts-ignore
            result = args(val);
        } else {
            result = args;
        }

        // @ts-ignore
        setVal(result);
        document.cookie = cookie.serialize(key, result as unknown as string);
    };

    return [val, onChange];
}