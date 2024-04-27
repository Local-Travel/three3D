import { _decorator, Component, EventTouch, Input, input, misc, Node, Quat, RigidBody, Vec2, Vec3 } from 'cc';
import { JoyStick } from './JoyStick';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(JoyStick)
    joyStick: JoyStick = null;

    @property
    speed: number = 0;

    ignoreLen: number = 0.5;
    vector: Vec2 = new Vec2(0, 0);

    onLoad () {
        // input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        
    }

    update(deltaTime: number) {
        this.vector = this.joyStick.direction;
        let dir = this.vector.normalize();
        console.log('dir.length()', dir, dir.length())
        if (dir && dir.length() < this.ignoreLen) {
            return
        }

        const vx = this.speed * dir.x;
        const vy = this.speed * dir.y;

        console.log('vx vy', vx, vy)

        const pos = this.node.position;
        this.node.setPosition(pos.x + vx, pos.y + vy, pos.y)
        // this.node.angle = this.joyStick.angle;
    }

    onDestroy () {
        // input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    // onTouchStart(event: EventTouch) {
    //     console.log(event.getLocation());  // Location on screen space
    //     console.log(event.getUILocation());  // Location on UI space
    // }

    
    onTouchMove(event: EventTouch) {
        console.log(event.getLocation());  // Location on screen space
        console.log(event.getUILocation());  // Location on UI space

        let lv = new Vec3(0, 0, 0)
        let rb = this.node.getComponent(RigidBody);
        if (rb) {
            rb.getLinearVelocity(lv)
        }

    }

    onTouchEnd(event: EventTouch) {
        
    }
}

