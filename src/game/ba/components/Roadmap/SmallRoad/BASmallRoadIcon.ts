namespace we {
  export namespace ba {
    export class BASmallRoadIcon extends BARoadIconBase {
      private iconFaceArr: egret.DisplayObjectContainer[];
      private iconFace: egret.DisplayObjectContainer;

      public constructor(size: number = 30) {
        super(size);
        this.initGraphics();
        this.setByObject({});
      }

      protected initGraphics() {
        this.iconFaceArr = new Array<egret.DisplayObjectContainer>();
        this.iconFace = new egret.DisplayObjectContainer();
        this.addChild(this.iconFace);

        // const colors = [0xdd0000, 0x0000dd, 0xaa0000, 0x0000aa];
        const gradientColors = [
          [0xee2e2e, 0xee2e2e],
          [0x3531ec, 0x3531ec],
          [0xdd6666, 0xaa0000],
          [0x6666dd, 0x000066],
        ];

        const iconSize = this.size;
        const circleRadius = (this.size / 2) * 0.8;
        const offset = (iconSize - circleRadius * 2) / 2;
        // draw the dark modes
        for (let d = 0; d < 2; d++) {
          // draw the icon faces
          for (let i = 0; i < 2; i++) {
            const face = new egret.DisplayObjectContainer();
            const circle = new egret.Shape();
            // circle.graphics.beginFill(colors[i], 1);
            const fillMatrix = new egret.Matrix();
            fillMatrix.createGradientBox(this.size, this.size, Math.PI / 2, 0, 0);
            circle.graphics.beginGradientFill(egret.GradientType.LINEAR, gradientColors[i + d * 2], [1, 1], [0, 255], fillMatrix);
            circle.graphics.drawCircle(circleRadius + offset, circleRadius + offset, circleRadius);
            circle.graphics.endFill();
            face.addChild(circle);
            face.visible = false;
            this.iconFaceArr.push(face);
            this.iconFace.addChild(face);
          }
        }
      }

      public setByObject(value: any) {
        this.reset();

        const useDarkMode = this.darkModeNumber === 0 ? 0 : 2;

        if (value.v != null) {
          if (value.v === 'b') {
            this.iconFaceArr[0 + useDarkMode].visible = true;
          } else if (value.v === 'p') {
            this.iconFaceArr[1 + useDarkMode].visible = true;
          }
        }
      }

      public reset() {
        for (const face of this.iconFaceArr) {
          face.visible = false;
        }
      }
    }
  }
}
