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