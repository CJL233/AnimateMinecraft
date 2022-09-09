# AnimateMinecraft

Minecraft 3d动画制作

mcmod上的教程只能用markdown写，对于一个3d沙盒游戏来说还是太抽象了。比如机械动力中的思索功能（ponderjs）就十分直观，但可惜只能在mc中运行，不能在浏览器中发扬光大，
所以我决定用Three.js封装一个MC动画的库。截至此项目创建，Three.js我只学了半个月，但生成几个方块还是绰绰有余的。

此项目有两大任务：
* ✔ 显示3D模型； 
* 🔲 流畅运行动画； 

---
# 制作模型

制作一个模型需要自制两个文件：
* 模型贴图( atlas.png )
* 用于模型生成的js( index.js )

## atlas.png

首先需要准备许多相同尺寸的素材，如[img/texture/src/]中所示，再将这些素材依次排列到一张透明底的png上即可制成一张总的贴图文件atlas.png

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
        oneSide.getUV(new Array(6).fill([1,5])  //从oneSide材质获取方块的贴图信息(UV)，传入一个二维数组[x+, x-, y+, y-, z+, z-]
      //oneSide.getUV([[1,5],[1,5],[1,5],[1,5],[1,5],[1,5]])等价于上式
    ))
```
  * 上例中声明了一个1x1x1且材质为单面的方块，并赋值给了常量brick
```javascript
//Attachment类型
const redstone=AMC.Attachment(
        [1,1],    //模型尺寸[长:x, 高:y]
        oneSide.getUV([[3 ,4]]),   //从oneSide材质获取方块的贴图信息(UV)，传入一个二维数组[x+, x-, y+, y-]
        {'enable': [    //新增属性enable
            ['textureOffset', null, [0,0]],    //
            ['textureOffset', null, [0,1]]    //
        ]}
    ))
```
  * 上例中声明了一个1x1且材质为单面的附着物(面片)，并赋值给了常量redstone
```javascript
//Block类型
const brick=AMC.Block(
        [1, 1, 1],   //模型尺寸[长:x, 高:y, 宽:z]
        oneSide.getUV(new Array(6).fill([1,5])  //从oneSide材质获取方块的贴图信息(UV)，传入一个二维数组[x+, x-, y+, y-, z+, z-]
      //oneSide.getUV([[1,5],[1,5],[1,5],[1,5],[1,5],[1,5]])等价于上式
    ))
```
  * 上例中声明了一个1x1x1的方块，并赋值给了常量brick
4. 生成模型
5. 注册/生成模型简写
6. 展示信息
