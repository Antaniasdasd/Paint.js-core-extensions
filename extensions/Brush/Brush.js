var Brush = (function () {
    function Brush(paint) {
        this.EXTENSION_NAME = "com.paintjs.Brush";
        this._lastPt = null;
        this.paint = paint;

        this.brush = paint.document.createElement('img');
        this.brush.src = __dirname + "/brush21.png";
        this.brush.width = 1;
        this.brush.height = 1;
    }
    Brush.prototype.init = function () {
        this.paint.registerExtension(this);
        this.paint.registerTool(this);
        this.paint.barManager.addToolbarToolItem(__dirname + "/icon.png", "Brush", this);
    };

    Brush.prototype.onStartDrawing = function (paper, point) {
        this._lastPt = point;

        this.coloredBrush = this.getColoredBrush(this.paint.primaryColor);

        this.onDraw(paper, point);
    };

    Brush.prototype.onStopDrawing = function (paper, point) {
        this._lastPt = null;
    };

    Brush.prototype.getColoredBrush = function (color) {
        var $ = this.paint.$;

        this.brush.removeAttribute('width');
        this.brush.removeAttribute('height');

        var newCanvas = $('<canvas />')[0];
        newCanvas.width = this.brush.width;
        newCanvas.height = this.brush.height;

        var ctx = newCanvas.getContext('2d');
        ctx.drawImage(this.brush, 0, 0);

        this.brush.width = 1;
        this.brush.height = 1;

        var img = ctx.getImageData(0, 0, newCanvas.width, newCanvas.height);
        var len = img.data.length;

        for (var i = 0; i < len; i += 4) {
            if (img.data[i + 3] > 0) {
                img.data[i] = (255 - img.data[i]) / 255 * color.R;
                img.data[i + 1] = (255 - img.data[i + 1]) / 255 * color.G;
                img.data[i + 2] = (255 - img.data[i + 2]) / 255 * color.B;
            }
        }

        ctx.putImageData(img, 0, 0);

        var image = this.paint.document.createElement('img');
        image.src = newCanvas.toDataURL();
        image.width = 1;
        image.height = 1;

        return image;
    };

    Brush.prototype.onDraw = function (paper, point) {
        var context = paper.baseLayer.getContext();

        if (this._lastPt === null || this._lastPt.equals(point))
            return;

        var distance = this._lastPt.distanceFrom(point), angle = this._lastPt.angleFrom(point);

        var sinAngle = (point.X - this._lastPt.X) / distance, cosAngle = (point.Y - this._lastPt.Y) / distance;

        var x = this._lastPt.X - this.brush.width * this.paint.toolSize / 2;
        var y = this._lastPt.Y - this.brush.height * this.paint.toolSize / 2;

        this._lastPt = point;

        for (var z = 0; (z <= distance || z === 0); z++, x += sinAngle, y += cosAngle) {
            context.drawImage(this.coloredBrush, x, y, this.brush.width * this.paint.toolSize, this.brush.height * this.paint.toolSize);
        }
    };
    return Brush;
})();

exports.Extensions = new Array();
exports.Extensions.push(Brush);
