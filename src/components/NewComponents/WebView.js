import React, { Component } from 'react';
import {
    Platform
} from 'react-native';
import { WebView, WebViewProps } from 'react-native-webview';


export default class WebViewCom extends Component<WebViewProps> {
    constructor(props) {
        super(props);
        this.countOnHeight = 0;
        this.state = {
            webViewHeight: 40
        }
    };

    _onWebViewMessage = (event: WebViewMessageEvent) => {
        if (this.countOnHeight == 1)
            return;
        this.countOnHeight++;
        this.setState({ webViewHeight: Number(event.nativeEvent.data * 0.41) })
    }

    render() {
        var { style = {}, source, fontSize = 26, limitedLine } = this.props;
        // vd: limitedLine = 4 giới hạn hiển thị số dòng text trong webview
        if (Platform.OS == 'android')
            fontSize = fontSize * 1.15;
        fontSize = 1.3281472327365 * fontSize;
        var html = source.html;
        if (html) {
            html = `<body><style>
            * {
                font-size: ${fontSize}px;
                font-family: 'Helvetica Neue';
                padding-bottom: 4px;
            }
        </style><div style="overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        ${limitedLine ? ` -webkit-line-clamp: ${limitedLine}; ` : ''}
        -webkit-box-orient: vertical;" id='divBody'>${html}</div></body>`;
            source.html = html;
        }

        return (
            <WebView
                onMessage={this._onWebViewMessage}
                injectedJavaScript={`
                window.ReactNativeWebView.postMessage(document.getElementById("divBody").scrollHeight)`}
                // scalesPageToFit={false}
                {...this.props}
                source={{ ...source }}
                style={[{ height: this.state.webViewHeight }, style]}
            />
        );
    }
}