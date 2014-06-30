var ColorChooser = (function () {
    function ColorChooser(paint) {
        this.EXTENSION_NAME = "com.paintjs.ColorChooser";
        this.paint = paint;
    }
    ColorChooser.prototype.init = function () {
        var paint = this.paint;
        var $ = this.paint.$;

        $("#miscToolbar").append('<div>\
                Primary color: <input type="color" id="toolColor1" value="#000000" />\
                Secondary color: <input type="color" id="toolColor2" value="#ffffff" />\
           </div>');

        this.inputPrimaryColor = $("#toolColor1")[0];
        this.inputSecondaryColor = $("#toolColor2")[0];

        $(this.inputPrimaryColor).on("change", $.proxy(this.setPrimaryColor, this)).change();
        $(this.inputSecondaryColor).on("change", $.proxy(this.setSecondaryColor, this)).change();
    };

    ColorChooser.prototype.onPrimaryColorChanged = function () {
        var $ = this.paint.$, newColor = this.paint.primaryColor;

        $("#toolColor1").val(newColor.HexString);
    };

    ColorChooser.prototype.onSecondaryColorChanged = function () {
        var $ = this.paint.$, newColor = this.paint.secondaryColor;

        $("#toolColor2").val(newColor.HexString);
    };

    ColorChooser.prototype.setPrimaryColor = function (ev) {
        this.paint.primaryColor = new window.Paint.Color(this.paint.$(this.inputPrimaryColor).val());
    };

    ColorChooser.prototype.setSecondaryColor = function (ev) {
        this.paint.secondaryColor = new window.Paint.Color(this.paint.$(this.inputSecondaryColor).val());
    };
    return ColorChooser;
})();

exports.Extensions = new Array();
exports.Extensions.push(ColorChooser);
