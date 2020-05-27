namespace we {
  export namespace overlay {
    export class VideoSetting extends ui.Panel {
      protected cam_title: ui.RunTimeLabel;
      protected qua_title: ui.RunTimeLabel;

      protected autoCamBtn: eui.RadioButton;
      protected closerCamBtn: eui.RadioButton;
      protected farCamBtn: eui.RadioButton;
      protected closeCamBtn: eui.RadioButton;

      protected autoQuaBtn: eui.RadioButton;
      protected bluRayBtn: eui.RadioButton;
      protected highQuaBtn: eui.RadioButton;
      protected standQuaBtn: eui.RadioButton;

      protected confirmBtn: eui.Component;
      protected confirmLabel: ui.RunTimeLabel;

      protected camIndex: number = 0;
      protected quaIndex: number = 0;

      protected targetGameScene: core.BaseGameScene;

      constructor(data) {
        super('VideoSetting');
        this.targetGameScene = data.target;
      }

      protected mount() {
        this.camIndex = env.camMode;
        this.quaIndex = env.qualityMode;
        super.mount();
      }

      protected init_menu() {
        this.autoCamBtn.label = i18n.t('video_setting_auto');
        this.closerCamBtn.label = i18n.t('video_setting_closer');
        this.farCamBtn.label = i18n.t('video_setting_far');
        this.closeCamBtn.label = i18n.t('video_setting_close');

        this.autoQuaBtn.label = i18n.t('video_setting_auto');
        this.bluRayBtn.label = i18n.t('video_setting_bluray');
        this.highQuaBtn.label = i18n.t('video_setting_highQua');
        this.standQuaBtn.label = i18n.t('video_setting_standQua');

        this.cam_title.text = i18n.t('video_setting_cam');
        this.qua_title.text = i18n.t('video_setting_qua');

        this.confirmLabel.text = i18n.t('mobile_dropdown_confirm');
        this.addListeners();
      }

      protected destroy() {
        super.destroy();
        this.removeListeners();
      }

      protected onCamChange(e: eui.UIEvent) {
        const radio: eui.RadioButton = e.target;
        this.camIndex = parseInt(radio.value, 10);
      }

      protected onQuaChange(e: eui.UIEvent) {
        const radio: eui.RadioButton = e.target;
        this.quaIndex = parseInt(radio.value, 10);
      }

      protected onConfirmChange() {
        // call the change function after press confirm
        env.camMode = this.camIndex;
        env.qualityMode = this.quaIndex;
        if (this.camIndex === 3) {
          this.targetGameScene.stopVideo(this.targetGameScene);
        } else {
          this.targetGameScene.playVideo(this.targetGameScene);
        }
        this.dispatchEvent(new egret.Event('close'));
      }

      protected addListeners() {
        this.autoCamBtn.addEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.closerCamBtn.addEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.farCamBtn.addEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.closeCamBtn.addEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.autoQuaBtn.addEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.bluRayBtn.addEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.highQuaBtn.addEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.standQuaBtn.addEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.confirmBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmChange, this);
      }

      protected removeListeners() {
        this.autoCamBtn.removeEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.closerCamBtn.removeEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.farCamBtn.removeEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.closeCamBtn.removeEventListener(eui.UIEvent.CHANGE, this.onCamChange, this);
        this.autoQuaBtn.removeEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.bluRayBtn.removeEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.highQuaBtn.removeEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.standQuaBtn.removeEventListener(eui.UIEvent.CHANGE, this.onQuaChange, this);
        this.confirmBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onConfirmChange, this);
      }

      protected initOrientationDependentComponent() {
        super.initOrientationDependentComponent();
        this.init_menu();
      }
    }
  }
}