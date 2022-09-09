
function Materials(_ref) {
    var Materials = _ref.Materials;

    return React.createElement("div", null);
}

function Types(_ref2) {
    var Types = _ref2.Types;

    return React.createElement("div", null);
}

function Objects(_ref3) {
    var Objects = _ref3.Objects;

    return React.createElement("div", null);
}

function Menu(_ref4) {
    var Materials = _ref4.Materials,
        Types = _ref4.Types,
        Objects = _ref4.Objects;

    return React.createElement("div", null);
}

function App(_ref5) {
    var Materials = _ref5.Materials,
        Types = _ref5.Types,
        Objects = _ref5.Objects;

    return React.createElement(
        "div",
        null,
        React.createElement(Menu, { Materials: Materials, Types: Types, Objects: Objects })
    );
}

export { App };