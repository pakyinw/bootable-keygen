namespace we {
  export namespace lw {
    export class ChipLayer extends we.ui.ChipLayer {
      // group
      protected _oneCircleGroup: eui.Group;
      protected _threeCircleGroup: eui.Group;
      protected _fiveCircleGroup: eui.Group;
      protected _greenDragonGroup: eui.Group;
      protected _whiteDragonGroup: eui.Group;
      protected _redDragonGroup: eui.Group;
      protected _weGroup: eui.Group;

      protected _oneCircleBetChipStack: ui.BetChipStack;
      protected _threeCircleBetChipStack: ui.BetChipStack;
      protected _fiveCircleBetChipStack: ui.BetChipStack;
      protected _greenDragonBetChipStack: ui.BetChipStack;
      protected _whiteDragonBetChipStack: ui.BetChipStack;
      protected _redDragonBetChipStack: ui.BetChipStack;
      protected _weBetChipStack: ui.BetChipStack;

      protected _groupHoverMapping: {};

      constructor() {
        super();
        this._betField = lw.BetField;
      }

      protected restructureChildren() {
        
      }

      protected createMapping() {
        super.createMapping();
        this._mouseAreaMapping = {};
        this._mouseAreaMapping[lw.BetField.LW_0] = this._oneCircleGroup;
        this._mouseAreaMapping[lw.BetField.LW_1] = this._threeCircleGroup;
        this._mouseAreaMapping[lw.BetField.LW_2] = this._fiveCircleGroup;
        this._mouseAreaMapping[lw.BetField.LW_3] = this._redDragonGroup;
        this._mouseAreaMapping[lw.BetField.LW_4] = this._greenDragonGroup;
        this._mouseAreaMapping[lw.BetField.LW_5] = this._whiteDragonGroup;
        this._mouseAreaMapping[lw.BetField.LW_6] = this._weGroup;

        Object.keys(this._mouseAreaMapping).map(value => {
          mouse.setButtonMode(this._mouseAreaMapping[value], true);
        });

        this._betChipStackMapping = {};
        this._betChipStackMapping[lw.BetField.LW_0] = this._oneCircleBetChipStack;
        this._betChipStackMapping[lw.BetField.LW_1] = this._threeCircleBetChipStack;
        this._betChipStackMapping[lw.BetField.LW_2] = this._fiveCircleBetChipStack;
        this._betChipStackMapping[lw.BetField.LW_3] = this._redDragonBetChipStack;
        this._betChipStackMapping[lw.BetField.LW_4] = this._greenDragonBetChipStack;
        this._betChipStackMapping[lw.BetField.LW_5] = this._whiteDragonBetChipStack;
        this._betChipStackMapping[lw.BetField.LW_6] = this._weBetChipStack;

        this._groupHoverMapping = {};
        Object.keys(we.ro.BETFIELD_MAPPING).map(value => {
          this._groupHoverMapping[value] = we.ro.BETFIELD_MAPPING[value];
        });
      }

      protected isExceedBetLimit(fieldAmounts: {}, betLimit: data.BetLimitSet) {
        for (const key of Object.keys(fieldAmounts)) {
          if (fieldAmounts[key] > betLimit.maxlimit) {
            return true;
          }
        }
        return false;
      }

      public onGridRollover(fieldName: string) {
        this._tableLayer.onRollover(fieldName);
      }

      public onGridRollout(fieldName: string) {
        this._tableLayer.onRollout(fieldName);
      }

    }
  }
}
