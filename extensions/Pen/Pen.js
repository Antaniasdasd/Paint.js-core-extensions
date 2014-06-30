var Pen = (function () {
    function Pen(paint) {
        this.EXTENSION_NAME = "com.paintjs.Pen";
        this._points = [];
        this.paint = paint;
    }
    Pen.prototype.init = function () {
        this.paint.barManager.addToolbarToolItem(null, "Pen", this);
        this.paint.registerTool(this);
    };

    Pen.prototype.activated = function (id) {
        this.paint.currentPaper.setCursorFromURL("cursors/brush.cur");
    };

    Pen.prototype.deactivated = function () {
        this.paint.currentPaper.restoreCursor();
    };

    Pen.prototype.onStartDrawing = function (paper, point) {
        this._points = [];

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();

        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        this.onDraw(paper, point);
    };

    Pen.prototype.onDraw = function (paper, point) {
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;

        this._points.push(point);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();

        var len = this._points.length;

        if (len == 1) {
        } else if (len == 2) {
            context.moveTo(this._points[0].X, this._points[0].Y);
            context.lineTo(point.X, point.Y);
        } else {
            context.moveTo(this._points[0].X, this._points[0].Y);

            for (var i = 1; i < len - 2; i++) {
                var xc = (this._points[i].X + this._points[i + 1].X) / 2;
                var yc = (this._points[i].Y + this._points[i + 1].Y) / 2;
                context.quadraticCurveTo(this._points[i].X, this._points[i].Y, xc, yc);
            }

            context.quadraticCurveTo(this._points[i].X, this._points[i].Y, this._points[i + 1].X, this._points[i + 1].Y);
        }

        context.stroke();
        context.closePath();
    };

    Pen.prototype.onStopDrawing = function (paper, point) {
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);

        this._points = [];
    };
    return Pen;
})();

exports.Extensions = new Array();
exports.Extensions.push(Pen);
