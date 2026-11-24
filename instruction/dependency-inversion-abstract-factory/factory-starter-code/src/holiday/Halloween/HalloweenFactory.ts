import { Factory } from "../Factory";
import { TableclothPatternProvider } from "../TableclothPatternProvider";
import { WallHangingProvider } from "../WallHangingProvider";
import { YardOrnamentProvider } from "../YardOrnamentProvider";
import { HalloweenTableclothPatternProvider } from "./HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "./HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "./HalloweenYardOrnamentProvider";

export class HalloweenFactory implements Factory {

    createTableclothPatternProvider(): TableclothPatternProvider {
        return new HalloweenTableclothPatternProvider()
    }

    createWallHangingProvider(): WallHangingProvider {
        return new HalloweenWallHangingProvider()
    }

    createYardOrnamentProvider(): YardOrnamentProvider {
        return new HalloweenYardOrnamentProvider()
    }
}