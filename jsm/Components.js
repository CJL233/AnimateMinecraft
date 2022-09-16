var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import * as AMC from 'AMC';

var rightBtn = { 'float': 'right', 'color': '#009688' };
function Required() {
	return React.createElement(
		'span',
		{ 'class': 'required' },
		'*'
	);
}

function Materials(_ref) {
	var state = _ref.state,
	    changeState = _ref.changeState,
	    tip = _ref.tip;

	function Create() {
		tip({
			title: '新建材质',
			inner: React.createElement(
				'form',
				{ id: 'promptForm' },
				'\u6750\u8D28\u540D\u79F0\uFF1A',
				React.createElement('input', { type: 'text', name: 'name', className: 'longInput' }),
				React.createElement('br', null),
				'\u8D34\u56FE\u5206\u5757',
				React.createElement(Required, null),
				'\uFF1A',
				React.createElement('input', { type: 'number', required: true, name: 'row', className: 'shortInput', min: '1' }),
				'\u884C ',
				React.createElement('input', { required: true, name: 'col', type: 'number', className: 'shortInput', min: '1' }),
				'\u5217',
				React.createElement('br', null),
				'\u8D34\u56FE\u5206\u8FA8\u7387',
				React.createElement(Required, null),
				'\uFF1A',
				React.createElement('input', { type: 'number', name: 'size', required: true, className: 'shortInput', min: '1' }),
				'x',
				React.createElement('br', null)
			),
			btns: [['取消', function () {
				return tip(null);
			}], ['确定', function (_ref2) {
				var firstChild = _ref2.firstChild;

				if (!firstChild.checkValidity()) {
					alert('非法表单，请填写带星号(*)的内容');return;
				}
				var form = new FormData(firstChild),
				    name = form.get('name') || 'Material' + parseInt(Math.random() * 1E3);
				if (window.varNames.has(name)) {
					alert('重复的名称，请更换名称');return;
				}

				var col = Number(form.get('col')),
				    row = Number(form.get('row')),
				    size = Number(form.get('size')),
				    obj = { name: name, row: row, col: col, size: size };
				window.varNames.add(name);
				obj.canvas = document.createElement('canvas');
				obj.canvas.width = col * size;obj.canvas.height = row * size;
				obj.canvas.className = 'textures';
				obj.ctx = obj.canvas.getContext('2d');
				obj.value = new AMC.Material(null, row, col);
				obj.value.material.map = new AMC.CanvasTexture(obj.canvas);
				obj.value.material.map.magFilter = 1003;
				obj.count = 0;
				state.set(name, obj);
				changeState(new Map(state));
				tip(null);
			}, rightBtn]]
		});
	}
	function Change(_ref3) {
		var innerText = _ref3.target.innerText;

		function addImg(index) {
			var fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.multiple = 'multiple';
			fileInput.accept = 'image/*';
			fileInput.onchange = function () {
				var _loop = function _loop(i, l) {
					var img = new Image();
					img.src = URL.createObjectURL(fileInput.files.item(i));
					img.onload = function () {
						if (typeof index !== 'number') source.ctx.drawImage(img, source.count % source.col * source.size, parseInt(source.count++ / source.col) * source.size);else source.ctx.drawImage(img, index % source.col * source.size, parseInt(index++ / source.col) * source.size);
						img.onload = null;
						source.value.material.map.needsUpdate = true;
					};
				};

				for (var i = 0, l = fileInput.files.length; i < l; i++) {
					_loop(i, l);
				}
				fileInput.onchange = null;
			};
			fileInput.click();
		}
		function Copy() {
			tip({
				title: '复制',
				inner: React.createElement(
					'form',
					{ id: 'promptForm' },
					'\u6E90\uFF1A',
					val.name,
					React.createElement('br', null),
					'\u65B0\u540D\u79F0\uFF1A ',
					React.createElement('input', { type: 'text', className: 'longInput', id: 'name' }),
					React.createElement('br', null),
					'\u5C5E\u6027\uFF1A ',
					React.createElement('input', { type: 'text', className: 'longInput', placeholder: '\u53CC\u9762\u6750\u8D28\uFF1A{"side": 2}', id: 'attr' })
				),
				btns: [['取消', function () {
					return tip(null);
				}], ['复制', function (elem) {
					var name = elem.querySelector('#name').value || 'Material' + parseInt(Math.random() * 1E3);
					if (window.varNames.has(name)) {
						alert('重复的名称，请更换名称');return;
					}
					var obj = {
						name: name,
						parent: val.name,
						attr: elem.querySelector('#attr').value,
						value: val.value.clone(JSON.parse(elem.querySelector('#attr').value || '{}'))
					};
					window.varNames.add(name);
					val.children || (val.children = []);
					val.children.push(name);
					state.set(name, obj);
					changeState(new Map(state));
					tip(null);
				}, rightBtn]]
			});
		}
		var val = state.get(innerText),
		    source = val;
		while (source.parent) {
			source = state.get(source.parent);
		}tip({
			title: val.name,
			inner: [val.parent ? '\u6E90\u6750\u8D28\uFF1A' + val.parent : null, val.parent ? React.createElement('br', null) : null, '\u5206\u5757\uFF1A' + source.row + '\u884C ' + source.col + '\u5217', React.createElement('br', null), '\u5206\u8FA8\u7387\uFF1A' + source.size, React.createElement('br', null), React.createElement('div', { onClick: addImg, ref: function ref(el) {
					return el && el.appendChild(source.canvas);
				} })],
			btns: [['删除', function () {
				function del(str) {
					if (!state.has(str)) return;
					var tar = state.get(str),
					    children = tar.children || [];
					while (children.length) {
						del(children.pop());
					}tar.value.material.dispose();
					if (!tar.parent) tar.value.material.map.dispose();
					window.varNames.delete(str);
					state.delete(str);
				}
				del(val.name);
				changeState(new Map(state));
				tip(null);
			}], ['完成', function () {
				tip(null);
			}, rightBtn], ['复制', Copy, rightBtn]]
		});
	}
	return React.createElement(
		'div',
		{ className: 'folder' },
		React.createElement('input', { type: 'checkbox', id: 'Materials', className: 'switch' }),
		React.createElement('label', { 'for': 'Materials', className: 'arrow' }),
		'\u6750\u8D28\u4E0E\u8D34\u56FE',
		React.createElement(
			'ul',
			{ className: 'list' },
			React.createElement(
				'li',
				{ onClick: Create },
				'+ \u65B0\u5EFA'
			),
			Array.from(state).map(function (v) {
				return React.createElement(
					'li',
					{ onClick: Change, key: v[0] },
					v[0]
				);
			})
		)
	);
}
function Types(_ref4) {
	var state = _ref4.state,
	    changeState = _ref4.changeState,
	    state2 = _ref4.state2,
	    tip = _ref4.tip;

	function CreateType(_ref5) {
		var children = _ref5.children;

		var _React$useState = React.useState('Block'),
		    _React$useState2 = _slicedToArray(_React$useState, 2),
		    _type = _React$useState2[0],
		    __type = _React$useState2[1];

		return React.createElement(
			'form',
			{ id: 'promptForm' },
			'\u540D\u79F0\uFF1A',
			React.createElement('input', { type: 'test', className: 'longInput', name: 'name' }),
			React.createElement('br', null),
			'\u7C7B\u578B',
			React.createElement(Required, null),
			'\uFF1A',
			React.createElement(
				'select',
				{ required: true, className: 'longInput', name: 'type', value: _type, onChange: function onChange(e) {
						__type(e.target.value);
					} },
				React.createElement(
					'option',
					{ value: 'Block' },
					'\u65B9\u5757(Block)'
				),
				React.createElement(
					'option',
					{ value: 'Attachment' },
					'\u9644\u7740\u7269(Attachment)'
				),
				React.createElement(
					'option',
					{ value: 'Entity' },
					'\u5B9E\u4F53(Entity)'
				)
			),
			React.createElement('br', null),
			'\u5C3A\u5BF8\uFF1A',
			React.createElement('input', { type: 'number', className: 'normalInput', placeholder: '\u957F', name: 'size1', min: 1 / 16, step: 1 / 16 }),
			'x',
			React.createElement('input', { type: 'number', className: 'normalInput', placeholder: '\u9AD8', name: 'size2', min: 1 / 16, step: 1 / 16 }),
			_type === 'Block' && ['x', React.createElement('input', { type: 'number', className: 'normalInput', placeholder: '\u5BBD', name: 'size3', min: 1 / 16, step: 1 / 16 })],
			React.createElement('br', null),
			'\u6750\u8D28',
			React.createElement(Required, null),
			'\uFF1A',
			React.createElement(
				'select',
				{ required: true, className: 'longInput', name: 'material' },
				children.length ? children : React.createElement(
					'option',
					{ value: '' },
					'\u65E0\u6750\u8D28'
				)
			),
			React.createElement('br', null),
			'\u8D34\u56FE',
			React.createElement(Required, null),
			'\uFF1A',
			React.createElement('input', { required: true, type: 'text', className: 'longInput', placeholder: '0,0; 0,1; ...', name: 'uv' })
		);
	}
	function Create() {
		tip({
			title: '新建3D原型',
			inner: React.createElement(
				CreateType,
				null,
				Array.from(state2.keys()).map(function (v) {
					return React.createElement(
						'option',
						{ key: v },
						v
					);
				})
			),
			btns: [['取消', function () {
				tip(null);
			}], ['创建', function (_ref6) {
				var firstChild = _ref6.firstChild;

				if (!firstChild.checkValidity()) {
					alert('非法表单');return;
				}
				var form = new FormData(firstChild),
				    name = form.get('name') || form.get('type') + parseInt(Math.random() * 1E3);
				if (window.varNames.has(name)) {
					alert('重复的命名，请更换名称');return;
				}
				var obj = {
					name: name,
					children: [],
					type: form.get('type'),
					size: [form.get('size1') || 1, form.get('size2') || 1],
					material: form.get('material'),
					uv: form.get('uv').replaceAll('，', ',').replaceAll('；', ';').split(';').map(function (v) {
						return v.split(',').map(Number);
					})
				};
				if (obj.type === 'Block') {
					obj.size.push(form.get('size3') || 1);
					obj.uv = obj.uv.slice(0, 6);
					for (var i = 0; i < 6; i++) {
						obj.uv[i] = obj.uv[i] && !isNaN(obj.uv[i][0]) && !isNaN(obj.uv[i][1]) ? obj.uv[i] : [0, 0];
					}
				} else {
					obj.uv = [obj.uv[0] && !isNaN(obj.uv[0][0]) && !isNaN(obj.uv[0][1]) ? obj.uv[0] : [0, 0]];
				}
				obj.size = obj.size.map(Number);
				obj.value = AMC[obj.type](obj.size, state2.get(obj.material).value.getUV(obj.uv));
				window.varNames.add(name);
				state.set(name, obj);
				changeState(new Map(state));
				tip(null);
			}, rightBtn]]
		});
	}
	function Change(_ref7) {
		var innerText = _ref7.target.innerText;

		var val = state.get(innerText);
		tip({
			title: val.name,
			inner: React.createElement(
				'form',
				{ id: 'promptForm' },
				'\u7C7B\u578B\uFF1A',
				val.type,
				React.createElement('br', null),
				'\u5C3A\u5BF8\uFF1A',
				val.size.join(' x '),
				' ',
				React.createElement('br', null),
				'\u6750\u8D28\uFF1A',
				val.material,
				React.createElement('br', null),
				'\u8D34\u56FEUV\uFF1A',
				React.createElement('input', { type: 'text', 'class': 'longInput', name: 'uv', ref: function ref(elem) {
						return elem && (elem.value = val.uv.join('; '));
					} })
			),
			btns: [['关闭', function () {
				tip(null);
			}], ['应用', function (_ref8) {
				var firstChild = _ref8.firstChild;

				var uv = new FormData(firstChild).get('uv').split(';').map(function (v) {
					return v.split(',').map(Number);
				}).slice(0, val.type === 'Block' ? 6 : 1);
				if (uv.reduce(function (prev, curr) {
					return prev || isNaN(curr[0]) || isNaN(curr[1]);
				}, false)) {
					alert('数据格式有误');return;
				}
				val.uv = uv;
				var newUV = state2.get(val.material).value.getUV(uv);
				val.value = AMC[val.type](val.size, newUV);
				val.children.forEach(function (v) {
					v.value.obj.geometry.attributes.uv.array = newUV;
					v.value.obj.geometry.attributes.uv.needsUpdate = true;
				});
				tip(null);
			}, rightBtn]]
		});
	}
	return React.createElement(
		'div',
		{ className: 'folder' },
		React.createElement('input', { type: 'checkbox', id: 'Types', className: 'switch' }),
		React.createElement('label', { 'for': 'Types', className: 'arrow' }),
		'3D\u539F\u578B',
		React.createElement(
			'ul',
			{ className: 'list' },
			React.createElement(
				'li',
				{ onClick: Create },
				'+ \u65B0\u5EFA'
			),
			Array.from(state).map(function (v) {
				return React.createElement(
					'li',
					{ onClick: Change, key: v[0] },
					v[0]
				);
			})
		)
	);
}

