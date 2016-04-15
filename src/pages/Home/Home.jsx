import React, {Component} from 'react'
import {Tree} from '_/components'

class Node {
    constructor(name = '', x = null, xNum = null, type = null, nodes) {
        this.name = name;
        this.type = type;
        this.x = x;
        this.xNum = xNum;
        this.xName = <span>x<sub>{this.xNum}</sub></span>;
        this.nodes = [];
        if (!nodes) return;
        for (let i = 0; i < nodes.length; ++i) {
            this.nodes[i] = typeof nodes[i] === 'string'
                ? new Node(nodes[i])
                : nodes[i];
        }
    }

    static or(name, ...nodes) {
        return new Node(name, null, null, 'or', nodes);
    }

    static and(name, ...nodes) {
        return new Node(name, null, null, 'and', nodes);
    }

    static x(xNum, x, name = '') {
        return new Node(name, x, xNum);
    }

    kpof() {
        if (!this.type) {
            return this;
        }
        let result = [];
        if (this.type === 'and') {
            result.push([]);
            for (let i = 0; i < this.nodes.length; ++i) {
                const childKpof = this.nodes[i].kpof(false);
                if (Object.prototype.toString.call(childKpof) === '[object Object]') {
                    for (let j = 0; j < result.length; ++j) {
                        result[j].push(childKpof);
                    }
                } else {
                    const oldresult = [...result];
                    result = [];
                    for (let j = 0; j < oldresult.length; ++j) {
                        for (let k = 0; k < childKpof.length; ++k) {
                            result.push([...oldresult[j], childKpof[k]]);
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.nodes.length; ++i) {
                const childKpof = this.nodes[i].kpof(false);
                if (Object.prototype.toString.call(childKpof) === '[object Object]') {
                    result.push(childKpof);
                } else {
                    result.push(...childKpof);
                }
            }
        }
        for (let i = 0; i < result.length; ++i) {
            if (Object.prototype.toString.call(result[i]) === '[object Object]') result[i] = [result[i]];
        }
        return result;
    }

    fStr() {
        const kpof = this.kpof();
        let kpofStr = [];
        for (let i = 0; i < kpof.length; ++i) {
            if (kpof[i].length !== 1) kpofStr.push('(');
            kpofStr.push(kpof[i].map((item, j, arr)=> {
                return <span key={j}>{item.xName}{j === arr.length - 1 ? '' : '∩'}</span>;
            }));
            if (kpof[i].length !== 1) kpofStr.push(')');
            if (i !== kpof.length - 1) kpofStr.push('∪');
        }
        return <span>f({this.xes()}) = {kpofStr}</span>;
    }

    p() {
        const kpof = this.kpof();
        let result = 1;
        for (let i = 0; i < kpof.length; ++i) {
            let currentP = 1;
            for (let j = 0; j < kpof[i].length; ++j) {
                currentP *= kpof[i][j].x;
            }
            result *= 1 - currentP;
        }
        return 1 - result;
    }

    xes() {
        if (this.x !== null) return this.xName;
        let result = [];
        for (let i = 0; i < this.nodes.length; ++i) {
            result.push(this.nodes[i].xes());
            result.push(', ');
        }
        result.pop();
        return result;
    }

    // xName() {
    //     return <span>x<sub>{this.xNum}</sub></span>;
    // }

    getTree(parent = null) {
        let node = {
            name: (this.type ? this.type === 'or' ? 'ИЛИ, ' : 'И, ' : '') + (this.xNum ? 'x' + this.xNum + '=' + Math.round(this.x * 100) / 100 + ', ' : '') + (this.name.length > 17 ? this.name.substr(0, 17) + '..' : this.name),
            parent: parent ? parent.name : 'null'
        };
        if (this.nodes !== null) {
            node.children = [];
            for (let i = 0; i < this.nodes.length; ++i) {
                node.children.push(this.nodes[i].getTree(this));
            }
        }
        return node;
    }

    static generate(tree) {
        let type = null;
        let childNodes = [];
        if (tree.or) {
            type = 'or';
            childNodes = tree.or;
        } else if (tree.and) {
            type = 'and';
            childNodes = tree.and;
        }
        if (childNodes.length === 0) {
            type = null;
        }
        let nodes = [];
        if (childNodes)
            for (let i = 0; i < childNodes.length; ++i) {
                nodes.push(Node.generate(childNodes[i]));
            }
        return new Node(tree.name || '', tree.x || null, tree.xNum || null, type, nodes);
    }
}

export default class Home extends Component {

    static title = 'Логико-вероятностный метод';

    state = {
        tree: {"name":"Нарушение информационной системы ЛОЦМАН","pos":{"x":620,"y":52}},
        lpmTree: null
    };

    create = (tree) => {
        this.setState({lpmTree: Node.generate(tree)});
        this.forceUpdate();
    };

    render() {
        return (
            <div>
                <button onClick={()=>{this.setState({tree: {"name":"Нарушение информационная системы ЛОЦМАН","pos":{"x":620,"y":52},"or":[{"name":"Несанкционированный доступ к БД","pos":{"x":290,"y":151},"or":[{"name":"Ошибка администратора","pos":{"x":38,"y":262},"x":0.01,"and":[],"xNum":1},{"name":"Взлом сервера БД","pos":{"x":348,"y":280},"or":[{"name":"","pos":{"x":265,"y":411},"and":[{"name":"Обход пропускной системы","pos":{"x":31,"y":532},"x":0.035,"and":[],"xNum":2},{"name":"Доступ в серверную","pos":{"x":276,"y":542},"x":0.1,"and":[],"xNum":3}]},{"name":"Кража данных","pos":{"x":502,"y":552},"x":0.1,"and":[],"xNum":4}]}]},{"name":"Несанкционированный доступ к компьютеру сотрудника","pos":{"x":738,"y":220},"or":[{"name":"Взлом/перехват пароля","pos":{"x":575,"y":405},"x":0.04,"and":[],"xNum":5},{"name":"Неоконченная сессия","pos":{"x":804,"y":419},"x":0.09,"and":[],"xNum":6}]},{"name":"Случайная ошибка разглашения конфинденциальной информации","pos":{"x":1010,"y":188},"or":[{"name":"Случайные наблюдения на мониторе","pos":{"x":1060,"y":392},"x":0.009,"and":[],"xNum":7},{"name":"Ошибки при почтовой рассылке","pos":{"x":1284,"y":413},"x":0.007,"and":[],"xNum":8}]}]}
})}}>Загрузить пример</button>

                <Tree hideSourceOnDrag={true} tree={this.state.tree}/>
                <button onClick={()=>{console.log(this.state.tree);console.log(JSON.stringify(this.state.tree));this.create(this.state.tree);}}>Обновить решение
                </button>
                {this.state.lpmTree ? <div>
                    <h1>Логико-вероятностный метод</h1>
                    <p>Шаг 1. Составление сценария опасного состояния ресурса.</p>
                    <p>Шаг 2. Построение функции алгебры логики.<br />Условие перехода системы в опасное состояние имеет
                        вид: {this.state.lpmTree.fStr()}.</p>
                    <p>Шаг 3. Построение вероятностной функции.</p>
                    <p>Шаг 4. Расчет оценки вероятности реализации опасного состояния.<br />P
                        = {Math.round(this.state.lpmTree.p() * 100) / 100}
                    </p>
                </div> : ''}
            </div>
        );
    }
}