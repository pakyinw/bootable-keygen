namespace we {
  export namespace ba {
    export class BABeadRoad extends BARoadBase {
      public constructor(_numCol: number = 12, _gridSize: number = 30, _scale: number = 1) {
        super(_numCol, _gridSize, _scale);
        this.gridUnit = 1;

        // this.touchEnabled = true;
        // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);

        this.addEventListener(mouse.MouseEvent.ROLL_OVER, this.onOver, this);
        this.addEventListener(mouse.MouseEvent.ROLL_OUT, this.onOut, this);
        /*if (!this.roadMapIconList) {
          this.initRoadData();
        }*/
      }

      protected createIcon(size: number): BABeadRoadIcon {
        return new BABeadRoadIcon(size);
      }

      public set Mode(mode: number) {
        for (const elem of this.roadMapIconList) {
          const icon: BABeadRoadIcon = elem as BABeadRoadIcon;
          icon.Mode = mode;
        }
      }

      public get Mode(): number {
        const icon: BABeadRoadIcon = this.roadMapIconList[0] as BABeadRoadIcon;
        return icon.Mode;
      }

      private onClick(e: egret.TouchEvent) {
        // this.Mode = ++this.Mode % 2;
      }

      private onOver(e: mouse.MouseEvent) {
        console.log(e);
        mouse.setMouseMoveEnabled(true);
        this.stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMove, this);
      }

      private onMove(e: egret.TouchEvent) {
        console.log(e);
        let pt: egret.Point = new egret.Point(0, 0);
        this.globalToLocal(e.stageX, e.stageY, pt);
        pt = pt;
        const posX: number = pt.x;
        const posY: number = pt.y;
        if (posX > 0 && posX < this.gridSize * this.numCol && posY > 0 && posY < this.gridSize * 6) {
          const col = Math.floor(posX / this.gridSize);
          const row = Math.floor(posY / this.gridSize);
          const index = col * 6 + row;
        }
      }

      private onOut(e: mouse.MouseEvent) {
        console.log(e);
        if (this.stage.hasEventListener(mouse.MouseEvent.MOUSE_MOVE)) {
          mouse.setMouseMoveEnabled(false);
          this.stage.removeEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMove, this);
        }
      }

      public dispose() {}
    }
  }
}
