namespace we {
  export namespace live {
    export class LiveBaListSimpleItem extends core.BaseEUI {
      protected rect: eui.Rect;
      protected _bigRoad: we.ba.BALobbyBigRoad;
      protected _quickbetPanel: we.live.LiveBaQuickBetPanel;
      protected _quickbetButton: ui.RoundButton;
      protected _quickbetEnable: boolean = false;
      protected _tableId: string;
      protected _dropdown: live.BetLimitDropdown;
      protected _group: eui.Group;
      protected _tableInfo: data.TableInfo;
      protected _betDetails: data.BetDetail[];
      protected _previousState: number;
      protected _gameData: we.ba.GameData;
      protected _timer: we.ba.CountdownTimer;
      protected _mouseOutside: boolean = false;
      protected _label: eui.Label;

      protected _tweenInterval1: number = 250;

      // protected _originalyhover: number;
      protected _originaly: number;
      protected _originalQuickBetButtonY: number;
      protected _targetQuickBetButtonY: number;
      protected _originalQuickBetPanelY: number;
      protected _targetQuickbetPanelY: number;
      protected _offsetY: number;
      protected _offsetLimit: number;
      protected _offsetMovement: number;
      // private _endanimRunning: boolean = false;

      public constructor(skinName: string = 'LiveBaListSimpleItem') {
        super();
        this.skinName = utils.getSkin(skinName);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.initPos();
      }

      protected initPos() {
        this._targetQuickBetButtonY = 180;
        this._originalQuickBetButtonY = 150;
        this._targetQuickbetPanelY = 218;
        this._originalQuickBetPanelY = 0;
        this._offsetLimit = 650;
        this._offsetMovement = 550;
      }

      public set tableId(value: string) {
        this._tableId = value;
      }

      public get tableId() {
        return this._tableId;
      }

      set labelText(value: string) {
        if (this._label) {
          this._label.text = value;
        }
      }

      get labelText() {
        if (this._label) {
          return this._label.text;
        }
        return null;
      }

      public getQuickbetButton(): ui.RoundButton {
        return this._quickbetButton;
      }

      protected childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        this.x += this.anchorOffsetX;
        this.y += this.anchorOffsetY;
        this._originaly = this.y;

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this._group.addEventListener(mouse.MouseEvent.ROLL_OVER, this.onRollover, this);
        this._group.addEventListener(mouse.MouseEvent.ROLL_OUT, this.onRollout, this);
        this._quickbetButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickButton, this);
        // this._dropdown.items = ['test 1', 'test 2'];
        // this._dropdown.setToggler(this._dropdown_toggle);
        this.mount();
        this._timer.skinName = utils.getSkin('CountdownTimerRound');
        this._quickbetPanel.tableId = this._tableId;
        const shape = new egret.Shape();
        shape.graphics.beginFill(0xffffff, 1);
        shape.graphics.drawRoundRect(0, 0, this.width, this.height, 16, 16);
        shape.graphics.endFill();
        this._group.addChild(shape);
        this._group.mask = shape;

        this.setEventListeners();
        // this._group.setChildIndex(this._timer, 2500);
      }

      private onTouchTap(evt: egret.Event) {
        const target = evt.target;
        if (target.parent && target.parent instanceof eui.ItemRenderer) {
          evt.stopPropagation();
          return;
        }
        if (evt.target === this._dropdown.toggler || evt.target === this) {
          evt.stopPropagation();
          return;
        }
      }

