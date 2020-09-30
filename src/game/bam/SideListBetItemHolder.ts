namespace we {
  export namespace bam {
    export class SideListBetItemHolder extends ui.TableListItemHolder {
      constructor() {
        super();
        // this.initDisplayItem();
      }

      protected initDisplayItem() {
        super.initDisplayItem();

        if (!this.tableInfo || this._displayItem) {
          return;
        }
        const BAgametype = this.tableInfo.gametype;
        const listItem = new we.ui.SideListBetItem('SideListBetItemSkin');
        listItem.itemInitHelper = new we.bam.SideListItemInitHelper();
        this._displayItem = listItem;
        this.setDisplayItem(this._displayItem);
      }
    }
  }
}