var CursorPosition = (function () {
    function CursorPosition(paint) {
        this.EXTENSION_NAME = "com.paintjs.CursorPosition";
        this.paint = paint;
    }
    CursorPosition.prototype.init = function () {
        this.indicator = this.paint.barManager.addTextIndicatorItem(__dirname + "/CursorPosition.png", 0, false);
    };

    CursorPosition.prototype.onPaperMouseEnter = function (pt) {
        var $ = this.paint.$;

        $(this.indicator).show();
    };

    CursorPosition.prototype.onPaperMouseMove = function (pt) {
        var $ = this.paint.$;

        $(this.indicator).html(pt.X + ", " + pt.Y + "px");
    };

    CursorPosition.prototype.onPaperMouseLeave = function (pt) {
        var $ = this.paint.$;

        $(this.indicator).hide();
    };
    return CursorPosition;
})();

var PaperSize = (function () {
    function PaperSize(paint) {
        this.EXTENSION_NAME = "com.paintjs.PaperSize";
        this.paint = paint;
    }
    PaperSize.prototype.init = function () {
        this.indicator = this.paint.barManager.addTextIndicatorItem(__dirname + "/PaperSize.png", 0, false);
        this.onResize();
    };

    PaperSize.prototype.onResize = function () {
        var $ = this.paint.$;
        var baseCanvas = this.paint.currentPaper.baseLayer.canvas;
        $(this.indicator).html(baseCanvas.width + " &times; " + baseCanvas.height + "px");
    };
    return PaperSize;
})();

exports.Extensions = new Array();
exports.Extensions.push(CursorPosition);
exports.Extensions.push(PaperSize);
