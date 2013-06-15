enchant();

window.onload = preloadAssets;
/* 定数の宣言 */
/* ゲーム画面の大きさ */
const GAME_X = 320;
const GAME_Y = 352;
/* ブロックサイズ */
const SIZE_X = 16;
const SIZE_Y = 16;
/* マップのサイズ */
const MAP_WIDTH = 10;
const MAP_HEIGHT = 20;
/* マップの位置 */
const OFFSET_X = 16;
const OFFSET_Y = 16;
/* FramePerSeconds */
const FPS = 24;
/* ブロックの種類の数 */
const MAX_BLOCKS_TYPE = 1;

/* 変数の宣言 */
/* ゲーム */
var game;
/* 各シーン */
var scene_background;
var scene_game;
var scene_start;
/* フレームカウンター */
var frame_counter = 0;
/* ブロックの種類 */
var blocks;
/* ブロックの種類 */
var block_type;
/* ブロック */
var block;
/* 表示するブロックの配列 */
var display_block;
/* ブロックを作るかどうかのフラグ */
var flag_create_block = 1;
/* 動かしているブロックの位置 */
var pos_x;
var pos_y;
/* 動かす前のブロックの位置 */
var pre_pos_x;
var pre_pos_y;
/* マップ */
var map;
/* 消去箇所保存配列 */
var delete_array;
/* ゲームスピード */
var game_speed = FPS;

function preloadAssets() {
    game = new Game(GAME_X, GAME_Y);
    game.fps = FPS;
    game.preload('chara1.gif', 'map2.gif', 'icon0.png', 'jump.wav', 'gameover.wav');
    game.onload = init;
    game.start();
}

function init() {
    /* 各シーンの作成 */
    createBackGroundScene();
    createGameScene();
    createStartScene();

    /* マップの作成 */
    createMap();

    /* 表示するブロックの初期化 */
    initDisplayBlock();

    /* ブロックの種類の作成 */
    createBlocks();

    /* 消去用配列作成 */
    initDeleteArray();

    /* シーンのプッシュ */
    game.pushScene(scene_start);

    /* スタート画面 */
    scene_start.addEventListener('enterframe', StartMenu);

    /* ゲーム画面 */
    scene_game.addEventListener('enterframe', main);
}

function main() {
    // ゲーム本体
    game_speed = 6;     // デバッグ用のスピード
    checkState();
    update_display(0);
    rotate(frame_counter);
    moveX(frame_counter);
    moveY(frame_counter);

    frame_counter++;
    if(frame_counter == game_speed) {
        frame_counter = 0;
    }
}
/* 現在の状態をチェックする関数 */
function checkState() {
    // 落ちているブロックが接地しているかのチェック->接地していればmapに反映&新しいブロックの作成及び配置
    if(flag_create_block == 0) {    // 最初はflag_create_block=1だからスキップのため
        if(check_block() == 1) {    // 最初はblockが設定されていないのでエラーが出る
            update_map();
            update_display(1);
        flag_create_block = 1;
        }
    }
    if(flag_create_block == 1) {
        createBlock();
        flag_create_block = 0;
    }
    // ラインがそろっているかチェック
    delete_line();
    // GameOverのチェック
}

function check_block() {
    // ブロックが設置しているかをチェックする。1ならば設置。
    /*
    if(pos_y == MAP_HEIGHT - 1) {
        return 1;
    }
    else if(pos_y > 0 && pos_y < MAP_HEIGHT - 1) {
        if(map[pos_x][pos_y+1] > 10) {
            return 1;
        }
    }
    */
    for(var i=0; i<4; i++) {
        for(var j=0; j<4; j++) {
            if(block[i][j] == 1) {
                if(pos_y + j == MAP_HEIGHT - 1) {
                    return 1;
                }
                else if(map[pos_x+i][pos_y+j+1] > 10) {
                    return 1;
                }
            }
        }
    }
    return 0;
}

function update_map() {
    // ブロックが設置している場合mapとblockを合体(?)させる
    //map[pos_x][pos_y] = 1;
    for(var i=0; i<4; i++) {
        for(var j=0; j<4; j++) {
            if(block[i][j] == 1) {
                map[pos_x+i][pos_y+j] = 1;
            }
        }
    }
}

function delete_line() {
    var flag_delete = 1;
    for(var y=0; y<MAP_HEIGHT; y++) {
        for(var x=0; x<MAP_WIDTH; x++) {
            if(map[x][y] == 0) {
                flag_delete = 0;
            }
        }
        if(flag_delete == 1) {
            if(y == 0) {
                for(var i=0; i<MAP_WIDTH; i++) {
                    delete_array[i][j] = 1;
                    map[i][y] = 0;
                }
            }
            else {
                for(var j=y; j>=0; j--) {
                    for(var i=0; i<MAP_WIDTH; i++) {
                        if(map[i][j] != map[i][j-1]) {
                            map[i][j] = map[i][j-1];
                            if(map[i][j] == 0) {
                                delete_array[i][j] = 1;
                            }
                            else {
                                delete_array[i][j] = 0;
                            }
                        }
                    }
                }
            }
        }
        flag_delete = 1;
    }
}

