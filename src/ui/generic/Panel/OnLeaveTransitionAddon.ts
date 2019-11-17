namespace we {
  export namespace ui {
    export class OnLeaveTransitionAddon extends DisplayObjectAddon {
      protected target: egret.DisplayObject & ITransitable;
      protected customAnimation: () => Promise<void>;
      public direction: string = 'right';
      public isFade: boolean = false;
      public duration: number = 300;

      constructor(displayObject: egret.DisplayObject & ITransitable) {
        super(displayObject);
      }

      public set active(value: boolean) {
        super.$setActive(value);
        if (value) {
          this.target.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.start, this);
          this.init();
        } else {
          this.target.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.start, this);
        }
      }

      public setCustomAnimtion(animationFunc: () => Promise<void>) {
        this.customAnimation = animationFunc;
      }

      protected async start() {
        if (!this.target) {
          return;
        }
        this.target.parent.touchEnabled = false;
        this.target.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.start, this);

        await this.startTransition();

        this.target.parent.touchEnabled = true;
      }

      protected async startTransition() {
        switch (this.direction) {
          case 'left':
            await Transition.MoveOutToLeft(this.target, this.isFade, this.duration);
            break;
          case 'right':
            await Transition.MoveOutToRight(this.target, this.isFade, this.duration);
            break;
          default:
            await Transition.defaultOut(this.target, this.duration);
            break;
        }
      }
    }
  }
}
