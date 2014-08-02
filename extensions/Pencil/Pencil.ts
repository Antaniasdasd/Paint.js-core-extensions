/// <reference path="../../common-headers/paintjs.d.ts" />

class Pencil {
    public EXTENSION_NAME: string = "com.paintjs.Pencil";
    paint: Paint.Global;
    private _lastPt: Paint.Point = null;

    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }

    init() {
        this.paint.barManager.addToolbarToolItem(__dirname + "/icon.png", "Pencil", this);
        this.paint.registerTool(this);
    }

    activated(id: string) {
        this.paint.currentPaper.setCursorFromURL("cursors/pencil.cur");
    }

    deactivated() {
        this.paint.currentPaper.restoreCursor();
    }

    onStartDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._lastPt = point;
        this.onDraw(paper, point);
    }

    onDraw(paper: Paint.Paper, point: Paint.Point) {

        var mX = this._lastPt.X <= point.X ? this._lastPt.X : point.X,
            mY = this._lastPt.Y <= point.Y ? this._lastPt.Y : point.Y;

        var location = new window.Paint.Point(mX, mY),
            width = Math.abs(this._lastPt.X - point.X) + 1,
            height = Math.abs(this._lastPt.Y - point.Y) + 1;

        var rect = new window.Paint.Rectangle(location, width, height);

        var matrix = paper.baseLayer.getCanvasMatrix(rect);

        window.Paint.PaperLayer.drawAliasedLine(
            this._lastPt.X - mX,
            this._lastPt.Y - mY,
            point.X - mX,
            point.Y - mY,
            this.paint.toolSize,
            this.paint.primaryColor,
            matrix.colorMatrix);

        matrix.apply(paper.baseLayer.getContext());


        this._lastPt = point;
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Pencil);