function update_display(state) {
    // mapとblockの位置からディスプレイの更新
    //scene_game.removeChild(display_block[pre_pos_y*MAP_WIDTH+pre_pos_x]);
    removeBlock(pre_pos_x, pre_pos_y);
    if(state == 0) {    // 設置時以外は現場所にadd、設置時はcreateBlockでaddするためスキップ
        //scene_game.addChild(display_block[pos_y*MAP_WIDTH+pos_x]);
        addBlock(pos_x, pos_y);
    }
    pre_pos_x = pos_x;
    pre_pos_y = pos_y;
    for(var x=0; x<MAP_WIDTH; x++) {
        for(var y=0; y<MAP_HEIGHT; y++) {
            if(delete_array[x][y] == 1) {
                scene_game.removeChild(display_block[y*MAP_WIDTH+x]);
                map[x][y] = 0;
                delete_array[x][y] = 0;
            }
            else if(map[x][y] >　0 && map[x][y] < 10) {
                scene_game.addChild(display_block[y*MAP_WIDTH+x]);
                map[x][y] += 10;
            }
        }
    }
}

function rotate(frame_counter) {
    // blockの回転
}

function moveX(frame_counter) {
    // blockの横移動
    if(frame_counter % 2 == 0) {
        if(game.input.right) {
            if(pos_x < MAP_WIDTH - 1) {
                if(map[pos_x+1][pos_y] == 0) {
                    pos_x++;
                }
            }
        }
        else if(game.input.left) {
            if(pos_x > 0) {
                if(map[pos_x-1][pos_y] == 0) {
                    pos_x--;
                }
            }
        }
    }
}

function moveY(frame_counter) {
    // blockの縦移動
    if(frame_counter == game_speed - 1 || frame_counter == Math.floor(game_speed / 2)) {
        pos_y++;
    }
}

function StartMenu() {
    // StartMenuの設定
    // 難易度の設定など？
    if(game.input.right) {
        game.replaceScene(scene_game);
    }
}

function createBackGroundScene() {
    scene_background = game.rootScene;
    var map_back = new Map(16,16);
    map_back.image = game.assets['map2.gif'];
    map_back.loadData(
        [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 19, 19, 19, 19, 19, 19, 19, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ]
    );
    scene_background.addChild(map_back);
}

function createGameScene() {
    scene_game = new Scene();
}

function createStartScene() {
    scene_start = new Scene();
    scene_start.backgroundColor = 'rgb(255, 150, 0)';
}

function createBlocks() {
    // ブロックの種類の作成
    // blocks配列でいくつか用意
    blocks = [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    ];
}

function initDisplayBlock() {
    display_block = new Array();
    for(var i=0; i<MAP_WIDTH*MAP_HEIGHT; i++) {
        display_block[i] = new Sprite(SIZE_X, SIZE_Y);
        display_block[i].image = game.assets['map2.gif'];
        display_block[i].x = (i % MAP_WIDTH) * SIZE_X + OFFSET_X;
        display_block[i].y = Math.floor(i / MAP_WIDTH) * SIZE_Y + OFFSET_Y;
        display_block[i].frame = 11;
        //scene_game.addChild(display_block[i]);
    }
}

function createBlock() {
    // ブロックの作成
    // blocks配列の中からランダムで選べばいい？
    block_type = Math.floor(Math.random()*0);
    block = blocks[block_type];
    if(block_type == 0) {
        pos_x = 3;
        pre_pos_x = 3;
        pos_y = -1;
        pre_pos_y = -1;
    }
    //scene_game.addChild(display_block[pos_y*MAP_WIDTH+pos_x]);
    addBlock(pos_x, pos_y);
}

function createMap() {
    // map配列の作成
    map = new Array();
    for(var x=0; x<MAP_WIDTH; x++) {
        map[x] = new Array();
        for(var y=0; y<MAP_HEIGHT; y++) {
            map[x][y] = 0;
        }
    }
}

function initDeleteArray() {
    delete_array = new Array();
    for(var x=0; x<MAP_WIDTH; x++) {
        delete_array[x] = new Array();
        for(var y=0; y<MAP_HEIGHT; y++) {
            delete_array[x][y] = 0;
        }
    }
}

function addBlock(x, y) {
    for(var i=0; i<4; i++) {
        for(var j=0; j<4; j++) {
            if(block[i][j] == 1) {
                scene_game.addChild(display_block[(y+j)*MAP_WIDTH+(x+i)]);
            }
        }
    }
}

function removeBlock(x, y) {
    for(var i=0; i<4; i++) {
        for(var j=0; j<4; j++) {
            if(block[i][j] == 1) {
                scene_game.removeChild(display_block[(y+j)*MAP_WIDTH+(x+i)]);
            }
        }
    }
}
