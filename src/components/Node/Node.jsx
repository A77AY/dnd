import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import {Line} from '_/components'

const boxSource = {
    beginDrag(props) {
        const {id, left, top} = props;
        return {id, left, top};
    }
};

@DragSource('box', boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class Node extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        hideSourceOnDrag: PropTypes.bool.isRequired,
        children: PropTypes.node
    };

    style = {
        position: 'absolute',
        border: '1px dashed gray',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        cursor: 'move',
        zIndex: 100
    };

    render() {
        const {hideSourceOnDrag, left, top, connectDragSource, isDragging, children, parentPos} = this.props;
        if (isDragging && hideSourceOnDrag) {
            return null;
        }

        return <div className="base">
            {parentPos ? <Line from={{x: parentPos.x, y: parentPos.y}} to={{x: left, y: top}}/> : ''}
            {connectDragSource(
                <div style={{ ...this.style, left, top }}>
                    {children}
                </div>
            )}
        </div>;
    }
}