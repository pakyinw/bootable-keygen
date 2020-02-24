namespace we {
  export namespace ui {
    export class ChipLayer extends ui.Panel {
      protected _tableId: string;
      protected _type: we.core.BettingTableType;
      protected _denomList: number[];
      protected _tableLayer: TableLayer;
      protected _betChipSet: BetChipSet & eui.Component;

      protected _getSelectedChipIndex: () => number;
      protected _getSelectedBetLimitIndex: () => number;
      protected _undoStack: we.utils.UndoStack;

      protected _mouseAreaMapping: { [s: string]: any };
      protected _betChipStackMapping: { [s: string]: BetChipStack };

      protected _betField: any;

      protected _uncfmBetDetails: data.BetDetail[];
      protected _cfmBetDetails: data.BetDetail[];

      constructor(skinName?: string) {
        super(skinName);
        this.once(eui.UIEvent.REMOVED_FROM_STAGE, this.destroy, this);
      }

      protected destroy() {
        // dir.evtHandler.addEventListener(core.Event.TABLE_LIST_UPDATE, function () {}, this);
      }

      public onTableListUpdate() {}

      set betField(value: any) {
        this._betField = value;
      }

      get betField() {
        return this._betField;
      }

      set denomList(value: number[]) {
        this._denomList = value;
      }

      get denomList() {
        return this._denomList;
      }

      set tableLayer(value: TableLayer) {
        this._tableLayer = value;
      }

      get tableLayer() {
        return this._tableLayer;
      }

      set betChipSet(value: BetChipSet & eui.Component) {
        this._betChipSet = value;
      }

      get betChipSet() {
        return this._betChipSet;
      }

      set uncfmBetDetails(value: data.BetDetail[]) {
        this._uncfmBetDetails = value;
      }

      get uncfmBetDetails() {
        return this._uncfmBetDetails;
      }

      set tableId(value: string) {
        this._tableId = value;
      }

      get tableId() {
        return this._tableId;
      }

      set type(value: we.core.BettingTableType) {
        this._type = value;
      }

      get type() {
        return this._type;
      }

      set undoStack(value: we.utils.UndoStack) {
        this._undoStack = value;
      }

      get undoStack() {
        return this._undoStack;
      }

      protected createMapping() {}

      protected passDenomListToBetChipStack() {
        Object.keys(this._betChipStackMapping).forEach(value => {
          if (this._betChipStackMapping[value]) {
            this._betChipStackMapping[value].denomList = this._denomList;
          }
        });
      }

      // Must be called if you change skin
      public init() {
        this.createMapping();
        this.passDenomListToBetChipStack();
        this.resetUnconfirmedBet();
        this.addAllMouseListeners();
      }

      public isAlreadyBet() {
        const result = this._cfmBetDetails.reduce((acc, cur) => {
          return cur.amount > 0 || acc;
        }, false);
        return result;
      }

      public addRolloverListeners() {
        Object.keys(this._mouseAreaMapping).forEach(value => {
          if (this._mouseAreaMapping[value]) {
            this._mouseAreaMapping[value].addEventListener(mouse.MouseEvent.ROLL_OVER, this.onGridRollover(value), this);
          }
        });
      }

      public removeRolloverListeners() {
        Object.keys(this._mouseAreaMapping).forEach(value => {
          if (this._mouseAreaMapping[value]) {
            this._mouseAreaMapping[value].addEventListener(mouse.MouseEvent.ROLL_OVER, this.onGridRollover(value), this);
          }
        });
      }

      public addRolloutListeners() {
        Object.keys(this._mouseAreaMapping).forEach(value => {
          if (this._mouseAreaMapping[value]) {
            this._mouseAreaMapping[value].addEventListener(mouse.MouseEvent.ROLL_OUT, this.onGridRollout(value), this);
          }
        });
      }

      public removeRolloutListeners() {
        Object.keys(this._mouseAreaMapping).forEach(value => {
          if (this._mouseAreaMapping[value]) {
            this._mouseAreaMapping[value].addEventListener(mouse.MouseEvent.ROLL_OUT, this.onGridRollout(value), this);
          }
        });
      }

      public onGridRollover(fieldName: string) {
        return (evt: egret.Event) => {
          if (evt.target === this._mouseAreaMapping[fieldName]) {
            this._tableLayer.onRollover(fieldName);
          }
        };
      }

      public onGridRollout(fieldName: string) {
        return (evt: egret.Event) => {
          if (evt.target === this._mouseAreaMapping[fieldName]) {
            this._tableLayer.onRollout(fieldName);
          }
        };
      }

      public addTouchTapListeners() {
        Object.keys(this._mouseAreaMapping).forEach(value => {
          if (this._mouseAreaMapping[value]) {
            this._mouseAreaMapping[value].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBetFieldUpdate(value), this);
          }
        });
      }

      public removeTouchTapListeners() {
        Object.keys(this._mouseAreaMapping).forEach(value => {
          if (this._mouseAreaMapping[value]) {
            this._mouseAreaMapping[value].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBetFieldUpdate(value), this);
          }
        });
      }

      public removeAllMouseListeners() {
        this.removeRolloverListeners();
        this.removeRolloutListeners();
        this.removeTouchTapListeners();
      }

      public addAllMouseListeners() {
        this.addRolloverListeners();
        this.addRolloutListeners();
        this.addTouchTapListeners();
      }

      public setState(state: string) {
        this.currentState = state;
      }

      protected changeLang() {}

      public setTouchEnabled(enable: boolean) {
        this.touchEnabled = enable;
        this.touchChildren = enable;
        if (!enable) {
          this.cancelBet();
        }
      }

      public getUnconfirmedBetDetails() {
        return this._uncfmBetDetails;
      }

      public getTotalUncfmBetAmount() {
        return this._uncfmBetDetails.reduce((a, b) => a + b.amount, 0);
      }

      public updateBetFields(betDetails: data.BetDetail[]) {
        this._cfmBetDetails = betDetails;

        // update the already bet amount of each bet field
        this._cfmBetDetails.map((value, index) => {
          if (this._betChipStackMapping[value.field]) {
            this._betChipStackMapping[value.field].cfmBet = value.amount;
            this._betChipStackMapping[value.field].draw();
          }
        });
      }

      public showWinFields(betDetails: data.BetDetail[]) {
        // TODO: show the win effect of each win field
        this._cfmBetDetails = betDetails;
      }

      public showWinEffect(betDetails: data.BetDetail[]) {
        // TODO: show the win effect of each winning bet
        this._cfmBetDetails = betDetails;
      }

      protected getUncfmBetByField(fieldName: string) {
        for (const value of this._uncfmBetDetails) {
          if (value.field === fieldName) {
            return value;
          }
        }
      }

      protected getOrderAmount() {
        return env.betLimits[this._getSelectedBetLimitIndex()].chipList[this._getSelectedChipIndex()];
      }

      protected onBetFieldUpdate(fieldName: string) {
        return () => {
          const grid = this.getUncfmBetByField(fieldName);
          const betDetail = { field: fieldName, amount: this.getOrderAmount() };
          // validate bet action
          if (this.validateBetAction(betDetail)) {
            // update the uncfmBetDetails
            for (const detail of this._uncfmBetDetails) {
              if (detail.field === betDetail.field) {
                detail.amount += betDetail.amount;
                break;
              }
            }
            // update the corresponding table grid
            this.undoStack.push(new Date().getTime(), we.utils.clone({ field: fieldName, amount: grid.amount }), this.undoBetFieldUpdate.bind(this));
          }
          if (this._betChipStackMapping[fieldName]) {
            this._betChipStackMapping[fieldName].uncfmBet = grid.amount;
            this._betChipStackMapping[fieldName].draw();
          }
        };
      }

      protected undoBetFieldUpdate(data: { fieldName: string; amount: number }) {
        if (this._betChipStackMapping[data.fieldName]) {
          this._betChipStackMapping[data.fieldName].uncfmBet -= data.amount;
          this._betChipStackMapping[data.fieldName].draw();
        }
        this._uncfmBetDetails.forEach(value => {
          if (value.field === data.fieldName) {
            value.amount -= data.amount;
          }
        });
      }

      public onDoublePressed() {
        this._undoStack.push(new Date().getTime(), we.utils.clone(this._uncfmBetDetails), this.undoDoubleBetFields.bind(this));
        this.doubleBetFields();
      }

      public undoDoubleBetFields(betDetails: data.BetDetail[]) {
        betDetails.map(value => {
          if (this._betChipStackMapping[value.field]) {
            this._betChipStackMapping[value.field].uncfmBet = value.amount;
            this._betChipStackMapping[value.field].draw();
          }
        });
        this._uncfmBetDetails = betDetails;
      }

      public doubleBetFields() {
        const validDoubleBet = this._cfmBetDetails.reduce((acc, cur) => {
          if (cur.amount === 0) {
            return acc && true;
          }
          const betDetail = { field: cur.field, amount: cur.amount };
          return this.validateBetAction(betDetail) ? acc && true : false;
        }, true);
        if (!validDoubleBet) {
          return;
        }
        this._cfmBetDetails.map(value => {
          const addedAmount = value.amount;
          if (addedAmount > 0) {
            if (this._betChipStackMapping[value.field]) {
              this._betChipStackMapping[value.field].uncfmBet += addedAmount;
              this._betChipStackMapping[value.field].draw();
            }
            for (const detail of this._uncfmBetDetails) {
              if (detail.field === value.field) {
                detail.amount += addedAmount;
                break;
              }
            }
          }
        });
      }

      public onRepeatPressed() {
        this._undoStack.push(new Date(), we.utils.clone(this._uncfmBetDetails), this.undoRepeatBetFields.bind(this));
        this.repeatBetFields();
      }

      protected undoRepeatBetFields(betDetails: data.BetDetail[]) {
        betDetails.map(value => {
          this.getUncfmBetByField(value.field).amount = value.amount;
        });
        this._uncfmBetDetails = betDetails;
      }

      public repeatBetFields() {
        if (!env.tableInfos[this._tableId].prevbets || !env.tableInfos[this._tableId].prevroundid) {
          return;
        }
        if (env.tableInfos[this._tableId].prevroundid !== env.tableInfos[this._tableId].prevbetsroundid) {
          return;
        }
        const validRepeatBet = this._cfmBetDetails.map(value => {
          if (value.amount === 0) {
            return true;
          }
          let betDetail = { field: value.field, amount: 0 };
          for (const bets of env.tableInfos[this._tableId].prevbets) {
            if (bets.field === value.field) {
              betDetail = { field: bets.field, amount: bets.amount };
            }
          }
          if (this.validateBetAction(betDetail)) {
            return true;
          }
          return false;
        });
        for (const valid of validRepeatBet) {
          if (!valid) {
            return;
          }
        }
        env.tableInfos[this._tableId].prevbets.map(value => {
          this._betChipStackMapping[value.field].uncfmBet = value.amount;
          this._betChipStackMapping[value.field].draw();
          for (const detail of this._uncfmBetDetails) {
            if (detail.field === value.field) {
              detail.amount += value.amount;
              break;
            }
          }
        });
      }

      set getSelectedChipIndex(value: () => number) {
        this._getSelectedChipIndex = value;
      }

      get getSelectedChipIndex() {
        return this._getSelectedChipIndex;
      }

      set getSelectedBetLimitIndex(value: () => number) {
        this._getSelectedBetLimitIndex = value;
      }

      get getSelectedBetLimitIndex() {
        return this._getSelectedBetLimitIndex;
      }

      protected validateBet(): boolean {
        const fieldAmounts = utils.arrayToKeyValue(this._uncfmBetDetails, 'field', 'amount');
        return this.validateFieldAmounts(fieldAmounts, this.getTotalUncfmBetAmount());
      }

      // check if the current unconfirmed betDetails are valid
      protected validateFieldAmounts(fieldAmounts: {}, totalBetAmount: number): boolean {
        const betLimit: data.BetLimit = env.betLimits[this._getSelectedBetLimitIndex()];
        // TODO: check balance
        const balance = env.balance;
        if (balance < totalBetAmount) {
          this.dispatchEvent(new egret.Event(core.Event.INSUFFICIENT_BALANCE));
          return false;
        }
        const exceedBetLimit = this.isExceedBetLimit(fieldAmounts, betLimit);

        if (exceedBetLimit) {
          dir.evtHandler.dispatch(core.Event.EXCEED_BET_LIMIT);
          return false;
        }
        return true;
      }

      protected isExceedBetLimit(fieldAmounts: {}, betLimit: data.BetLimit) {
        return false;
      }

      // check if the current bet action is valid
      protected validateBetAction(betDetail: data.BetDetail): boolean {
        const fieldAmounts = utils.arrayToKeyValue(this._uncfmBetDetails, 'field', 'amount');
        fieldAmounts[betDetail.field] += betDetail.amount;
        return this.validateFieldAmounts(fieldAmounts, this.getTotalUncfmBetAmount() + betDetail.amount);
      }

      public resetUnconfirmedBet() {
        this._uncfmBetDetails = new Array();
        Object.keys(this._betField).map(value => {
          this._uncfmBetDetails.push({ field: value, amount: 0 });
        });
        if (this._betChipStackMapping) {
          Object.keys(this._betChipStackMapping).forEach(value => {
            if (this._betChipStackMapping[value]) {
              this._betChipStackMapping[value].uncfmBet = 0;
              this._betChipStackMapping[value].draw();
            }
          });
        }
      }

      public resetConfirmedBet() {
        this._cfmBetDetails = new Array();
        Object.keys(this._cfmBetDetails).map(value => {
          this._cfmBetDetails.push({ field: value, amount: 0 });
        });
        if (this._betChipStackMapping) {
          Object.keys(this._betChipStackMapping).forEach(value => {
            if (this._betChipStackMapping[value]) {
              this._betChipStackMapping[value].cfmBet = 0;
              this._betChipStackMapping[value].draw();
            }
          });
        }
      }

      public onCancelPressed() {
        this._undoStack.push(null, we.utils.clone(this._uncfmBetDetails), this.undoCancelBet.bind(this));
        this.cancelBet();
      }

      public cancelBet() {
        this.resetUnconfirmedBet();
        Object.keys(this._betChipStackMapping).map(value => {
          if (this._betChipStackMapping[value]) {
            this._betChipStackMapping[value].uncfmBet = 0;
            this._betChipStackMapping[value].draw();
          }
        });
      }

      public undoCancelBet(betDetails: data.BetDetail[]) {
        if (betDetails) {
          betDetails.forEach(value => {
            if (value) {
              if (this._betChipStackMapping[value.field]) {
                this._betChipStackMapping[value.field].uncfmBet = value.amount;
                this._betChipStackMapping[value.field].draw();
              }
            }
          });
          this._uncfmBetDetails = betDetails;
        }
      }

      public onChangeLang() {
        this.changeLang();
      }
    }
  }
}
