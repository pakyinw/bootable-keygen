/* tslint:disable triple-equals */
namespace we {
  export namespace ui {
    export class LotteryMobileLiveListItem extends MobileLiveListItem {
      protected _counter1: eui.Label;
      protected _counter2: eui.Label;
      protected _counter3: eui.Label;
      protected _counter4: eui.Label;
      protected _counter5: eui.Label;
      protected _counter6: eui.Label;
      protected _timerDot1: eui.Label;
      protected _timerDot2: eui.Label;

      protected _targetTime;
      protected _counterInterval;

      public constructor(skinName: string = null) {
        super(skinName);
      }

      protected initChildren() {
        super.initChildren();
        this.resetTimer();
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
          const dateStr = moment.utc(diff).format('HH:mm:ss');
          this._counter1.text = dateStr.substr(0, 1);
          this._counter2.text = dateStr.substr(1, 1);
          this._counter3.text = dateStr.substr(3, 1);
          this._counter4.text = dateStr.substr(4, 1);
          this._counter5.text = dateStr.substr(6, 1);
          this._counter6.text = dateStr.substr(7, 1);

          this._counter1.textColor = (diff > 5999) ? 0x4adc84 : 0xe4493a;
          this._timerDot1.textColor = this._timerDot2.textColor = this._counter2.textColor = this._counter3.textColor = this._counter4.textColor = this._counter5.textColor = this._counter6.textColor = this._counter1.textColor;
        } else {
          this.resetTimer();
        }
      }

      protected resetTimer() {
        this._counter1.text = '0';
        this._counter2.text = '0';
        this._counter3.text = '0';
        this._counter4.text = '0';
        this._counter5.text = '0';
        this._counter6.text = '0';
        this._counter1.textColor = 0xe4493a;
        this._timerDot1.textColor = this._timerDot2.textColor = this._counter2.textColor = this._counter3.textColor = this._counter4.textColor = this._counter5.textColor = this._counter6.textColor = this._counter1.textColor;
        clearInterval(this._counterInterval);
      }

      protected onTouchTap(evt: egret.Event) {
        // check if the parent name is "ActionButton"
        let t = evt.target;
        if (t.stage) {
          while (!(t instanceof egret.Stage)) {
            if (t.name === 'ActionButton') {
              return;
            } else {
              t = t.parent;
            }
          }
        }
        //
        if (evt.target === this._toggler || evt.target === this) {
          evt.stopPropagation();
          return;
        }

        if (this._isButtonGroupShow) {
          this.hideButtonGroup();
        } else {
          this.showButtonGroup();
        }
      }
    }
  }
}