import { TableclothPatternProvider } from "./TableclothPatternProvider";
import { WallHangingProvider } from "./WallHangingProvider";
import { YardOrnamentProvider } from "./YardOrnamentProvider";

export interface Factory {
    createTableclothPatternProvider(): TableclothPatternProvider;
    createWallHangingProvider(): WallHangingProvider;
    createYardOrnamentProvider(): YardOrnamentProvider;
}