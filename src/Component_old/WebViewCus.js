import React, { Component } from 'react';
import {
    Platform
} from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview'
import { WebViewProps } from 'react-native-webview';


export default class WebViewCus extends Component<WebViewProps> {
    constructor(props) {
        super(props);
    };

    render() {
        var { style = {}, source, fontSize = 18 } = this.props;
        if (Platform.OS == 'android')
            fontSize = fontSize * 1.1;
        fontSize = 1.3281472327365 * fontSize;
        var html = source.html;
        if (html) {
            html = `<body>
            <style>
            * {
                font-family: 'Helvetica Neue';
            }
            .phieuluong_title {
                text-align: center;
                color: black;
                font-size: 16pt;
                font-weight: bold;
                border: 1px solid black;
                border-style: dotted;
            }
        
            .csscong {
                color: blue;
                height: 20px;
                font-size: 12pt;
            }
        
         .csscong0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .csscong1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
           .csskhoancong {
                color: rgb(22, 168, 80);
                height: 20px;
                background-color: #f0f0f0;
                font-size: 12pt;
                font-weight: bold;
            }
    
            .csskhoancong0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .csskhoancong1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
            .csstongtru {
                color: red;
                height: 20px;
                background-color: #f0f0f0;
                font-size: 12pt;
                font-weight: bold;
            }
        
            .csstongtru0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
           .csstongtru1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
            .cssthuclanh {
                color: rgb(22, 168, 80);
                height: 20px;
                background-color: #f0f0f0;
                font-size: 12pt;
                font-weight: bold;
            }
        
           .cssthuclanh0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
           .cssthuclanh1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        
            .cssthongtin {
                color: black;
                height: 20px;
                font-size: 12pt;
            }
        
            .cssthongtin0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .cssthongtin1 {
                border: 1px solid black;
                text-align: left;
                font-weight: bold;
                padding-left: 5px;
                border-style: dotted;
            }
        
           .csstru {
                color: orangered;
                height: 20px;
                font-size: 12pt;
            }
        
            .csstru0 {
                border: 1px solid black;
                padding-left: 5px;
                border-style: dotted;
            }
        
            .csstru1 {
                border: 1px solid black;
                text-align: right;
                padding-right: 5px;
                border-style: dotted;
            }
        </style><div id='divBody'>${html}</div></body>`;
            source.html = html;
        }
        return (
            <AutoHeightWebView
                scalesPageToFit={false}
                {...this.props}
                source={{ ...source }}
                style={{ width: '100%', ...style }}
            />
        );
    }
}
