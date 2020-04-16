namespace we {
  export namespace ro {
    export class AdvancedRoad extends core.BaseEUI implements we.ui.IAdvancedRoad {
      protected _tableInfo: data.TableInfo;
      public beadRoad: ROBeadRoad;
      public colorBigRoad: ROColorBigRoad;
      public sizeBigRoad: ROSizeBigRoad;
      public oddBigRoad: ROOddBigRoad;
      protected _roadmapControl: we.ro.RORoadmapControl;

      protected bankerCountLabel: ui.RunTimeLabel;
      protected playerCountLabel: ui.RunTimeLabel;
      protected tieCountLabel: ui.RunTimeLabel;
      protected bankerPairCountLabel: ui.RunTimeLabel;
      protected playerPairCountLabel: ui.RunTimeLabel;
      protected totalCountLabel: ui.RunTimeLabel;
      protected playerButtonLabel: ui.RunTimeLabel;
      protected bankerButtonLabel: ui.RunTimeLabel;

      protected roadsContainer: egret.DisplayObjectContainer;

      protected totalCount: number;

      public constructor(skin?: string) {
        super(skin);
      }

      public set tableInfo(value: data.TableInfo) {
        this._tableInfo = value;
      }

      public get tableInfo() {
        return this._tableInfo;
      }

      protected mount() {
        this.init();
      }

      protected init() {
        const gridSize = 26;
        this.totalCount = 0;

        this.roadsContainer = new egret.DisplayObjectContainer();
        this.roadsContainer.x = 0;
        this.roadsContainer.y = 0;
        this.roadsContainer.scaleX = 584 / 520;
        this.roadsContainer.scaleY = 450 / 396;
        this.addChild(this.roadsContainer);

        this.beadRoad = new ROBeadRoad(3, 12, 43, 1, 0, 0, 0x262a2b, 1);
        this.beadRoad.x = 2;
        this.beadRoad.y = 0;
        // this.beadRoad.scaleX = 690 / 689;
        // this.beadRoad.scaleY = 690 / 689;
        this.roadsContainer.addChild(this.beadRoad);

        this.colorBigRoad = new ROColorBigRoad(26, 20, 1, false);
        this.colorBigRoad.x = 0;
        this.colorBigRoad.y = 1 + 3 * 52;
        this.roadsContainer.addChild(this.colorBigRoad);

        this.oddBigRoad = new ROOddBigRoad(13, 20, 1, false);
        this.oddBigRoad.x = 0;
        this.oddBigRoad.y = 3 * 52 + 20 * 6;
        this.roadsContainer.addChild(this.oddBigRoad);

        this.sizeBigRoad = new ROSizeBigRoad(13, 20, 1, false);
        this.sizeBigRoad.x = 13 * 20;
        this.sizeBigRoad.y = 3 * 52 + 20 * 6;
        this.roadsContainer.addChild(this.sizeBigRoad);

        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);

        this.changeLang();
      }

      public changeLang() {
        // this.totalCountLabel.text = this.totalCount + '';
        // this.playerButtonLabel.text = i18n.t('baccarat.askPlayer');
        // this.bankerButtonLabel.text = i18n.t('baccarat.askBanker');
      }

      // render text by tableInfo
      public update() {
        if (this.tableInfo) {
          if (!this._roadmapControl) {
            this._roadmapControl = new RORoadmapControl(this._tableInfo.tableid);
            this._roadmapControl.setRoads(this.beadRoad, this.colorBigRoad, this.oddBigRoad, this.sizeBigRoad, null, null, null);
          }
          if (this._roadmapControl) {
            this._roadmapControl.setTableInfo(this._tableInfo);
            this._roadmapControl.updateRoadData();
          }
          if (this.tableInfo.gamestatistic) {
            // this.bankerCountLabel.text = this.tableInfo.gamestatistic.bankerCount.toString();
            // this.playerCountLabel.text = this.tableInfo.gamestatistic.playerCount.toString();
            // this.tieCountLabel.text = this.tableInfo.gamestatistic.tieCount.toString();
            // this.bankerPairCountLabel.text = this.tableInfo.gamestatistic.bankerPairCount.toString();
            // this.playerPairCountLabel.text = this.tableInfo.gamestatistic.playerPairCount.toString();
            // this.totalCount = this.tableInfo.gamestatistic.totalCount;
            // this.changeLang();
          }
        }
      }

      // called by BaRoadmapControl
      /*
      public setPredictIcons(b1: any, b2: any, b3: any, p1: any, p2: any, p3: any) {
        this.iconBankerBigEye.setByObject(b1);
        this.iconBankerSmall.setByObject(b2);
        this.iconBankerCockroach.setByObject(b3);

        this.iconPlayerBigEye.setByObject(p1);
        this.iconPlayerSmall.setByObject(p2);
        this.iconPlayerCockroach.setByObject(p3);

        this.update();
      }*/

      public destroy() {
        super.destroy();

        if (dir.evtHandler.hasEventListener(core.Event.SWITCH_LANGUAGE)) {
          dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        }
      }
    }
  }
}