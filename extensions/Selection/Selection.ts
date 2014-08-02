/// <reference path="../../common-headers/paintjs.d.ts" />

class Selection {
    public EXTENSION_NAME: string = "com.paintjs.Selection";
    paint: Paint.Global;

    private point1: Paint.Point = null;
    private _layer: Paint.PaperLayer;

    private toolbarGroup: Paint.BarGroup;

    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }

    init() {
        this.paint.registerTool(this);
        this.toolbarGroup = this.paint.barManager.addGroup('tabTools', 'Image');
        this.toolbarGroup.addTool(__dirname + "/icon.png", "Select", this);
    }

    onStartDrawing(paper: Paint.Paper, point: Paint.Point) {
        this.point1 = point;

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        context.lineWidth = 1;
        context.setLineDash([4]);
        context.strokeStyle = "#3399FF";
    }

    onDraw(paper: Paint.Paper, point: Paint.Point) {
        var canvas = this._layer.canvas;
        var context = this._layer.getContext();
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.rect(
            Math.min(this.point1.X, point.X) - 0.5,
            Math.min(this.point1.Y, point.Y) - 0.5,
            Math.abs(this.point1.X - point.X),
            Math.abs(this.point1.Y - point.Y));
        context.stroke();
        context.closePath();
    }

    onStopDrawing(paper: Paint.Paper, point: Paint.Point) {
        paper.removeLayer(this._layer);
    }
}

exports.Extensions = [Selection];