function Objects(_ref9) {
	var state = _ref9.state,
	    changeState = _ref9.changeState,
	    state2 = _ref9.state2,
	    tip = _ref9.tip;

	function ObjForm(_ref10) {
		var _ref10$value = _ref10.value,
		    name = _ref10$value.name,
		    proto = _ref10$value.proto,
		    pos = _ref10$value.pos,
		    move = _ref10$value.move,
		    rotate = _ref10$value.rotate,
		    info = _ref10$value.info;

		return React.createElement(
			'form',
			{ id: 'promptForm' },
			!name && ['名称：', React.createElement('input', { type: 'test', className: 'longInput', name: 'name' }), React.createElement('br', null)],
			'\u539F\u578B',
			React.createElement(Required, null),
			'\uFF1A',
			React.createElement(
				'select',
				{ className: 'longInput', name: 'proto', required: true, value: proto },
				Array.from(state2.keys()).map(function (v) {
					return React.createElement(
						'option',
						null,
						v
					);
				}),
				Array.from(state.keys()).map(function (v) {
					return React.createElement(
						'option',
						null,
						v
					);
				})
			),
			React.createElement('br', null),
			'\u4F4D\u7F6E\uFF1A[',
			React.createElement('input', { type: 'number', placeholder: 'x', 'class': 'shortInput', name: 'pos', ref: function ref(e) {
					return e && (e.value = pos[0]);
				} }),
			',',
			React.createElement('input', { type: 'number', placeholder: 'y', 'class': 'shortInput', name: 'pos', ref: function ref(e) {
					return e && (e.value = pos[1]);
				} }),
			',',
			React.createElement('input', { type: 'number', placeholder: 'z', 'class': 'shortInput', name: 'pos', ref: function ref(e) {
					return e && (e.value = pos[2]);
				} }),
			']',
			React.createElement('br', null),
			'\u504F\u79FB\uFF1A[',
			React.createElement('input', { type: 'number', placeholder: 'x', 'class': 'shortInput', name: 'move', ref: function ref(e) {
					return e && (e.value = move[0]);
				} }),
			',',
			React.createElement('input', { type: 'number', placeholder: 'y', 'class': 'shortInput', name: 'move', ref: function ref(e) {
					return e && (e.value = move[1]);
				} }),
			',',
			React.createElement('input', { type: 'number', placeholder: 'z', 'class': 'shortInput', name: 'move', ref: function ref(e) {
					return e && (e.value = move[2]);
				} }),
			']',
			React.createElement('br', null),
			'\u65CB\u8F6C\uFF1A[',
			React.createElement('input', { type: 'number', placeholder: 'x', 'class': 'shortInput', name: 'rotate', ref: function ref(e) {
					return e && (e.value = rotate[0]);
				} }),
			',',
			React.createElement('input', { type: 'number', placeholder: 'y', 'class': 'shortInput', name: 'rotate', ref: function ref(e) {
					return e && (e.value = rotate[1]);
				} }),
			',',
			React.createElement('input', { type: 'number', placeholder: 'z', 'class': 'shortInput', name: 'rotate', ref: function ref(e) {
					return e && (e.value = rotate[2]);
				} }),
			']',
			React.createElement('br', null),
			'\u63D0\u793A\u6807\u9898\uFF1A',
			React.createElement('input', { type: 'text', placeholder: '\u6807\u9898', name: 'info', className: 'longInput', ref: function ref(e) {
					return e && info[0] && (e.value = info[0]);
				} }),
			React.createElement('br', null),
			'\u63D0\u793A\u5185\u5BB9\uFF1A',
			React.createElement('textarea', { placeholder: '\u5185\u5BB9', name: 'info', ref: function ref(e) {
					return e && info[1] && (e.value = info[1]);
				} }),
			React.createElement('br', null),
			'\u63D0\u793A\u56FE\u7247\uFF1A',
			React.createElement('input', { type: 'url', placeholder: '\u56FE\u7247url', name: 'info', className: 'longInput', ref: function ref(e) {
					return e && info[2] && (e.value = info[2]);
				} }),
			React.createElement('br', null)
		);
	}
	function Create() {
		tip({
			title: '新建3D对象',
			inner: React.createElement(ObjForm, { value: { pos: [], move: [], rotate: [], info: [] } }),
			btns: [['取消', function () {
				tip(null);
			}], ['确定', function (_ref11) {
				var _obj$value$move, _obj$value, _obj$value2;

				var firstChild = _ref11.firstChild;

				var form = new FormData(firstChild),
				    name = form.get('name') || form.get('proto').split('_')[0] + '_' + parseInt(Math.random() * 1E3);
				if (window.varNames.has(name)) {
					alert('重复的命名，请更换名称');return;
				}
				window.varNames.add(name);
				var obj = {
					name: name,
					proto: form.get('proto'),
					pos: form.getAll('pos').map(Number),
					move: form.getAll('move').map(Number),
					rotate: form.getAll('rotate').map(Number),
					info: form.getAll('info'),
					brother: [],
					children: []
				};
				if (state.has(obj.proto)) {
					obj.value = state.get(obj.proto).value.clone(obj.pos);
					state.get(obj.proto).brother.push(name);
				} else {
					obj.value = new (state2.get(obj.proto).value)(obj.pos);
					state2.get(obj.proto).children.push(obj);
				}
				(_obj$value$move = (_obj$value = obj.value).move.apply(_obj$value, _toConsumableArray(obj.move))).rotate.apply(_obj$value$move, _toConsumableArray(obj.rotate));
				if (obj.info[0]) (_obj$value2 = obj.value).info.apply(_obj$value2, _toConsumableArray(obj.info));
				state.set(name, obj);
				changeState(new Map(state));
				tip(null);
				window.obj = obj;
			}, rightBtn]]
		});
	}
	function Change(_ref12) {
		var innerText = _ref12.target.innerText;

		var val = state.get(innerText);
		tip({
			title: val.name,
			inner: React.createElement(ObjForm, { value: val }),
			btns: [['关闭', function () {
				tip(null);
			}], ['删除', function () {
				var proto = void 0,
				    current = void 0;
				function del(tar) {
					current = state.get(tar);
					if (state.has(current.proto)) {
						proto = state.get(current.proto);
						proto.brother.splice(proto.brother.indexOf(tar), 1);
						current.brother.forEach(function (v) {
							state.get(v).proto = proto.name;
							proto.brother.push(v);
						});
					} else {
						proto = state2.get(current.proto);
						proto.children.splice(proto.children.indexOf(tar), 1);
						current.brother.forEach(function (v) {
							state.get(v).proto = proto.name;
							proto.children.push(v);
						});
					}
					current.value.obj.parent.remove(current.value.obj);
					current.value = null;
					current.children.forEach(del);
					state.delete(tar);
				}
				del(val.name);
				changeState(new Map(state));
				tip(null);
			}], ['应用', function (_ref13) {
				var _val$value$obj$positi, _val$value$obj$rotati, _val$value, _val$value2;

				var firstChild = _ref13.firstChild;

				var form = new FormData(firstChild);
				(_val$value$obj$positi = val.value.obj.position).set.apply(_val$value$obj$positi, _toConsumableArray(val.pos = form.getAll('pos').map(Number)));
				(_val$value$obj$rotati = val.value.obj.rotation).set.apply(_val$value$obj$rotati, _toConsumableArray(val.rotate = form.getAll('rotate').map(Number)));
				(_val$value = val.value).move.apply(_val$value, _toConsumableArray(val.move = form.getAll('move').map(Number)));
				if (val.info || form.getAll('info')[0]) (_val$value2 = val.value).info.apply(_val$value2, _toConsumableArray(val.info = form.getAll('info')));
				tip(null);
			}, rightBtn]]
		});
	}
	return React.createElement(
		'div',
		{ className: 'folder' },
		React.createElement('input', { type: 'checkbox', id: 'Objects', className: 'switch' }),
		React.createElement('label', { 'for': 'Objects', className: 'arrow' }),
		'3D\u5BF9\u8C61',
		React.createElement(
			'ul',
			{ className: 'list' },
			React.createElement(
				'li',
				{ onClick: Create },
				'+ \u65B0\u5EFA'
			),
			Array.from(state).map(function (v) {
				return React.createElement(
					'li',
					{ onClick: Change, key: v[0] },
					v[0]
				);
			})
		)
	);
}

