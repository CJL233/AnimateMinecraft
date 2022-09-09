
function Materials({Materials}){
    return <div></div>
}

function Types({Types}){
    return <div></div>
}

function Objects({Objects}){
    return <div></div>
}

function Menu({Materials, Types, Objects}){
    return <div></div>
}

function App({Materials, Types, Objects}){
    return <div>
        <Menu Materials={Materials} Types={Types} Objects={Objects} />
    </div>
}

export {App}