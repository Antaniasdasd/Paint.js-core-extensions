class Fill {
    public EXTENSION_NAME: string = "com.paintjs.Fill";
    paint: Paint.Global;

    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }

    init() {
        this.paint.barManager.addToolbarToolItem(__dirname + "/icon.png", "Fill", this);
        this.paint.registerTool(this);
    }

    activated(id: string) {
        this.paint.currentPaper.setCursorFromURL("cursors/fill.cur");
    }

    deactivated() {
        this.paint.currentPaper.restoreCursor();
    }

    onStartDrawing(paper: Paint.Paper, point: Paint.Point) {
        var matrix = paper.baseLayer.getCanvasMatrix();
        var colorMatrix = matrix.colorMatrix;

        var newColor = this.paint.primaryColor;
        var replacedColor = colorMatrix.getValue(point.X, point.Y);

        // For each pixel, we update its color only if its current color matches
        // the color we're replacing, then we recursively do the same thing on the
        // neighbors.
        var stack = [point.X, point.Y];

        while (stack.length > 0) {
            var y = stack.pop();
            var x = stack.pop();

            var curColor = colorMatrix.getValue(x, y);
            if (curColor.equals(replacedColor) && !curColor.equals(newColor)) {
                colorMatrix.setValue(x, y, newColor);

                if (x + 1 < colorMatrix.width) stack.push(x + 1, y);
                if (y + 1 < colorMatrix.height) stack.push(x, y + 1);
                if (x > 0) stack.push(x - 1, y);
                if (y > 0) stack.push(x, y - 1);
            }
        }

        matrix.apply(paper.baseLayer.getContext());
    }

}

exports.Extensions = new Array();
exports.Extensions.push(Fill);