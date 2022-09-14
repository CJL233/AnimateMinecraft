import * as AMC from 'AMC'

const rightBtn={'float':'right','color':'#009688'};
function Required(){
	return <span class='required'>*</span>
}

function Materials({state, changeState, tip}){
	function Create(){
		tip({
			title: '新建材质', 
			inner: <form id='promptForm'>
				材质名称：<input type='text' name='name' className='longInput' /><br />
				贴图分块<Required />：<input type='number' required name='row' className='shortInput' min='1' />行 <input required name='col' type='number' className='shortInput' min='1' />列<br />
				贴图分辨率<Required />：<input type='number' name='size' required className='shortInput' min='1' />x<br />
				</form>, 
			btns: [
				['取消', ()=>tip(null)],
				['确定', ({firstChild})=>{
					if(!firstChild.checkValidity()){alert('非法表单，请填写带星号(*)的内容');return;}
					const form=new FormData(firstChild),
						name=form.get('name')||`Material${parseInt(Math.random()*1E3)}`;
					if(window.varNames.has(name)){alert('重复的名称，请更换名称');return;}

					const col=Number(form.get('col')),
						row=Number(form.get('row')),
						size=Number(form.get('size')),
						obj={name, row, col, size};
					window.varNames.add(name);
					obj.canvas=document.createElement('canvas');
					obj.canvas.width=col*size;obj.canvas.height=row*size;
					obj.canvas.className='textures';
					obj.ctx=obj.canvas.getContext('2d');
					obj.value=new AMC.Material(null, row, col);
					obj.value.material.map=new AMC.CanvasTexture(obj.canvas);
					obj.value.material.map.magFilter=1003;
					obj.count=0;
					state.set(name, obj);
					changeState(new Map(state));
					tip(null);
				}, rightBtn]
			]
		})
	}
	function Change({target:{innerText}}){
		function addImg(index){
			const fileInput=document.createElement('input');
			fileInput.type='file';
			fileInput.multiple='multiple';
			fileInput.accept='image/*';
			fileInput.onchange=function(){
				for(let i=0,l=fileInput.files.length;i<l;i++){
					const img=new Image();
					img.src=URL.createObjectURL(fileInput.files.item(i));
					img.onload=()=>{
						if(typeof index!=='number')
						source.ctx.drawImage(img, source.count++%source.col*source.size, parseInt(source.count/source.col)*source.size);
						else
						source.ctx.drawImage(img, index++%source.col*source.size, parseInt(index/source.col)*source.size);
						img.onload=null;
						source.value.material.map.needsUpdate=true;
					}
				}
				fileInput.onchange=null;
			}
			fileInput.click();
		}
		function Copy(){
			tip({
				title: '复制',
				inner: <form id='promptForm'>
					源：{val.name}<br />
					新名称： <input type='text' className='longInput' id='name' /><br />
					属性： <input type='text' className='longInput' placeholder='双面材质：{"side": 2}' id='attr' />
				</form>,
				btns:[
					['取消', ()=>tip(null)],
					['复制', (elem)=>{
						const name=elem.querySelector('#name').value||`Material${parseInt(Math.random()*1E3)}`;
						if(window.varNames.has(name)){alert('重复的名称，请更换名称');return;}
						const obj={
							name,
							parent: val.name, 
							value: val.value.clone(JSON.parse(elem.querySelector('#attr').value || '{}'))
						}
						window.varNames.add(name);
						val.children || (val.children=[]);
						val.children.push(name)
						state.set(name, obj);
						changeState(new Map(state));
						tip(null);
					},rightBtn]
				]
			})
		}
		let val=state.get(innerText),source=val;
		while(source.parent)
		source=state.get(source.parent);
		tip({
			title: val.name,
			inner: [
				val.parent?`源材质：${val.parent}`:null,val.parent?<br/>:null,
				`分块：${source.row}行 ${source.col}列`,<br/>,
				`分辨率：${source.size}`,<br/>,
				<div onClick={addImg} ref={el=>el && el.appendChild(source.canvas)}></div>],
			btns: [
				['删除', ()=>{
					function del(str){
						if(!state.has(str))return;
						const tar=state.get(str),
							children=tar.children||[];
						while(children.length)
							del(children.pop());
						tar.value.material.dispose();
						if(!tar.parent)tar.value.material.map.dispose();
						window.varNames.delete(str);
						state.delete(str);
					}
					del(val.name)
					changeState(new Map(state));
					tip(null);
				}],
				['完成', ()=>{tip(null)} ,rightBtn],
				['复制', Copy ,rightBtn]
			]
		})
	}
	return <div className='folder'>
		<input type='checkbox' id='Materials' className='switch' />
		<label for='Materials' className='arrow' />
		材质与贴图
		<ul className='list'>
			<li onClick={Create}>+ 新建</li>
			{Array.from(state).map(v=>(<li onClick={Change} key={v[0]}>{v[0]}</li>))}
		</ul>
	</div>
}
function Types({state, changeState, state2, tip}){
	function CreateType({children}){
		const [_type,__type]=React.useState('Block');
		return <form id='promptForm'>
			名称：<input type='test' className='longInput' name='name' /><br />
			类型<Required />：<select required className='longInput' name='type' value={_type} onChange={(e)=>{__type(e.target.value)}}>
				<option value='Block'>方块(Block)</option>
				<option value='Attachment'>附着物(Attachment)</option>
				<option value='Entity'>实体(Entity)</option>
			</select><br />
			尺寸：
			<input type='number' className='normalInput' placeholder='长' name='size1' min={1/16} step={1/16}/>x
			<input type='number' className='normalInput' placeholder='高' name='size2' min={1/16} step={1/16}/>
			{_type==='Block' && ['x', <input type='number' className='normalInput' placeholder='宽' name='size3' min={1/16} step={1/16}/>]}<br />
			材质<Required />：<select required className='longInput' name='material'>
				{children.length?children:<option value=''>无材质</option>}
			</select><br />
			贴图<Required />：<input required type='text' className='longInput' placeholder='0,0; 0,1; ...' name='uv' />
		</form>
	}
	function Create(){tip({
		title: '新建3D原型', 
		inner: <CreateType>{Array.from(state2.keys()).map(v=><option key={v}>{v}</option>)}</CreateType>, 
		btns: [
			['取消', ()=>{tip(null)}],
			['创建', ({firstChild})=>{
				if(!firstChild.checkValidity()){alert('非法表单');return}
				const form=new FormData(firstChild),
					name=form.get('name')||form.get('type')+parseInt(Math.random()*1E3);
				if(window.varNames.has(name)){alert('重复的命名，请更换名称');return}
				const obj={
					name,
					children:[],
					type: form.get('type'),
					size: [form.get('size1')||1, form.get('size2')||1],
					material: form.get('material'),
					uv: form.get('uv').replaceAll('，',',').replaceAll('；',';').split(';').map(v=>v.split(',').map(Number))
				};
				if(obj.type==='Block'){
					obj.size.push(form.get('size3')||1);
					obj.uv=obj.uv.slice(0,6);
					for(let i=0;i<6;i++)
						obj.uv[i]=(obj.uv[i] && !isNaN(obj.uv[i][0]) && !isNaN(obj.uv[i][1]))?obj.uv[i]:[0,0]
				}else{
					obj.uv=[(obj.uv[0] && !isNaN(obj.uv[0][0]) && !isNaN(obj.uv[0][1]))?obj.uv[0]:[0,0]];
				}
				obj.size=obj.size.map(Number);
				obj.value=AMC[obj.type](obj.size, state2.get(obj.material).value.getUV(obj.uv));
				window.varNames.add(name);
				state.set(name,obj);
				changeState(new Map(state));
				tip(null);
			}, rightBtn]
		]
	})}
	function Change({target:{innerText}}){
		const val=state.get(innerText);
		tip({
			title: val.name,
			inner: <form id='promptForm'>
				类型：{val.type}<br />
				尺寸：{elem.value=val.size.join(' x ')} <br />
				材质：{val.material}<br />
				贴图UV：<input type='text' class='longInput' name='uv' ref={elem=>elem && (elem.value=val.uv.join('; '))} />
			</form>,
			btns: [
				['关闭', ()=>{tip(null)}],
				['应用', ({firstChild})=>{
					const uv=new FormData(firstChild).get('uv').split(';').map(v=>v.split(',').map(Number)).slice(0,val.type==='Block'?6:1);
					if(uv.reduce((prev, curr)=>prev || isNaN(curr[0]) || isNaN(curr[1]),false)){alert('数据格式有误');return}
					val.uv=uv;
					const newUV=state2.get(val.material).value.getUV(uv);
					val.value=AMC[val.type](size, newUV);
					val.children.forEach(v=>{
						v.value.obj.geometry.attributes.uv.array=newUV;
						v.value.obj.geometry.attributes.uv.needsUpdate=true;
					});
					tip(null);
				}, rightBtn]
			]
		});
	}
	return <div className='folder'>
	<input type='checkbox' id='Types' className='switch' />
	<label for='Types' className='arrow' />
	3D原型
	<ul className='list'>
		<li onClick={Create}>+ 新建</li>
		{Array.from(state).map(v=>(<li onClick={Change} key={v[0]}>{v[0]}</li>))}
	</ul>
</div>
}

