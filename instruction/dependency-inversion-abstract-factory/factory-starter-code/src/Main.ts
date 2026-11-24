import { DecorationPlacer } from "./decoration/DecorationPlacer";
import { ArborDayFactory } from "./holiday/ArborDay/ArborDayFactory";
import { HalloweenFactory } from "./holiday/Halloween/HalloweenFactory";

main();

function main(): void {
  let halloweenFactory = new HalloweenFactory()
  let arborDayFactory = new ArborDayFactory()
  let decorationPlacer = new DecorationPlacer(arborDayFactory);

  console.log(decorationPlacer.placeDecorations());
}
