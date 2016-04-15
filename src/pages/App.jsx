import React from 'react'
import {Logo} from '_/components'
import Home from './Home/Home.jsx'

export default class App extends React.Component {

    static title = 'StarJS App';

    render() {
        return (
            <div>
                <article><Home/></article>
            </div>
        );
    }
}