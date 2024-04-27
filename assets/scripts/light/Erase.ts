import { _decorator, Color, Component, EventTouch, Graphics, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Erase')
export class Erase extends Component {
    @property(Node)
    mask: Node = null;

    size: number = 200;

    private _UITransform: UITransform = null;
    private _g: Graphics = null;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    start() {
        this._UITransform = this.mask.getComponent(UITransform);
        this._g = this.mask.getComponent(Graphics);
        console.log('this.mask', this.mask)
    }

    update(deltaTime: number) {
        
    }

    onTouchStart(event: EventTouch) {
        // const wPos = this.getWorldPos(event);
        // this.addCircle(wPos);
    }

    onTouchMove(event: EventTouch) {
        const wPos = this.getWorldPos(event);
        this.clearCircle();
        this.addCircle(wPos);
    }

    onTouchEnd(event: EventTouch) {
        // const wPos = this.getWorldPos(event);
        // this.clearCircle();
        // this.addCircle(wPos);
    }

    getWorldPos(event: EventTouch) {
        const pos = event.touch.getLocation();
        const wPos = this._UITransform.convertToNodeSpaceAR(new Vec3(pos.x, pos.y));
        return wPos;
    }

    addCircle(pos: Vec3) {
        // 画一个圆形节点
        this._g.circle(pos.x, pos.y, this.size);
        this._g.fill();
    }

    clearCircle() {
        this._g.clear();
    }
}

