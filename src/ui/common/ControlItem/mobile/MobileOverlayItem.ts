/* tslint:disable triple-equals */
namespace we {
  export namespace ui {
    export class MobileOverlayItem extends ControlItem {
      // protected _bigRoad: we.ba.BALobbyBigRoad;
      // protected _alreadyBetSign: eui.Group;
      protected _contentContainer: eui.Group;
      protected _betChipSetPanel: eui.Group;
      protected _roadmapControl: ba.BARoadmapControl;
      protected _roadsContainer: eui.Group;
      protected _bigRoadMap: ba.BABigRoad;
      protected _bigEyeRoad: ba.BABigEyeRoad;
      protected _smallRoad: ba.BASmallRoad;
      protected _cockroachRoad: ba.BACockroachRoad;
      protected _closeButton: ui.BaseImageButton;
      protected _prevButton: ui.BaseImageButton;
      protected _betChipSetGridSelected: ui.BetChipSetGridSelected;
      protected _betChipSetGridEnabled: boolean = false;

      public constructor(skinName: string = null) {
        super(skinName);
        this._betChipSetPanel.alpha = 0;
        this._betChipSet.alpha = 1;
      }

      protected initChildren() {
        super.initChildren();
        this.initRoadMap();
        this._roadmapControl.setTableInfo(this._tableInfo);

        // draw border corner radius
        const shape = new egret.Shape();
        shape.graphics.beginFill(0xffffff, 1);
        shape.graphics.drawRoundRect(0, 0, this._contentContainer.width, this._contentContainer.height, 48, 48);
        shape.graphics.endFill();
        this._contentContainer.addChild(shape);
        this._contentContainer.mask = shape;
      }

      protected initRoadMap() {
        this._roadmapControl = new ba.BARoadmapControl(this._tableId);

        const gridSizeBR = 48;
        const gridSize = 32;
        const lineWidth = 2;
        const lineColor = 0xaaaaaa;

        this._bigRoadMap = new ba.BABigRoad(17, gridSizeBR);
        this._bigRoadMap.x = 0;
        this._bigRoadMap.y = 0;
        this._roadsContainer.addChild(this._bigRoadMap);

        this._bigEyeRoad = new ba.BABigEyeRoad(10 * 2, gridSize);
        this._bigEyeRoad.x = gridSizeBR * 17;
        this._bigEyeRoad.y = gridSize * 3;
        this._roadsContainer.addChild(this._bigEyeRoad);

        this._smallRoad = new ba.BASmallRoad(10 * 2, gridSize);
        this._smallRoad.x = gridSizeBR * 17;
        this._smallRoad.y = 0;
        this._roadsContainer.addChild(this._smallRoad);

        this._cockroachRoad = new ba.BACockroachRoad(10 * 2, gridSize);
        this._cockroachRoad.x = gridSizeBR * 17;
        this._cockroachRoad.y = gridSize * 6;
        this._roadsContainer.addChild(this._cockroachRoad);

        const rect: eui.Rect = new eui.Rect(lineWidth, gridSizeBR * 6, lineColor);
        const rect2: eui.Rect = new eui.Rect(gridSize * 10, lineWidth, lineColor);
        const rect3: eui.Rect = new eui.Rect(gridSize * 10, lineWidth, lineColor);
        this._roadsContainer.addChild(rect);
        this._roadsContainer.addChild(rect2);
        this._roadsContainer.addChild(rect3);
        rect.anchorOffsetX = lineWidth * 0.5;
        rect2.anchorOffsetY = lineWidth * 0.5;
        rect3.anchorOffsetY = lineWidth * 0.5;
        rect.x = gridSizeBR * 17;
        rect2.x = gridSizeBR * 17;
        rect3.x = gridSizeBR * 17;
        rect2.y = gridSize * 3;
        rect3.y = gridSize * 6;

        this._roadmapControl.setRoads(null, this._bigRoadMap, this._bigEyeRoad, this._smallRoad, this._cockroachRoad, [0, 17, 20, 20, 20], null, null, false);
      }

      protected onRoadDataUpdate(evt: egret.Event) {
        this._roadmapControl.updateRoadData();
      }

      public onClickUndoButton(evt: egret.Event) {
        this._undoStack.popAndUndo();
      }

      public onClickButton() {}

      protected onClickBetChipSelected() {
        this._betChipSetGridEnabled ? this.hideBetChipPanel() : this.showBetChipPanel();
      }

      protected showBetChipPanel() {
        this._betChipSetPanel.anchorOffsetY = 30;
        egret.Tween.get(this._betChipSetPanel).to({ alpha: 1, anchorOffsetY: 0 }, 250);
        this._betChipSetGridEnabled = true;
      }

      protected hideBetChipPanel() {
        egret.Tween.get(this._betChipSetPanel).to({ alpha: 0, anchorOffsetY: 30 }, 250);
        this._betChipSetGridEnabled = false;
      }

      protected addEventListeners() {
        super.addEventListeners();
        this._prevButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUndoButton, this);
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickButton, this);
        this._betChipSetGridSelected.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBetChipSelected, this);
      }

      protected removeEventListeners() {
        super.removeEventListeners();
        this._prevButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickUndoButton, this);
        this._closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickButton, this);
      }

      // public setData(tableInfo: data.TableInfo) {
      //   super.setData(tableInfo);
      //   if (tableInfo.roadmap) {
      //     if (this._bigRoad) {
      //       this._bigRoad.updateLobbyRoadData(tableInfo.roadmap);
      //     }
      //   }
      // }

      // protected onRoadDataUpdate(evt: egret.Event) {
      //   super.onRoadDataUpdate(evt);
      //   if (evt && evt.data) {
      //     const tableInfo = <data.TableInfo> evt.data;
      //     if (tableInfo.tableid === this._tableId) {
      //       if (this._bigRoad) {
      //         this._bigRoad.updateLobbyRoadData(tableInfo.roadmap);
      //       }
      //     }
      //   }
      // }
    }
  }
}