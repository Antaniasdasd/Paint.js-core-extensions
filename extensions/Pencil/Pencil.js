var Pencil = (function () {
    function Pencil(paint) {
        this.EXTENSION_NAME = "com.paintjs.Pencil";
        this._lastPt = null;
        this.paint = paint;
    }
    Pencil.prototype.init = function () {
        this.paint.barManager.addToolbarToolItem("extensions/Pencil/icon.png", "Pencil", this);
        this.paint.registerTool(this);
    };

    Pencil.prototype.activated = function (id) {
        this.paint.currentPaper.setCursorFromURL("cursors/pencil.cur");
    };

    Pencil.prototype.deactivated = function () {
        this.paint.currentPaper.restoreCursor();
    };

    Pencil.prototype.onStartDrawing = function (paper, point) {
        this._lastPt = point;
        this.onDraw(paper, point);
    };

    Pencil.prototype.onDraw = function (paper, point) {
        var matrix = paper.baseLayer.getCanvasMatrix();

        Paint.PaperLayer.drawAliasedLine(this._lastPt.X, this._lastPt.Y, point.X, point.Y, this.paint.toolSize, this.paint.primaryColor, matrix.colorMatrix);

        matrix.apply(paper.baseLayer.getContext());

        this._lastPt = point;
    };
    return Pencil;
})();

exports.Extensions = new Array();
exports.Extensions.push(Pencil);
