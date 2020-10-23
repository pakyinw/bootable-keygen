namespace we {
  export namespace lw {
    export class MobileBottomGamePanel extends ui.MobileBottomCommonPanel {
      // roadmap Panel
      public _roadmapPanel: lw.MobileBottomRoadmapPanel;

      // table info panel
      public _tableInfoPanel: ba.TableInfoPanel;
      // public _betLimitDropDownBtn: ui.RunTimeLabel;

      // statisticChartPanel
      public _statisticChartPanel: lw.StatisticChartPanel;

      // viewStack and radioBtn
      protected roadSheetBtn: eui.RadioButton;
      protected chartBtn: eui.RadioButton;
      protected tableInfoBtn: eui.RadioButton;

      protected _roadmapGroup: eui.Group;
      protected _chartGroup: eui.Group;
      protected _infoGroup: eui.Group;

      public constructor(skin?: string) {
        super(skin || !env.isMobile ? skin : 'lw.MobileBottomGamePanel');
      }

      protected mount() {
        super.mount();
        if (env.orientation === 'landscape') {
          env.bottomPanelSelectedIdx = env.bottomPanelSelectedIdx <= 1 ? 0 : 2;
        }
        this.viewStack.selectedIndex = env.bottomPanelSelectedIdx;
        switch (env.bottomPanelSelectedIdx.toString()) {
          case '0':
            this.roadSheetBtn.selected = true;
            break;
          case '1':
            this.chartBtn.selected = true;
            break;
          case '2':
            this.tableInfoBtn.selected = true;
            break;
        }

        // this._betLimitDropDownBtn = this._tableInfoPanel.pBetLimit;
      }

      protected addListeners() {
        super.addListeners();
        this.roadSheetBtn.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        this.tableInfoBtn.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        if (env.orientation === 'portrait') {
          this.chartBtn.addEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        }
      }

      protected removeListeners() {
        super.removeListeners();
        this.roadSheetBtn.removeEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        this.tableInfoBtn.removeEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        if (env.orientation === 'portrait') {
          this.chartBtn.removeEventListener(eui.UIEvent.CHANGE, this.onViewChange, this);
        }
      }

      public updateText() {
        super.updateText();
        if (env.isMobile && env.orientation === 'landscape') {
          this.roadSheetBtn.label = i18n.t('luckywheel.gameRecordlandscape');
        }else {
          this.roadSheetBtn.label = i18n.t('luckywheel.gameRecord');
        }
        this.tableInfoBtn.label = i18n.t('mobile_game_panel_table_info');
        if (env.orientation === 'portrait') {
          console.log(`${ i18n.t('luckywheel.gameRecord')}`)
          console.log(`${ i18n.t('luckywheel.pool')}`)
          console.log(`${ i18n.t('mobile_game_panel_table_info')}`)
          this.chartBtn.label = i18n.t('luckywheel.pool');
        }
      }

      public openTableInfo() {
        super.openTableInfo();
        this.tableInfoBtn.selected = true;
        this.viewStack.selectedIndex = this.tableInfoBtn.value;
      }

      public destroy() {
        super.destroy();
        this._roadmapGroup.removeChildren();
        this.removeListeners();
      }
      protected onViewChange(e: eui.UIEvent) {
        super.onViewChange(e);
        env.bottomPanelSelectedIdx = this.viewStack.selectedIndex;
      }
    }
  }
}
