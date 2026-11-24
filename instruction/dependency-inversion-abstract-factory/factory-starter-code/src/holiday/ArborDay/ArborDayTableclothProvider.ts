import { TableclothPatternProvider } from "../TableclothPatternProvider";

export class ArborDayTableclothProvider implements TableclothPatternProvider {
    getTablecloth(): string {
        return "a giant Nebraska flag honoring the fact that Arbor Day originated there";
    }
}