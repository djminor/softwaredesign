import { TableclothPatternProvider } from "../TableclothPatternProvider"
import { WallHangingProvider } from "../WallHangingProvider"
import { YardOrnamentProvider } from "../YardOrnamentProvider"
import { ArborDayTableclothProvider } from "./ArborDayTableclothProvider"
import { ArborDayWallHangingProvider } from "./ArborDayWallHangingProvider"
import { ArborDayYardOrnamentProvider } from "./ArborDayYardOrnamentProvider"

export class ArborDayFactory {
    createTableclothPatternProvider(): TableclothPatternProvider {
            return new ArborDayTableclothProvider()
        }
    
        createWallHangingProvider(): WallHangingProvider {
            return new ArborDayWallHangingProvider()
        }
    
        createYardOrnamentProvider(): YardOrnamentProvider {
            return new ArborDayYardOrnamentProvider()
        }
}