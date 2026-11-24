import type TableclothPatternProvider = require("../TableclothPatternProvider");

export class HalloweenTableclothPatternProvider implements TableclothPatternProvider.TableclothPatternProvider {

    getTablecloth(): string {
        return "ghosts and skeletons";
    }
}
