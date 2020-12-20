// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.TiledLayer)
    wall : cc.TiledLayer = null;
    
    @property(cc.RigidBody)
    car : cc.RigidBody = null;

    @property(cc.Camera)
    mainCamera : cc.Camera = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let p = cc.director.getPhysicsManager();
        p.enabled = true;
        p.debugDrawFlags = 1;
        p.gravity = cc.v2(0,0);

        // this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchClick,this);
    }

    onTouchClick(event){
        let size = cc.view.getVisibleSize();
        if (event.getLocation().x < size.width/2) {
            this.car.applyLinearImpulse(cc.v2(-10000,1000),cc.v2(0,0),true);
        }else{
            this.car.applyLinearImpulse(cc.v2(10000,1000),cc.v2(0,0),true);
        }
    }

    start () {
        // 20 * 20
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                let n = this.wall.getTileGIDAt(i,j);
                // cc.log(n);
                if (n != 0) {
                    let x = -1280 / 2 + i * 64 + 32;
                    let y = 1280 / 2 - j * 64 - 32;
                    let p : cc.PhysicsBoxCollider = this.wall.node.addComponent(cc.PhysicsBoxCollider);
                    p.offset.set(cc.v2(x,y));
                    p.size.width = 64;
                    p.size.height = 64;
                    p.apply();
                }
            }
        }
    }

    update (dt) {
        let hudu = cc.misc.degreesToRadians(-this.car.node.angle);
        let x = Math.sin(hudu);
        let y = Math.cos(hudu);
        this.car.applyForceToCenter(cc.v2(1000 * x, 1000 * y),false);
        
        this.mainCamera.node.position = this.car.node.position;
    }
}
