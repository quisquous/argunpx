argunpx.dungeon = function() {

    var levelWidth = argunpx.dungeonWidth;
    var levelHeight = argunpx.dungeonHeight;

    var feature = {
        floor: { idx: 0, tile: argunpx.display.tile.floor1 },
        wall: { idx: 1, tile: argunpx.display.tile.wall_dngn },
    };

    var wallOffset = {
        wall_vert: 0,
        wall_horz: 1,
        wall_ul: 2,
        wall_ur: 3,
        wall_ll: 4,
        wall_lr: 5,
        wall_cross: 6,
        wall_t_up: 7,
        wall_t_down: 8,
        wall_t_left: 9,
        wall_t_right: 10,
    };

    function Level() {
        var cells = [];
        this.wallBase = argunpx.display.tile.wall_dngn;

        function Cell() {
            this.feat = feature.floor;
            this.items = [];
            this.featTileOffset = 0;
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

        this.cellTile = function(x, y) {
            var cell = cells[cellIdx(x, y)];

            if (cell.items.length > 0)
                return cell.items[0].tile;

            var tile = (cell.feat.idx == feature.wall.idx) ? this.wallBase : cell.feat.tile;
            return tile + cell.featTileOffset;
        }

        function isWall(x, y) {
            return cells[cellIdx(x, y)].feat.idx == feature.wall.idx;
        }

        this.fixupWalls = function() {
            for (var y = 0; y < levelHeight; ++y) {
                for (var x = 0; x < levelWidth; ++x) {
                    var cell = cells[cellIdx(x, y)];

                    if (cell.feat.idx != feature.wall.idx)
                        continue;

                    var wall_d = y < levelHeight - 1 && isWall(x, y + 1) ? 1 : 0;
                    var wall_u = y > 0 && isWall(x, y - 1) ? 1 : 0;
                    var wall_r = x < levelWidth - 1 && isWall(x + 1, y) ? 1 : 0;
                    var wall_l = x > 0 && isWall(x - 1, y) ? 1 : 0;

                    var total =  wall_d + wall_u + wall_r + wall_l;

                    switch (total)
                    {
                    default:
                    case 0:
                        cell.featTileOffset =  wallOffset.wall_horz;
                        break;
                    case 1:
                        if (wall_d)
                            cell.featTileOffset =  wallOffset.wall_t_down;
                        else if (wall_u)
                            cell.featTileOffset =  wallOffset.wall_t_up;
                        else if (wall_l)
                            cell.featTileOffset =  wallOffset.wall_t_left;
                        else
                            cell.featTileOffset =  wallOffset.wall_t_right;
                        break;
                    case 2:
                        if (wall_l && wall_r)
                            cell.featTileOffset =  wallOffset.wall_horz;
                        else if (wall_l && wall_u)
                            cell.featTileOffset =  wallOffset.wall_lr;
                        else if (wall_l && wall_d)
                            cell.featTileOffset =  wallOffset.wall_ur;
                        else if (wall_r && wall_u)
                            cell.featTileOffset =  wallOffset.wall_ll;
                        else if (wall_r && wall_d)
                            cell.featTileOffset =  wallOffset.wall_ul;
                        else
                            cell.featTileOffset =  wallOffset.wall_vert;
                        break;
                    case 3:
                        if (!wall_d)
                            cell.featTileOffset =  wallOffset.wall_t_up;
                        else if (!wall_u)
                            cell.featTileOffset =  wallOffset.wall_t_down;
                        else if (!wall_l)
                            cell.featTileOffset =  wallOffset.wall_t_right;
                        else
                            cell.featTileOffset =  wallOffset.wall_t_left;
                        break;
                    case 4:
                        cell.featTileOffset =  wallOffset.wall_cross;
                        break;
                    }
                }
            }
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

        level.cell(5, 6).items.push(new argunpx.item.Potion);
        level.cell(10, 12).items.push(new argunpx.item.Wand);

        level.fixupWalls();
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
