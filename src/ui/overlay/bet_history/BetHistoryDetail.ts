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

        protected _btn_prev: ui.RoundRectButton;
        protected _btn_next: ui.RoundRectButton;
        protected _btn_replay: egret.DisplayObject;
        protected _record_result: egret.DisplayObjectContainer;
        protected _source: any;
        protected _index: number;

        private data;

        constructor() {
          super();
          // super(env.isMobile ? 'BetHistoryDetail' : null);
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

          if (this._btn_next) {
            this._btn_next.label.renderText = () => `${i18n.t('overlaypanel_bethistory_btn_next')}`;
            this._btn_next.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
          }

          if (this._btn_prev) {
            this._btn_prev.label.renderText = () => `${i18n.t('overlaypanel_bethistory_btn_prev')}`;
            this._btn_prev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.prevPage, this);
          }

          this._btn_replay.$addListener(egret.TouchEvent.TOUCH_TAP, this.onClickReplay, this);
        }

        protected nextPage() {
          this.dataChanged(this._source, this._index + 1);
          this.show();
        }

        protected prevPage() {
          this.dataChanged(this._source, this._index - 1);
          this.show();
        }

        protected destroy() {
          super.destroy();
          this._btn_replay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickReplay, this);
        }

        public dataChanged(source, index): void {
          this._source = source;
          this._index = index;
          this.data = source[index];

          if (this._btn_next) {
            this._btn_next.visible = this._index + 1 < this._source.length;
          }
          if (this._btn_prev) {
            this._btn_prev.visible = this._index - 1 >= 0;
          }

          this._record_id.text = this.data.betid;
          this._record_date.text = utils.formatTime(this.data.datetime.toFixed(0));
          // this._record_date.text = utils.formatTime((this.data.datetime / Math.pow(10, 9)).toFixed(0));
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
            this._record_win_s.text = this._record_win_l.text = `${utils.formatNumber(this.data.winamount, true)}`;
          }
        }

        protected onHover() {
          this.currentState = 'hover';
        }

        protected onRollOut() {
          this.currentState = 'normal';
        }

        protected onClickReplay(e: egret.Event) {
          if (this.data && this.data.replayurl) {
            window.open(this.data.replayurl, '_blank');
          }
          // window.open('https://www.facebook.com/', '_blank');
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
            case we.core.GameType.BAM:
              return i18n.t(`betfield_baccarat_${bettype.toLowerCase()}`);

            case we.core.GameType.DT:
              return i18n.t(`betfield_dragonTiger_${bettype.toLowerCase()}`);
            case we.core.GameType.DI:
              return i18n.t(`dice.${bettype.toLowerCase()}`);
            case we.core.GameType.DIL:
              const res = bettype;
              const dilresultStr = res.split('_');
              const dilresult = dilresultStr[1];
              return dilresult;
            case we.core.GameType.RO:
            case we.core.GameType.ROL:
              const roresult = this.formatROBetType(bettype.toLowerCase());
              // return i18n.t(`roulette.${bettype.toLowerCase()}`);
              return roresult;
            case we.core.GameType.LW:
              const lwresult = this.formatLWBetType(bettype.toLowerCase());
              return i18n.t(`luckywheel.${lwresult}`);
            default:
              return i18n.t(`betfield_${bettype.toLowerCase()}`);
          }
        }
        private formatROBetType(bettype) {
          const bettypearray = bettype.split('_'); // direct,SEPARAT,street,corner,LINE,row,DOZEN,RED,black,odd,even,small,big
          switch (bettypearray[0]) {
            case 'direct':
              return `${i18n.t(`roulette.betGroup.direct`)} ${bettypearray[1]}`;
            case 'separate':
              return `${i18n.t(`roulette.betGroup.separate`)} (${bettypearray[1]},${bettypearray[2]})`;
            case 'street':
              return `${i18n.t(`roulette.betGroup.street`)} (${bettypearray[1]},${bettypearray[2]},${bettypearray[3]})`;
            case 'corner':
              return `${i18n.t(`roulette.corner`)} (${bettypearray[1]},${bettypearray[2]},${bettypearray[3]},${bettypearray[4]})`;
            case 'line':
              return `${i18n.t(`roulette.betGroup.line`)} (${bettypearray[1]},${(parseInt(bettypearray[1], 10) + 1).toString()},${(parseInt(bettypearray[1], 10) + 2).toString()},${(
                parseInt(bettypearray[1], 10) + 3
              ).toString()},${(parseInt(bettypearray[1], 10) + 4).toString()}, ${bettypearray[2]})`;
            case 'row':
              return `${i18n.t(`roulette.betGroup.row`)}_${i18n.t(`roulette.${bettype}`)}`;
            case 'dozen':
              return `${i18n.t(`roulette.dozen`)} (${bettypearray[1]} ${i18n.t(`roulette.to`)} ${bettypearray[2]})`;
            case 'red':
              return `${i18n.t(`roulette.roadRed`)}`;
            case 'black':
              return `${i18n.t(`roulette.roadBlack`)}`;
            case 'odd':
              return `${i18n.t(`roulette.roadOdd`)}`;
            case 'even':
              return `${i18n.t(`roulette.roadEven`)}`;
            case 'small':
              return `${i18n.t(`roulette.roadSmall`)}`;
            case 'big':
              return `${i18n.t(`roulette.roadBig`)}`;
          }
        }
        private formatLWBetType(bettype) {
          switch (bettype) {
            case 'lw_0':
              return 'east';
            case 'lw_1':
              return 'south';
            case 'lw_2':
              return 'west';
            case 'lw_3':
              return 'north';
            case 'lw_4':
              return 'red';
            case 'lw_5':
              return 'green';
            case 'lw_6':
              return 'white';
          }
        }
         private createGameResult(gametype, gameResult) {
          let p: eui.Component;

          switch (gametype) {
            case we.core.GameType.BAC:
            case we.core.GameType.BAS:
            case we.core.GameType.BAI:
            case we.core.GameType.BAM:
              p = new BaResultItem(gameResult);
              break;
            case we.core.GameType.DT:
              p = new DtResultItem(gameResult);
              break;
            case we.core.GameType.RO:
              p = new RoResultItem(gameResult);
              break;
            case we.core.GameType.ROL:
              p = new RolResultItem(gameResult);
              break;
            case we.core.GameType.DI:
              p = new DiResultItem(gameResult);
              break;
            case we.core.GameType.DIL:
              p = new DilResultItem(gameResult);
              break;
            case we.core.GameType.LW:
              p = new LwResultItem(gameResult);
              break;
            case we.core.GameType.LO:
              p = new LoResultItem(gameResult);
              break;
            case we.core.GameType.RC:
              p = new RcResultItem(gameResult);
              break;
            default:
              p = new eui.Component();
              break;
          }

          this._record_result.removeChildren();
          this._record_result.addChild(p);
        }
      }
    }
  }
}
