import { _decorator, Collider2D, Component, Contact2DType, EventTouch, Input, input, Node, PhysicsSystem2D, UITransform, Vec3 } from 'cc';
import { Smong } from './Smog';
const { ccclass, property } = _decorator;

@ccclass('Torch')
export class Torch extends Component {

    @property(Smong)
    smong: Smong = null;

    _UITransform: UITransform = null;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        // 注册全局碰撞回调函数
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        this._UITransform = this.node.getComponent(UITransform);
    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onBeginContact (self: Collider2D, other: Collider2D) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('onBeginContact', self, other);

        if (other.node.name === 'SpriteSplash') {
            // 处理与玩家碰撞的逻辑
            other.node.active = false;
        }
    }

    onTouchStart(event: EventTouch) {
        const pos = event.touch.getLocation();
        // 处理触摸开始的逻辑
        this.node.setPosition(new Vec3(pos.x, pos.y));
    }

    onTouchMove(event: EventTouch) {
        const pos = event.touch.getLocation();
        // 处理触摸开始的逻辑
        this.node.setPosition(new Vec3(pos.x, pos.y));
    }

    onTouchEnd(event: EventTouch) {
        const pos = event.touch.getLocation();
        console.log('pos', pos)
        // this.smong.hideMaskBlock(pos)
    }
}

