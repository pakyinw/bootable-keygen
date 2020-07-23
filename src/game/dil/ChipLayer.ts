namespace we {
  export namespace dil {
    export class ChipLayer extends we.ui.ChipLayer {
      protected _flashingOdd: eui.Label;
      protected _luckyAnims: dragonBones.EgretArmatureDisplay[];
      protected _winningAnim: dragonBones.EgretArmatureDisplay;

      // group
      protected _sum_3_group: eui.Group;
      protected _sum_4_group: eui.Group;
      protected _sum_5_group: eui.Group;
      protected _sum_6_group: eui.Group;
      protected _sum_7_group: eui.Group;
      protected _sum_8_group: eui.Group;
      protected _sum_9_group: eui.Group;
      protected _sum_10_group: eui.Group;
      protected _sum_11_group: eui.Group;
      protected _sum_12_group: eui.Group;
      protected _sum_13_group: eui.Group;
      protected _sum_14_group: eui.Group;
      protected _sum_15_group: eui.Group;
      protected _sum_16_group: eui.Group;
      protected _sum_17_group: eui.Group;
      protected _sum_18_group: eui.Group;

      protected _sum_3_betChipStack: ui.BetChipStack;
      protected _sum_4_betChipStack: ui.BetChipStack;
      protected _sum_5_betChipStack: ui.BetChipStack;
      protected _sum_6_betChipStack: ui.BetChipStack;
      protected _sum_7_betChipStack: ui.BetChipStack;
      protected _sum_8_betChipStack: ui.BetChipStack;
      protected _sum_9_betChipStack: ui.BetChipStack;
      protected _sum_10_betChipStack: ui.BetChipStack;
      protected _sum_11_betChipStack: ui.BetChipStack;
      protected _sum_12_betChipStack: ui.BetChipStack;
      protected _sum_13_betChipStack: ui.BetChipStack;
      protected _sum_14_betChipStack: ui.BetChipStack;
      protected _sum_15_betChipStack: ui.BetChipStack;
      protected _sum_16_betChipStack: ui.BetChipStack;
      protected _sum_17_betChipStack: ui.BetChipStack;
      protected _sum_18_betChipStack: ui.BetChipStack;

      constructor() {
        super();
        this._betField = dil.BetField;
      }

      protected createMapping() {
        super.createMapping();
        this._mouseAreaMapping = {};
        this._mouseAreaMapping[dil.BetField.SUM_3] = this._sum_3_group;
        this._mouseAreaMapping[dil.BetField.SUM_4] = this._sum_4_group;
        this._mouseAreaMapping[dil.BetField.SUM_5] = this._sum_5_group;
        this._mouseAreaMapping[dil.BetField.SUM_6] = this._sum_6_group;
        this._mouseAreaMapping[dil.BetField.SUM_7] = this._sum_7_group;
        this._mouseAreaMapping[dil.BetField.SUM_8] = this._sum_8_group;
        this._mouseAreaMapping[dil.BetField.SUM_9] = this._sum_9_group;
        this._mouseAreaMapping[dil.BetField.SUM_10] = this._sum_10_group;
        this._mouseAreaMapping[dil.BetField.SUM_11] = this._sum_11_group;
        this._mouseAreaMapping[dil.BetField.SUM_12] = this._sum_12_group;
        this._mouseAreaMapping[dil.BetField.SUM_13] = this._sum_13_group;
        this._mouseAreaMapping[dil.BetField.SUM_14] = this._sum_14_group;
        this._mouseAreaMapping[dil.BetField.SUM_15] = this._sum_15_group;
        this._mouseAreaMapping[dil.BetField.SUM_16] = this._sum_16_group;
        this._mouseAreaMapping[dil.BetField.SUM_17] = this._sum_17_group;
        this._mouseAreaMapping[dil.BetField.SUM_18] = this._sum_18_group;

        Object.keys(this._mouseAreaMapping).map(value => {
          console.log(value);
          mouse.setButtonMode(this._mouseAreaMapping[value], true);
        });

        this._betChipStackMapping = {};
        this._betChipStackMapping[dil.BetField.SUM_3] = this._sum_3_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_4] = this._sum_4_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_5] = this._sum_5_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_6] = this._sum_6_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_7] = this._sum_7_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_8] = this._sum_8_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_9] = this._sum_9_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_10] = this._sum_10_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_11] = this._sum_11_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_12] = this._sum_12_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_13] = this._sum_13_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_14] = this._sum_14_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_15] = this._sum_15_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_16] = this._sum_16_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_17] = this._sum_17_betChipStack;
        this._betChipStackMapping[dil.BetField.SUM_18] = this._sum_18_betChipStack;
      }

      protected isExceedBetLimit(fieldAmounts: {}, betLimit: data.BetLimitSet) {
        for (const key of Object.keys(fieldAmounts)) {
          if (fieldAmounts[key] > betLimit.maxlimit) {
            return true;
          }
        }
        return false;
      }

      protected addGridBg(grid: any, num: number) {
        return (evt: dragonBones.EgretEvent) => {
          if (!evt && !evt.eventObject && evt.eventObject.name !== 'INSERT_GRID_BG') {
            return;
          }
          /*
          let source = '';
          switch (we.dil.RACETRACK_COLOR[num]) {
            case we.dil.Color.GREEN:
              source = 'Disc_Green_103x214_png';
              break;
            case we.dil.Color.RED:
              source = 'Disc_Red_84x72_png';
            case we.dil.Color.BLACK:
            default:
              source = 'Disc_Black_84x72_png';
          }
          const img = new eui.Image();
          img.source = source;
          img.verticalCenter = 0;
          img.horizontalCenter = 0;
          img.width = grid.width - 2;
          img.height = grid.height - 2;
          img.alpha = 0.5;
          grid.addChild(img);
          */
        };
      }

      public clearLuckyNumber() {
        this.clearLuckyAnim();
        this.clearWinningAnim();
      }

      public clearWinningAnim() {
        console.log('clearWinningAnim 1', this._winningAnim);

        if (!this._winningAnim || !this._winningAnim.parent) {
          return;
        }
        console.log('clearWinningAnim 2');
        this._winningAnim.parent.removeChild(this._winningAnim);
      }

      public clearLuckyAnim() {
        console.log('clearLuckyAnim 1');
        if (!this._luckyAnims) {
          return;
        }
        console.log('clearLuckyAnim 2');
        this._luckyAnims.map(luckyAnim => {
          if (!luckyAnim || !luckyAnim.parent) {
            return;
          }
          console.log('clearLuckyAnim 3');

          luckyAnim.animation.stop();
          if (luckyAnim.parent.contains(luckyAnim)) {
            console.log('clearLuckyAnim 4');
            luckyAnim.dispose();
            luckyAnim.parent.removeChild(luckyAnim);
          }
        });
        // this._luckyAnims = new Array();
        if (this._flashingOdd) {
          egret.Tween.removeTweens(this._flashingOdd);
        }
      }

      public showWinningNumber() {
        if (
          !(
            this._tableId &&
            env.tableInfos[this._tableId] &&
            env.tableInfos[this._tableId].data &&
            env.tableInfos[this._tableId].data.dice1 &&
            env.tableInfos[this._tableId].data.dice2 &&
            env.tableInfos[this._tableId].data.dice3
          )
        ) {
          return;
        }

        const sum = env.tableInfos[this._tableId].data.dice1 + env.tableInfos[this._tableId].data.dice2 + env.tableInfos[this._tableId].data.dice3;

        if (!this._mouseAreaMapping[dil.BetField['SUM_' + sum]]) {
          return;
        }

        this.clearWinningAnim();
        this.clearLuckyAnim();

        this._winningAnim = this.createAnim('Bet_Effect_Destop');
        const grid = this._mouseAreaMapping[dil.BetField['SUM_' + sum]];
        grid.addChild(this._winningAnim);
        this._winningAnim.anchorOffsetX = 3;
        this._winningAnim.anchorOffsetY = 2;
        console.log('showWinningNumber', this._winningAnim);

        (async () => {
          const p = we.utils.waitDragonBone(this._winningAnim);
          this._winningAnim.animation.play(`win`, 1);
          await p;

          this._winningAnim.animation.stop();
        })();
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

      public showLuckyNumber() {
        if (!(this._tableId && env.tableInfos[this._tableId] && env.tableInfos[this._tableId].data && env.tableInfos[this._tableId].data.luckynumber)) {
          return;
        }

        this.clearLuckyAnim();
        this.clearWinningAnim();

        const luckyNumbers = env.tableInfos[this._tableId].data.luckynumber;

        this._luckyAnims = new Array<dragonBones.EgretArmatureDisplay>();
        console.log('showLuckyNumber2');

        Object.keys(luckyNumbers).map((key, index) => {
          console.log('showLuckyNumber 5');

          if (!this._mouseAreaMapping[dil.BetField['SUM_' + key]]) {
            return;
          }
          console.log('showLuckyNumber 9');

          const grid = this._mouseAreaMapping[dil.BetField['SUM_' + key]];

          const luckyAnim = this.createAnim('Bet_Effect_Destop');
          luckyAnim.addDBEventListener(dragonBones.EventObject.FRAME_EVENT, this.addGridBg(grid, +key), luckyAnim);

          grid.addChild(luckyAnim);
          luckyAnim.anchorOffsetX = 3;
          luckyAnim.anchorOffsetY = 2;

          this._flashingOdd = new eui.Label();
          this._flashingOdd.verticalCenter = 0;
          this._flashingOdd.horizontalCenter = 0;
          this._flashingOdd.fontFamily = 'Barlow';
          this._flashingOdd.size = 30;
          this._flashingOdd.textColor = 0x83f3af;
          this._flashingOdd.text = luckyNumbers[key] + 'x';

          grid.addChild(this._flashingOdd);
          egret.Tween.get(this._flashingOdd)
            .to({ alpha: 0 }, 1000)
            .to({ alpha: 1 }, 1000)
            .to({ alpha: 0 }, 1000)
            .to({ alpha: 1 }, 1000)
            .to({ alpha: 0 }, 1000);

          this._luckyAnims.push(luckyAnim);

          const animName = this.getAnimName(+key);
          console.log('showLuckyNumber');

          (async () => {
            let p = we.utils.waitDragonBone(luckyAnim);
            luckyAnim.animation.play(`${animName}_in`, 1);
            await p;

            luckyAnim.removeDBEventListener(dragonBones.EventObject.FRAME_EVENT, this.addGridBg(grid, +key), luckyAnim);

            p = we.utils.waitDragonBone(luckyAnim);
            luckyAnim.animation.play(`${animName}_loop`, 0);
            await p;
          })();
        });
      }

      protected restructureChildren() {}

      protected createAnim(armatureName: string) {
        const skeletonData = RES.getRes(`dice_w_game_result_ske_json`);
        const textureData = RES.getRes(`dice_w_game_result_tex_json`);
        const texture = RES.getRes(`dice_w_game_result_tex_png`);
        const factory = new dragonBones.EgretFactory();
        factory.parseDragonBonesData(skeletonData);
        factory.parseTextureAtlasData(textureData, texture);
        return factory.buildArmatureDisplay(armatureName);
      }
    }
  }
}