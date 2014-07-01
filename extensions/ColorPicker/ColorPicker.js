var ColorPicker = (function () {
    function ColorPicker(paint) {
        this.EXTENSION_NAME = "com.paintjs.ColorPicker";
        this.paint = paint;
    }
    ColorPicker.prototype.init = function () {
        this.paint.registerTool(this);
        this.paint.barManager.addToolbarToolItem(__dirname + "/icon.png", "Color Picker", this);
    };

    ColorPicker.prototype.activated = function (id) {
        this.paint.currentPaper.setCursorFromURL("cursors/picker.cur");
    };

    ColorPicker.prototype.deactivated = function () {
        this.paint.currentPaper.restoreCursor();
    };

    ColorPicker.prototype.onPaperClick = function (pt) {
        var layers = this.paint.currentPaper.layers;

        if (layers.length <= 0)
            return;

        for (var i = layers.length - 1; i >= 0; i--) {
            var result = this.tryFindColor(layers[i], pt);

            if (result !== null) {
                this.paint.primaryColor = result;
                return;
            }
        }

        this.paint.primaryColor = window.Paint.Color.White;
    };

    ColorPicker.prototype.tryFindColor = function (layer, pt) {
        var col = layer.getCanvasMatrix().colorMatrix.getValue(pt.X, pt.Y);

        if (!col.equals(window.Paint.Color.White))
            return col;

        return null;
    };
    return ColorPicker;
})();

exports.Extensions = new Array();
exports.Extensions.push(ColorPicker);
