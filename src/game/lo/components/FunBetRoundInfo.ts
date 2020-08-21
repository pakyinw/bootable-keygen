namespace we {
  export namespace lo {
    export class FunBetRoundInfo extends core.BaseEUI {
      protected _txt_thisRound: ui.RunTimeLabel;
      protected _tf_round: eui.Label;
      protected _txt_round: ui.RunTimeLabel;
      protected _tf_lastRound: eui.Label;
      protected _txt_lastRound: ui.RunTimeLabel;

      protected _rdContainer: ui.Group;
      protected _lastRdContainer: ui.Group;

      protected b5: eui.Label;
      protected b4: eui.Label;
      protected b3: eui.Label;
      protected b2: eui.Label;
      protected b1: eui.Label;

      protected mount() {
        super.mount();
        this._txt_thisRound.renderText = () => `${i18n.t('lo_fun_bettingRound')}`;
        this._txt_round.renderText = () => `${i18n.t('lo_fun_round')}`;
        this._txt_lastRound.renderText = () => `${i18n.t('lo_fun_lastRound')}`;

        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.onLang, this);
      }

      protected destroy() {
        super.destroy();
        dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.onLang, this);
      }

      protected onLang() {
        if (env.language === 'en') {
          this._rdContainer.setChildIndex(this._tf_round, 1);
          this._rdContainer.setChildIndex(this._txt_round, 0);

          this._lastRdContainer.setChildIndex(this._tf_lastRound, 1);
          this._lastRdContainer.setChildIndex(this._txt_lastRound, 0);
          this._tf_lastRound.visible = false;
        } else {
          this._rdContainer.setChildIndex(this._txt_round, 1);
          this._rdContainer.setChildIndex(this._tf_round, 0);

          this._lastRdContainer.setChildIndex(this._txt_lastRound, 1);
          this._lastRdContainer.setChildIndex(this._tf_lastRound, 0);
          this._tf_lastRound.visible = true;
        }
      }

      public update(r) {
        this._tf_round.text = r.gameroundid;
        this.b1.text = r.ball1 >= 0 ? `${r.ball1}` : `-`;
        this.b2.text = r.ball2 >= 0 ? `${r.ball2}` : `-`;
        this.b3.text = r.ball3 >= 0 ? `${r.ball3}` : `-`;
        this.b4.text = r.ball4 >= 0 ? `${r.ball4}` : `-`;
        this.b5.text = r.ball5 >= 0 ? `${r.ball5}` : `-`;
      }
    }
  }
}
