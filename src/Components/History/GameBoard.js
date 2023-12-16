import Phaser from 'phaser';

import caseBlanche from '../../assets/blanc.png';
import caseNoir from '../../assets/noir.png';

import transparent from '../../assets/transparent.png';

import BBishop from '../../assets/piece/BBishop.png';
import BKing from '../../assets/piece/BKing.png';
import BKnight from '../../assets/piece/BKnight.png';
import BPawn from '../../assets/piece/BPawn.png';
import BQueen from '../../assets/piece/BQueen.png';
import BRook from '../../assets/piece/BRook.png';

import WBishop from '../../assets/piece/WBishop.png';
import WKing from '../../assets/piece/WKing.png';
import WPawn from '../../assets/piece/WPawn.png';
import WKnight from '../../assets/piece/WKnight.png';
import WQueen from '../../assets/piece/WQueen.png';
import WRook from '../../assets/piece/WRook.png';

const tailleCase = 70;

const align = (val) => {
  const value = val * tailleCase + 0.5 * tailleCase;
  return value;
};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.pieces = [];
    this.piecesMap = [[], [], [], [], [], [], [], []];
    this.deletedPieces = [];
    this.moves = [];
    this.index = 0;
  }

  initData(data) {
    const moveStrings = data.split(';');

    this.moves = moveStrings.map((moveString) => {
      const [piece, coordStr] = moveString.split(':');
      const [sourceStr, destStr] = coordStr.split('-');
      const [sx, sy] = sourceStr.split(',').map(Number);
      const [dx, dy] = destStr.split(',').map(Number);

      return {
        piece,
        sourceCoord: { x: sx, y: sy },
        destCoord: { x: dx, y: dy },
      };
    });
  }

  preload() {
    this.load.image('white_case', caseBlanche);
    this.load.image('black_case', caseNoir);

    this.load.image('empty', transparent);

    this.load.image('BBishop', BBishop);
    this.load.image('BKnight', BKnight);
    this.load.image('BPawn', BPawn);
    this.load.image('BQueen', BQueen);
    this.load.image('BRook', BRook);
    this.load.image('BKing', BKing);

    this.load.image('WBishop', WBishop);
    this.load.image('WKing', WKing);
    this.load.image('WPawn', WPawn);
    this.load.image('WKnight', WKnight);
    this.load.image('WQueen', WQueen);
    this.load.image('WRook', WRook);
  }

  create() {
    let whiteCase = true;
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        this.add
          .image(
            j * tailleCase + 0.5 * tailleCase,
            i * tailleCase + 0.5 * tailleCase,
            whiteCase ? 'white_case' : 'black_case',
          )
          .setDisplaySize(tailleCase, tailleCase);
        whiteCase = !whiteCase;
      }
      whiteCase = !whiteCase;
    }

    this.initializePieces();

    const previousButton = this.add.text(100, 575, 'Previous move', { fill: '#0f0' });
    previousButton.setInteractive();
    previousButton.on('pointerdown', () => {
      if (this.index > 0) {
        this.index -= 1;
        this.movePiece(this.moves[this.index].destCoord, this.moves[this.index].sourceCoord, false);
      }
    });

    const nextButton = this.add.text(350, 575, 'Next move', { fill: '#0f0' });
    nextButton.setInteractive();
    nextButton.on('pointerdown', () => {
      if (this.index < this.moves.length) {
        this.movePiece(this.moves[this.index].sourceCoord, this.moves[this.index].destCoord, true);
        this.index += 1;
      }
    });
  }

  findPieceByCoordinates(coordinates) {
    return this.piecesMap[coordinates.x][coordinates.y];
  }

  movePiece(coordinatesBefore, coordinatesAfter, forward) {
    const pieceId = this.findPieceByCoordinates(coordinatesBefore);
    const piece = this.pieces[pieceId];

    const targetId = this.findPieceByCoordinates(coordinatesAfter);
    const target = this.pieces[targetId];

    if (target) {
      target.setAlpha(0);
    }

    let resurectedPieceId;
    if (forward) {
      this.deletedPieces.push(targetId);
    } else {
      resurectedPieceId = this.deletedPieces.pop();
    }

    const resurectedPiece = this.pieces[resurectedPieceId];
    if (resurectedPiece) {
      resurectedPiece.setAlpha(1);
    }

    piece.x = align(coordinatesAfter.x);
    piece.y = align(coordinatesAfter.y);

    this.piecesMap[coordinatesAfter.x][coordinatesAfter.y] = pieceId;
    this.piecesMap[coordinatesBefore.x][coordinatesBefore.y] = forward ? null : resurectedPieceId;

    if (
      (pieceId === 'BKing' || pieceId === 'WKing') &&
      coordinatesBefore.x === 4 &&
      (coordinatesBefore.y === 0 || coordinatesBefore.y === 7) &&
      Math.abs(coordinatesAfter.x - coordinatesBefore.x) > 1
    ) {
      console.log('hey');
      console.log(coordinatesBefore.x, coordinatesAfter.x);
      const roquedPieceCoordinates = {
        x: coordinatesAfter.x > coordinatesBefore.x ? 7 : 0,
        y: coordinatesBefore.y,
      };
      console.log(roquedPieceCoordinates);
      const newX = roquedPieceCoordinates.x === 7 ? 5 : 3;
      const roquedPieceId = this.findPieceByCoordinates(roquedPieceCoordinates);
      const roquedPiece = this.pieces[roquedPieceId];
      roquedPiece.x = align(newX);
      roquedPiece.y = align(roquedPieceCoordinates.y);
      this.piecesMap[newX][roquedPieceCoordinates.y] = roquedPieceId;
      this.piecesMap[roquedPieceCoordinates.x][roquedPieceCoordinates.y] = null;
      console.log(this.piecesMap);
    }
    if (
      (pieceId === 'BKing' || pieceId === 'WKing') &&
      coordinatesAfter.x === 4 &&
      (coordinatesAfter.y === 0 || coordinatesAfter.y === 7) &&
      Math.abs(coordinatesBefore.x - coordinatesAfter.x) > 1
    ) {
      console.log('yeh');
      const roquedPieceCoordinates = {
        x: coordinatesAfter.x > coordinatesBefore.x ? 0 : 7,
        y: coordinatesBefore.y,
      };
      const newX = roquedPieceCoordinates.x === 7 ? 5 : 3;
      const roquedPieceId = this.findPieceByCoordinates({ x: newX, y: coordinatesBefore.y });
      const roquedPiece = this.pieces[roquedPieceId];
      roquedPiece.x = align(roquedPieceCoordinates.x);
      roquedPiece.y = align(roquedPieceCoordinates.y);
      this.piecesMap[roquedPieceCoordinates.x][roquedPieceCoordinates.y] = roquedPieceId;
      this.piecesMap[newX][roquedPieceCoordinates.y] = null;
    }
  }

  initializePieces() {
    this.pieces.BRook1 = this.add
      .image(align(0), align(0), 'BRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[0][0] = 'BRook1';

    this.pieces.BKnight1 = this.add
      .image(align(1), align(0), 'BKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[1][0] = 'BKnight1';

    this.pieces.BBishop1 = this.add
      .image(align(2), align(0), 'BBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[2][0] = 'BBishop1';

    this.pieces.BQueen = this.add
      .image(align(3), align(0), 'BQueen')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[3][0] = 'BQueen';

    this.pieces.BKing = this.add
      .image(align(4), align(0), 'BKing')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[4][0] = 'BKing';

    this.pieces.BBishop2 = this.add
      .image(align(5), align(0), 'BBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[5][0] = 'BBishop2';

    this.pieces.BKnight2 = this.add
      .image(align(6), align(0), 'BKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[6][0] = 'BKnight2';

    this.pieces.BRook2 = this.add
      .image(align(7), align(0), 'BRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[7][0] = 'BRook2';

    this.pieces.BPawn1 = this.add
      .image(align(0), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[0][1] = 'BPawn1';

    this.pieces.BPawn2 = this.add
      .image(align(1), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[1][1] = 'BPawn2';

    this.pieces.BPawn3 = this.add
      .image(align(2), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[2][1] = 'BPawn3';

    this.pieces.BPawn4 = this.add
      .image(align(3), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[3][1] = 'BPawn4';

    this.pieces.BPawn5 = this.add
      .image(align(4), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[4][1] = 'BPawn5';

    this.pieces.BPawn6 = this.add
      .image(align(5), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[5][1] = 'BPawn6';

    this.pieces.BPawn7 = this.add
      .image(align(6), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[6][1] = 'BPawn7';

    this.pieces.BPawn8 = this.add
      .image(align(7), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[7][1] = 'BPawn8';

    this.pieces.WRook1 = this.add
      .image(align(0), align(7), 'WRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[0][7] = 'WRook1';

    this.pieces.WKnight1 = this.add
      .image(align(1), align(7), 'WKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[1][7] = 'WKnight1';

    this.pieces.WBishop1 = this.add
      .image(align(2), align(7), 'WBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[2][7] = 'WBishop1';

    this.pieces.WQueen = this.add
      .image(align(3), align(7), 'WQueen')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[3][7] = 'WQueen';

    this.pieces.WKing = this.add
      .image(align(4), align(7), 'WKing')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[4][7] = 'WKing';

    this.pieces.WBishop2 = this.add
      .image(align(5), align(7), 'WBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[5][7] = 'WBishop2';

    this.pieces.WKnight2 = this.add
      .image(align(6), align(7), 'WKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[6][7] = 'WKnight2';

    this.pieces.WRook2 = this.add
      .image(align(7), align(7), 'WRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[7][7] = 'WRook2';

    this.pieces.WPawn1 = this.add
      .image(align(0), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[0][6] = 'WPawn1';

    this.pieces.WPawn2 = this.add
      .image(align(1), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[1][6] = 'WPawn2';

    this.pieces.WPawn3 = this.add
      .image(align(2), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[2][6] = 'WPawn3';

    this.pieces.WPawn4 = this.add
      .image(align(3), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[3][6] = 'WPawn4';

    this.pieces.WPawn5 = this.add
      .image(align(4), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[4][6] = 'WPawn5';

    this.pieces.WPawn6 = this.add
      .image(align(5), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[5][6] = 'WPawn6';

    this.pieces.WPawn7 = this.add
      .image(align(6), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[6][6] = 'WPawn7';

    this.pieces.WPawn8 = this.add
      .image(align(7), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.piecesMap[7][6] = 'WPawn8';
  }
}

export default GameScene;
