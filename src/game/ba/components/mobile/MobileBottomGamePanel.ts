namespace we {
  export namespace ba {
    export class MobileBottomGamePanel extends core.BaseGamePanel implements IBARoadmapDisplayObject {
      // Left Roadmap
      public beadRoad: BABeadRoad;

      protected gameIdLabel: ui.RunTimeLabel;
      protected totalBetLabel: ui.RunTimeLabel;
      protected gameId: string;
      protected totalBet: number;
      protected switchModeButton: eui.Component;

      // Right Roadmap
      public bigRoad: BABigRoad;
      public bigEyeRoad: BABigEyeRoad;
      public smallRoad: BASmallRoad;
      public cockroachRoad: BACockroachRoad;

      public iconBankerBead: BABeadRoadIcon;
      public iconPlayerBead: BABeadRoadIcon;
      protected iconBankerBigEye: BABigEyeRoadIcon;
      protected iconPlayerBigEye: BABigEyeRoadIcon;
      protected iconBankerSmall: BASmallRoadIcon;
      protected iconPlayerSmall: BASmallRoadIcon;
      protected iconBankerCockroach: BACockroachRoadIcon;
      protected iconPlayerCockroach: BACockroachRoadIcon;

      protected iconBankerCount;
      protected iconPlayerCount;
      protected iconTieCount;
      protected iconBankerPairCount;
      protected iconPlayerPairCount;

      protected bankerCountLabel: ui.RunTimeLabel;
      protected playerCountLabel: ui.RunTimeLabel;
      protected tieCountLabel: ui.RunTimeLabel;
      protected bankerPairCountLabel: ui.RunTimeLabel;
      protected playerPairCountLabel: ui.RunTimeLabel;
      protected totalCountLabel: ui.RunTimeLabel;

      protected roadsContainer: egret.DisplayObjectContainer;

      protected totalCount: number;

      // table info panel
      protected _tableInfoPanel: ui.TableInfoPanel;

      // viewStack and radioBtn
      protected _roadmapGroup: eui.Group;
      protected _infoGroup: eui.Group;

      protected roadSheetBtn: eui.RadioButton;
      protected chartBtn: eui.RadioButton;
      protected tableInfoBtn: eui.RadioButton;
      protected viewStack: eui.ViewStack;

      public constructor(skin?: string) {
        super(skin || !env.isMobile ? skin : 'ba/MobileBottomGamePanel');
      }

      protected init() {
        this.gameId = '';
        this.totalBet = 0;
        this.totalCount = 0;

        const gridSizeL = 73;
        const gridSizeR = 38;
        const numColumn = 8;

        this.beadRoad = new BABeadRoad(numColumn, gridSizeL, 1, true);
        this.beadRoad.x = 0;
        this.beadRoad.y = 98;
        this._roadmapGroup.addChild(this.beadRoad);

        this.iconBankerBead = new BABeadRoadIcon(52);
        this.iconBankerBead.x = 15;
        this.iconBankerBead.y = 23;
        this.iconBankerBead.setByObject({ v: 'b' });
        this._roadmapGroup.addChild(this.iconBankerBead);

        this.iconBankerBigEye = new BABigEyeRoadIcon(27);
        this.iconBankerBigEye.x = 146;
        this.iconBankerBigEye.y = 36;
        this.iconBankerBigEye.setByObject({ v: 'b' });
        this._roadmapGroup.addChild(this.iconBankerBigEye);

        this.iconBankerSmall = new BASmallRoadIcon(27);
        this.iconBankerSmall.x = 177;
        this.iconBankerSmall.y = 36;
        this.iconBankerSmall.setByObject({ v: 'b' });
        this._roadmapGroup.addChild(this.iconBankerSmall);

        this.iconBankerCockroach = new BACockroachRoadIcon(27);
        this.iconBankerCockroach.x = 208;
        this.iconBankerCockroach.y = 36;
        this.iconBankerCockroach.setByObject({ v: 'b' });
        this._roadmapGroup.addChild(this.iconBankerCockroach);

        this.iconPlayerBead = new BABeadRoadIcon(52);
        this.iconPlayerBead.x = 247;
        this.iconPlayerBead.y = 23;
        this.iconPlayerBead.setByObject({ v: 'p' });
        this._roadmapGroup.addChild(this.iconPlayerBead);

        this.iconPlayerBigEye = new BABigEyeRoadIcon(27);
        this.iconPlayerBigEye.x = 379;
        this.iconPlayerBigEye.y = 36;
        this.iconPlayerBigEye.setByObject({ v: 'p' });
        this._roadmapGroup.addChild(this.iconPlayerBigEye);

        this.iconPlayerSmall = new BASmallRoadIcon(27);
        this.iconPlayerSmall.x = 410;
        this.iconPlayerSmall.y = 36;
        this.iconPlayerSmall.setByObject({ v: 'p' });
        this._roadmapGroup.addChild(this.iconPlayerSmall);

        this.iconPlayerCockroach = new BACockroachRoadIcon(27);
        this.iconPlayerCockroach.x = 441;
        this.iconPlayerCockroach.y = 36;
        this.iconPlayerCockroach.setByObject({ v: 'p' });
        this._roadmapGroup.addChild(this.iconPlayerCockroach);

        this.roadsContainer = new egret.DisplayObjectContainer();
        this.roadsContainer.x = 0;
        this.roadsContainer.y = 0;
        this._roadmapGroup.addChild(this.roadsContainer);

        this.bigRoad = new BABigRoad(18, gridSizeR);
        this.bigRoad.x = 584;
        this.bigRoad.y = 98;
        this.roadsContainer.addChild(this.bigRoad);

        this.bigEyeRoad = new BABigEyeRoad(18 * 2, gridSizeR);
        this.bigEyeRoad.x = 584;
        this.bigEyeRoad.y = 98 + 6 * gridSizeR;
        this.roadsContainer.addChild(this.bigEyeRoad);

        this.smallRoad = new BASmallRoad(9 * 2, gridSizeR);
        this.smallRoad.x = 584;
        this.smallRoad.y = 98 + 6 * gridSizeR + 6 * (gridSizeR / 2);
        this.roadsContainer.addChild(this.smallRoad);

        this.cockroachRoad = new BACockroachRoad(9 * 2, gridSizeR);
        this.cockroachRoad.x = 584 + gridSizeR * 9;
        this.cockroachRoad.y = 98 + 6 * gridSizeR + 6 * (gridSizeR / 2);
        this.roadsContainer.addChild(this.cockroachRoad);

        this.switchModeButton.touchEnabled = true;
        this.switchModeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSwitchModeClick, this);
        this.switchModeButton.x = 510;
        this.switchModeButton.y = 462;
        this._roadmapGroup.addChild(this.switchModeButton);

        this.roadSheetBtn.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        this.chartBtn.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        this.tableInfoBtn.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);

        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        this.changeLang();
      }

      public changeLang() {
        this.gameIdLabel.text = this.gameId + ' ' + i18n.t('baccarat.gameroundid');
        this.totalBetLabel.text = i18n.t('baccarat.totalbet') + ' ' + this.totalBet;
        this.totalCountLabel.text = '' + this.totalCount;

        this.roadSheetBtn.label = i18n.t('mobile_game_panel_road_sheet');
        this.chartBtn.label = i18n.t('mobile_game_panel_statistic_chart');
        this.tableInfoBtn.label = i18n.t('mobile_game_panel_table_info');
      }

      protected onViewChange(e: eui.UIEvent) {
        const radio: eui.RadioButton = e.target;
        this.viewStack.selectedIndex = radio.value;
      }

      protected onSwitchModeClick(e: egret.TouchEvent) {
        this.beadRoad.Mode = ++this.beadRoad.Mode % 2;
      }

      public setPredictIcons(b1: any, b2: any, b3: any, p1: any, p2: any, p3: any) {
        this.iconBankerBigEye.setByObject(b1);
        this.iconBankerSmall.setByObject(b2);
        this.iconBankerCockroach.setByObject(b3);

        this.iconPlayerBigEye.setByObject(p1);
        this.iconPlayerSmall.setByObject(p2);
        this.iconPlayerCockroach.setByObject(p3);

        this.update();
      }

      public update() {
        if (this.tableInfo) {
          if (this.tableInfo.betInfo || this.tableInfo.gamestatistic) {
            this.gameId = this.tableInfo.betInfo.gameroundid;
            this.totalBet = this.tableInfo.betInfo.total;
            this.bankerCountLabel.text = this.tableInfo.gamestatistic.bankerCount.toString();
            this.playerCountLabel.text = this.tableInfo.gamestatistic.playerCount.toString();
            this.tieCountLabel.text = this.tableInfo.gamestatistic.tieCount.toString();
            this.bankerPairCountLabel.text = this.tableInfo.gamestatistic.bankerPairCount.toString();
            this.playerPairCountLabel.text = this.tableInfo.gamestatistic.playerPairCount.toString();
            this.totalCount = this.tableInfo.gamestatistic.totalCount;
            this.changeLang();
          }
        }
      }

      public destroy() {
        super.destroy();

        this.beadRoad.dispose();
        this.bigRoad.dispose();
        this.bigEyeRoad.dispose();
        this.smallRoad.dispose();
        this.cockroachRoad.dispose();

        if (this.switchModeButton.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
          this.switchModeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSwitchModeClick, this);
        }

        if (dir.evtHandler.hasEventListener(core.Event.SWITCH_LANGUAGE)) {
          dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        }
      }
    }
  }
}