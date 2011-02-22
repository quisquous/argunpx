argunpx.dungeon = function() {

    var levelWidth = argunpx.dungeonWidth;
    var levelHeight = argunpx.dungeonHeight;

    var feature = {
        floor: { idx: 0, tile: argunpx.display.tile.floor1 },
        wall: { idx: 1, tile: argunpx.display.tile.wall_dngn },
    };

    function Level() {
        var cells = [];

        function Cell() {
            this.feat = feature.floor;
        }

        function cellIdx(x, y) {
            return x + levelWidth * y;
        }

        this.cell = function(x, y) {
            var idx = cellIdx(x, y);
            var cell = cells[idx];
            if (cell)
                return cell;
            cell = new Cell;
            cells[idx] = cell;
            return cell;
        }
    }

    function buildTestLevel() {
        var level = new Level();
        for (var y = 0; y < levelHeight; ++y) {
            for (var x = 0; x < levelWidth; ++x) {
                if (x > 0 && x < levelWidth - 1 && y > 0 && y < levelHeight - 1)
                    level.cell(x, y).feat = feature.floor;
                else
                    level.cell(x, y).feat = feature.wall;
            }
        }

        return level;
    }

    function Dungeon() {
        var branches = {
            "main": [],
        };

        this.getLevel = function(branchName, levelNum) {
            var branch = branches[branchName];
            if (!branch) {
                argunpx.abort("Unknown branch: " + branchName);
                return undefined;
            }
            var level = branch[levelNum];
            if (level)
                return level;
            branch[levelNum] = buildTestLevel();
            return branch[levelNum];
        }
    }

    return {
        feature: feature,
        Dungeon: Dungeon,
    };
}();
