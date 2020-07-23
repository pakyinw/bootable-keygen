namespace we {
  export namespace dil {
    export class LeftPanel extends core.BaseGamePanel {
      protected _chipLayer: we.ui.ChipLayer;
      protected _coinGroup: eui.Group;

      protected gameIdLabel: ui.RunTimeLabel;
      protected totalBetLabel: ui.RunTimeLabel;
      protected gameId: string;
      protected totalBet: number;
      protected btnHotCold: ui.BaseImageButton;
      protected btnHistory: ui.BaseImageButton;
      protected btnRoads: ui.BaseImageButton;

      protected pageRadioBtn1: eui.RadioButton;
      protected pageRadioBtn2: eui.RadioButton;

      protected activeLine: egret.Shape;

      protected pageStack: eui.ViewStack;
      protected roadStack: eui.ViewStack;

      // new for di
      protected beadRadioBtn1: eui.RadioButton;
      protected beadRadioBtn2: eui.RadioButton;
      protected isExpanded: boolean;
      protected toggleUpDownButton: eui.ToggleSwitch;

      protected bg: ui.RoundRectShape;
      protected border: ui.RoundRectShape;

      public constructor(skin?: string) {
        super(skin ? skin : env.isMobile ? '' : 'DilLeftPanel');
      }

      public set chipLayer(value: we.ui.ChipLayer) {
        this._chipLayer = value;
      }

      public changeLang() {
        this.gameIdLabel.text = i18n.t('baccarat.gameroundid') + ' ' + this.gameId;
        this.totalBetLabel.text = i18n.t('baccarat.totalbet') + ' ' + this.totalBet;

        this.pageRadioBtn1['labelDisplayDown']['text'] = this.pageRadioBtn1['labelDisplayUp']['text'] = i18n.t('dice.luckyNumber');
        this.pageRadioBtn2['labelDisplayDown']['text'] = this.pageRadioBtn2['labelDisplayUp']['text'] = i18n.t('dice.history');

        this.updateActiveLine(false);
      }

      protected init() {
        this.gameId = '';
        this.totalBet = 0;

        this.activeLine = new egret.Shape();
        const gr = this.activeLine.graphics;
        const matrix = new egret.Matrix();
        matrix.createGradientBox(100, 3);

        gr.beginGradientFill(egret.GradientType.LINEAR, [0x52d7ff, 0x5273ef], [1, 1], [0, 255], matrix);
        gr.drawRect(0, 0, 100, 3);
        gr.endFill();
        this.addChild(this.activeLine);
        this.activeLine.y = 332;

        const page1Group = this.pageStack.getChildAt(0) as eui.Group;

        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        this.pageRadioBtn1.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        this.pageRadioBtn2.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);

        this.toggleUpDownButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onToggleUpDown, this, true);
        this.changeLang();
      }
      public onToggleUpDown(evt: egret.TouchEvent) {
        this.expandPanel(!this.isExpanded);
      }

      public expandPanel(expand: boolean) {
        if (!this.isExpanded && expand) {
          this.bg.setRoundRectStyle(580, 340 + 202, { tl: 14, tr: 14, br: 14, bl: 14 }, '0x1f242b', 1, 0);
          this.bg.y -= 202;
          this.border.setRoundRectStyle(580, 340 + 202, { tl: 14, tr: 14, br: 14, bl: 14 }, '0x1f242b', -1, 2, 0x3a3f48);
          this.border.y -= 202;

          (this.pageStack.getChildAt(0) as eui.Group).height += 202;
          (this.pageStack.getChildAt(0) as eui.Group).y -= 202;

          this.gameIdLabel.y -= 202;
          this.totalBetLabel.y -= 202;

          this.beadRadioBtn1.y += 202;
          this.beadRadioBtn2.y += 202;
          this.isExpanded = true;

          this.toggleUpDownButton.currentState = 'b_down';
        } else if (this.isExpanded && !expand) {
          this.bg.setRoundRectStyle(580, 340, { tl: 14, tr: 14, br: 14, bl: 14 }, '0x1f242b', 1, 0);
          this.bg.y += 202;
          this.border.setRoundRectStyle(580, 340, { tl: 14, tr: 14, br: 14, bl: 14 }, '0x1f242b', -1, 2, 0x3a3f48);
          this.border.y += 202;

          (this.pageStack.getChildAt(0) as eui.Group).height -= 202;
          (this.pageStack.getChildAt(0) as eui.Group).y += 202;

          this.gameIdLabel.y += 202;
          this.totalBetLabel.y += 202;

          this.beadRadioBtn1.y -= 202;
          this.beadRadioBtn2.y -= 202;
          this.isExpanded = false;

          this.toggleUpDownButton.currentState = 'b_up';
        }
      }

      protected onRoadChange(e: eui.UIEvent) {
        const radio: eui.RadioButton = e.target;
        this.roadStack.selectedIndex = radio.value;
      }

      protected onViewChange(e: eui.UIEvent) {
        const radio: eui.RadioButton = e.target;
        this.pageStack.selectedIndex = radio.value;
        if (radio.value > 0) {
          this.expandPanel(false);
          this.toggleUpDownButton.visible = false;
        } else {
          this.toggleUpDownButton.visible = true;
        }
        this.updateActiveLine(true);
      }

      protected updateActiveLine(useEasing: boolean) {
        const radioButtons = [this.pageRadioBtn1, this.pageRadioBtn2];
        const btn = radioButtons[this.pageStack.selectedIndex];

        radioButtons.forEach(element => {
          if (element === btn) {
            element.currentState = 'upAndSelected';
          } else {
            element.currentState = 'up';
          }
        });
        btn.validateNow();
        const w = btn['labelDisplayDown']['textWidth'];
        const x = btn.x + (btn.width - w) * 0.5;

        egret.Tween.removeTweens(this.activeLine);
        if (useEasing) {
          egret.Tween.get(this.activeLine).to({ x, scaleX: w / 100 }, 300, egret.Ease.quartOut);
        } else {
          this.activeLine.x = x;
          this.activeLine.scaleX = w / 100;
        }
      }

      public update() {
        if (this.tableInfo) {
          if (this.tableInfo.betInfo) {
            this.gameId = this.tableInfo.betInfo.gameroundid;
            this.totalBet = this.tableInfo.betInfo.total;
            this.changeLang();
          }
        }
      }

      public destroy() {
        super.destroy();

        egret.Tween.removeTweens(this.activeLine);
        if (dir.evtHandler.hasEventListener(core.Event.SWITCH_LANGUAGE)) {
          dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        }
      }

      protected createLuckyCoinAnim() {
        const skeletonData = RES.getRes(`dice_w_game_result_ske_json`);
        const textureData = RES.getRes(`dice_w_game_result_tex_json`);
        const texture = RES.getRes(`dice_w_game_result_tex_png`);
        const factory = new dragonBones.EgretFactory();
        factory.parseDragonBonesData(skeletonData);
        factory.parseTextureAtlasData(textureData, texture);
        return factory.buildArmatureDisplay('Draw_Number_Effect_Destop');
      }

      public updateLuckyNumbers() {
        this._coinGroup.removeChildren();

        console.log(this.tableInfo.data);
        if (!(this.tableInfo && this.tableInfo.data && this.tableInfo.data.luckynumber)) {
          return;
        }

        const luckyNumbers = this.tableInfo.data.luckynumber;
        const noOfLuckNum = Object.keys(luckyNumbers).length > 3 ? 3 : Object.keys(luckyNumbers).length;

        // 18 = 668 - 5 * 112
        let x = (580 - (noOfLuckNum - 1) * 13 - noOfLuckNum * 175) / 2;

        for (const key of Object.keys(luckyNumbers)) {
          const coinGroup = new eui.Group();
          coinGroup.x = x;
          coinGroup.y = 10;
          coinGroup.width = 175;
          coinGroup.height = 213;

          const coinAnim = this.createLuckyCoinAnim();
          coinAnim.width = 175;
          coinAnim.height = 213;
          // 112 + 18

          const oddLabel = new eui.Label();
          oddLabel.text = luckyNumbers[key];
          oddLabel.verticalCenter = 55;
          oddLabel.horizontalCenter = 0;
          oddLabel.fontFamily = 'Barlow';
          oddLabel.textAlign = egret.HorizontalAlign.CENTER;
          oddLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
          oddLabel.size = 15;
          // oddLabel.anchorOffsetX = oddLabel.width / 2;
          oddLabel.textColor = 0x2ab9c6;

          const numberLabel = new eui.Label();
          numberLabel.text = key.toString();
          numberLabel.horizontalCenter = 0;
          numberLabel.verticalCenter = 15;
          numberLabel.fontFamily = 'Barlow';
          numberLabel.textAlign = egret.HorizontalAlign.CENTER;
          numberLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
          // numberLabel.anchorOffsetX = numberLabel.width / 2;
          numberLabel.size = 50;

          numberLabel.textColor = 0x2ab9c6;

          x += 188;

          coinGroup.addChild(coinAnim);
          coinGroup.addChild(oddLabel);
          coinGroup.addChild(numberLabel);
          this._coinGroup.addChild(coinGroup);

          // const oddSlot = coinAnim.armature.getSlot('Odd');
          // oddSlot.display = this.getOddSlotGroup(luckyNumbers[key]);

          // const numberSlot = coinAnim.armature.getSlot('Number');
          // numberSlot.display = this.getNumberSlotGroup(+key);

          // let noBet = '_nobet';

          if (!this._chipLayer) {
            return;
          }

          const betDetails = this._chipLayer.getConfirmedBetDetails();

          /*
          if (!betDetails) {
            return;
          }
          */
          if (betDetails) {
            betDetails.map((detail, index) => {
              if (!detail || !detail.field || !detail.amount) {
                return;
              }

              const f = this.fieldToValue(detail.field);

              if (key === f) {
                // const chipSlot = coinAnim.armature.getSlot('chips');
                // chipSlot.display = this.getChipSlotGroup(detail.amount / 100);
                // noBet = '';
              }
            });
          }
          const animName = this.getAnimName(+key);

          (async () => {
            let p = we.utils.waitDragonBone(coinAnim);
            coinAnim.animation.play(`${animName}_in`, 1);
            await p;

            p = we.utils.waitDragonBone(coinAnim);
            coinAnim.animation.play(`${animName}_loop`, 4);
            await p;

            p = we.utils.waitDragonBone(coinAnim);
            coinAnim.animation.play(`${animName}_out`, 1);
            await p;

            this._coinGroup.removeChildren();
          })();

          we.utils.sleep(250);
        }
      }

      public clearLuckyNumbers() {
        this._coinGroup.removeChildren();
      }

      protected fieldToValue(fieldName: string) {
        if (!fieldName) {
          return null;
        }
        if (fieldName.indexOf('SUM_') === -1) {
          return null;
        }
        const result = fieldName.split('SUM_');
        if (result && result[1]) {
          return result[1];
        }
        return null;
      }

      public getAnimName(sum: number) {
        let animName;
        if (sum <= 10) {
          const firstPart = sum;
          const secondPart = 21 - sum;
          animName = `${firstPart}_${secondPart}`;
        } else {
          const firstPart = 21 - sum;
          const secondPart = sum;
          animName = `${firstPart}_${secondPart}`;
        }
        return animName;
      }
    }
  }
}