function Info(_ref14) {
	var state = _ref14.state,
	    changeState = _ref14.changeState;

	var _React$useState3 = React.useState(null),
	    _React$useState4 = _slicedToArray(_React$useState3, 2),
	    _depose = _React$useState4[0],
	    __depose = _React$useState4[1];

	React.useEffect(function () {
		if (state) __depose([AMC.showInfo()]);else _depose && _depose[0]();
	}, [state]);
	return React.createElement(
		'div',
		{ className: 'folder' },
		React.createElement('input', { type: 'checkbox', id: 'Info', className: 'switch' }),
		React.createElement('label', { 'for': 'Info', className: 'arrow' }),
		'\u5BF9\u8C61\u63D0\u793A\u4FE1\u606F',
		React.createElement(
			'ul',
			{ className: 'list' },
			React.createElement(
				'label',
				null,
				React.createElement(
					'li',
					null,
					React.createElement('input', { 'class': 'checkbox', type: 'checkbox', checked: state, onChange: function onChange(e) {
							changeState(e.target.checked);
						} }),
					React.createElement('div', { 'class': 'checkbox' }),
					'\u663E\u793A'
				)
			)
		)
	);
}

function Images(_ref15) {
	var state = _ref15.state,
	    changeState = _ref15.changeState,
	    tip = _ref15.tip;

	function Create() {
		var fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept = 'image/*';
		fileInput.onchange = function () {
			state.push(URL.createObjectURL(fileInput.files.item(0)));
			changeState(state.slice());
			fileInput.onchange = null;
		};
		fileInput.click();
	}
	function View(_ref16) {
		var target = _ref16.target;

		var i = Number(target.getAttribute('data-index'));
		tip({
			title: 'Image_' + i,
			inner: [React.createElement('img', { style: { width: '100%' }, src: state[i] }), React.createElement('br', null), '图片URL：', React.createElement('input', { type: 'url', className: 'longInput', value: state[i], onClick: function onClick(_ref17) {
					var target = _ref17.target;
					return target.select();
				} })],
			btns: [['关闭', function () {
				tip(null);
			}]]
		});
	}
	return React.createElement(
		'div',
		{ className: 'folder' },
		React.createElement('input', { type: 'checkbox', id: 'Images', className: 'switch' }),
		React.createElement('label', { 'for': 'Images', className: 'arrow' }),
		'\u56FE\u7247\u8D44\u6E90\u4E0A\u4F20',
		React.createElement(
			'ul',
			{ className: 'list' },
			React.createElement(
				'li',
				{ onClick: Create },
				'+ \u65B0\u5EFA'
			),
			state.map(function (v, i) {
				return React.createElement(
					'li',
					{ onClick: View, 'data-index': i, key: 'Image_' + i },
					'Image_' + i
				);
			})
		)
	);
}

