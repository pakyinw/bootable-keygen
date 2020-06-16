namespace we {
  export namespace bam {
    export class MobileFlipCardHolder extends core.BaseEUI {
      public _flipCard1: ba.FlipCard;
      public _flipCard2: ba.FlipCard;

      public showCardIndex: number = 0;

      protected isOpen: boolean;

      protected leftStartPosition: number;
      protected rightStartPosition: number;
      protected middleStartPosition: number;

      public constructor() {
        super();
      }

      protected createChildren() {
        super.createChildren();
        this.skinName = utils.getSkinByClassname('bam.FlipCardHolderSkin');
      }

      protected childrenCreated() {
        super.childrenCreated();
      }

      protected moveCard() {
        // egret.Tween.get(this._flipCard).to(
        //   {
        //     x: this.slideWidth,
        //   },
        //   duration
        // );
        // egret.Tween.get(current)
        //   .to(
        //     {
        //       x: 0,
        //     },
        //     duration
        //   )
        //   .call(this.onMoveFinished, this, [0]);
      }

      public setCardImage(index: number, value: string) {
        this.showCardIndex = index;

        console.log('flipcardpath', `d_sq_bac_large_poker_${utils.formatCardForFlip(value)}_png`);
        this._flipCard1.setCardImage('m_sq_ba_large_poker_backside_png', `m_sq_bac_large_poker_${utils.formatCardForFlip(value)}_png`, `m_sq_bac_large_poker_${utils.formatCardForFlip(value)}_png`);
      }

      public closeFlipPanel() {}
    }
  }
}
