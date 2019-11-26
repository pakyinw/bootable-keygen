namespace we {
  export namespace live {
    export class LiveBacarratExpanded extends core.BaseEUI {
      private dealerImage: eui.Image;
      private bigRoad: we.ba.BALobbyBigRoad;

      public constructor() {
        super();
      }
      public childrenCreated() {
        super.childrenCreated();
        const imageResName = Math.round(Math.random()) ? 'temp_baccarat_dealer_1' : 'temp_baccarat_dealer_2';
        this.dealerImage.texture = RES.getRes(imageResName);
        this.bigRoad.changeScale(678);
      }
      public setHeight() {}
      public setWidth() {}
      public setTableId() {}
    }
  }
}