namespace we {
  export namespace overlay {
    export namespace betHistory {
      export class BetHistoryDetail extends ui.Panel {
        protected _txt_title: ui.RunTimeLabel;
        protected _txt_record_id: ui.RunTimeLabel;
        protected _txt_record_date: ui.RunTimeLabel;
        protected _txt_record_game: ui.RunTimeLabel;
        protected _txt_record_round: ui.RunTimeLabel;
        protected _txt_record_replay: ui.RunTimeLabel;
        protected _txt_record_remark: ui.RunTimeLabel;
        protected _txt_record_bettype: ui.RunTimeLabel;
        protected _txt_record_betamount: ui.RunTimeLabel;
        protected _txt_record_win_s: ui.RunTimeLabel;
        protected _txt_record_win_l: ui.RunTimeLabel;
        protected _txt_record_orgbalance: ui.RunTimeLabel;
        protected _txt_record_finbalance: ui.RunTimeLabel;
        protected _txt_record_result: ui.RunTimeLabel;

        protected _record_id: eui.Label;
        protected _record_date: eui.Label;
        protected _record_game: eui.Label;
        protected _record_round: eui.Label;
        protected _record_remark: eui.Label;
        protected _record_bettype: eui.Label;
        protected _record_betamount: eui.Label;
        protected _record_win_s: eui.Label;
        protected _record_win_l: eui.Label;
        protected _record_orgbalance: eui.Label;
        protected _record_finbalance: eui.Label;

        private _btn_replay: egret.DisplayObject;
        private _record_result: egret.DisplayObjectContainer;

        private data;

        constructor() {
          super('overlay/BetHistoryDetail');
          // this.poppableAddon = new ui.PoppableAddonSilder(this);
          this.isPoppable = true;
          this.hideOnStart = true;
        }

        protected mount() {
          super.mount();

          this._txt_title.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_title')}`;
          this._txt_record_id.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_id')}`;
          this._txt_record_date.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_date')}`;
          this._txt_record_game.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_game')}`;
          this._txt_record_round.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_round')}`;
          this._txt_record_replay.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_replay')}`;
          this._txt_record_remark.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_remark')}`;
          this._txt_record_bettype.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_bettype')}`;
          this._txt_record_betamount.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_betamount')}`;
          this._txt_record_win_s.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_win')}`;
          this._txt_record_win_l.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_win')}`;
          this._txt_record_orgbalance.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_orgbalance')}`;
          this._txt_record_finbalance.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_finbalance')}`;
          this._txt_record_result.renderText = () => `${i18n.t('overlaypanel_bethistory_recordtab_resuit')}`;

          this._btn_replay.$addListener(egret.TouchEvent.TOUCH_TAP, this.onClickReplay, this);
        }

        protected destroy() {
          super.destroy();
          this._btn_replay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickReplay, this);
        }

        public dataChanged(d): void {
          this.data = d;

          this._record_id.text = this.data.betid;
          this._record_date.text = utils.formatTime((this.data.datetime / Math.pow(10, 9)).toFixed(0));
          this._record_game.text = `${i18n.t('gametype_' + we.core.GameType[this.data.gametype])} ${this.data.tablename}`;
          this._record_round.text = this.data.gameroundid;
          this._record_remark.text = this.formatRemark(this.data.remark);
          this._record_bettype.text = this.formatBetType(this.data.gametype, this.data.field);
          this._record_betamount.text = utils.formatNumber(this.data.betamount, true);
          this._record_orgbalance.text = utils.formatNumber(this.data.beforebalance, true);
          this._record_finbalance.text = utils.formatNumber(this.data.afterbalance, true);

          this.updateWinText(this.data.remark, this.data.winamount);

          this.createGameResult(this.data.gametype, this.data.result);
        }

        protected updateWinText(remark, amt) {
          switch (remark) {
            case -1:
              this._record_win_l.textColor = 0xff5555;
              break;
            default:
              this._record_win_l.textColor = 0x43ce5c;
              break;
          }

          if (amt > 0) {
            this._record_win_s.text = this._record_win_l.text = `+${utils.formatNumber(this.data.winamount, true)}`;
          } else {
            this._record_win_s.text = this._record_win_l.text = `-${utils.formatNumber(this.data.winamount, true)}`;
          }
        }

        protected onHover() {
          this.currentState = 'hover';
        }

        protected onRollOut() {
          this.currentState = 'normal';
        }

        protected onClickReplay(e: egret.Event) {
          window.open('https://www.facebook.com/', '_blank');
        }

        private formatRemark(remark) {
          switch (remark) {
            case 1:
              return i18n.t('overlaypanel_bethistory_remark_win');
            case -1:
              return i18n.t('overlaypanel_bethistory_remark_lose');
            case 0:
              return i18n.t('overlaypanel_bethistory_remark_ties');
            default:
              return '';
          }
        }

        private formatBetType(gametype, bettype: string) {
          switch (gametype) {
            case we.core.GameType.BAC:
            case we.core.GameType.BAS:
            case we.core.GameType.BAI:
              return i18n.t(`betfield_baccarat_${bettype.toLowerCase()}`);

            case we.core.GameType.DT:
              return i18n.t(`betfield_dragonTiger_${bettype.toLowerCase()}`);
            default:
              return i18n.t(`betfield_${bettype.toLowerCase()}`);
          }
        }

        private createGameResult(gametype, gameResult) {
          let p: core.BaseEUI;

          switch (gametype) {
            case we.core.GameType.BAC:
            case we.core.GameType.BAS:
            case we.core.GameType.BAI:
              p = new BaResultItem(gameResult);
              break;
            case we.core.GameType.DT:
              p = new DtResultItem(gameResult);
              break;
            default:
              p = new core.BaseEUI();
              break;
          }

          this._record_result.removeChildren();
          this._record_result.addChild(p);
        }
      }
    }
  }
}