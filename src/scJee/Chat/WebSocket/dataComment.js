import { appConfig } from '../../../app/ConfigJeePlatform';
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr'

var connection = '';

function Comment() {
    let URL = `${appConfig.domainJeeComment}hub/comment`;
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

const dataComment = {
    connectionComment: reTurnConnect,
    Comment
}
export default dataComment