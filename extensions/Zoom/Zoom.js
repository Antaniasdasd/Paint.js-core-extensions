var Zoom = (function () {
    function Zoom(paint) {
        this.EXTENSION_NAME = "com.paintjs.Zoom";
        this.paint = paint;
    }
    Zoom.prototype.init = function () {
        var paint = this.paint;
        var $ = this.paint.$;

        var indicator = $('<div />').append('\
            <span id="ext-zoom-val" style="width: 40px; display: inline-block;"></span>\
            <input type="range" id="ext-zoom" value="100" min="10" max="400" step="10" style="vertical-align: middle;" />\
        ');

        this.paint.barManager.addCustomIndicatorItem(indicator[0], 0, true);

        var inputNode = this.inputNode = $('#ext-zoom')[0];

        $(this.inputNode).on("change", function (ev) {
            var zoom = parseInt($(inputNode).val());
            paint.currentPaper.Zoom = zoom / 100;
        }).change();
    };

    Zoom.prototype.onZoom = function () {
        var zoom = this.paint.currentPaper.Zoom;

        this.paint.$('#ext-zoom').val((zoom * 100).toString());
        this.paint.$('#ext-zoom-val').text(Math.round(zoom * 100).toString() + '%');
    };
    return Zoom;
})();

exports.Extensions = new Array();
exports.Extensions.push(Zoom);
