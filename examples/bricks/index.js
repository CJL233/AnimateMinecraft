import * as AMC from 'AMC' 
const Material255=new AMC.Material('img/texture/atlas_Material255.png',2,2),
brick=AMC.Block([1,1,1],Material255.getUV([[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]])),
brick_550=new brick([0,0,0]),
brick_985=new brick([1,0,0]),
brick_206=new brick([1,2,1]);
