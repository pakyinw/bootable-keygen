namespace we {
  export namespace lw {
    export class StatisticChartPanel extends ui.Panel {
      public _progress_East: lw.StatisticChartPanelBar;
      public _progress_South: lw.StatisticChartPanelBar;
      public _progress_West: lw.StatisticChartPanelBar;
      public _progress_North: lw.StatisticChartPanelBar;
      public _progress_White: lw.StatisticChartPanelBar;
      public _progress_Red: lw.StatisticChartPanelBar;
      public _progress_Green: lw.StatisticChartPanelBar;
      public _lbl_East: ui.RunTimeLabel;
      public _lbl_South: ui.RunTimeLabel;
      public _lbl_West: ui.RunTimeLabel;
      public _lbl_North: ui.RunTimeLabel;
      public _lbl_White: ui.RunTimeLabel;
      public _lbl_Red: ui.RunTimeLabel;
      public _lbl_Green: ui.RunTimeLabel;

      public constructor(skin?: string) {
        super(skin ? skin : env.isMobile ? '' : 'lw.StatisticChartPanel');
      }

      public mount() {
        this._progress_East.setProgress(0.05);
        this._progress_South.setProgress(0.2);
        this._progress_West.setProgress(0.5);
        this._progress_North.setProgress(0.6);
        this._progress_White.setProgress(0.8);
        this._progress_Red.setProgress(0.95);
        this._progress_Green.setProgress(1);
      }

      public setValue(tableInfo: data.TableInfo) {}
    }
  }
}
