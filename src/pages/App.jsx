import React from 'react'
import {Logo} from '_/components'

export default class App extends React.Component {

    static title = 'StarJS App';

    render() {
        return (
            <div>
                <article>{this.props.children}</article>
            </div>
        );
    }
}