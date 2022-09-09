import {App} from 'Components'

const Materials = new Map(),
    Types = new Map(),
    Objects = new Map();

ReactDOM.render(
    React.createElement(
        App, 
        {Materials, Types, Objects}
    ),
    document.getElementById('ReactRoot')
);