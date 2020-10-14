// TypeScript file
namespace we {
  export namespace lo {
    export class AnalysisPanel extends ui.Panel {

      protected analysisStack: eui.ViewStack;

      protected analysisBtn1: eui.RadioButton;
      protected analysisBtn2: eui.RadioButton;
      protected analysisBtn3: eui.RadioButton;
      protected analysisBtn4: eui.RadioButton;

      protected listShow: LoAnalysisScrollList;
      protected listNoShow: LoAnalysisScrollList;
      protected listHot: LoAnalysisScrollList;
      protected listCold: LoAnalysisScrollList;

      public constructor() {
        super();
      }

      protected mount() {
        super.mount();
      }

      protected init() {
        const analysis1Group = this.analysisStack.getChildAt(0) as eui.Group;
        this.listShow = new LoAnalysisScrollList(0, 5, 625, 277, 20);
        this.listShow.y = 45;
        analysis1Group.addChild(this.listShow);

        const analysis2Group = this.analysisStack.getChildAt(1) as eui.Group;
        this.listNoShow = new LoAnalysisScrollList(1, 5, 625, 277, 20);
        this.listNoShow.y = 45;
        analysis2Group.addChild(this.listNoShow);

        const analysis3Group = this.analysisStack.getChildAt(2) as eui.Group;
        this.listHot = new LoAnalysisScrollList(2, 5, 625, 277, 20);
        this.listHot.y = 45;
        analysis3Group.addChild(this.listHot);

        const analysis4Group = this.analysisStack.getChildAt(3) as eui.Group;
        this.listCold = new LoAnalysisScrollList(3, 5, 625, 277, 20);
        this.listCold.y = 45;
        analysis4Group.addChild(this.listCold);

        this.analysisBtn1.addEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
        this.analysisBtn2.addEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
        this.analysisBtn3.addEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
        this.analysisBtn4.addEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);

        dir.evtHandler.addEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
        this.changeLang();
      }

      protected destroy() {
          super.destroy();
          this.analysisBtn1.removeEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
          this.analysisBtn2.removeEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
          this.analysisBtn3.removeEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
          this.analysisBtn4.removeEventListener(eui.UIEvent.CHANGE, this.onAnalysisChange, this);
          dir.evtHandler.removeEventListener(core.Event.SWITCH_LANGUAGE, this.changeLang, this);
      }

      protected onAnalysisChange(e: eui.UIEvent) {
        const radio: eui.RadioButton = e.target;
        this.analysisStack.selectedIndex = radio.value;

        this.listShow.resetPosition();
        this.listNoShow.resetPosition();
        this.listHot.resetPosition();
        this.listCold.resetPosition();
      }

    public update() {
          // this.listShow.updateList(history.show);
          // this.listNoShow.updateList(history.noShow);
          // this.listHot.updateList(history.hot);
          // this.listCold.updateList(history.cold);

          this.changeLang();
      }

      public changeLang() {
        this.analysisBtn1['labelDisplayDown']['text'] = this.analysisBtn1['labelDisplayUp']['text'] = 'Show';
        this.analysisBtn2['labelDisplayDown']['text'] = this.analysisBtn2['labelDisplayUp']['text'] = 'NoShow';
        this.analysisBtn3['labelDisplayDown']['text'] = this.analysisBtn3['labelDisplayUp']['text'] = 'Hot';
        this.analysisBtn4['labelDisplayDown']['text'] = this.analysisBtn4['labelDisplayUp']['text'] = 'Cold';
      }
    }
  }
}
