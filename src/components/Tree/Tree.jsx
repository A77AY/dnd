import React, {Component, PropTypes} from 'react'
import update from 'react/lib/update'
import {Node} from '_/components'
import {DropTarget, DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const boxTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        component.moveBox(item.id, left, top);
    }
};

@DragDropContext(HTML5Backend)
@DropTarget('box', boxTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
export default class Tree extends Component {
    static propTypes = {
        hideSourceOnDrag: PropTypes.bool.isRequired,
        connectDropTarget: PropTypes.func.isRequired
    };

    styles = {
        width: typeof window === 'undefined' ? 1024 : window.width,
        height: 800,
        borderBottom: '1px solid black',
        position: 'relative'
    };

    state = {
        boxes: {
            'a': {top: 20, left: 80, title: 'Drag me around'},
            'b': {top: 180, left: 20, title: 'Drag me too'}
        }
    };

    moveBox(id, left, top) {
        let node = this.props.tree;
        if (id) {
            const ids = id.split('.');
            for (let i = 1; i < ids.length; ++i) {
                node = (node.and || node.or)[ids[i]];
            }
        }
        node.pos = {
            x: left,
            y: top
        };
        this.forceUpdate();
        // this.setState(update(this.state, {
        //     boxes: {
        //         [id]: {
        //             $merge: {
        //                 left: left,
        //                 top: top
        //             }
        //         }
        //     }
        // }));
    }

    autoResize = (ref) => {
        if (ref) {
            ref.style.height = '5px';
            ref.style.height = ref.scrollHeight + 'px';
        }
    };

    static xNum = 0;

    walkTree(tree, parent = null, id = 0, num = 1, key = 0) {
        let childs;
        if (tree.or) {
            childs = tree.or;
        } else {
            if (!tree.and) {
                tree.and = [];
            }
            childs = tree.and;
        }
        const isChilds = !!childs.length;
        if(!isChilds && tree) {
            tree.xNum = ++Tree.xNum;
        }
        return <div key={key}>
            <Node id={id}
                  left={tree.pos.x}
                  top={tree.pos.y}
                  parentPos={parent ? parent.pos : null}
                  hideSourceOnDrag={this.props.hideSourceOnDrag}
            >
                <div style={{position: 'absolute', top: -50, padding: 20}} className="hide">
                    <span
                        onClick={()=>{childs.push({name: '', pos: {x: 0, y: 0}, x: 0}); this.forceUpdate();}}>Добавить</span>
                    &nbsp;<span onClick={()=>{
                    console.log(parent[parent.and ? 'and' : 'or']);
                    console.log(key);
                    parent[parent.and ? 'and' : 'or'].splice(key, 1);

                    this.forceUpdate();}}>Удалить</span>
                </div>
                {num}
                <br/><textarea ref={ref=>this.autoResize(ref)} onKeyUp={e=>this.autoResize(e.target)}
                               onChange={e=>{tree.name = e.target.value}} defaultValue={tree.name}/><br />
                {isChilds
                    ? <select size="1"
                              onChange={e=>{tree[e.target.value] = childs; delete tree[e.target.value === 'and' ? 'or' : 'and'];}}
                              defaultValue={tree.and ? 'and':'or'}>
                    <option value="and">и</option>
                    <option value="or">или</option>
                </select>
                    : <div>x{tree.xNum} = <input style={{width: 40}} type="text" defaultValue={tree.x} onChange={e=>tree.x = e.target.value}/></div>}

            </Node>
            {childs.map((child, i) => {
                return this.walkTree(child, tree, id + '.' + i, num + '.' + (i+1), i);
            })}
        </div>;
    }

    render() {
        const {hideSourceOnDrag, connectDropTarget} = this.props;
        Tree.xNum = 0;
        return connectDropTarget(
            <div style={this.styles}>
                {this.walkTree(this.props.tree)}
            </div>
        );
    }
}
