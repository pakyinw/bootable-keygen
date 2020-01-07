/* tslint:disable triple-equals */
/**
 * BaccaratScene
 *
 * BaccaratScene consist of serveral components: Betting table, Video, serveral roadmap, table list panel on right hand side, table info panel and some statistic graph
 */
namespace we {
  export namespace ba {
    export class Scene extends core.BaseScene {
      protected _header: eui.Group;
      protected _betRelatedGroup: eui.Group;
      protected _undoButton: ui.BaseImageButton;
      protected _undoStack: we.utils.UndoStack = new we.utils.UndoStack();
      protected _bettingTable: BettingTable;
      protected _betChipSet: we.ba.BetChipSetHorizontal;
      protected _cardHolder: CardHolder;
      protected _countdownTimer: ui.CountdownTimer;
      protected _confirmButton: eui.Button;
      protected _repeatButton: ui.BaseImageButton;
      protected _cancelButton: ui.BaseImageButton;
      protected _doubleButton: ui.BaseImageButton;
      protected _roundPanel: eui.Rect;
      protected _switchLang: ui.SwitchLang;
      protected _tableID: string;
      protected _previousState: number;
      protected _tableInfo: data.TableInfo;
      protected _gameData: GameData;
      protected _betDetails: data.BetDetail[];

      protected _btnBack: egret.DisplayObject;
      protected _lblRoomInfo: eui.Label;
      protected _lblRoomNo: ui.RunTimeLabel;
      protected _lblBetLimit: eui.Label;
      protected _lblBetLimitInfo: eui.Label;

      protected _tableInfoWindow: ui.TableInfoPanel;
      protected _gameBar: GameBar;

      protected _bgImg: eui.Image;
      protected _video: egret.FlvVideo;

      protected _roadmapControl: BARoadmapControl;
      protected _roadmapLeftPanel: BARoadmapLeftPanel;
      protected _roadmapRightPanel: BARoadmapRightPanel;

      protected _resultMessage: GameResultMessage;
      protected _message: InGameMessage;

      protected _switchBaMode: eui.ToggleSwitch;
      protected _lblBaMode: ui.RunTimeLabel;

      constructor(data: any) {
        super(data);
        this._tableID = data.tableid;
        this.skinName = utils.getSkin('BaccaratScene');
        this._video = dir.videoPool.get();
        this._video.x = 0;
        this._video.y = 0;
        this._video.width = 2600;
        this._video.height = 1340;
        this._video.load('http://192.168.1.85:8090/live/360.flv');
      }

      public insufficientBalance() {
        if (this._message) {
          this._message.showMessage(InGameMessage.ERROR, 'Insufficient Balance');
        }
      }

      public set tableID(tableID: string) {
        this._tableID = tableID;
        this._lblRoomNo.text = `${i18n.t('gametype_' + we.core.GameType[this._tableInfo.gametype])} ${env.getTableNameByID(this._tableID)}`;
      }

      public get tableID() {
        return this._tableID;
      }

