var Selection = (function () {
    function Selectiona(paint) {
        this.EXTENSION_NAME = "com.paintjs.Selection";
        this.point1 = null;
        this.paint = paint;
    }
    Selectiona.prototype.init = function () {
        this.paint.registerTool(this);
        this.paint.barManager.addToolbarToolItem("extensions/Selection/icon.png", "Select", this);
    };

    Selectiona.prototype.onStartDrawing = function (paper, point) {
        this.point1 = point;

        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        context.lineWidth = 1;
        context.setLineDash([4]);
        context.strokeStyle = "#3399FF";
    };

    Selectiona.prototype.onDraw = function (paper, point) {
        var canvas = this._layer.canvas;
        var context = this._layer.getContext();
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.rect(Math.min(this.point1.X, point.X) - 0.5, Math.min(this.point1.Y, point.Y) - 0.5, Math.abs(this.point1.X - point.X), Math.abs(this.point1.Y - point.Y));
        context.stroke();
        context.closePath();
    };

    Selectiona.prototype.onStopDrawing = function (paper, point) {
        paper.removeLayer(this._layer);
    };
    return Selectiona;
})();

exports.Extensions = [Selection];
