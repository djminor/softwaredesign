import { Factory } from "../holiday/Factory";
import { HalloweenTableclothPatternProvider } from "../holiday/Halloween/HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "../holiday/Halloween/HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "../holiday/Halloween/HalloweenYardOrnamentProvider";
import { TableclothPatternProvider } from "../holiday/TableclothPatternProvider";
import { WallHangingProvider } from "../holiday/WallHangingProvider";
import { YardOrnamentProvider } from "../holiday/YardOrnamentProvider";

export class DecorationPlacer {
  // FIXME use dependency inversion to remove these hard-coded dependencies
  private tableclothPattern: TableclothPatternProvider;
  private wallHanging: WallHangingProvider;
  private yardOrnament: YardOrnamentProvider;

  public constructor(holidayFactory: Factory) {
    this.tableclothPattern = holidayFactory.createTableclothPatternProvider()
    this.wallHanging = holidayFactory.createWallHangingProvider()
    this.yardOrnament = holidayFactory.createYardOrnamentProvider()
  }

  placeDecorations(): string {
    return (
      "Everything was ready for the party. The " +
      this.yardOrnament.getOrnament() +
      " was in front of the house, the " +
      this.wallHanging.getHanging() +
      " was hanging on the wall, and the tablecloth with " +
      this.tableclothPattern.getTablecloth() +
      " was spread over the table."
    );
  }
}
