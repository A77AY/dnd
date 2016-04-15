import React from 'react'
import cfg from '../../cfg/server'

export default class Template extends React.Component {

    getMarkup = () => {
        return {__html: this.props.markup};
    };

    render() {
        return (
            <html>
            <head>
                <title>{this.props.title}</title>
                <style>{
                    `.hide {
                        display: none;
                    }
                    .base:hover .hide {
                        display: block;
                    }`
                }</style>
            </head>
            <body style={{
                padding: 0,
                margin: 0
            }}>
            <div id="app" dangerouslySetInnerHTML={this.getMarkup()}/>
            <script
                src={'http://' + cfg.builder.client.watchServer.host + ':' + cfg.builder.client.watchServer.port + '/' + cfg.structure.client.fileName}></script>
            </body>
            </html>
        );
    }

}