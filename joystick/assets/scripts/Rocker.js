// Rocker.js

cc.Class({
    extends: cc.Component,

    properties: {
        sceneNode: {    // 场景节点
            type: cc.Node,
            default: null,
        },

        playerNode: {    // player节点
            type: cc.Node,
            default: null,
        },

        playerNodeSpeed: 100,    // player移动速度

        Max_r: 100,    // 摇杆移动半径，根据自己美术资源进行调整
    },

    onLoad() {
        // 隐藏摇杆组件节点
        this.node.active = false;

        // 获取摇杆节点并初始化摇杆节点位置及角度
        this.joystick = this.node.getChildByName('joystick')
        this.joystick.setPosition(cc.v2(0, 0));
        this.dir = cc.v2(0, 0);

        // 注册父节点的 touch 监听事件
        this.sceneNode.on(cc.Node.EventType.TOUCH_START, this.cbTouchStart, this);
        this.sceneNode.on(cc.Node.EventType.TOUCH_MOVE, this.cbTouchMove, this);
        this.sceneNode.on(cc.Node.EventType.TOUCH_END, this.cbTouchEnd, this);
        this.sceneNode.on(cc.Node.EventType.TOUCH_CANCEL, this.cbTouchCancel, this);
    },

    update(dt) {
        if (this.dir.mag() < 0.5) {
            return;
        }

        let vx = this.dir.x * this.playerNodeSpeed;
        let vy = this.dir.y * this.playerNodeSpeed;

        let sx = vx * dt;
        let sy = vy * dt;
        //移动
        this.playerNode.x += sx;
        this.playerNode.y += sy;

        let windowsSize = cc.winSize;

        let minX = -windowsSize.width / 2 + this.playerNode.width / 2;    // 最小X坐标
        let maxX = Math.abs(minX);    // 最大X坐标
        let minY = -windowsSize.height / 2 + this.playerNode.height / 2;    // 最小Y坐标
        let maxY = Math.abs(minY);    // 最大Y坐标

        let currentPos = this.playerNode.getPosition();

        if (currentPos.x < minX) {
            currentPos.x = minX;
        } else if (currentPos.x > maxX) {
            currentPos.x = maxX;
        } 
        
        if (currentPos.y < minY) {
            currentPos.y = minY;
        } else if (currentPos.y > maxY) {
            currentPos.y = maxY;
        }

        this.playerNode.setPosition(currentPos);

        //方向计算
        var r = Math.atan2(this.dir.y, this.dir.x);
        var degree = r * 180 / (Math.PI);
        degree = 360 - degree + 90;
        this.playerNode.rotation = degree;
    },

    cbTouchStart(event) {
        let pos = event.getLocation();

        // 点击时显示摇杆组件节点并设置位置
        this.node.active = true;
        let rPos = this.sceneNode.convertToNodeSpaceAR(pos);    // 将世界坐标转化为场景节点的相对坐标
        this.node.setPosition(rPos);
        
        // 初始化摇杆节点位置及角度
        this.joystick.setPosition(cc.v2(0, 0));
        this.dir = cc.v2(0, 0);
    },

    cbTouchMove(event) {
        var pos = event.getLocation();

        var jPos = this.node.convertToNodeSpaceAR(pos);    // 将世界坐标转化为摇杆组件节点的相对坐标

        // 获取摇杆的角度
        let len = jPos.mag();
        this.dir.x = jPos.x / len;
        this.dir.y = jPos.y / len;

        // 设置摇杆的位置
        if (len > this.Max_r) {
            jPos.x = this.Max_r * jPos.x / len;
            jPos.y = this.Max_r * jPos.y / len;
        }
        this.joystick.setPosition(jPos);
    },

    cbTouchEnd(event) {
        // 初始化摇杆节点位置及角度
        this.joystick.setPosition(cc.v2(0, 0));
        this.dir = cc.v2(0, 0);
        this.node.active = false;
    },

    cbTouchCancel(event) {
        // 初始化摇杆节点位置及角度
        this.joystick.setPosition(cc.v2(0, 0));
        this.dir = cc.v2(0, 0);
        this.node.active = false;
    }
});
