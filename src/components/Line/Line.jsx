import React, {Component} from 'react'

export default class Line extends Component {

    static defaultProps = {};

    state = {};

    style = {
        height: 1,
        position: 'absolute',
        backgroundColor: 'gray'
    };

    render() {
        let {from, to} = this.props;
        const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
        const angle = Math.atan(Math.abs(to.y - from.y) / (to.y > from.y ? to.x - from.x : from.x - to.x));
        const middle = {
            x: from.x + (to.x - from.x) / 2,
            y: from.y + (to.y - from.y) / 2
        };
        const style = {
            top: middle.y,
            left: middle.x - length / 2,
            width: length,
            transform: 'rotate(' + angle + 'rad)'
        };
        return (
            <div style={{...this.style, ...style}}></div>
        );
    }

}