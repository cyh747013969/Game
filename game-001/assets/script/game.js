
cc.Class({
    extends: cc.Component,

    properties: {
        blockNode:cc.Node,
        scoreLabel:cc.Label,
        baseNodeArr:[cc.Node],
        wallNodeArr:[cc.Node],
        
    },

    
    onLoad(){
        this.score = 0;
        this.node.on('touchstart',this.grow,this);
        this.node.on('touchend',this.stop,this);
        this.init();
    },
    // 初始化
    init(){
        this.blockState = 'idle';
        this.resetColor();
        this.resetWall();
    },
    onDeatroy(){
        this.node.off('touchstart',this.grow,this);
        this.node.off('touchend',this.stop,this);
    },
    grow(){
        if(this.blockState != 'idle') return
        this.blockState = 'rotate'; 
        this.seq = cc.scaleTo(1,4),
        this.gorwAction = this.blockNode.runAction(this.seq);
    },
    stop(){
        if(this.blockState != 'rotate') return
        this.blockState = 'falling'
        this.blockNode.stopAction(this.seq);
        // this.gorwAction = this.blockNode.runAction(cc.rotateTo(0.5,90));
        this.blockNode.runAction(cc.sequence(
            cc.rotateBy(0.15,45),
            cc.callFunc(()=>{
                if(this.blockNode.width*this.blockNode.scaleX<=this.baseNodeArr[1].x-this.baseNodeArr[0].x){
                    // console.log('掉落了');
                    this.blockNode.runAction(cc.sequence(
                        cc.moveTo(0.7,cc.v2(0,-1000)),
                        cc.callFunc(()=>{
                            this.gameOver();
                        })
                    ));
                }else{
                    if(this.blockNode.width*this.blockNode.scaleX<=this.wallNodeArr[1].x-this.wallNodeArr[0].x){
                        this.bounce(true);
                    }else{
                        this.bounce(false);
                    }
                }
            })
        ))
    },
    bounce(success){
        if(success){
            this.blockNode.runAction(
                cc.sequence(
                    cc.moveTo(0.5,cc.v2(0,150+this.blockNode.width*this.blockNode.scaleX/2)).easing(cc.easeBounceOut()),
                    cc.callFunc(()=>{
                        this.resetBlock();
                        this.init();
                        this.setScore(1);
                    })
                )
            );
        }else{
            debugger;
            this.blockNode.runAction(
                cc.sequence(
                    cc.moveTo(0.4,cc.v2(0,250+this.blockNode.width*this.blockNode.scaleX/2)).easing(cc.easeBounceOut())),
                    cc.callFunc(()=>{
                        this.gameOver();
                    })
                )
                // cc.moveTo(0.5,cc.v2(0,250+this.blockNode.width*this.blockNode.scaleX/2)).easing(cc.easeBounceOut()))
                
    }
        
    },
    gameOver(){
        // setTimeout(function(){
            
        // },1000)
        cc.director.loadScene('Game');
        // console.log("游戏结束")
        
    },
    setWall(node,desX){
        node.runAction(cc.moveTo(0.7,cc.v2(desX,node.y)).easing(cc.easeQuarticActionIn()));
    },
    resetWall(){
        let baseGap = 100 + Math.random()*100;
        let wallGap = baseGap +30+ Math.random()*100;
        this.setWall(this.baseNodeArr[0],-baseGap/2);
        this.setWall(this.baseNodeArr[1],baseGap/2);
        this.setWall(this.wallNodeArr[0],-wallGap/2);
        this.setWall(this.wallNodeArr[1],wallGap/2);
    },
    resetBlock(){
        this.blockNode.runAction(
            cc.spawn(
                cc.moveTo(0.5,cc.v2(0,1000)),
                cc.rotateBy(0.5,-45),
                cc.scaleTo(0.5,1)
            ),
            cc.callFunc(()=>{

            })
        )
    },
    setScore(num){
        this.score +=  num;
        this.scoreLabel.string = this.score;
        console.log(this.score);
    },
    resetColor(){
        let colorArr = ['#4cb4e7','#ffc09f','#c7b3e5','#588c7e','#a3a380'];
        this.node.color = cc.Color.BLACK.fromHEX(colorArr[parseInt(Math.random()*colorArr.length)]);
    }

    // update (dt) {},
});
