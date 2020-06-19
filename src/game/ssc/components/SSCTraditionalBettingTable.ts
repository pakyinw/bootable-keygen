// TypeScript file
namespace we {
  export namespace ssc {
    export class SSCTraditionalBettingTable extends we.ui.Panel {
      private _inputType: number;
      private _name: string;
      private _rowCount: number;
      private _rowName: string[];
      private _isOption: number;
      private _inputArray: string[];
      private _showValueArray: string[];
      private _betCode: string;

      // not done
      private _checkBoxArray: string[];
      private _inputField;

      private bigTagIndex: number = -1;
      private smallTagIndex: number = -1;

      private _ballBetCode: string;
      private _ballsArray: eui.Group[];

      // check combination
      private _ballResults: string[];
      private _combinationArray: string[];
      constructor(currentBigTagIndex: number, currentSmallTagIndex: number) {
        super();
        this.bigTagIndex = currentBigTagIndex;
        this.smallTagIndex = currentSmallTagIndex;
        this.init();
        // this.initComponents();
      }

      protected init() {
        const currentBetMode = SelectionMapping[Object.keys(SelectionMapping)[this.bigTagIndex]];
        const betTypeMapping = currentBetMode['type'][Object.keys(currentBetMode['type'])[this.smallTagIndex]];

        this._inputType = betTypeMapping.inputType;
        this._name = betTypeMapping.name;
        this._rowCount = parseInt(betTypeMapping.row, 0);
        this._rowName = betTypeMapping.rowName;
        this._isOption = parseInt(betTypeMapping.option, 0);
        this._inputArray = betTypeMapping.input;
        this._showValueArray = betTypeMapping.showValue;
        this._betCode = betTypeMapping.betCode;
        this.width = 1509;
        this.height = 478;
        this.createComponents();
      }

      protected clear() {
        this._inputType = null;
        this._name = null;
        this._rowCount = null;
        this._rowName = null;
        this._isOption = null;
        this._inputArray = null;
        this._showValueArray = null;
        this._betCode = null;

        this.removeChildren();
      }

      protected createComponents() {
        // check inputtype
        // Five Star ball selection test
        const rowHeight = 80;
        const rowWidth = this.width;

        this._ballsArray = [];
        let btnGrp;

        // '';
        for (let i = 0; i < this._rowCount; i++) {
          btnGrp = new eui.Group();
          btnGrp.width = rowWidth;
          btnGrp.height = rowHeight;
          btnGrp.x = 0;
          btnGrp.y = i * rowHeight;

          const lblTitle = new ui.RunTimeLabel();
          lblTitle.x = 33;
          lblTitle.width = 154;
          lblTitle.height = 25;
          lblTitle.verticalAlign = 'middle';
          lblTitle.textAlign = 'left';
          lblTitle.fontFamily = 'Barlow';
          lblTitle.size = 18;
          lblTitle.textColor = 0x00b8c3;
          // lblTitle.text = i18n.t(this._rowName[i]);
          lblTitle.text = this._rowName[i];
          btnGrp.addChild(lblTitle);

          const ballsGroup = new eui.Group();
          ballsGroup.width = 768;
          ballsGroup.height = rowHeight;
          ballsGroup.x = 187;
          ballsGroup.touchEnabled = true;
          ballsGroup.touchChildren = true;

          for (let k = 0; k < this._inputArray.length; k++) {
            const ball = new SSCBallButton(this._showValueArray[k], this._inputArray[k], k);
            ball.width = 50;
            ball.height = 50;
            ballsGroup.addChild(ball);
            ball.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBallClicked, this);
          }

          let layout = new eui.HorizontalLayout();
          layout.paddingLeft = layout.paddingRight = 44;
          layout.verticalAlign = 'middle';
          layout.gap = 20;
          ballsGroup.layout = layout;

          btnGrp.addChild(ballsGroup);
          this._ballsArray.push(ballsGroup);

          if (this._isOption) {
            const option = new SSCTradtionalBettingOptionButtonRow(i);
            btnGrp.addChild(option);
          }

          layout = new eui.HorizontalLayout();
          layout.verticalAlign = 'middle';
          btnGrp.layout = layout;
          btnGrp.touchChildren = true;

          this.addChild(btnGrp);
        }
      }

      protected onBallClicked(e: egret.TouchEvent) {
        console.log(e.target);
        const ball: SSCBallButton = e.target as SSCBallButton;
        console.log('balls row : ' + ball.rowIndex + 'value : ' + ball.value);
        ball.toggleActive();
        this.generateBetCode(true);
      }

      protected generateBetCode(isUpdate: boolean = false) {
        // this._ballBetCode = '';

        // for (let i = 0; i < this._ballsArray.length; i++) {
        //   if (i > 0) this._ballBetCode += '_';

        //   const ballsRow: eui.Group = this._ballsArray[i];
        //   for (let k = 0; k < ballsRow.numChildren; k++) {
        //     this._ballBetCode += (ballsRow.getChildAt(k) as SSCBallButton).isActive ? (ballsRow.getChildAt(k) as SSCBallButton).betValue : '';
        //   }
        // }
        // //[0,1] [0,1,2] = 0,1|0,1,2;
        // //[0,1] [0,1,2] [0,4] = 0,1|0,1,2 0,1|0,4 0,1,2|0,4
        // if (isUpdate) this.dispatchEventWith('SSC_UPDATE_BETACTION', false, this._ballBetCode);
        // console.log(this._ballBetCode);

        this._ballResults = [];
        for (let i = 0; i < this._ballsArray.length; i++) {
          const ballsRow: eui.Group = this._ballsArray[i];
          let temp = '';
          for (let k = 0; k < ballsRow.numChildren; k++) {
            temp += (ballsRow.getChildAt(k) as SSCBallButton).isActive ? (ballsRow.getChildAt(k) as SSCBallButton).betValue : '';
          }
          this._ballResults.push(temp);
        }
        const currentBetMode = SelectionMapping[Object.keys(SelectionMapping)[this.bigTagIndex]];
        const betTypeMapping = currentBetMode['type'][Object.keys(currentBetMode['type'])[this.smallTagIndex]];

        this.generateCombination(this._ballResults, parseInt(betTypeMapping['unit'], 0));
      }

      protected generateCombination(results: string[], numberOfChosen: number) {

        let combinationArray = [];
        
        for (let i = 0; i < results.length - 1; i++) {
          // This is where you'll capture that last value
          for (let j = i + 1; j < results.length; j++) {
            combinationArray.push(`${results[i]}+'_'+ ${results[j]}`);
          }
        }
        // for(let i = 0;i < numberOfInputField; i++){
        //   let temp = '';
        //   combinationArray.push(temp);
        //   for(let k = 0; k < numberOfChosen; k++){
        //     temp += 
        //   }
        // }

        // let ballsSelection = [];
        // for (let i = 0; i < this._ballsArray.length; i++) {
        //   const ballsRow: eui.Group = this._ballsArray[i];
        //   let temp = '';
        //   for (let k = 0; k < ballsRow.numChildren; k++) {
        //     temp +=  (ballsRow.getChildAt(k) as SSCBallButton).isActive ?(ballsRow.getChildAt(k)as SSCBallButton).betValue : '' ;
        //   }
        //   ballsSelection.push(temp);
        // }
      }

      protected;
    }
  }
}
