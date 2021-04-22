
cc.Class({
    extends: cc.Component,

    properties: {
        targetNode:cc.Node,
        knifeNode:cc.Node,
        knifePrefab:cc.Prefab

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.canThrow = true;
        this.targetNode.zIndex = 1;
        this.knifeArr = [];
        this.targetRotationRate = 3;
        this.isHit = false;
        this.gap = 15;
        setInterval(()=>{
            this.changeSpeed();
        },2000);
        this.node.on('touchstart',this.throwKnife,this);
    },
    onDestroy () {
        this.node.off('touchstart',this.throwKnife,this);
    },
    changeSpeed(){
        let direction = Math.random()>0.5?1:-1;
        let speed = 1+Math.random()*4;
        this.targetRotationRate = direction*speed;
    },
    throwKnife () {
        if(this.canThrow){
            this.canThrow = false;
            this.knifeNode.runAction(cc.sequence(
                cc.moveTo(0.15,cc.v2(this.knifeNode.x,this.targetNode.y-this.targetNode.height/2)),
                cc.callFunc(()=>{
                    for(let theKnife of this.knifeArr){
                        if(Math.abs(this.knifeNode.x - theKnife.x)<this.gap){
                            this.isHit = true;
                            break;
                        }
                    }
                    if(this.isHit){
                        this.knifeNode.runAction(
                            cc.sequence(
                                cc.spawn(
                                    cc.moveTo(0.25,cc.v2(this.knifeNode.x,-cc.winSize.height)),
                                    cc.rotateTo(0.25,30)
                                ),
                                cc.callFunc(()=>{
                                   cc.director.loadScene('Game');
                                }),
                            )
                        )
                    }else{
                        let thisKnife = cc.instantiate(this.knifePrefab);
                        thisKnife.setPosition(this.knifeNode.getPosition());
                        this.knifeArr.push(thisKnife);
                        this.node.addChild(thisKnife);
                        this.knifeNode.setPosition(cc.v2(0,-300));
                        this.canThrow = true;
                    }
                })
            ))
        }
    },
    update (dt) {
        this.targetNode.angle = (this.targetNode.angle + this.targetRotationRate)%360;
        for(let theKnife of this.knifeArr){
            theKnife.angle = (theKnife.angle + this.targetRotationRate)%360;
            let radian = (theKnife.angle-90)*Math.PI/180;
            theKnife.x = this.targetNode.x + this.targetNode.height/2 * Math.cos(radian);
            theKnife.y = this.targetNode.y + this.targetNode.height/2 * Math.sin(radian);
        }
    },

    start () {

    },

    
});
