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

/* 変数の宣言 */
/* ゲーム */
var game;
/* 各シーン */
var scene_background;
var scene_game;
var scene_start;
/* フレームカウンター */
var frame_counter;
/* ブロックの種類 */
var blocks;
/* ブロック */
var block;
/* 動かしているブロックの位置 */
var pos_x;
var pos_y;
/* マップ */
var map;

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
    /* シーンのプッシュ */
    game.pushScene(scene_background);
    game.pushScene(scene_game);
    game.pushScene(scene_start);

    /* ブロックの種類の作成 */
    createBlocks();

    /* マップの作成 */
    createMap();

    /* スタート画面 */
    scene_start.addEventListener(Event.ENTER_FRAME, StartMenu);

    /* ゲーム画面 */
    scene_game.addEventListener(Event.ENTER_FRAME, main);
}

function main() {
    // ゲーム本体
    checkState(frame_counter);
    update_display(frame_counter);
    rotate(frame_counter);
    moveX(frame_counter);
    moveY(frame_counter);

    frame_counter++;
    if(frame_counter == FPS) {
        frame_counter = 0;
    }
}
/* 現在の状態をチェックする関数 */
function checkState(frame_counter) {
    // 落ちているブロックが接地しているかのチェック->接地していればmapに反映&新しいブロックの作成及び配置
    // ラインがそろっているかチェック
    // GameOverのチェック
}

function update_display(frame_counter) {
    // mapとblockの位置からディスプレイの更新
}

function rotate(frame_counter) {
    // blockの回転
}

function moveX(frame_counter) {
    // blockの横移動
}

function moveY(frame_counter) {
    // blockの縦移動
}

function StartMenu() {
    // StartMenuの設定
    // 難易度の設定など？
    if(game.input.right) {
        game.popScene();
    }
}

function createBackGroundScene() {
    scene_background = new Scene();
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
}

function createBlock() {
    // ブロックの作成
    // blocks配列の中からランダムで選べばいい？
}

function createMap() {
    // map配列の作成
    map = new Array(MAP_WIDTH);
    for(var i=0; i<MAP_WIDTH; i++) {
        map[i] = new Array(MAP_HEIGHT);
        for(var j=0; j<MAP_HEIGHT; j++) {
            map[i][j] = 0;
        }
    }
}
