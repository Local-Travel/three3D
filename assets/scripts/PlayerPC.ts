import { _decorator, Collider, Component, EventKeyboard, EventMouse, Input, input, KeyCode, macro, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
const InputCode: { [key: string]: any } = {}

@ccclass('PlayerPC')
export class PlayerPC extends Component {
    @property(Node)
    minCamera: Node = null

    @property(Node)
    header: Node = null

    speed: number = 5
    jumpSpeed: number = 5
    angleSpeed: number = 1
    rb: RigidBody = null
    cameraOffsetZ: number = 0
    isJumping: boolean = false
    isMouseDown: boolean = false

    collider: Collider = null

    onLoad () {
        // 键盘
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        // 鼠标
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        
        this.collider = this.getComponent(Collider)
        if (this.collider) {
            this.collider.on('onTriggerEnter', this.onTriggerEnter, this)
        }
    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);

        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

        if (this.collider) {
            this.collider.off('onTriggerEnter', this.onTriggerEnter, this)
        }
    }

    start() {
        this.rb = this.node.getComponent(RigidBody)
        console.log('rb', this.rb)
        this.cameraOffsetZ = this.minCamera.worldPosition.z - this.node.worldPosition.z
    }

    update(deltaTime: number) {
        let lv = new Vec3(0, 0, 0)
        let rb = this.node.getComponent(RigidBody)
        rb.getLinearVelocity(lv)

        if (InputCode[KeyCode.KEY_W]) {
            console.log('向前')
            lv.z = -this.speed
            lv.x = 0
        } else if (InputCode[KeyCode.KEY_S]) {
            console.log('向后')
            lv.z = this.speed
            lv.x = 0
        } else if (InputCode[KeyCode.KEY_A]) {
            console.log('向左')
            lv.x = -this.speed
            lv.z = 0
        } else if (InputCode[KeyCode.KEY_D]) {
            console.log('向右')
            lv.x = this.speed
            lv.z = 0
        } else {
            lv = new Vec3(0, lv.y, 0)
        }

        if (InputCode[KeyCode.SPACE] && !this.isJumping) {
            console.log('跳跃')
            lv.y = this.jumpSpeed
            this.isJumping = true
        }

        let angle = this.node.eulerAngles;

        if (InputCode[KeyCode.KEY_Q]) {
            this.node.setRotationFromEuler(new Vec3(angle.x, angle.y + this.angleSpeed, angle.z))
        } else if (InputCode[KeyCode.KEY_E]) {
            this.node.setRotationFromEuler(new Vec3(angle.x, angle.y - this.angleSpeed, angle.z))
        }

        Vec3.transformQuat(lv, lv, this.node.getRotation())

        rb.setLinearVelocity(lv)
    }

    lateUpdate(dt: number): void {
        const pos = this.minCamera.getWorldPosition()
        pos.z = this.node.worldPosition.z + this.cameraOffsetZ
        this.minCamera.setPosition(pos)
    }

    onTriggerEnter(event: any) {
        this.isJumping = false
    }

    onKeyDown (event: EventKeyboard) {
        // switch(event.keyCode) {
        //     case KeyCode.KEY_A:
        //         // console.log('Press a key');
        //         break;
        // }
        InputCode[event.keyCode] = true
        console.log('按下', event.keyCode, InputCode[event.keyCode])
    }

    onKeyUp (event: EventKeyboard) {
        // switch(event.keyCode) {
        //     case KeyCode.KEY_A:
        //         console.log('Release a key');
        //         break;
        // }
        InputCode[event.keyCode] = false
    }

    onMouseDown (event: EventMouse) {
        this.isMouseDown = true
    }

    onMouseUp (event: EventMouse) {
        this.isMouseDown = false
    }

    onMouseMove (event: EventMouse) {
        if (!this.isMouseDown) return false;
        let delta = event.getDelta()
        if (delta.x != 0) {
            let angle = this.node.eulerAngles;
            this.node.setRotationFromEuler(new Vec3(angle.x, angle.y - delta.x * this.angleSpeed, angle.z))
        }

        if (delta.y != 0) {
            let angle = this.header.eulerAngles;
            let angleX = angle.x + delta.y * this.angleSpeed
            if (angleX > 90) {
                angleX = 90
            } else if (angleX < -90) {
                angleX = -90
            }
            this.header.setRotationFromEuler(new Vec3(angleX, angle.y, angle.z))
        }
    }
}

