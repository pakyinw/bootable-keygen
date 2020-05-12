namespace we {
  export namespace lw {
    export class SideListItemHolder extends ui.TableListItemHolder {
      constructor() {
        super();
        // this.initDisplayItem();
      }

      protected initDisplayItem() {
        super.initDisplayItem();

        if (!this.tableInfo || this._displayItem) {
          return;
        }

        const listItem = new we.ui.SideListItem('SideListItemSkin');
        listItem.itemInitHelper = new we.lw.SideListItemInitHelper();

        this._displayItem = listItem;
        this.setDisplayItem(this._displayItem);
      }
    }
  }
}