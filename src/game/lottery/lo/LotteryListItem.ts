namespace we {
  export namespace lo {
    export class LotteryListItem extends ui.ListBaseItem {
      protected _rdContainer: ui.Group;
      protected _tf_round: eui.Label;
      protected _txt_round: ui.RunTimeLabel;

      protected _counter: eui.Label;
      protected _targetTime;
      protected _counterInterval;

      public constructor(skinName: string = null) {
        super(skinName);
      }

      protected addEventListeners() {
        super.addEventListeners();
        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.onLang, this);
      }

      protected removeEventListeners() {
        super.removeEventListeners();
        dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.onLang, this);
        this.resetTimer();
      }

      public setData(tableinfo: data.TableInfo) {
        super.setData(tableinfo);
        this._tf_round.text = this._gameData.gameroundid;
      }

      protected updateCountdownTimer() {
        clearInterval(this._counterInterval);
        this._targetTime = this._gameData.starttime + this._gameData.countdown * 1000;

        this._counterInterval = setInterval(this.update.bind(this), 500);
        this.update();
      }

      protected update() {
        const diff = this._targetTime - env.currTime;

        if (diff > 0) {
          this._counter.text = moment.utc(diff).format('HH:mm:ss');
        } else {
          this.resetTimer();
        }
      }

      protected resetTimer() {
        this._counter.text = '00:00:00';
        clearInterval(this._counterInterval);
      }

      protected onLang() {
        if (env.language === 'en') {
          this._rdContainer.setChildIndex(this._tf_round, 1);
          this._rdContainer.setChildIndex(this._txt_round, 0);
        } else {
          this._rdContainer.setChildIndex(this._txt_round, 1);
          this._rdContainer.setChildIndex(this._tf_round, 0);
        }
      }
    }
  }
}