function Objects({state, changeState, state2, tip}){
	function ObjForm({value: {name, proto, pos, move, rotate, info}}){
		return <form id='promptForm'>
			{!name && ['名称：',<input type='test' className='longInput' name='name' /> ,<br />]}
			原型<Required />：<select className='longInput' name='proto' required value={proto} >{Array.from(state2.keys()).map(v=><option>{v}</option>)}{Array.from(state.keys()).map(v=><option>{v}</option>)}</select><br />
			位置：[<input type='number' placeholder='x' class='shortInput' name='pos' ref={e=>e&&(e.value=pos[0])} />, 
			<input type='number' placeholder='y' class='shortInput' name='pos' ref={e=>e&&(e.value=pos[1])} />, 
			<input type='number' placeholder='z' class='shortInput' name='pos' ref={e=>e&&(e.value=pos[2])} />]<br />
			偏移：[<input type='number' placeholder='x' class='shortInput' name='move' ref={e=>e&&(e.value=move[0])} />, 
			<input type='number' placeholder='y' class='shortInput' name='move' ref={e=>e&&(e.value=move[1])} />, 
			<input type='number' placeholder='z' class='shortInput' name='move' ref={e=>e&&(e.value=move[2])} />]<br />
			旋转：[<input type='number' placeholder='x' class='shortInput' name='rotate' ref={e=>e&&(e.value=rotate[0])} />, 
			<input type='number' placeholder='y' class='shortInput' name='rotate' ref={e=>e&&(e.value=rotate[1])} />, 
			<input type='number' placeholder='z' class='shortInput' name='rotate' ref={e=>e&&(e.value=rotate[2])} />]<br />
			提示标题：<input type='text' placeholder='标题' name='info' className='longInput' ref={e=>e&&info[0]&&(e.value=info[0])}/><br/>
			提示内容：<textarea placeholder='内容' name='info' ref={e=>e&&info[1]&&(e.value=info[1])}/><br/>
			提示图片：<input type='url' placeholder='图片url' name='info' className='longInput' ref={e=>e&&info[2]&&(e.value=info[2])}/><br/>
		</form>
	}
	function Create(){tip({
		title: '新建3D对象',
		inner: <ObjForm value={{pos:[], move:[], rotate:[], info:[]}}  />,
		btns: [
			['取消', ()=>{tip(null)}],
			['确定', ({firstChild})=>{
				const form=new FormData(firstChild),
					name=form.get('name')||`${form.get('proto').split('_')[0]}_${parseInt(Math.random()*1E3)}`;
				if(window.varNames.has(name)){alert('重复的命名，请更换名称');return}
				window.varNames.add(name);
				const obj={
					name,
					proto: form.get('proto'),
					pos: form.getAll('pos').map(Number),
					move: form.getAll('move').map(Number),
					rotate: form.getAll('rotate').map(Number),
					info: form.getAll('info'),
					brother: [],
					children: []
				}
				if(state.has(obj.proto)){
					obj.value=state.get(obj.proto).value.clone(obj.pos);
					state.get(obj.proto).brother.push(name);
				}
				else{
					obj.value=new (state2.get(obj.proto).value)(obj.pos);
					state2.get(obj.proto).children.push(obj);
				}
				obj.value.move(...obj.move).rotate(...obj.rotate);
				if(obj.info[0])obj.value.info(...obj.info);
				state.set(name,obj);
				changeState(new Map(state));
				tip(null);
				window.obj=obj;
			},rightBtn]
		]
	})}
	function Change({target:{innerText}}){
		const val=state.get(innerText);
		tip({
			title: val.name,
			inner: <ObjForm value={val} />,
			btns: [
				['关闭', ()=>{tip(null)}],
				['删除', ()=>{
					let proto,current;
					function del(tar){
						current=state.get(tar);
						if(state.has(current.proto)){
							proto=state.get(current.proto);
							proto.brother.splice(proto.brother.indexOf(tar),1);
							current.brother.forEach(v=>{
								state.get(v).proto=proto.name;
								proto.brother.push(v);
							});
						}else{
							proto=state2.get(current.proto);
							proto.children.splice(proto.children.indexOf(tar),1);
							current.brother.forEach(v=>{
								state.get(v).proto=proto.name;
								proto.children.push(v);
							});
						}
						current.value.obj.parent.remove(current.value.obj);
						current.value=null;
						current.children.forEach(del);
						state.delete(tar);
					}
					del(val.name);
					changeState(new Map(state));
					tip(null);
				}],
				['应用', ({firstChild})=>{
					const form=new FormData(firstChild);
					val.value.obj.position.set(...(val.pos=form.getAll('pos').map(Number)));
					val.value.obj.rotation.set(...(val.rotate=form.getAll('rotate').map(Number)));
					val.value.move(...(val.move=form.getAll('move').map(Number)));
					if(val.info||form.getAll('info')[0])val.value.info(...(val.info=form.getAll('info')));
					tip(null);
				},rightBtn]
			]
		});
	}
	return <div className='folder'>
	<input type='checkbox' id='Objects' className='switch' />
	<label for='Objects' className='arrow' />
	3D对象
	<ul className='list'>
		<li onClick={Create}>+ 新建</li>
		{Array.from(state).map(v=>(<li onClick={Change} key={v[0]}>{v[0]}</li>))}
	</ul>
</div>
}

