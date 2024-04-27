import { _decorator, Camera, CCFloat, Component, EventTouch, Input, input, math, Node, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {
    @property(Node)
    stickBg: Node = null;

    @property(Node)
    circle: Node = null;

    @property(Camera)
    camera: Camera = null;

    @property({ type: CCFloat})
    radius: number = 0;

    // 方向
    direction: Vec2 = new Vec2();
    // 角度
    angle: number = 0;

    private _uiTransform: UITransform = null;

    start() {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this._uiTransform = this.node.getComponent(UITransform);
    }

    update(deltaTime: number) {
        if (this.direction.x == 0 && this.direction.y == 0) {
            return;
        }

        // 弧度转角度
        this.angle = this.VectorToAngle(this.direction);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchMove(event: EventTouch) {
        const screenPos = event.getLocation();
        // 摄像机，把世界坐标转换到屏幕坐标
        const wPos = this.camera.screenToWorld(v3(screenPos.x, screenPos.y));
        // 把世界坐标转换成节点坐标
        const nPos = this._uiTransform.convertToNodeSpaceAR(wPos);

        let len = nPos.length();
        if (len < this.radius) {
            this.circle.setPosition(nPos);
        } else {
            const pos = nPos.normalize();
            const x = pos.x * this.radius;
            const y = pos.y * this.radius;
            this.circle.setPosition(x, y);
        }
        this.direction = new Vec2(this.circle.position.x, this.circle.position.y);
    }

    onTouchEnd(event: EventTouch) {
        this.circle.setPosition(0, 0);
        this.direction = new Vec2(0, 0);
    }

    VectorToAngle(vec: Vec2) {
        const dir = vec.normalize();
        const radian = dir.signAngle(new Vec2(1, 0));
        const angle = -180 / Math.PI * radian;
        return angle;
    }

    AngleToVector(angle: number) {
        const radian = (angle * Math.PI) / 180;
        const vec = new Vec2(Math.cos(radian), Math.sin(radian)).normalize();
        return vec;
    }
}

