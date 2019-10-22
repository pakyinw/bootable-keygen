namespace baccarat {
  export class BABigEyeRoad extends BARoadBase {
    /*
            [
                {v:'b', b:0, p:0},
                {v:'p', b:1, p:0},
                {v:'t', b:0, p:0},
                {},
                {},
            ]

        */

    public constructor() {
      super();
      this.scale = 1;
      this.gridUnit = 2;
      this.gridSize = 15;
      this.numCol = 12;

      this.parseRoadData([{ v: 'b' }, { v: 'p' }, {}, { v: 'b' }, { v: 'p' }, {}, { v: 'b' }, { v: 'p' }, {}]);
    }

    protected createIcon(size: number): BABigEyeRoadIcon {
      return new BABigEyeRoadIcon(size);
    }
  }
}