function Output(_ref18) {
	var _ref18$states = _ref18.states,
	    _Materials = _ref18$states._Materials,
	    _Types = _ref18$states._Types,
	    _Objects = _ref18$states._Objects,
	    _info = _ref18$states._info,
	    _image = _ref18$states._image,
	    tip = _ref18.tip;

	function Click() {
		var Materials = new Map(),
		    Objs = new Map();
		_Objects.forEach(function (v) {
			if (Objs.has(v.proto)) {
				Objs.get(v.proto).push(v.name);
				Objs.set(v.name, []);
			} else {
				Objs.set(v.proto, [v.name]);
				Objs.set(v.name, []);
				if (Materials.has(_Types.get(v.proto).material)) Materials.get(_Types.get(v.proto).material).push(v.proto);else Materials.set(_Types.get(v.proto).material, [v.proto]);
			}
		});
		var text = ['import * as AMC from \'AMC\' \r\nconst '],
		    first = 0;
		Materials.forEach(function (v, i) {
			var val = _Materials.get(i);
			if (val.parent) text.push(',\r\n' + i + '=' + val.parent + '.clone(' + val.attr + ')');else text.push('' + (first++ ? ',\r\n' : '') + i + '=new AMC.Material(\'img/texture/atlas_' + i + '.png\',' + val.row + ',' + val.col + ')');
		});
		Materials.forEach(function (v, i) {
			//v: [Types]
			v.forEach(function (vv) {
				//vv: Type
				var val = _Types.get(vv);
				text.push(',\r\n' + vv + '=AMC.' + val.type + '([' + val.size.join(',') + '],' + i + '.getUV([' + val.uv.map(function (vvv) {
					return '[' + vvv.join(',') + ']';
				}).join(',') + ']))');
				Objs.get(vv).forEach(add);
				function add(name, mode) {
					var val2 = _Objects.get(name);
					text.push(mode !== undefined ? ',\r\n' + name + '=new ' + val2.proto + '([' + val2.pos.join(',') + '])' : '\r\n.clone([' + val2.pos.join(',') + '])');
					val2.move.reduce(function (prev, curr) {
						return prev && curr;
					}) && text.push('.move(' + val2.move.join(',') + ')');
					val2.rotate.reduce(function (prev, curr) {
						return prev && curr;
					}) && text.push('.rotate(' + val2.rotate.join(',') + ')');
					val2.info[0] && text.push('.info(\'' + val2.info[0] + '\',\'' + val2.info[1] + '\',\'' + (val2.info[2] ? 'img/Image_' + _image.reduce(function (prev, curr, i) {
						return prev === null && curr !== val2.info[2] ? i : prev;
					}, null) + '.png' : '') + '\')');
					if (Objs.get(name).length) Objs.get(name).forEach(function (vvv) {
						return add(vvv);
					});
				}
			});
		});
		text.push(';\r\n' + (_info ? '\r\nAMC.showInfo();' : ''));
		var htmlText = ['<!DOCTYPE html>', '<meta charset="utf-8">\n\t\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\t\t\t<link rel="stylesheet" type="text/css" href="../../style/main.css">\n\t\t\t<html><head><title>Auto Page</title></head>\n\t\t\t<body>\n\t\t\t  <a title="View on Github" href="https://github.com/CJL233/AnimateMinecraft/tree/main/examples/altar"><svg style="margin: 0.5rem;position: absolute;right: 0;" height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">\n\t\t\t\t<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>\n\t\t\t</svg></a>\n\t\t\t</body>\n\t\t\t<script type="importmap">\n\t\t\t{\n\t\t\t  "imports": {\n\t\t\t\t"AMC": "../../jsm/AnimateMC.js",\n\t\t\t\t  "three": "../../jsm/three.module.js",\n\t\t\t\t"OrbitControls": "../../jsm/OrbitControls.js",\n\t\t\t\t"WebGL": "../../jsm/WebGL.js"\n\t\t\t\t  //"three": "https://unpkg.com/three@0.143.0/build/three.module.js",\n\t\t\t\t//"OrbitControls": "https://unpkg.com/three@0.143.0/examples/jsm/controls/OrbitControls.js",\n\t\t\t\t//"WebGL": "https://unpkg.com/three@0.143.0/examples/jsm/capabilities/WebGL.js"\n\t\t\t  }\n\t\t\t}\n\t\t\t</script>\n\t\t\t<script type=\'module\' src="index.js"></script>\n\t\t\t</html>'];
		tip({
			title: '导出文件',
			inner: React.createElement(
				'ul',
				{ className: 'fileList' },
				React.createElement(
					'li',
					null,
					'\uD83D\uDCC1img'
				),
				React.createElement(
					'ul',
					{ className: 'fileList' },
					React.createElement(
						'li',
						null,
						'\uD83D\uDCC1texture'
					),
					React.createElement(
						'ul',
						{ className: 'fileList' },
						Array.from(_Materials).map(function (v) {
							return v[1].parent ? null : React.createElement(
								'li',
								null,
								React.createElement(
									'a',
									{ download: 'atlas_' + v[0] + '.png', ref: function ref(elem) {
											return elem && v[1].canvas.toBlob(function (blob) {
												return elem.href = URL.createObjectURL(blob);
											});
										} },
									'\uD83D\uDCC4atlas_',
									v[0],
									'.png'
								)
							);
						})
					),
					_image.map(function (v, i) {
						return React.createElement(
							'li',
							null,
							React.createElement(
								'a',
								{ download: 'Image_' + i + '.png', href: v },
								'Image_',
								i,
								'.png'
							)
						);
					})
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ download: 'index.js', href: URL.createObjectURL(new Blob(text)) },
						'\uD83D\uDCC4index.js'
					)
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ download: 'index.html', href: URL.createObjectURL(new Blob(htmlText)) },
						'\uD83D\uDCC4index.html'
					)
				)
			),
			btns: [['关闭', function () {
				tip(null);
			}]]
		});
	}
	return React.createElement('div', { id: 'Output', onClick: Click });
}

