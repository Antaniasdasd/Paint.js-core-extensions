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
        var matrix = paper.baseLayer.getCanvasMatrix();

        Paint.PaperLayer.drawAliasedLine(
            this._lastPt.X,
            this._lastPt.Y,
            point.X,
            point.Y,
            this.paint.toolSize,
            this.paint.primaryColor,
            matrix.colorMatrix);

        matrix.apply(paper.baseLayer.getContext());

        this._lastPt = point;
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Pencil);