      public onEnter() {
        this.initRoadMap();
        this.setupTableInfo();
        this.addChild(this._video);
        this.setChildIndex(this._video, 0);
        // this.playVideo();

        this._gameBar.setPlayFunc(this.playVideo(this));
        this._gameBar.setStopFunc(this.stopVideo(this));

        // setInterval(() => ui.EdgeDismissableAddon.toggle(), 2000);

        // work around currentSelectedBetLimitIndex = 0 choose by the
        const denominationList = env.betLimits[this.getSelectedBetLimitIndex()].chipList;
        this._betChipSet.init(4, denominationList);

        this._confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmPressed, this, true);
        this._repeatButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRepeatPressed, this, true);
        this._doubleButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDoublePressed, this, true);
        this._undoButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUndoPressed, this, true);
        this._cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancelPressed, this, true);

        this._bettingTable.getSelectedBetLimitIndex = this.getSelectedBetLimitIndex;
        this._bettingTable.getSelectedChipIndex = this._betChipSet.getSelectedChipIndex.bind(this._betChipSet);
        this._bettingTable.type = we.core.BettingTableType.NORMAL;
        this._bettingTable.denomList = denominationList;
        this._bettingTable.tableId = this._tableID;
        this._bettingTable.undoStack = this._undoStack;
        this._bettingTable.init();

        if (this._switchBaMode) {
          this._bettingTable.setGameMode(this._switchBaMode.selected);
          this._switchBaMode.addEventListener(eui.UIEvent.CHANGE, this.onBaModeToggle, this);
        }

        this._lblBaMode.renderText = () => `${i18n.t('baccarat.noCommission')}`;
        this._lblRoomNo.renderText = () => `${i18n.t('gametype_' + we.core.GameType[this._tableInfo.gametype])} ${env.getTableNameByID(this._tableID)}`;

        this._tableInfoWindow.setToggler(this._lblRoomInfo);
        this._tableInfoWindow.setValue(this._tableInfo);

        // Below two must be run after the component initialization finished
        this.updateGame();
        this.addEventListeners();
      }

      protected onBaModeToggle(evt: eui.UIEvent) {
        this._bettingTable.setGameMode(this._switchBaMode.selected);
      }

      protected getSelectedBetLimitIndex() {
        return env.currentSelectedBetLimitIndex;
      }

      protected onConfirmPressed() {
        if (this._bettingTable.getTotalUncfmBetAmount() > 0) {
          const bets = this._bettingTable.getUnconfirmedBetDetails();
          this._bettingTable.resetUnconfirmedBet(); // Waiting to change to push to waitingforconfirmedbet
          this._undoStack.clearStack();
          dir.socket.bet(this.tableID, bets);
        }
      }

      protected onRepeatPressed() {
        this._bettingTable.onRepeatPressed();
      }

      protected onDoublePressed() {
        this._bettingTable.onDoublePressed();
      }

      protected onCancelPressed() {
        this._bettingTable.onCancelPressed();
      }

      protected onUndoPressed() {
        this._undoStack.popAndUndo();
      }

      public playVideo(scene: any) {
        return () => {
          scene._video.play();
          scene.bgImg.visible = false;
          scene.bgImg.enabled = false;
        };
      }

      public stopVideo(scene: any) {
        return () => {
          scene._video.stop();
          scene.bgImg.visible = true;
          scene.bgImg.enabled = true;
        };
      }

      protected setupTableInfo() {
        // console.log(env.tableInfoArray);
        const self = this;
        env.tableInfoArray.forEach(value => {
          if (value.tableid === self._tableID) {
            self._tableInfo = value;
            self._betDetails = self._tableInfo.bets;
            self._gameData = self._tableInfo.data;
            self._previousState = core.GameState.UNKNOWN; // self.tableInfo.data.previousstate;
            self._roadmapControl.updateRoadData(self._tableInfo.roadmap);
            if (self._tableInfo.betInfo) {
              self._roadmapLeftPanel.setGameInfo(self._tableInfo.betInfo.gameroundid, self._tableInfo.betInfo.total);
            }
          }
        });
      }

      protected addEventListeners() {
        dir.evtHandler.addEventListener(core.Event.TABLE_INFO_UPDATE, this.onTableInfoUpdate, this);
        dir.evtHandler.addEventListener(core.Event.PLAYER_BET_INFO_UPDATE, this.onBetDetailUpdate, this);
        dir.evtHandler.addEventListener(core.Event.PLAYER_BET_RESULT, this.onBetResultReceived, this);
        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.onChangeLang, this);
        dir.evtHandler.addEventListener(core.Event.ROADMAP_UPDATE, this.onRoadDataUpdate, this);
        dir.evtHandler.addEventListener(core.Event.TABLE_BET_INFO_UPDATE, this.onTableBetInfoUpdate, this);
        dir.evtHandler.addEventListener(core.Event.INSUFFICIENT_BALANCE, this.insufficientBalance, this);
        dir.evtHandler.addEventListener(core.Event.BET_LIMIT_CHANGE, this.onBetLimitChanged, this);
        this._btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToLobby, this);
        // this.lblRoomInfo.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleRoomInfo, this);
      }

      protected onBetLimitChanged(evt: egret.Event) {
        const denominationList = env.betLimits[this.getSelectedBetLimitIndex()].chipList;
        this._betChipSet.resetDenominationList(denominationList);
      }

      protected toggleRoomInfo() {
        this._tableInfoWindow.visible = !this._tableInfoWindow.visible;
      }

      protected removeEventListeners() {
        dir.evtHandler.removeEventListener(core.Event.TABLE_INFO_UPDATE, this.onTableInfoUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.PLAYER_BET_INFO_UPDATE, this.onBetDetailUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.PLAYER_BET_RESULT, this.onBetResultReceived, this);
        dir.evtHandler.removeEventListener(core.Event.ROADMAP_UPDATE, this.onRoadDataUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.TABLE_BET_INFO_UPDATE, this.onTableBetInfoUpdate, this);
        dir.evtHandler.removeEventListener(core.Event.INSUFFICIENT_BALANCE, this.insufficientBalance, this);

        this._btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.backToLobby, this);
      }

      public async onFadeEnter() {}

      public onExit() {
        super.onExit();
        dir.videoPool.release(this._video);
        this.removeEventListeners();
        this.removeChildren();
      }

      public backToLobby() {
        dir.sceneCtr.goto('lobby', { page: 'live', tab: 'ba' });
      }

      public onChangeLang() {
        this._bettingTable.onChangeLang();
      }

      public async onFadeExit() {}

      protected initRoadMap() {
        this._roadmapControl = new BARoadmapControl(this._tableID);
        this._roadmapControl.setRoads(
          this._roadmapLeftPanel.beadRoad,
          this._roadmapRightPanel.bigRoad,
          this._roadmapRightPanel.bigEyeRoad,
          this._roadmapRightPanel.smallRoad,
          this._roadmapRightPanel.cockroachRoad,
          [16, 33, 66, 34, 32],
          this._roadmapRightPanel
        );
      }

      protected mount() {
        super.mount();
        mouse.setButtonMode(this._btnBack, true);
      }

      protected socketConnect() {}

      protected socketConnectSuccess() {
        // dir.evtHandler.removeEventListener(enums.mqtt.event.CONNECT_SUCCESS, this.socketConnectSuccess, this);
        // dir.evtHandler.removeEventListener(enums.mqtt.event.CONNECT_FAIL, this.socketConnectFail, this);
        // step 4: auth and get user profiles
        // step 5: get and display tips, promote banner
        // step 6: load general resource (lobby, baccarat)
        // step 7: init complete, transfer to lobby scene
        // dir.sceneCtr.goto('LobbySCene');
      }

      protected socketConnectFail() {}

      protected onTableInfoUpdate(evt: egret.Event) {
        if (evt && evt.data) {
          const tableInfo = <data.TableInfo> evt.data;
          if (tableInfo.tableid === this.tableID) {
            // update the scene
            this._tableInfo = tableInfo;
            this._betDetails = tableInfo.bets;
            this._gameData = <GameData> this._tableInfo.data;
            this._previousState = this._gameData ? this._gameData.previousstate : core.GameState.UNKNOWN;
            if (tableInfo.roadmap) {
              this._roadmapControl.updateRoadData(tableInfo.roadmap);
            }
            if (tableInfo.betInfo) {
              this._roadmapLeftPanel.setGameInfo(tableInfo.betInfo.gameroundid, tableInfo.betInfo.total);
            }

            // console.log('BaccaratScene::onTableInfoUpdate', this.gameData);
            this.updateGame();

            this._tableInfoWindow.setValue(this._tableInfo);
          }
        }
      }

      protected onTableBetInfoUpdate(evt: egret.Event) {
        console.log('BaccaratScene::onTableBetInfoUpdate');
        console.log(evt.data);
        if (evt && evt.data) {
          const betInfo = <data.GameTableBetInfo> evt.data;
          if (betInfo.tableid === this.tableID) {
            // update the scene
          }
        }
      }

      protected onBetDetailUpdate(evt: egret.Event) {
        const tableInfo = <data.TableInfo> evt.data;
        if (tableInfo.tableid === this.tableID) {
          this._betDetails = tableInfo.bets;
          switch (this._gameData.state) {
            case core.GameState.BET:
              this._bettingTable.updateBetFields(this._betDetails);
              this._message.showMessage(InGameMessage.SUCCESS, i18n.t('baccarat.betSuccess'));
              break;
            case core.GameState.FINISH:
            default:
              // this.winAmountLabel.visible = true;
              // this.winAmountLabel.text = `This round you got: ${this.totalWin.toString()}`;
              this._bettingTable.showWinEffect(this._betDetails);
              this.checkResultMessage(this._tableInfo.totalWin);
              break;
          }
        }
      }

      protected onBetResultReceived(evt: egret.Event) {
        const result: data.PlayerBetResult = evt.data;
        if (result.success) {
          this.onBetConfirmed();
        }
      }

      protected onRoadDataUpdate(evt: egret.Event) {
        // console.log('BaccaratScene::onRoadDataUpdate');
        const tableInfo = <data.TableInfo> evt.data;
        if (tableInfo.tableid === this.tableID) {
          this._bettingTable.tableId = this._tableID;
          if (tableInfo.roadmap) {
            this._roadmapControl.updateRoadData(tableInfo.roadmap);
          }
          if (tableInfo.betInfo) {
            this._roadmapLeftPanel.setGameInfo(tableInfo.betInfo.gameroundid, tableInfo.betInfo.total);
          }
        }
      }

      protected updateGame() {
        switch (this._gameData && this._gameData.state) {
          case core.GameState.IDLE:
            this.setStateIdle();
            break;
          case core.GameState.BET:
            this.setStateBet();
            break;
          case core.GameState.DEAL:
            this.setStateDeal();
            break;
          case core.GameState.FINISH:
            this.setStateFinish();
            break;
          case core.GameState.REFUND:
            this.setStateRefund();
            break;
          case core.GameState.SHUFFLE:
            this.setStateShuffle();
            break;
          default:
            break;
        }
      }

      protected setStateIdle() {
        if (this._previousState !== core.GameState.IDLE) {
          this._bettingTable.setTouchEnabled(false);
          this._cardHolder.visible = false;
          // this.winAmountLabel.visible = false;
          // this.setBetRelatedComponentsTouchEnabled(false);
          // hide state
          // this.stateLabel.visible = false;
          this.setBetRelatedComponentsVisibility(false);
        }
      }

      protected setStateBet() {
        if (this._previousState !== core.GameState.BET) {
          // reset data betinfo
          this._bettingTable.resetUnconfirmedBet();
          this._bettingTable.resetConfirmedBet();
          this._undoStack.clearStack();
          this._resultMessage.clearMessage();

          // if (this.betDetails) {
          //   this.betDetails.splice(0, this.betDetails.length);
          // }

          // show start bet message to the client for few seconds
          this._message.showMessage(InGameMessage.INFO, i18n.t('game.startBet'));
          // this.stateLabel.text = 'Betting';
          // this.winAmountLabel.visible = false;

          // // show state
          // this.stateLabel.visible = true;

          // hide cardHolder
          this._cardHolder.visible = false;

          // show the betchipset, countdownTimer, confirm, cancel and other bet related buttons
          this.setBetRelatedComponentsVisibility(true);

          // enable betting table
          this._bettingTable.setTouchEnabled(true);
          this.setBetRelatedComponentsTouchEnabled(true);

          // update the bet amount of each bet field in betting table
        }
        if (this._betDetails) {
          this._bettingTable.updateBetFields(this._betDetails);
        }

        // update the countdownTimer
        this.updateCountdownTimer();
      }
      protected setStateDeal() {
        if (this._previousState !== core.GameState.DEAL) {
          this._cardHolder.resetCards();
          // show stop bet message to the client for few seconds
          if (this._previousState === core.GameState.BET) {
            this._message.showMessage(InGameMessage.INFO, i18n.t('game.stopBet'));
          }

          // hide the betchipset, countdownTimer, confirm, cancel and other bet related buttons
          this.setBetRelatedComponentsVisibility(false);
          this.setBetRelatedComponentsTouchEnabled(false);

          // show state
          // this.stateLabel.visible = true;

          // show cardHolder
          this._cardHolder.visible = true;
          this._cardHolder.updateResult(this._gameData);

          // disable betting table
          this._bettingTable.setTouchEnabled(false);
          this.setBetRelatedComponentsTouchEnabled(false);

          // this.winAmountLabel.visible = false;
        }
        if (this._betDetails) {
          this._bettingTable.updateBetFields(this._betDetails);
        }
        // update card result in cardHolder
        this._cardHolder.updateResult(this._gameData);
      }
      protected setStateFinish() {
        if (this._previousState !== core.GameState.FINISH) {
          // hide the betchipset, countdownTimer, confirm, cancel and other bet related buttons
          this.setBetRelatedComponentsVisibility(false);

          // show state
          // this.stateLabel.visible = true;

          // show cardHolder
          this._cardHolder.visible = true;
          this._cardHolder.updateResult(this._gameData);

          // disable betting table
          this._bettingTable.setTouchEnabled(false);
          this.setBetRelatedComponentsTouchEnabled(false);

          // TODO: show effect on each winning bet field
          logger.l(`this.gameData.winType ${this._gameData.wintype} ${utils.EnumHelpers.getKeyByValue(WinType, this._gameData.wintype)}`);
          // this.stateLabel.text = `Finish, ${utils.EnumHelpers.getKeyByValue(WinType, this.gameData.wintype)}`;

          // TODO: show win message and the total win ammount to the client for few seconds
          this.checkResultMessage(this._tableInfo.totalWin);

          // TODO: after win message has shown, show win/ lose effect of each bet
        }
      }
      protected setStateRefund() {
        if (this._previousState !== core.GameState.REFUND) {
          // TODO: show round cancel message to the client for few seconds
          // this.stateLabel.text = 'Refunding';

          // TODO: after round cancel message has shown, show refund effect of each bet

          // hide the betchipset, countdownTimer, confirm, cancel and other bet related buttons
          this.setBetRelatedComponentsVisibility(false);
          this.setBetRelatedComponentsTouchEnabled(false);

          // show state
          // this.stateLabel.visible = true;

          // hide cardHolder
          // this.cardHolder.visible = false;
          // this.winAmountLabel.visible = false;

          // disable betting table
          this._bettingTable.setTouchEnabled(false);
        }
      }
      protected setStateShuffle() {
        // if (this.previousState !== core.GameState.SHUFFLE) {
        // TODO: show shuffle message to the client for few seconds
        // this.stateLabel.text = 'Shuffling';

        // hide the betchipset, countdownTimer, confirm, cancel and other bet related buttons
        this.setBetRelatedComponentsVisibility(false);
        this.setBetRelatedComponentsTouchEnabled(false);

        // show state
        // this.stateLabel.visible = true;

        // hide cardHolder
        this._cardHolder.visible = false;
        // this.winAmountLabel.visible = false;

        // disable betting table
        this._bettingTable.setTouchEnabled(false);
        // }
      }

      public checkResultMessage(totalWin: number = NaN) {
        if (this.hasBet()) {
          if (this._gameData && this._gameData.wintype != WinType.NONE && !isNaN(totalWin)) {
            this._resultMessage.showResult(this._gameData.wintype, totalWin);
            // play sound
            dir.audioCtr.playSequence(['player', 'win']);
          }
        } else {
          if (this._gameData && this._gameData.wintype != WinType.NONE) {
            this._resultMessage.showResult(this._gameData.wintype);
            // play sound
            dir.audioCtr.playSequence(['player', 'win']);
          }
        }
      }

      public onBetConfirmed() {
        this._bettingTable.resetUnconfirmedBet();
      }

      protected setBetRelatedComponentsVisibility(visible: boolean) {
        this._betRelatedGroup.visible = visible;
        /*
        this._roundPanel.visible = visible;
        this._betChipSet.visible = visible;
        this._countdownTimer.visible = visible;
        this._confirmButton.visible = visible;
        this._cancelButton.visible = visible;
        this._doubleButton.visible = visible;
        this._repeatButton.visible = visible;
        */
      }

      protected setBetRelatedComponentsTouchEnabled(enabled: boolean) {
        this._betChipSet.setTouchEnabled(enabled);
        this._confirmButton.touchEnabled = enabled;
        this._cancelButton.touchEnabled = enabled;
      }

      protected updateCountdownTimer() {
        this._countdownTimer.countdownValue = this._gameData.countdown * 1000;
        this._countdownTimer.remainingTime = this._gameData.countdown * 1000 - (env.currTime - this._gameData.starttime);
        this._countdownTimer.start();
      }

      protected hasBet(): boolean {
        if (this._betDetails) {
          for (const betDetail of this._betDetails) {
            if (betDetail.amount > 0) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }
}
