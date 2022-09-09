import * as THREE from 'three'
import {OrbitControls} from './OrbitControls.js'

window.scene=new THREE.Scene();
window.renderer=new THREE.WebGLRenderer({alpha:true});

renderer.setClearAlpha(0.0);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 5, 2, 8 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(0,0,1);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

window.onresize = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};

function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}
animate();

function Material(url, row=1, col=1){
	this.row=row;
	this.col=col;
	if(url)this.map=new THREE.TextureLoader().load( url, texture=>{texture.magFilter=THREE.NearestFilter});
	this.material=new THREE.MeshBasicMaterial( url?{map: this.map}: null);
	this.material.setValues({color: 0xFFFFFF, alphaTest: 0.1
		//, transparent: true, opacity: 1
	});
	this.getUV=function(arr){
		const r=1/this.row,c=1/this.col;
		return {'uv': new Float32Array(arr.map(v=>[v[1]*c,1-v[0]*r, (v[1]+1)*c,1-v[0]++*r, v[1]*c,1-v[0]*r, (v[1]+1)*c,1-v[0]--*r]).flat()), 'self': this }
	}
	this.clone=function(attr={}){
		const newObj=new this.constructor(null, this.row, this.col);
		newObj.map=attr.map=this.map;
		newObj.material.setValues(attr);
		return newObj;
	}
}

function rotate(...args){this.obj.rotation.set(...args);return this;}
function rotateX(x=0){this.obj.rotation.x+=x;return this;}
function rotateY(y=0){this.obj.rotation.y+=y;return this;}
function rotateZ(z=0){this.obj.rotation.z+=z;return this;}
function move(x=0,y=0,z=0){this.obj.position.add({x,y,z});return this;}
function moveX(x=0){this.obj.position.x+=x;return this;}
function moveY(y=0){this.obj.position.y+=y;return this;}
function moveZ(z=0){this.obj.position.z+=z;return this;}
function textureOffset(target,offset){
	const r=-offset[0]/this.material.self.row,
		c=offset[1]/this.material.self.col,
		uv=this.material.uv;
	target=new Set(target || [...new Array(uv.length/8).keys()]);
	this.obj.geometry.attributes.uv.array=(r || c)?uv.map((v,i)=>target.has(parseInt(i/8))?v+(i%2?r:c):v):uv;
	this.obj.geometry.attributes.uv.needsUpdate=true;
	return this;
}
function setAttr(name,value){
	if(!(name || value))return this;
	const todo=this.attr[name][value];
	this[todo[0]].bind(this)(...todo.slice(1,todo.length));
	return this;
}
function clone(position){return new this.constructor(position, this.obj.geometry);}
function appendChild(child){
	if(arguments.length > 1){
		for(let i=0,l=arguments.length;i<l;i++)
			this.obj.add(arguments[i].obj);
	}
	else this.obj.add(child.obj);
	return this;
}
function info(title='', content, url){
	this.obj.info={title, content, url};
	return this;
}
function bindMethods(){
		this.rotate=rotate;
		this.rotateX=rotateX;
		this.rotateY=rotateY;
		this.rotateZ=rotateZ;
		this.move=move;
		this.moveX=moveX;
		this.moveY=moveY;
		this.moveZ=moveZ;
		this.textureOffset=textureOffset;
		this.set=setAttr;
		this.clone=clone;
		this.appendChild=appendChild;
		this.info=info;
}
function Block(size,material,attr){
	const r=1/material.self.row,c=1/material.self.col;
	if(size[0]!==1)[18,22,26,30,34,38,42,46].forEach(v=>material.uv[v]-=(1-size[0])*c);
	if(size[1]!==1)[1,3,9,11,33,35,41,43].forEach(v=>material.uv[v]-=(1-size[1])*r);
	if(size[2]!==1){[2,6,10,14].forEach(v=>material.uv[v]-=(1-size[2])*c);[17,19,25,27].forEach(v=>material.uv[v]-=(1-size[2])*r);}
	return function block(position, geometry=null){
		if(!geometry){
			geometry = new THREE.BoxGeometry( ...size );
			geometry.attributes.uv = new THREE.BufferAttribute( material.uv, 2 );
		}
		this.material=material;
		this.obj = new THREE.Mesh( geometry ,  material.self.material );
		scene.add(this.obj);
		this.obj.position.set(...position);
		this.attr=attr;

		bindMethods.bind(this)();
	}
}


function Attachment(size,material,attr){
	return function attachment(position, geometry=null){
		if(!geometry){
			geometry = new THREE.PlaneGeometry( ...size );
			geometry.attributes.uv = new THREE.BufferAttribute( material.uv, 2 );
		}
		this.material=material;
		this.obj = new THREE.Mesh( geometry ,  material.self.material );
		scene.add(this.obj);
		this.obj.position.set(...position);
		this.attr=attr;

		bindMethods.bind(this)();
	}
}

function Entity(size,material,attr){
	return function entity(position, geometry=null){
		if(!geometry){
			geometry = new THREE.PlaneGeometry( ...size );
			geometry.attributes.uv = new THREE.BufferAttribute( material.uv, 2 );
		}
		this.material=material;
		this.obj = new THREE.Mesh( geometry ,  material.self.material );
		const child=new THREE.Mesh( geometry ,  material.self.material );
		child.rotation.y=Math.PI/2;
		this.obj.add(child);
		scene.add(this.obj);
		this.obj.position.set(...position);
		this.attr=attr;

		bindMethods.bind(this)();
	}
}

function showInfo(){
	const raycaster = new THREE.Raycaster(),
    	coords = new THREE.Vector2(),
		dom=renderer.domElement,
		info=document.createElement('div');
	info.id='info';
	document.body.appendChild(info);
	dom.addEventListener('click',function (e){
		e.preventDefault();
		info.innerHTML='';
		coords.x = (e.clientX / dom.clientWidth) * 2 - 1;
        coords.y = -(e.clientY / dom.clientHeight) * 2 + 1;
		raycaster.setFromCamera(coords, camera);
		let firstClick=raycaster.intersectObjects(scene.children,false)[0];
		firstClick=firstClick?firstClick.object.info:null;
		if(!(firstClick && firstClick.title)){info.style.visibility='hidden';return;}
		info.innerHTML=`<div id='infoTitle'>◉&nbsp;${firstClick.title}</div><div id='infoContent'>${firstClick.content}</div>${firstClick.url?`<img id='imgInfo' src='${firstClick.url}'>`:''}`;
		info.style.visibility='visible';
		info.style.top=coords.y>=0?50*(1-coords.y)+2+'vh':'unset';
		info.style.bottom=coords.y<0?50*(1+coords.y)+2+'vh':'unset';
		info.style.right=coords.x>=0?50*(1-coords.x)+2+'vw':'unset';
		info.style.left=coords.x<0?50*(1+coords.x)+2+'vw':'unset';
		info.className=firstClick.url?'imgInfo':'';
	},false);
}

if(!String.prototype.link)String.prototype.link=function(url=''){return `<a href='${url}'>${this}</a>`}

export {Block, Attachment, Entity, Material, showInfo}