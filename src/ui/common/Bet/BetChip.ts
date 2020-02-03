namespace we {
  export namespace ui {
    export class BetChip extends core.BaseEUI implements eui.UIComponent, IBetChip {
      protected _value: number;
      protected _chipImage: eui.Image;
      protected _chipValueLabel: ui.LabelImage;
      protected _type: we.core.ChipType;
      protected _highlight: boolean;
      protected _glowImage: eui.Image;

      protected _index: number;

      public constructor(value: number = null, index: number = null, type: we.core.ChipType = we.core.ChipType.BETTING, highlight: boolean = false) {
        super('BetChip');
        this._value = value;
        this._index = index;
        this._type = type;
        this._highlight = highlight;
      }

      protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
      }

      protected mount() {
        this._render();
      }

      public setValue(value: number, index: number, type: we.core.ChipType = null) {
        this._value = value;
        this._index = index;
        this._type = type;
        this._render();
      }

      public getValue() {
        return this._value;
      }

      get highlight(): boolean {
        return this._highlight;
      }

      set highlight(value: boolean) {
        this._highlight = value;
        if (value) {
          this._glowImage = new eui.Image();
          this._glowImage.source = 'd_lobby_panel_betcontrol_chips_select_png';
          this._glowImage.bottom = this._chipImage.bottom - 6;
          this._glowImage.top = this._chipImage.top - 6;
          this._glowImage.left = this._chipImage.left - 6;
          this._glowImage.right = this._chipImage.right - 6;
          this._glowImage.verticalCenter = this._chipImage.verticalCenter;
          this._glowImage.horizontalCenter = this._chipImage.horizontalCenter;
          this._glowImage.height = this._chipImage.height;
          this._glowImage.width = this._chipImage.width;
          this.addChild(this._glowImage);
        } else {
          if (this._glowImage && this.contains(this._glowImage)) {
            this.removeChild(this._glowImage);
          }
        }
      }

      public set index(value: number) {
        this._index = value;
        this._chipImage.source = this.getChipSource(this._type);
      }

      public set labelOffset(value: number) {
        if (this._chipValueLabel) {
          this._chipValueLabel.verticalCenter = value;
        }
      }

      public get labelOffset() {
        if (this._chipValueLabel) {
          return this._chipValueLabel.verticalCenter;
        }
        return null;
      }

      public set labelSize(value: number) {
        if (this._chipValueLabel) {
          this._chipValueLabel.size = value;
        }
      }

      public get labelSize() {
        if (this._chipValueLabel) {
          return this._chipValueLabel.size;
        }
        return null;
      }

      set type(value: number) {
        if (value) {
          this._type = +value;
        }
        this._render();
      }

      get type() {
        return this._type;
      }

      protected _render() {
        switch (this._type) {
          case we.core.ChipType.FLAT:
            this._chipValueLabel.text = utils.numberToFaceValue(this._value);
            this._chipImage.source = this.getChipSource(this._type);
            this._chipValueLabel.verticalCenter = this.height * -0.012;
            this._chipValueLabel.height = this.height * 0.5;
            // this._chipValueLabel.width = this.width * 0.3;
            break;
          case we.core.ChipType.CLIP:
            this._chipValueLabel.text = utils.numberToFaceValue(this._value);
            this._chipImage.source = this.getChipSource(this._type);
            this._chipValueLabel.verticalCenter = this.height * -0.072;
            this._chipValueLabel.height = this.height * 0.3;
            // this._chipValueLabel.width = this.width * 0.3;
            break;
          case we.core.ChipType.BETTING:
          default:
            this._chipValueLabel.text = '';
            this._chipImage.source = this.getChipSource(this._type);
            break;
        }
      }

      protected getChipSource(type): string {
        let filename: string;

        switch (type) {
          case we.core.ChipType.CLIP:
            filename = we.core.ChipSetInfo.clip + `${this._index + 1}` + '_png';
            break;
          case we.core.ChipType.FLAT:
            filename = we.core.ChipSetInfo.flat + `${this._index + 1}` + '_png';
            break;
          case we.core.ChipType.BETTING:
          default:
            filename = we.core.ChipSetInfo.betting + '_png';
        }

        return filename;
      }

      public draw() {
        this._render();
      }
    }
  }
}
