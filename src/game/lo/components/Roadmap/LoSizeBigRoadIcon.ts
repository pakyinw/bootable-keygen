namespace we {
  export namespace lo {
    export class LoSizeBigRoadIcon extends ro.ROBigRoadIconBase {

      public constructor(size: number = 30) {
        super(size);
      }

      public changeLang() {
        if (this.value) {
          if (this.value.v !== undefined) {
            if (this.value.v === 0) {
              // green
              this._iconText.text = i18n.t('roulette.zeroShort');
            } else if (this.value.v === 1) {
              // blue for small
              this._iconText.text = i18n.t('roulette.smallShort');
            } else {
              // red for big
              this._iconText.text = i18n.t('roulette.bigShort');
            }
          }
        }
      }

      public updateDisplay() {
        super.updateDisplay();
        const value = this.value;

        const colors = [0xee2e2e, 0x3e60f8, 0x10b04b];
        const iconSize = this.size;
        const circleRadius = (this.size / 2) * 0.9;
        const lineWidth = 1;
        const offset = (iconSize - circleRadius * 2) / 2;

        const useDarkMode = this.darkModeNumber === 0 ? 0 : 3;
        let colorIdx = -1;

        if (value.v != null) {
          if (value.v === 0) {
            // green
            colorIdx = 2 + useDarkMode;
          } else if (value.v === 1) {
            // blue for small
            colorIdx = 1 + useDarkMode;
          } else {
            // red for big
            colorIdx = 0 + useDarkMode;
          }
          if (colorIdx >= 0) {
            //this._iconShape.graphics.lineStyle(lineWidth, 0x6d7278, 0.5, true);
            this._iconShape.graphics.beginFill(colors[colorIdx]);
            this._iconShape.graphics.drawCircle(iconSize / 2, iconSize / 2, circleRadius);
            this._iconShape.graphics.endFill();
            this.changeLang();
          }
        }
      }

      public dispose() {
        super.dispose();

        if (dir.evtHandler.hasEventListener(core.Event.SWITCH_LANGUAGE)) {
          dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        }
      }
    }
  }
}
