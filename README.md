# AnimateMinecraft

Minecraft 3d动画制作

mcmod上的教程只能用markdown写，对于一个3d沙盒游戏来说还是太抽象了。比如机械动力中的思索功能（ponderjs）就十分直观，但可惜只能在mc中运行，不能在浏览器中发扬光大，
所以我决定用Three.js封装一个MC动画的库。截至此项目创建，Three.js我只学了半个月，但生成几个方块还是绰绰有余的。

此项目有两大任务：
* ✔ 显示3D模型； 
* 🔲 流畅运行动画； 

---
# 示例
* 红石自动化血魔法祭坛（极简版）
  * [mcmod](https://www.mcmod.cn/post/2343.html)
  * [AMC](https://cjl233.github.io/AnimateMinecraft/examples/altar/)


---
# 制作模型

制作一个模型需要自制两个文件：
* 模型贴图( atlas.png )
* 用于模型生成的js( index.js )

## atlas.png

首先需要准备许多相同尺寸的素材，如[img/texture/src/](examples/altar/img/src)中所示，再将这些素材依次排列到一张透明底的png上即可制成一张总的贴图文件atlas.png

## index.js

1. 引入AMC库
```javascript
import * as AMC from 'AMC'
```
2. 创建材质包
```javascript
const oneSide=new AMC.Material('./img/texture/atlas.png', 8, 8),
    dbSide=oneSide.clone({side: 2});
```
  * 此代码表示从'./img/texture/atlas.png'生成一个8行8列的材质，并赋值给常量oneSide，原始贴图'./img/texture/atlas.png'会被切割为8行8列共计64张图片；
  * 之所以叫oneSide是因为默认生成的材质是只有一面显示的，dbSide是一个双面材质，调用oneSide的.clone方法而不是新建一个AMC.Material是为了节约内存
3. 注册模型
```javascript
//Block类型
const brick=AMC.Block(
        [1, 1, 1],   //模型尺寸[长:x, 高:y, 宽:z]
        oneSide.getUV(new Array(6).fill([1,5])  //从oneSide材质获取方块的贴图信息(UV)，传入一个二维数组[x+:[U,V], x-:[U,V], y+:[U,V], y-:[U,V], z+:[U,V], z-:[U,V]]
      //oneSide.getUV([[1,5],[1,5],[1,5],[1,5],[1,5],[1,5]])等价于上式
    ))
```
  * 上例中声明了一个1x1x1且材质为单面的方块，并赋值给了常量brick
```javascript
//Attachment类型
const redstone=AMC.Attachment(
        [1,1],    //模型尺寸[长:x, 高:y]
        oneSide.getUV([[3 ,4]]),   //从oneSide材质获取方块的贴图信息(UV)，传入一个二维数组[x+:[U,V]]
        {'enable': [    //新增属性enable
            ['textureOffset', null, [0,0]],    //enable=0时，将材质偏移0行0列，即不改变材质
            ['textureOffset', null, [0,1]]    //enable=1时，将材质向右偏移1列，恰好为红石充能时的材质
        ]}
    ))
```
  * 上例中声明了一个1x1且材质为单面的附着物(面片)，并赋值给了常量redstone，此附着物的enable属性变成1时替换成充能时的材质
```javascript
//Entity类型
const orb=AMC.Entity(
        [0.5,0.5],   //模型尺寸[长:x, 高:y]
        dbSide.getUV([[3,6]])  //从dbSide材质获取方块的贴图信息(UV)，传入一个二维数组[x+:[U,V]]
    ))
```
  * 上例中声明了一个0.5x0.5的实体(也是物品)，并赋值给了常量orb，为了节约资源，Entity类型其实是两块相互垂直的面片，为了防止反面没有材质，此类型建议使用双面材质
4. 生成模型
```javascript
new brick([1,-1,1])    //在[1,-1,1]处生成一个新brick
    .clone([1,0,2])    //在[1,0,2]处基于已有的brick复制一个brick
    .clone([0,-2,2])
    .clone([-1,-1,2]);
```
  * brick是已声明的方块，6个面的贴图都是1行5列处的石砖。使用new关键字就可以在场景中[1,-1,1]处创建一个全新的石砖，使用.clone方法可以持续地在更多地方生成全同(有相同材质，特性，位置和旋转相互独立)的石砖。使用.clone()生成新石砖而不用new brick()是因为两块石砖有大量属性完全相同，重复new brick会生成大量冗余数据，降低流畅度。
```javascript
new torch([1,1,2]).moveY(-3/16)    //在[1,1,2]处生成一根全新的torch(红石火把)，并将其沿Y轴向下移动-3/16
    .clone([0,0,2]).rotateZ( Math.PI/6).moveX(0.4)    //在[0,0,2]处基于上面的torch克隆一个torch，并将其绕Z轴旋转30°再沿X轴平移0.4个单位长度
    .set('enable',1)    //将两根火把的enable属性设置为1
```
  * 用clone生成了两根相互绑定的熄灭红石火把，两根火把除了位置不同，材质完全相同。因此将其中任意一个的enable设为1都会导致材质同时变化，变为点亮的红石火把，从而实现状态的同步改变，而不用去分别注册激活的和未激活两种红石火把

5. 注册/生成模型简写

  * 调用AMC.Block方法注册方块，其返回值其实是js中的一个构造函数constructor，因此某个方块只出现一次时可以将注册和生成写在一起
```javascript
new ( AMC.Block([1, 1, 1], oneSide.getUV([[1,0],[1,0],[1,1],[1,1],[1,0],[1,0]])) )([1,1,0])
    .info('ME接口','方向设置为朝下，自动从AE网络中调用气血宝珠','img/02.png');
```
等价于
```javascript
const Interface=AMC.Block([1, 1, 1], oneSide.getUV([[1,0],[1,0],[1,1],[1,1],[1,0],[1,0]]));    //注册1x1x1的ME接口
new ( Interface )([1,1,0])    //在[1,1,0]生成ME接口
    .info('ME接口','方向设置为朝下，自动从AE网络中调用气血宝珠','img/02.png');    //为这个ME接口添加提示信息.info(标题, 内容文本, 图片的链接)，在点击到ME接口时会显示这些信息
```

6. 展示信息
```javascript
AMC.showInfo();    //显示提示信息
```
等到所有模型注册并添加完成后，执行此函数为所有Block、Attachment、Entity添加点击事件，点击后显示创建时设置的信息
