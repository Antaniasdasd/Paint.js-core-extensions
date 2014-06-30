var fs = require('fs');
var gui = global.window.nwDispatcher.requireNwGui();

var ImageSaver = (function () {
    function ImageSaver(paint) {
        this.EXTENSION_NAME = "com.paintjs.ImageSaver";
        this.paint = paint;
    }
    ImageSaver.prototype.init = function () {
        var paint = this.paint, $ = this.paint.$, _this = this;

        this.saveFileDialog = $('<input id="saveAs" type="file" nwsaveas accept=".png" />')[0];

        var mnuSave = new gui.MenuItem({ label: 'Save' });

        mnuSave.click = function () {
            _this.chooseFile(_this.saveFileDialog, function (filename) {
                if (filename !== "" && filename !== null) {
                    var image = paint.currentPaper.getCanvas().toDataURL();
                    image = image.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(filename, image, "base64", function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        };

        this.paint.menu.File.submenu.append(mnuSave);
        this.paint.refreshMenu();
    };

    ImageSaver.prototype.chooseFile = function (dialog, callback) {
        var paint = this.paint, $ = this.paint.$;

        var fl = new paint.FileList();
        fl.append(new paint.File('', ''));
        fl.append(new paint.File('', 'no_file_selected_...\|/*?'));
        dialog.files = fl;

        var chooser = $(dialog);

        var change = function (evt) {
            $(this).off("change", change);
            callback($(this).val());
        };

        chooser.on("change", change);
        chooser.trigger('click');
    };
    return ImageSaver;
})();

exports.Extensions = new Array();
exports.Extensions.push(ImageSaver);
