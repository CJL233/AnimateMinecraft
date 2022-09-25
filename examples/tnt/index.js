import * as AMC from 'AMC' 
const defaultTexture=new AMC.Material('img/texture/atlas_defaultTexture.png',4,4),
tnt=AMC.Block([1,1,1],defaultTexture.getUV([[1,0],[1,0],[1,1],[1,2],[1,0],[1,0]])),
tnt_226=new tnt([0,0,0]),
piston=AMC.Block([1,1,1],defaultTexture.getUV([[0,0],[0,0],[0,1],[0,2],[0,0],[0,0]])),
piston_909=new piston([2,0,0]).rotateZ(1.57)
.clone([-2,0,0]).rotateZ(-1.57),
observer=AMC.Block([1,1,1],defaultTexture.getUV([[3,2],[3,2],[3,3],[3,3],[3,1],[3,0]])),
observer_547=new observer([1,0,0]).rotateY(Math.PI)
.clone([3,0,0]).rotateY(1.57),
brick=AMC.Block([1,1,1],defaultTexture.getUV([[0,3],[0,3],[0,3],[0,3],[0,3],[0,3]])),
brick_509=new brick([0,1,0])
.clone([1,1,0])
.clone([-2,1,0])
.clone([1,0,1])
.clone([-1,0,1])
.clone([0,-1,1]),
stonePart=AMC.Block([0.5,0.5,1],defaultTexture.getUV([[1,3],[1,3],[1,3],[1,3],[1,3],[1,3]])),
stonePart_141=new stonePart([-1,1,0]).move(-0.25,0.25,0)
.clone([-1,1,0]).move(0.25,0.25,0)
.clone([-1,1,0]).move(0.25,-0.25,0),
redstone=AMC.Attachment(
    [1,1],
    defaultTexture.getUV([[2,0]]),
    {'state':[
        ['textureOffset', null , [0,0]],
        ['textureOffset', null , [0,1]],
        ['textureOffset', null , [0,2]],
        ['textureOffset', null , [0,3]]
    ]}
),
redstone_839=new redstone([1,2,0]).rotateX(-1.57).moveY(-0.49).set('state',1)
.clone([1,1,1]).rotate(-1.57,0,-1.57).moveY(-0.49),
redstone_849=new redstone([0,2,0]).rotateX(-1.57).moveY(-0.49).set('state',3)
.clone([-1,2,0]).rotateX(-1.57).moveY(-0.49)
.clone([-2,2,0]).rotateX(-1.57).moveY(-0.49)
.clone([0,0,1]).rotateX(-1.57).moveY(-0.49)
.clone([1,1,1]).moveZ(-0.49).rotateZ(1.57)
.clone([0,0,1]).rotate(1.57,-1.57,0).moveX(0.49);
