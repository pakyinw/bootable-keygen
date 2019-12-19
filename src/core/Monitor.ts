/** Over-Scene Global Controller */
namespace we {
  export namespace core {
    export class Monitor {
      private _nav: ui.Nav;
      private _notificationController: ui.NotificationController;
      private _liveSidePanel: ui.LiveSidePanel;
      private _overlay: ui.Overlay;
      private _msg: ui.MsgOverlay;

      public preload() {
        this._msg = new ui.MsgOverlay();

        dir.layerCtr.msg.addChild(this._msg);

        this.addListeners();
      }

      public start(stage: egret.Stage) {
        this._nav = new ui.Nav();
        this._notificationController = new ui.NotificationController();
        this._liveSidePanel = new ui.LiveSidePanel();
        this._overlay = new ui.Overlay();

        dir.layerCtr.nav.addChild(this._nav);
        dir.layerCtr.top.addChild(this._notificationController);
        dir.layerCtr.top.addChild(this._liveSidePanel);
        dir.layerCtr.overlay.addChild(this._overlay);

        this._notificationController.x = stage.stageWidth - 410;
        this._notificationController.y = 240;

        this._liveSidePanel.x = 2050;
        this._liveSidePanel.y = 120;
      }

      private addListeners() {
        dir.evtHandler.addEventListener(core.Event.BALANCE_UPDATE, this.updateBalance, this);
      }

      private updateBalance() {
        dir.meterCtr.rackTo('balance', env.balance, 0);
      }
    }
  }
}
