import { WallHangingProvider } from "../WallHangingProvider";

export class ArborDayWallHangingProvider implements WallHangingProvider {
    getHanging(): string {
        return "wreath, but this one made of corn husks,"
    }
}