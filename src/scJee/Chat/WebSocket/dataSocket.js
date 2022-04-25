import { appConfig } from '../../../app/ConfigJeePlatform';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'

var connection = '';

function ChatMessage() {
    let URL = `${appConfig.domainJeeChat}hubs/message`;
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

const dataSocket = {
    connection: reTurnConnect,
    ChatMessage
}
export default dataSocket