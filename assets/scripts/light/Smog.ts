import { _decorator, CCFloat, CCInteger, Component, instantiate, Layers, Node, Prefab, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Smong')
export class Smong extends Component {
    @property(Prefab)
    mask: Prefab = null;

    @property({type: CCFloat})
    radius: number = 100;

    size: number = 30;
    row: number = 0;
    col: number = 0;

    blockList: Node[] = [];


    start() {
        this.generateMask();
    }

    update(deltaTime: number) {
        
    }

    generateMask() {
        this.clearMask();
        // const parentPos =  this.node.parent.position;
        const uiTransform = this.node.getComponent(UITransform);
        const { height, width } = uiTransform.contentSize;
        this.row = Math.ceil(height / this.size);
        this.col = Math.ceil(width / this.size);
        console.log('row', this.row, 'col', this.col)
        const pos = new Vec2(-width / 2, height / 2)
        for (let i = 0; i <= this.row + 2; i++) {
            const x = pos.x + i * this.size;
            for (let j = 0; j <= this.col + 2; j++) {
                const y = pos.y + j * this.size;
                this.generateSmog(x, y);
            }
        }
    }

    generateSmog(x: number, y: number) {
        // 生成蒙层
        const maskNode = instantiate(this.mask);
        maskNode.setPosition(v3(x, y, 0));
        maskNode.parent = this.node;
        maskNode.active = true;
        maskNode.layer = Layers.Enum.UI_2D;
        this.blockList.push(maskNode);
    }

    clearMask() {
        for (let i = 0; i < this.blockList.length; i++) {
            this.blockList[i].destroy();
        }
        this.blockList = [];
    }

    hideMaskBlock(pos: Vec2) {
        for (let i = 0; i < this.blockList.length; i++) {
            const block = this.blockList[i];
            const p = block.position;
            // 两点之间的距离
            const distance = Vec2.distance(p, new Vec3(pos.x, pos.y, 0));
            console.log('distance', distance);
            if (distance > this.radius) {
                block.active = false;
            }
        }
    }
}