function Info({state, changeState}){
	const [_depose, __depose]=React.useState(null);
	React.useEffect(()=>{
		if(state) __depose([AMC.showInfo()]);
		else _depose && _depose[0]()
	},[state]);
	return <div className='folder'>
		<input type='checkbox' id='Info' className='switch' />
		<label for='Info' className='arrow' />
		对象提示信息
		<ul className='list'>
			<label><li><input class='checkbox' type='checkbox' checked={state} onChange={e=>{changeState(e.target.checked)}} /><div class='checkbox'></div>显示</li></label>
		</ul>
	</div>
}

function Images({tip}){
    function Create(){
        const fileInput=document.createElement('input');
			fileInput.type='file';
			fileInput.accept='image/*';
			fileInput.onchange=function(){
				_image.push(URL.createObjectURL(fileInput.files.item(0)));
                __image(_image.slice());
				fileInput.onchange=null;
			}
			fileInput.click();
    }
    function View({target}){
        const i=Number(target.getAttribute('data-index'));
        tip({
            title: `Image_${i}`,
            inner: [<img style={{width:'100%'}} src={_image[i]} />, <br />,'图片URL：' , <input type='url' className='longInput' value={_image[i]} onClick={({target})=>target.select()} />],
            btns: [
                ['关闭', ()=>{tip(null)}]
            ]
        });
    }
    const [_image,__image]=React.useState([]);
    return <div className='folder'>
    <input type='checkbox' id='Images' className='switch' />
    <label for='Images' className='arrow' />
    图片资源上传
    <ul className='list'>
        <li onClick={Create}>+ 新建</li>
		{_image.map((v,i)=>(<li onClick={View} data-index={i} key={`Image_${i}`}>{`Image_${i}`}</li>))}
    </ul>
</div>
}

