var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Shape = (function () {
    function Shape() {
    }
    Shape.Draw = function (ctx, startPoint, endPoint) {
    };
    Shape.name = "";
    return Shape;
})();

var Line = (function (_super) {
    __extends(Line, _super);
    function Line() {
        _super.apply(this, arguments);
    }
    Line.Draw = function (ctx, startPoint, endPoint) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(startPoint.X - 0.5, startPoint.Y - 0.5);
        ctx.lineTo(endPoint.X - 0.5, endPoint.Y - 0.5);
    };
    Line.name = "Line";
    return Line;
})(Shape);

var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle() {
        _super.apply(this, arguments);
    }
    Rectangle.Draw = function (ctx, startPoint, endPoint) {
        ctx.moveTo(startPoint.X, startPoint.Y);

        var w = endPoint.X - startPoint.X, h = endPoint.Y - startPoint.Y;

        ctx.rect(startPoint.X - 0.5, startPoint.Y - 0.5, w, h);
    };
    Rectangle.name = "Rectangle";
    return Rectangle;
})(Shape);

var Ellipse = (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse() {
        _super.apply(this, arguments);
    }
    Ellipse.Draw = function (ctx, startPoint, endPoint) {
        var w = endPoint.X - startPoint.X, h = endPoint.Y - startPoint.Y;

        ctx.moveTo(startPoint.X, startPoint.Y + h / 2);

        ctx.bezierCurveTo(startPoint.X, startPoint.Y, endPoint.X, startPoint.Y, endPoint.X, endPoint.Y - h / 2);
        ctx.moveTo(endPoint.X, endPoint.Y - h / 2);
        ctx.bezierCurveTo(endPoint.X, endPoint.Y, startPoint.X, endPoint.Y, startPoint.X, endPoint.Y - h / 2);
    };
    Ellipse.name = "Ellipse";
    return Ellipse;
})(Shape);

var Shapes = (function () {
    function Shapes() {
        this._shapes = {};
    }
    Shapes.prototype.addShape = function (id, cls) {
        this._shapes[id] = cls;
    };

    Shapes.prototype.getShape = function (id) {
        return this._shapes[id];
    };
    return Shapes;
})();

var ShapeDrawer = (function () {
    function ShapeDrawer(paint) {
        this.EXTENSION_NAME = "com.paintjs.ShapeDrawer";
        this._startPt = null;
        this._oldCursor = "";
        this.paint = paint;
        this._shapes = new Shapes();
    }
    ShapeDrawer.prototype.init = function () {
        this.paint.registerTool(this);
        this.ToolBarGroup = this.paint.barManager.addGroup('tabTools', 'Shapes');

        this._shapes.addShape(this.paint.barManager.addToolbarItem("extensions/ShapeDrawer/icons/rectangle.png", this.ToolBarGroup, Rectangle.name, this), Rectangle);

        this._shapes.addShape(this.paint.barManager.addToolbarItem("extensions/ShapeDrawer/icons/line.png", this.ToolBarGroup, Line.name, this), Line);

        this._shapes.addShape(this.paint.barManager.addToolbarItem("extensions/ShapeDrawer/icons/ellipse.png", this.ToolBarGroup, Ellipse.name, this), Ellipse);
    };

    ShapeDrawer.prototype.activated = function (id) {
        this.paint.currentPaper.setCursorFromURL("cursors/cross.cur");
        this._currentShape = this._shapes.getShape(id);
    };

    ShapeDrawer.prototype.deactivated = function () {
        this.paint.currentPaper.restoreCursor();
        this._currentShape = null;
    };

    ShapeDrawer.prototype.onStartDrawing = function (paper, point) {
        this._startPt = point;

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;

        this.onDraw(this.paint.currentPaper, point);
    };

    ShapeDrawer.prototype.onDraw = function (paper, point) {
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();

        this._currentShape.Draw(context, this._startPt, point);

        context.stroke();
        context.closePath();
    };

    ShapeDrawer.prototype.onStopDrawing = function (paper, point) {
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);
    };
    return ShapeDrawer;
})();

exports.Extensions = new Array();
exports.Extensions.push(ShapeDrawer);
