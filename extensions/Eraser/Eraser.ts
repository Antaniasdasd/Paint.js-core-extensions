/// <reference path="../../common-headers/paintjs.d.ts" />

class Eraser {
    public EXTENSION_NAME: string = "com.paintjs.Eraser";
    paint: Paint.Global;

    private _layer: Paint.PaperLayer;
    private _points: Paint.Point[] = [];

    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }

    init() {
        this.paint.registerTool(this);
        this.paint.barManager.addToolbarToolItem(__dirname + "/icon.png", "Eraser", this);
    }

    activated(id: string) {
        this.onToolSizeChanged();
    }

    deactivated() {
        this.paint.currentPaper.restoreCursor();
    }

    onToolSizeChanged() {
        if (this.paint.currentTool === this) {
            var size = this.paint.toolSize;

            var cur = this.getCursorForSize(size);
            this.paint.currentPaper.setCursorFromURL(cur, size / 2, size / 2);
        }
    }

    private getCursorForSize(size: number): string {
        var $ = this.paint.$;

        var newCanvas = $('<canvas />');
        newCanvas.css('position', 'absolute');
        newCanvas.css('top', 0);
        newCanvas.css('left', 0);
        newCanvas.attr("width", size);
        newCanvas.attr("height", size);

        var el = <HTMLCanvasElement>newCanvas[0];
        var ctx = el.getContext('2d');

        ctx.fillStyle = Paint.Color.White.HexString;
        ctx.fillRect(0, 0, size, size);

        var mat = new Paint.CanvasMatrix(ctx.getImageData(0, 0, size, size), new Paint.Point(0,0));

        Paint.PaperLayer.drawAliasedLine(0, 0, size - 1, 0, 1, Paint.Color.Black, mat.colorMatrix);
        Paint.PaperLayer.drawAliasedLine(0, 0, 0, size - 1, 1, Paint.Color.Black, mat.colorMatrix);
        Paint.PaperLayer.drawAliasedLine(size - 1, 0, size - 1, size - 1, 1, Paint.Color.Black, mat.colorMatrix);
        Paint.PaperLayer.drawAliasedLine(0, size - 1, size - 1, size - 1, 1, Paint.Color.Black, mat.colorMatrix);

        mat.apply(ctx);

        return el.toDataURL();
    }

    onStartDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._points = [];

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();

        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.secondaryColor.HexString;
        context.lineCap = 'square';
        context.lineJoin = 'round';

        this.onDraw(paper, point);
    }

    onDraw(paper: Paint.Paper, point: Paint.Point) {
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;

        this._points.push(point);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();

        var len = this._points.length;

        if (len === 1) {
            // FIXME Draw a dot 

        } else if (len === 2) {
            context.moveTo(this._points[0].X, this._points[0].Y);
            context.lineTo(point.X, point.Y);

        } else {

            // move to the first point
            context.moveTo(this._points[0].X, this._points[0].Y);

            for (var i = 1; i < len - 2; i++) {
                var xc = (this._points[i].X + this._points[i + 1].X) / 2;
                var yc = (this._points[i].Y + this._points[i + 1].Y) / 2;
                context.quadraticCurveTo(this._points[i].X, this._points[i].Y, xc, yc);
            }

            // curve through the last two points
            context.quadraticCurveTo(this._points[i].X, this._points[i].Y, this._points[i + 1].X, this._points[i + 1].Y);

        }

        context.stroke();
        context.closePath();
    }

    onStopDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);

        this._points = [];
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Eraser);