function Output({states:{_Materials, _Types, _Objects}}){
	return <div className='folder'></div>
}

function Menu({states:{_Materials, _Types, _Objects}, _states:{__Materials, __Types, __Objects}, tip}){
	const [_info, __info]=React.useState(false);
	return <div id='LeftBar'>
		<div id='logo'>BuildTool</div>
		<Materials state={_Materials} changeState={__Materials} tip={tip} />
		<Types state={_Types} changeState={__Types} state2={_Materials} tip={tip} />
		<Objects state={_Objects} changeState={__Objects} state2={_Types} tip={tip} />
		<Info state={_info} changeState={__info} />
        <Images tip={tip} />
		<Output states={{_Materials, _Types, _Objects}}/>
	</div>
}

function Prompt({msg:{title, inner, btns}}){
	let elem=null;
	return <div id='Prompt'>
		<div id='PromptTitle'>{title}</div>
		<div ref={el=>elem=el} id='PromptInner'>{inner}</div>
		{btns.map(v=><button className='TextBtn' onClick={()=>{v[1](elem)}} key={v[0]} style={v[2]} >{v[0]}</button>)}
	</div>
}

function App(){
	const [_Materials, __Materials]=React.useState(new Map()),
		[_Types, __Types]=React.useState(new Map()),
		[_Objects, __Objects]=React.useState(new Map()),
		[_Prompt,__Prompt]=React.useState(null);
	React.useEffect(()=>{
		window._Materials=_Materials;
	},[_Materials]);
	return <div>
		<input type='checkbox' id='MenuSW' />
		<label for='MenuSW' id='MenuBtn'><div id='MenuBtnImg'></div></label>
		<Menu states={{_Materials, _Types, _Objects}} _states={{__Materials, __Types, __Objects}} tip={__Prompt} />
		{_Prompt && <Prompt msg={_Prompt} />}
	</div>
}

export {App}