function Menu(_ref19) {
	var _ref19$states = _ref19.states,
	    _Materials = _ref19$states._Materials,
	    _Types = _ref19$states._Types,
	    _Objects = _ref19$states._Objects,
	    _ref19$_states = _ref19._states,
	    __Materials = _ref19$_states.__Materials,
	    __Types = _ref19$_states.__Types,
	    __Objects = _ref19$_states.__Objects,
	    tip = _ref19.tip;

	var _React$useState5 = React.useState(false),
	    _React$useState6 = _slicedToArray(_React$useState5, 2),
	    _info = _React$useState6[0],
	    __info = _React$useState6[1],
	    _React$useState7 = React.useState([]),
	    _React$useState8 = _slicedToArray(_React$useState7, 2),
	    _image = _React$useState8[0],
	    __image = _React$useState8[1];

	return React.createElement(
		'div',
		{ id: 'LeftBar' },
		React.createElement(
			'div',
			{ id: 'logo' },
			'BuildTool'
		),
		React.createElement(Materials, { state: _Materials, changeState: __Materials, tip: tip }),
		React.createElement(Types, { state: _Types, changeState: __Types, state2: _Materials, tip: tip }),
		React.createElement(Objects, { state: _Objects, changeState: __Objects, state2: _Types, tip: tip }),
		React.createElement(Info, { state: _info, changeState: __info }),
		React.createElement(Images, { state: _image, changeState: __image, tip: tip }),
		React.createElement(Output, { states: { _Materials: _Materials, _Types: _Types, _Objects: _Objects, _info: _info, _image: _image }, tip: tip })
	);
}

