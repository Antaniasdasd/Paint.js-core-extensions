class Shape {
    static name = "";
    static Draw(ctx: CanvasRenderingContext2D, startPoint: Paint.Point, endPoint: Paint.Point) { }
}

class Line extends Shape {
    static name = "Line";

    static Draw(ctx: CanvasRenderingContext2D, startPoint: Paint.Point, endPoint: Paint.Point) {

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(startPoint.X - 0.5, startPoint.Y - 0.5);
        ctx.lineTo(endPoint.X - 0.5, endPoint.Y - 0.5);
    }
}

class Rectangle extends Shape {
    static name = "Rectangle";

    static Draw(ctx: CanvasRenderingContext2D, startPoint: Paint.Point, endPoint: Paint.Point) {
        ctx.moveTo(startPoint.X, startPoint.Y);

        var w = endPoint.X - startPoint.X,
            h = endPoint.Y - startPoint.Y;

        ctx.rect(startPoint.X - 0.5, startPoint.Y - 0.5, w, h);
    }
}

class Ellipse extends Shape {
    static name = "Ellipse";

    static Draw(ctx: CanvasRenderingContext2D, startPoint: Paint.Point, endPoint: Paint.Point) {

        var w = endPoint.X - startPoint.X,
            h = endPoint.Y - startPoint.Y;

        ctx.moveTo(startPoint.X, startPoint.Y + h / 2);

        ctx.bezierCurveTo(startPoint.X, startPoint.Y, endPoint.X, startPoint.Y, endPoint.X, endPoint.Y - h / 2);
        ctx.moveTo(endPoint.X, endPoint.Y - h / 2);
        ctx.bezierCurveTo(endPoint.X, endPoint.Y, startPoint.X, endPoint.Y, startPoint.X, endPoint.Y - h / 2);
    }
}

// It contains associations between HTMLElement id and shapes
class Shapes {
    private _shapes = {};

    addShape(id: string, cls: typeof Shape) {
        this._shapes[id] = cls;
    }

    getShape(id: string): typeof Shape {
        return this._shapes[id];
    }
}

class ShapeDrawer {
    public EXTENSION_NAME: string = "com.paintjs.ShapeDrawer";
    paint: Paint.Global;

    private _startPt: Paint.Point = null;
    private _layer: Paint.PaperLayer;
    private _oldCursor = "";

    private _shapes: Shapes;
    private _currentShape: typeof Shape;

    private toolbarGroup: Paint.BarGroup;

    public constructor(paint: Paint.Global) {
        this.paint = paint;
        this._shapes = new Shapes();
    }

    init() {
        this.paint.registerTool(this);
        this.toolbarGroup = this.paint.barManager.addGroup('tabTools', 'Shapes');
        // Add Rectangle shape
        if (!this.toolbarGroup)
            return;

        this._shapes.addShape(
            this.toolbarGroup.addTool(__dirname + "/icons/rectangle.png", Rectangle.name, this),
            Rectangle
            );

        // Add Line shape
        this._shapes.addShape(
            this.toolbarGroup.addTool(__dirname + "/icons/line.png", Line.name, this),
            Line
            );

        this._shapes.addShape(
            this.toolbarGroup.addTool(__dirname + "/icons/ellipse.png", Ellipse.name, this),
            Ellipse
            );
    }

    activated(id: string) {
        this.paint.currentPaper.setCursorFromURL("cursors/cross.cur");
        this._currentShape = this._shapes.getShape(id);
    }

    deactivated() {
        this.paint.currentPaper.restoreCursor();
        this._currentShape = null;
    }

    onStartDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._startPt = point;

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;

        this.onDraw(this.paint.currentPaper, point);
    }

    onDraw(paper: Paint.Paper, point: Paint.Point) {
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();

        // Call drawing function of the selected shape
        this._currentShape.Draw(context, this._startPt, point);

        context.stroke();
        context.closePath();
    }

    onStopDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);
    }
}

exports.Extensions = new Array();
exports.Extensions.push(ShapeDrawer);