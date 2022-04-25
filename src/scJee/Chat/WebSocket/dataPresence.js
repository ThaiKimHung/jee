import { appConfig } from '../../../app/ConfigJeePlatform';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'

var connection = '';

function Presence() {
    let URL = `${appConfig.domainJeeChat}hubs/presence`;
    connection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        .withUrl(URL, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        }).withAutomaticReconnect()
        .build()
}
const reTurnConnect = () => {
    return connection;
}

const dataPresence = {
    connectionPresence: reTurnConnect,
    Presence
}
export default dataPresence