function Prompt(_ref20) {
	var _ref20$msg = _ref20.msg,
	    title = _ref20$msg.title,
	    inner = _ref20$msg.inner,
	    btns = _ref20$msg.btns;

	var elem = null;
	return React.createElement(
		'div',
		{ id: 'Prompt' },
		React.createElement(
			'div',
			{ id: 'PromptTitle' },
			title
		),
		React.createElement(
			'div',
			{ ref: function ref(el) {
					return elem = el;
				}, id: 'PromptInner' },
			inner
		),
		btns.map(function (v) {
			return React.createElement(
				'button',
				{ className: 'TextBtn', onClick: function onClick() {
						v[1](elem);
					}, key: v[0], style: v[2] },
				v[0]
			);
		})
	);
}

function App() {
	var _React$useState9 = React.useState(new Map()),
	    _React$useState10 = _slicedToArray(_React$useState9, 2),
	    _Materials = _React$useState10[0],
	    __Materials = _React$useState10[1],
	    _React$useState11 = React.useState(new Map()),
	    _React$useState12 = _slicedToArray(_React$useState11, 2),
	    _Types = _React$useState12[0],
	    __Types = _React$useState12[1],
	    _React$useState13 = React.useState(new Map()),
	    _React$useState14 = _slicedToArray(_React$useState13, 2),
	    _Objects = _React$useState14[0],
	    __Objects = _React$useState14[1],
	    _React$useState15 = React.useState(null),
	    _React$useState16 = _slicedToArray(_React$useState15, 2),
	    _Prompt = _React$useState16[0],
	    __Prompt = _React$useState16[1];

	React.useEffect(function () {
		window._Materials = _Materials;
	}, [_Materials]);
	return React.createElement(
		'div',
		null,
		React.createElement('input', { type: 'checkbox', id: 'MenuSW' }),
		React.createElement(
			'label',
			{ 'for': 'MenuSW', id: 'MenuBtn' },
			React.createElement('div', { id: 'MenuBtnImg' })
		),
		React.createElement(Menu, { states: { _Materials: _Materials, _Types: _Types, _Objects: _Objects }, _states: { __Materials: __Materials, __Types: __Types, __Objects: __Objects }, tip: __Prompt }),
		_Prompt && React.createElement(Prompt, { msg: _Prompt })
	);
}

export { App };