namespace we {
  export namespace ba {
    export class SideListItem extends LiveListSimpleItem {
      protected _bigRoad: we.ba.BetInfoBigRoad;
      protected _betChipSetGridSelected: ui.BetChipSetGridSelected;
      protected _quickbetButton: ui.QuickBetAnimButton;
      protected _quickbetEnable: boolean = false;
      protected _quickBetGroup: eui.Group;
      protected _goodRoadLabel: ui.GoodRoadLabel;
      protected _alreadyBetSign: eui.Group;
      protected _tweenInterval1: number = 250;
      protected _betChipSetGridEnabled: boolean = false;

      // protected _originalyhover: number;
      protected _originaly: number;
      protected _originalQuickBetButtonY: number;
      protected _targetQuickBetButtonY: number;
      protected _originalQuickBetPanelY: number;
      protected _targetQuickbetPanelY: number;
      protected _offsetY: number;
      protected _offsetLimit: number;
      protected _offsetMovement: number;

      public constructor(skinName: string = 'BaSideListItemSkin') {
        super(skinName);
        this._betChipSet.injectSetSelectedChip(this._betChipSetGridSelected.setSelectedChip.bind(this._betChipSetGridSelected));
        const denominationList = env.betLimits[this.getSelectedBetLimitIndex()].chipList;
        this._betChipSetGridSelected.setValue(denominationList[0]);
        this._betChipSetGridSelected.index = 0;
      }

      protected addEventListeners() {
        super.addEventListeners();
        this._betChipSetGridSelected.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBetChipSelected, this);
      }

      protected onClickBetChipSelected() {
        this._betChipSetGridEnabled ? this.hideBetChipPanel() : this.showBetChipPanel();
      }

      protected showBetChipPanel() {
        egret.Tween.get(this._betChipSet).to({ y: 390, alpha: 1 }, 250);
        this._betChipSetGridEnabled = true;
      }

      protected hideBetChipPanel() {
        egret.Tween.get(this._betChipSet).to({ y: 0, alpha: 0 }, 250);
        this._betChipSetGridEnabled = false;
      }

      protected initCustomPos() {
        this._targetQuickBetButtonY = 199;
        this._originalQuickBetButtonY = 85;
        this._targetQuickbetPanelY = 170;
        this._originalQuickBetPanelY = 0;
        this._offsetLimit = 10000;
        this._offsetMovement = 0;
        this._hoverScale = 1.06;
      }

      protected initChildren() {
        super.initChildren();
        this._betChipSet.resetFormat(1);
        this._goodRoadLabel.visible = false;
      }

      public setData(tableInfo: data.TableInfo) {
        super.setData(tableInfo);
        if (this.tableInfo.goodRoad) {
          this._goodRoadLabel.visible = true;
          const goodRoadData = this.tableInfo.goodRoad;
          const goodRoadName: string = goodRoadData.custom ? goodRoadData.name : i18n.t(`goodroad.${goodRoadData.roadmapid}`);
          // this._goodRoadLabel.text = goodRoadName;
          this._goodRoadLabel.renderText = () => (goodRoadData.custom ? goodRoadData.name : i18n.t(`goodroad.${goodRoadData.roadmapid}`));
        } else {
          this._goodRoadLabel.visible = false;
        }
      }

      protected hideQuickBetGroup() {
        super.hideQuickBetGroup();
        this.hideBetChipPanel();
      }

      protected setStateBet(isInit: boolean = false) {
        super.setStateBet(isInit);
        if (this._bettingTable.isAlreadyBet()) {
          this._alreadyBetSign.visible = true;
        } else {
          this._alreadyBetSign.visible = false;
        }
      }

      protected onTableBetInfoUpdate() {
        super.onTableBetInfoUpdate();
        if (this._bettingTable.isAlreadyBet()) {
          this._alreadyBetSign.visible = true;
        } else {
          this._alreadyBetSign.visible = false;
        }
      }

      protected onMatchGoodRoadUpdate() {
        if (this.tableInfo.goodRoad) {
          this._goodRoadLabel.visible = true;
          const goodRoadData = this.tableInfo.goodRoad;
          const goodRoadName: string = goodRoadData.custom ? goodRoadData.name : i18n.t(`goodroad.${goodRoadData.roadmapid}`);
          // this._goodRoadLabel.text = goodRoadName;
          this._goodRoadLabel.renderText = () => (goodRoadData.custom ? goodRoadData.name : i18n.t(`goodroad.${goodRoadData.roadmapid}`));
        } else {
          this._goodRoadLabel.visible = false;
        }
      }
    }
  }
}