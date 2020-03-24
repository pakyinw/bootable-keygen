namespace we {
  export namespace ui {
    export class SideListItemHolder extends ui.TableListItemHolder {
      constructor() {
        super();
        // this.initDisplayItem();
      }

      protected initDisplayItem() {
        super.initDisplayItem();
        let generalGameType: string;

        if (!this.tableInfo) {
          return;
        }

        switch (this.tableInfo.gametype) {
          //  switch (0) {
          case we.core.GameType.BAC:
          case we.core.GameType.BAI:
          case we.core.GameType.BAS:
            generalGameType = 'ba';
            break;

          case we.core.GameType.RO:
            generalGameType = 'ro';
            break;

          case we.core.GameType.DI:
            generalGameType = 'di';
            break;

          case we.core.GameType.DT:
          default:
            generalGameType = 'dt';
        }
        const listItem = new we.ui.SideListItem('SideListItemSkin');
        if (we[generalGameType].SideListItemInitHelper) {
          listItem.itemInitHelper = new we[generalGameType].SideListItemInitHelper();
        }

        this._displayItem = listItem;
        this.setDisplayItem(this._displayItem);
      }
    }
  }
}
