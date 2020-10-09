namespace we {
  export namespace lo {
    export class LotterySceneFun extends LotterySceneFunBasic {
      // protected _denominationList = [500, 1000, 2000, 5000, 10000];
      protected _denominationList;
      protected _betLayerTween: ui.TweenConfig;
      protected _betLayer: FunBetLayer;

      protected _betResult: FunBetResult;
      protected _roundInfo: FunBetRoundInfo;

      protected _betChipSet: ui.BetChipSet;
      protected _betRelatedGroup: egret.DisplayObject;
      protected _confirmButton: eui.Button;
      protected _cancelButton: ui.BaseImageButton;

      protected _custombet: FunBetCustomBet;

      protected _lastgameResult;
      protected _drawerPanel: lo.LoRightDrawerPanel;

      protected mount() {
        super.mount();
        this.initDenom();
        this.funbet.reset();

        if (this._drawerPanel) {
          this._drawerPanel.setTableInfo(this._tableInfo);
        }
      }

      protected initDenom() {
        this._denominationList = env.betLimits[env.currentSelectedBetLimitIndex].chips;
        this._betChipSet.init(5, this._denominationList);
        this._betChipSet.selectedChipIndex = 0;
        this.onBetChipChanged();
      }

      protected addListeners() {
        super.addListeners();
        this._custombet.addEventListener('CUSTOMBET_SELECTED', this.onCustomBetSelected, this);
        dir.evtHandler.addEventListener(core.Event.BET_DENOMINATION_CHANGE, this.onBetChipChanged, this);
        dir.evtHandler.addEventListener(core.Event.BET_LIMIT_CHANGE, this.onBetLimitUpdate, this);
        utils.addButtonListener(this._confirmButton, this.onConfirmPressed, this);
        utils.addButtonListener(this._cancelButton, this.onCancelPressed, this);
        this.funbet.evtHandler.addEventListener('LOTTERY_FUNBET_UPDATE', this.onFunBetUpdate, this);
        this.funbet.evtHandler.addEventListener('LOTTERY_FUNBET_OVERBETLIMIT', this.onOverBetLimit, this);
        this.funbet.evtHandler.addEventListener('LOTTERY_FUNBET_LOWERBETLIMIT', this.onLowBetLimit, this);
        this.funbet.evtHandler.addEventListener('LOTTERY_FUNBET_OVERBALANCE', this.onOverBalance, this);
      }

      protected removeListeners() {
        super.removeListeners();
        this._custombet.removeEventListener('CUSTOMBET_SELECTED', this.onCustomBetSelected, this);
        dir.evtHandler.removeEventListener(core.Event.BET_DENOMINATION_CHANGE, this.onBetChipChanged, this);
        dir.evtHandler.removeEventListener(core.Event.BET_LIMIT_CHANGE, this.onBetLimitUpdate, this);
        utils.removeButtonListener(this._confirmButton, this.onConfirmPressed, this);
        utils.removeButtonListener(this._cancelButton, this.onCancelPressed, this);
        this.funbet.evtHandler.removeEventListener('LOTTERY_FUNBET_UPDATE', this.onFunBetUpdate, this);
        this.funbet.evtHandler.removeEventListener('LOTTERY_FUNBET_OVERBETLIMIT', this.onOverBetLimit, this);
        this.funbet.evtHandler.removeEventListener('LOTTERY_FUNBET_LOWERBETLIMIT', this.onLowBetLimit, this);
        this.funbet.evtHandler.removeEventListener('LOTTERY_FUNBET_OVERBALANCE', this.onOverBalance, this);
      }

      protected onRoadDataUpdate(evt: egret.Event) {
        super.onRoadDataUpdate(evt);
        if (evt && evt.data) {
          const stat = <data.TableInfo>evt.data;
          if (stat.tableid === this._tableId) {
            this._drawerPanel.update();
          }
        }
      }

      protected onGameStatisticUpdated() {
        if (this._statistic.loresults && this._statistic.loresults.length > 0) {
          this._lastgameResult = this._statistic.loresults[this._statistic.loresults.length - 1].Data;
          // this._lastgameResult = this._statistic.loresults[0].Data;
        } else {
          this._lastgameResult = {};
        }
        this.updateResultDisplay();
      }

      protected onCustomBetSelected() {
        this._custombet.selected = true;
        this.funbet.bet = this._custombet.currentBet;
        this._betChipSet.unSelect();
      }

      protected onBetChipChanged() {
        this._custombet.selected = false;
        this.funbet.bet = this._denominationList[this._betChipSet.selectedChipIndex];
      }

      protected onBetLimitUpdate(evt: egret.Event) {
        this._custombet.selected = false;
        this._denominationList = env.betLimits[env.currentSelectedBetLimitIndex].chips;
        this._betChipSet.resetDenominationList(this._denominationList);
        this.onBetChipChanged();
      }

      protected onFunBetUpdate() {
        this._confirmButton.enabled = Object.keys(this.funbet.betDetails).length > 0;
      }

      protected onOverBetLimit() {
        this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.exceedBetUpperLimit'));
      }

      protected onLowBetLimit() {
        this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.exceedBetLowerLimit'));
      }

      protected onOverBalance() {
        this._message.showMessage(ui.InGameMessage.ERROR, i18n.t('game.insufficientBalance'));
      }

      protected onConfirmPressed() {
        if (Object.keys(this.funbet.betDetails).length > 0 && this.funbet.checkAllAvailable()) {
          dir.evtHandler.createOverlay({
            class: 'FunBetOverlay',
            args: [this._tableInfo, this.customKey],
          });
        }
      }

      protected onCancelPressed() {
        this.funbet.reset();
      }

      protected onBetResultReceived(evt: egret.Event) {
        super.onBetResultReceived(evt);
        this.funbet.evtHandler.dispatchEvent(new egret.Event('LOTTERY_FUNBET_CLEANSCREEN'));
      }

      protected onBetConfirmed() {
        super.onBetConfirmed();
        this.funbet.reset();
      }

      protected setBetRelatedComponentsEnabled(enable: boolean) {
        this.betClipEnabled = enable;
        this.betLayerEnabled = enable;

        if (!enable) {
          this.funbet.evtHandler.dispatchEvent(new egret.Event('LOTTERY_FUNBET_CLEANSCREEN'));
          this.funbet.reset();
        }
      }

      protected setResultRelatedComponentsEnabled(enable: boolean) {
        this._betResult.visible = enable;
        this._betResult.update(this._gameData);
      }

      protected set betLayerEnabled(enabled: boolean) {
        if (enabled) {
          this._betLayerTween.currentState = 'open';
        } else {
          this._betLayerTween.currentState = 'close';
        }
        egret.Tween.removeTweens(this._betLayer);
        egret.Tween.get(this._betLayer).to(this._betLayerTween.getTweenPackage(), 250);
      }

      protected set betClipEnabled(enabled: boolean) {
        this._betRelatedGroup.visible = enabled;
        this._custombet.enabled = enabled;
      }

      public updateGame() {
        super.updateGame();

        this.updateResultDisplay();
      }

      protected updateResultDisplay() {
        if (!this._gameData || !this._roundInfo) {
          return;
        }
        switch (this._gameData.state) {
          case core.GameState.DEAL:
          case core.GameState.FINISH:
            this._roundInfo.currentState = 'drawing';
            this._roundInfo.update(this._gameData);
            break;
          default:
            this._roundInfo.currentState = 'normal';
            this._lastgameResult.gameroundid = this._gameData.gameroundid;
            this._roundInfo.update(this._lastgameResult);
            break;
        }
      }
    }
  }
}
