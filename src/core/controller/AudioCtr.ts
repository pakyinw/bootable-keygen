namespace we {
  export namespace core {
    export class AudioCtr {
      private _soundBGM: egret.Sound;
      private _channelBGM: egret.SoundChannel;
      private _channelFX: egret.SoundChannel;

      private _volumeBGM = 1;
      private _volumeFX = 1;
      private _volumeLive = 1;

      constructor(stage: egret.Stage) {
        // init dummy scene
        logger.l('AudioCtr is created');
      }

      public get volumeBGM() {
        return this._volumeBGM;
      }

      public set volumeBGM(vol: number) {
        logger.l(`Setting volumeBGM to ${vol}`);
        this._volumeBGM = vol;
        if (this._channelFX) {
          this._channelBGM.volume = this._volumeBGM;
        }
      }

      public get volumeFX() {
        return this._volumeFX;
      }

      public set volumeFX(vol: number) {
        logger.l(`Setting volumeFX to ${vol}`);
        this._volumeFX = vol;
        if (this._channelFX) {
          this._channelFX.volume = this._volumeFX;
        }
      }

      public get volumeLive() {
        return this._volumeLive;
      }

      public set volumeLive(vol: number) {
        logger.l(`Setting volumeLive to ${vol}`);
        this._volumeLive = vol;
      }

      public init() {
        this._soundBGM = RES.getRes('sn_bgm002_mp3');
        this._channelBGM = this._soundBGM.play();
      }

      public async playSequence(resNameSeq: string[]) {
        let chain = Promise.resolve();
        resNameSeq.forEach(name => {
          const soundFx = RES.getRes(`sn_${name}_${we.i18n.lang}_mp3`);
          chain = chain.then(() => {
            this._channelFX = soundFx.play(0, 1);
            console.log('playing', `sn_${name}_${we.i18n.lang}_mp3`);
            return new Promise<void>(resolve => {
              this._channelFX.addEventListener(
                egret.Event.SOUND_COMPLETE,
                () => {
                  console.log('play end', `sn_${name}_${we.i18n.lang}_mp3`);
                  this._channelFX = null;
                  resolve();
                },
                this
              );
            });
          });
        });
        return chain;
      }
    }
  }
}