var SizeChooser = (function () {
    function SizeChooser(paint) {
        this.EXTENSION_NAME = "com.paintjs.SizeChooser";
        this.paint = paint;
    }
    SizeChooser.prototype.init = function () {
        var paint = this.paint;
        var $ = this.paint.$;

        $("#miscToolbar").append('Size: 1 <input type="range" id="toolSize" value="3" min="1" max="20" /> 20');

        var inputNode = this.inputNode = $('#toolSize')[0];

        $(this.inputNode).on("change", function (ev) {
            var size = parseInt(paint.$(inputNode).val());
            paint.toolSize = size;
        }).change();
    };

    SizeChooser.prototype.onToolSizeChanged = function () {
        var size = this.paint.toolSize;

        this.paint.$(this.inputNode).val(size.toString());
    };
    return SizeChooser;
})();

exports.Extensions = new Array();
exports.Extensions.push(SizeChooser);