      public onClickButton(evt: egret.Event) {
        if (this.parent && this.parent.parent) {
          this.parent.parent.setChildIndex(<egret.DisplayObjectContainer> this.parent, 1000);
        }
        // this.setChildIndex(this._timer, 2500);

        if (!env.livepageLocked) {
          if (this._gameData.state !== we.ba.GameState.BET) {
            return;
          }
          this._quickbetButton.tweenLabel(!!!env.livepageLocked);
          this.toggleLivePageLock();
          dir.evtHandler.dispatch(we.core.Event.LIVE_PAGE_LOCK);
          if (this.parent.localToGlobal(this.x, this._originaly).y > this._offsetLimit) {
            this._offsetY = this.parent.localToGlobal(this.x, this._originaly).y - this._offsetMovement;
          } else {
            this._offsetY = 0;
          }
          egret.Tween.removeTweens(this);
          egret.Tween.removeTweens(this._quickbetPanel);

          ///////
          /*
          this.y = this._originaly - this._offsetY;
          this.scaleX = 1.1;
          this.scaleY = 1.1;
          this._quickbetPanel.y = 378;
          this._quickbetPanel.alpha = 1;*/

          const p1 = new Promise(resolve =>
            egret.Tween.get(this)
              .to({ y: this._originaly - this._offsetY, scaleX: 1.1, scaleY: 1.1 }, this._tweenInterval1)
              .call(resolve)
          );
          console.log('quickbetpanel go tableid: ' + this._tableId);
          const p2 = new Promise(resolve =>
            egret.Tween.get(this._quickbetPanel)
              .to({ y: this._targetQuickbetPanelY, alpha: 1 }, this._tweenInterval1)
              .call(resolve)
          );
          Promise.all([p1, p2]).then(() => {
            this.setChildIndex(this._group, 1000);
            this.setChildIndex(this._quickbetPanel, 1500);
          });
        } else if (env.livepageLocked === this.tableId) {
          this._quickbetButton.tweenLabel(!!!env.livepageLocked);
          // this.setChildIndex(this._quickbetPanel, 1000);
          // this.setChildIndex(this._group, 1500);
          // this._quickbetPanel.validateNow();

          egret.Tween.removeTweens(this);
          egret.Tween.removeTweens(this._quickbetPanel);
          egret.Tween.get(this._quickbetPanel).to({ y: this._originalQuickBetPanelY, alpha: 0 }, this._tweenInterval1);
          if (this._mouseOutside) {
            egret.Tween.removeTweens(this._quickbetButton);
            const tw1 = egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, y: this._originaly }, this._tweenInterval1);
            const tw2 = egret.Tween.get(this._quickbetButton).to({ y: this._targetQuickBetButtonY, alpha: 0 }, this._tweenInterval1);
          } else {
            egret.Tween.get(this).to({ y: this._originaly }, this._tweenInterval1);
          }
          this.toggleLivePageLock();
          dir.evtHandler.dispatch(we.core.Event.LIVE_PAGE_LOCK);
        }
      }

      public toggleLivePageLock() {
        if (!env.livepageLocked) {
          env.livepageLocked = this._tableId;
        } else if (env.livepageLocked === this._tableId) {
          env.livepageLocked = null;
        }
      }

      get bigRoad() {
        return this._bigRoad;
      }

      set bigRoad(value: we.ba.BALobbyBigRoad) {
        this._bigRoad = value;
      }

      private setEventListeners() {
        dir.evtHandler.addEventListener(core.Event.TABLE_INFO_UPDATE, this.onTableInfoUpdate, this);
      }

      public setupTableInfo() {
        // console.log(env.tableInfoArray);
        env.tableInfoArray.forEach(value => {
          if (value.tableid === this._tableId) {
            this._tableInfo = value;
            this._betDetails = this._tableInfo.bets;
            this._gameData = this._tableInfo.data;
            this._previousState = this._gameData ? this._gameData.previousstate : null;
          }
        });
      }

      protected onTableInfoUpdate(evt: egret.Event) {
        // console.log('Baccarat listener');
        if (evt && evt.data) {
          const tableInfo = <data.TableInfo> evt.data;
          if (tableInfo.tableid === this._tableId) {
            // update the scene
            this._tableInfo = tableInfo;
            this._betDetails = tableInfo.bets;
            this._previousState = this._gameData ? this._gameData.previousstate : null;
            this._gameData = <we.ba.GameData> this._tableInfo.data;

            this.updateGame();
          }
        }
      }

      public updateGame() {
        console.log('LiveBaListItem::updateGame() - this._gameData.state ');
        console.log(this._gameData);
        if (!this._gameData) {
          return;
        }
        console.log('state:        ' + this._gameData.state);
        switch (this._gameData.state) {
          case we.ba.GameState.BET:
            this.setQuickbetPanelVisible(true);
            this.setStateBet();
            break;
          default:
            this.setQuickbetPanelVisible(false);
            break;
        }
      }

      protected setStateBet() {
        if (this._previousState !== we.ba.GameState.BET) {
          // reset data betinfo

          // if (this._betDetails) {
          //   this._betDetails.splice(0, this._betDetails.length);
          // }

          // TODO: show start bet message to the client for few seconds
          logger.l('LiveBaListSimpleItem::setStateBet::this._quickbetPanel', this._quickbetPanel);
          logger.l('LiveBaListSimpleItem::setStateBet::this._quickbetPanel.bettingTable', this._quickbetPanel.bettingTable);
          this._quickbetPanel.bettingTable.resetUnconfirmedBet();
          this._quickbetPanel.bettingTable.resetConfirmedBet();

          // show the betchipset, countdownTimer, confirm, cancel and other bet related buttons
          // this.setBetRelatedComponentsTouchEnabled(true);

          // enable betting table
          // this._quickbetPanel.bettingTable.setTouchEnabled(true);

          // update the bet amount of each bet field in betting table
          if (this._betDetails) {
            this._quickbetPanel.bettingTable.updateBetFields(this._betDetails);
          }
        }

        // update the countdownTimer
        this.updateCountdownTimer();
      }

      protected updateCountdownTimer() {
        this._timer.countdownValue = this._gameData.countdown * 1000;
        this._timer.remainingTime = this._gameData.countdown * 1000 - (env.currTime - this._gameData.starttime);
        this._timer.start();
      }

      private setQuickbetPanelVisible(enable: boolean) {
        if (this._quickbetEnable !== enable) {
          if (enable) {
            this._timer.visible = true;
            // this.setChildIndex(this._timer, 30000);
            console.log('LiveBaListItem::setQuickbetPanelVisible-enable()' + this.tableId);
          } else {
            this._timer.visible = false;
            console.log('LiveBaListItem::setQuickbetPanelVisible-disable1()' + this.tableId);
            this.setChildIndex(this._quickbetPanel, 1000);
            this.setChildIndex(this._group, 1500);
            this._quickbetButton.tweenLabel(!!!env.livepageLocked);
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this._quickbetPanel);
            egret.Tween.get(this._quickbetPanel).to({ y: this._originalQuickBetPanelY, alpha: 0 }, this._tweenInterval1);
            egret.Tween.removeTweens(this._quickbetButton);
            const tw1 = egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, y: this._originaly }, this._tweenInterval1);
            const tw2 = egret.Tween.get(this._quickbetButton).to({ y: this._originalQuickBetButtonY, alpha: 0 }, this._tweenInterval1);

            setTimeout(() => {
              if (env.livepageLocked === this.tableId) {
                console.log('LiveBaListItem::setQuickbetPanelVisible-disable2()' + this.tableId);
                // this.onClickButton(null);
                this.toggleLivePageLock();
                dir.evtHandler.dispatch(we.core.Event.LIVE_PAGE_LOCK);
              } else {
                const tw2 = egret.Tween.get(this._quickbetButton).to({ y: this._targetQuickBetButtonY, alpha: 0 }, this._tweenInterval1);
                this._quickbetButton.tweenLabel(false);
              }
            }, 300);
          }
          this._quickbetEnable = enable;
        }
      }

      protected async mount() {}

      protected destroy() {
        dir.evtHandler.removeEventListener(core.Event.TABLE_INFO_UPDATE, this.onTableInfoUpdate, this);
      }

      public onRollover(evt: egret.Event) {
        console.log('LiveBaListItem::onRollover');
        this._mouseOutside = false;
        if (!env.livepageLocked) {
          // this.setChildIndex(this._timer, 25000);
          egret.Tween.removeTweens(this);
          egret.Tween.removeTweens(this._quickbetButton);
          egret.Tween.get(this).to({ scaleX: 1.1, scaleY: 1.1, y: this._originaly }, this._tweenInterval1);
          if (this._quickbetEnable) {
            egret.Tween.get(this._quickbetButton).to({ y: this._originalQuickBetButtonY, alpha: 1 }, this._tweenInterval1);
          }
        }
      }

      public onRollout(evt: egret.Event) {
        this._mouseOutside = true;
        if (!env.livepageLocked) {
          // this.setChildIndex(this._timer, 2500);

          egret.Tween.removeTweens(this);
          egret.Tween.removeTweens(this._quickbetButton);
          const tw1 = egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, y: this._originaly }, 250);
          const tw2 = egret.Tween.get(this._quickbetButton).to({ y: this._targetQuickBetButtonY, alpha: 0 }, 250);
        }
      }
    }
  }
}