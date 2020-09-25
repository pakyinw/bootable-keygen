namespace we {
  export namespace lw {
    export class LwLobbyBeadRoad extends ui.Panel implements we.ui.ILobbyRoad {
      protected beadRoad: LwBeadRoad;

      public roadIndentX: number = 0;
      public roadIndentY: number = 0;

      public roadRow: number = 3;
      public roadCol: number = 10;
      public roadCellWidth: number = 10;
      public roadCellHeight: number = 10;
      public roadImageWidth: number = 10;
      public roadImageHeight: number = 10;
      public roadScale: number = 1;
      public roadGridColor: number = 0xffffff;
      public roadGridAlpha: number = 1;
      public roadGridBorderColor: number = 0x000000;
      protected beadRoadGrid: egret.Shape;

      public constructor() {
        super();
        this.cacheAsBitmap = true;
      }

      protected childrenCreated() {
        super.childrenCreated();
        this.init();
      }

      protected init() {
        this.beadRoad = new LwBeadRoad(
          this.roadRow,
          this.roadCol,
          this.roadCellWidth,
          this.roadCellHeight,
          this.roadImageWidth,
          this.roadImageHeight,
          1,
          this.roadGridColor,
          this.roadGridAlpha,
          this.roadGridBorderColor,
          false
        );
        this.beadRoad.x = this.roadIndentX;
        this.beadRoad.y = this.roadIndentY;
        this.beadRoad.scaleX = this.beadRoad.scaleY = this.roadScale;

        // const rdata: any = [];
        // this.beadRoad.parseRoadData(rdata);

        // grid bg rectangle
        this.beadRoadGrid = new egret.Shape();
        this.addChild(this.beadRoadGrid);
        this.addChild(this.beadRoad);
        this.beadRoad.initRoadData();
      }

      public drawGridBg(width: number, height: number) {
        this.beadRoadGrid.graphics.beginFill(0xffffff, 1);
        this.beadRoadGrid.graphics.lineStyle(1, 0xafafaf, 1, true);
        RoundRect.drawRoundRect(this.beadRoadGrid.graphics, 0, 0, width, height, { tl: 0, tr: 0, bl: 10, br: 10 });
        this.beadRoadGrid.graphics.endFill();
      }

      public updateRoadData(roadmapData: data.RoadmapData) {
        if (roadmapData) {
          if (this.beadRoad) {
            this.beadRoad.parseRoadData(roadmapData.inGame.bead);
          }
        }
      }

      public updateLobbyRoadData(roadmapData: data.RoadmapData) {
        if (roadmapData && roadmapData.inGame) {
          if (this.beadRoad) {
            this.beadRoad.parseRoadData(roadmapData.inGame.bead);
          }
        }
      }

      // public updateSideBarRoadData(roadmapData: data.RoadmapData) {
      //   console.log('roadmapData', roadmapData);
      //   if (roadmapData && roadmapData.inGame) {
      //     if (this.beadRoad) {
      //       this.beadRoad.parseRoadData(roadmapData.inGame.bead);
      //     }
      //   }
      // }

      public updateSideBarRoadData(roadmapData: any) {
        if (roadmapData && roadmapData.inGame) {
          if (this.beadRoad) {
            this.beadRoad.parseRoadData(roadmapData.inGame.bead);
          }
        }
      }

      protected destroy() {
        super.destroy();
        this.beadRoad.dispose();
      }
    }
  }
}
