var Eraser = (function () {
    function Eraser(paint) {
        this.EXTENSION_NAME = "com.paintjs.Eraser";
        this._points = [];
        this.paint = paint;
    }
    Eraser.prototype.init = function () {
        this.paint.registerTool(this);
        this.paint.barManager.addToolbarToolItem("extensions/Eraser/icon.png", "Eraser", this);
    };

    Eraser.prototype.activated = function (id) {
        this.onToolSizeChanged();
    };

    Eraser.prototype.deactivated = function () {
        this.paint.currentPaper.restoreCursor();
    };

    Eraser.prototype.onToolSizeChanged = function () {
        if (this.paint.currentTool === this) {
            var size = this.paint.toolSize;

            var cur = this.getCursorForSize(size);
            this.paint.currentPaper.setCursorFromURL(cur, size / 2, size / 2);
        }
    };

    Eraser.prototype.getCursorForSize = function (size) {
        var $ = this.paint.$;

        var newCanvas = $('<canvas />');
        newCanvas.css('position', 'absolute');
        newCanvas.css('top', 0);
        newCanvas.css('left', 0);
        newCanvas.attr("width", size);
        newCanvas.attr("height", size);

        var el = newCanvas[0];
        var ctx = el.getContext('2d');

        ctx.fillStyle = Paint.Color.White.HexString;
        ctx.fillRect(0, 0, size, size);

        var mat = new Paint.CanvasMatrix(ctx.getImageData(0, 0, size, size));

        Paint.PaperLayer.drawAliasedLine(0, 0, size - 1, 0, 1, Paint.Color.Black, mat.colorMatrix);
        Paint.PaperLayer.drawAliasedLine(0, 0, 0, size - 1, 1, Paint.Color.Black, mat.colorMatrix);
        Paint.PaperLayer.drawAliasedLine(size - 1, 0, size - 1, size - 1, 1, Paint.Color.Black, mat.colorMatrix);
        Paint.PaperLayer.drawAliasedLine(0, size - 1, size - 1, size - 1, 1, Paint.Color.Black, mat.colorMatrix);

        mat.apply(ctx);

        return el.toDataURL();
    };

    Eraser.prototype.onStartDrawing = function (paper, point) {
        this._points = [];

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();

        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.secondaryColor.HexString;
        context.lineCap = 'square';
        context.lineJoin = 'round';

        this.onDraw(paper, point);
    };

    Eraser.prototype.onDraw = function (paper, point) {
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;

        this._points.push(point);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();

        var len = this._points.length;

        if (len === 1) {
        } else if (len === 2) {
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

    Eraser.prototype.onStopDrawing = function (paper, point) {
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);

        this._points = [];
    };
    return Eraser;
})();

exports.Extensions = new Array();
exports.Extensions.push(Eraser);
