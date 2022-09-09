import * as AMC from 'AMC'


/*Materials*/
const oneSide=new AMC.Material('./img/texture/atlas.png', 8, 8),
    dbSide=oneSide.clone({side: 2});


/*Blocks*/
new (AMC.Block([1, 11/16, 1], oneSide.getUV([[0,2],[0,3],[0,1],[0,0],[0,4],[0,5]])))([0,-1,0]).moveY(-5/32);
new (AMC.Block([1, 1, 1], oneSide.getUV([[1,0],[1,0],[1,1],[1,1],[1,0],[1,0]])))([1,1,0]).info('ME接口','方向设置为朝下，自动从AE网络中调用气血宝珠','img/02.png');
new (AMC.Block([7/8, 15/16, 7/8], oneSide.getUV([[2,0],[1,7],[1,6],[1,6],[1,7],[1,7]])))([1,0,0]).info('箱子','可以用能被比较器检测的任意箱子代替');
new (AMC.Block(
    [1, 1/8, 1], 
    oneSide.getUV([[1,4],[1,4],[1,2],[1,4],[1,4],[1,4]]), 
    {'enable': [
        ['textureOffset', null, [0,0]],
        ['textureOffset', null, [0,1]]
    ]}
))([1,0,1]).moveY(-7/16).rotateY( Math.PI ).info('比较器','为节约资源被降维打击');
new (AMC.Block(
    [1, 1, 1], 
    oneSide.getUV(new Array(6).fill([0,6])), 
    {'enable': [
        ['textureOffset', null, [0,0]],
        ['textureOffset', null, [0,1]]
    ]}
))([0,-2,0]).info('红石灯','放置在祭坛底下，当祭坛完成某个配方时，祭坛会被强充能约3秒钟')


const brick=AMC.Block(
        [1, 1, 1], 
        oneSide.getUV(new Array(6).fill([1,5])
    )),
    torch=AMC.Block(
        [1/8, 5/8, 1/8], 
        oneSide.getUV([[3,0],[3,0],[3,2],[3,0],[3,0],[3,0]]), 
        {'enable': [
            ['textureOffset', null, [0,0]],
            ['textureOffset', null, [0,1]]
        ]}
    ),
    conduit=AMC.Block(
        [3/8,3/8,3/8], 
        oneSide.getUV(new Array(6).fill([2,4]))
    ),
    pipe=0.34375,connection=new(AMC.Block(
        [3/8,5/16,3/8], 
        oneSide.getUV([[2,5],[2,5],[2,4],[2,4],[2,5],[2,5]])
    ))([0,pipe,0]),
    end=new(AMC.Block(
        [1/2,1/4,1/2],
        oneSide.getUV([[2,7],[2,7],[2,6],[2,6],[2,7],[2,7]])
    ))([-7/16,0,0]),
    extractor=AMC.Block(
        [1/2,1/4,1/2], 
        oneSide.getUV([[2,2],[2,2],[2,1],[2,1],[2,2],[2,2]]),
        {'enable': [
            ['textureOffset', null, [0,0]],
            ['textureOffset', [0,1,4,5], [0,1]]
        ]}
    );

new brick([1,-1,1]).clone([1,0,2]).clone([0,-2,2]).clone([-1,-1,2]);
new torch([1,1,2]).moveY(-3/16).clone([0,0,2]).rotateZ( Math.PI/6).moveX(0.4).set('enable',1);
new torch([-1,-1,1]).rotate(0, -Math.PI/2, Math.PI/6).moveZ(0.4);
new conduit([1,-1,0]).appendChild(connection, connection.clone([-pipe,0,0]).rotateZ(Math.PI/2), end.rotateZ(Math.PI/2), new extractor([0,3/8+0.01,0]).set('enable',1)).info('热力膨胀：伺服器','收到红石信号时关闭')
.clone([0,0,0]).appendChild(connection.clone([0,-pipe,0]), connection.clone([0,pipe,0]), connection.clone([-pipe,0,0]).rotateZ(Math.PI/2), new extractor([0,-3/8-0.01,0]).rotateZ(Math.PI)).info('热力膨胀：伺服器','收到红石信号时提取')
.clone([0,1,0]).appendChild(connection.clone([0,-pipe,0]).rotateX(-Math.PI), connection.clone([pipe,0,0]).rotateZ(-Math.PI/2),  end.clone([7/16,0,0]).rotateZ(-Math.PI/2))
.clone([-1,0,0]).appendChild(connection.clone([0,-pipe,0]).rotateX(-Math.PI), connection.clone([pipe,0,0]).rotateZ(-Math.PI/2))
.clone([-1,-1,0]).appendChild(connection.clone([0,pipe,0]), connection.clone([pipe,0,0]).rotateZ(-Math.PI/2), new extractor([3/8+0.01,0,0]).rotateZ(-Math.PI/2)).info('热力膨胀：伺服器','收到红石信号时提取，白名单过滤气血宝珠','img/01.png')
.clone([0,-1,1]).appendChild(connection.clone([0,pipe,0]), connection.clone([0,0,-pipe]).rotateX(-Math.PI/2), end.clone([0,0,-7/16]).rotateX(-Math.PI/2))
.clone([0,0,1]).appendChild(connection.clone([0,-pipe,0]).rotateX(-Math.PI), connection.clone([0,pipe,0]))
.clone([0,1,1]).appendChild(connection.clone([0,-pipe,0]).rotateX(-Math.PI), connection.clone([pipe,0,0]).rotateZ(-Math.PI/2))
.clone([1,1,1]).appendChild(connection.clone([0,0,-pipe]).rotateX(-Math.PI/2), connection.clone([-pipe,0,0]).rotateZ(Math.PI/2), new extractor([0,0,-3/8-0.01]).rotateX(-Math.PI/2).set('enable',1)).info('热力膨胀：伺服器','收到红石信号时关闭');


/*Attachments*/
new (AMC.Attachment(
    [1,1], 
    oneSide.getUV([[3 ,4]]), 
    {'enable': [
        ['textureOffset', null, [0,0]],
        ['textureOffset', null, [0,1]]
    ]}
))([0,-1,2]).rotateX(-Math.PI/2).moveY(-0.45).set('enable',1);


/*Entities*/
new (AMC.Entity(
    [0.5,0.5],
    dbSide.getUV([[3,6]])
))([0,-0.7,0]);


/*clickEvent*/
AMC.showInfo();
