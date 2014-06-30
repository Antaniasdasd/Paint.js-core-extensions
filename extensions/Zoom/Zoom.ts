class Zoom
{
    public EXTENSION_NAME : string = "com.paintjs.Zoom";
    paint: Paint.Global;
    
    private inputNode : HTMLInputElement;
    
    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;
        
        // FIXME Spostare gli stili in CSS esterni. Bisogna prima decidere che struttura dare alle estensioni.
        var indicator = $('<div />').append('\
            <span id="ext-zoom-val" style="width: 40px; display: inline-block;"></span>\
            <input type="range" id="ext-zoom" value="100" min="10" max="400" step="10" style="vertical-align: middle;" />\
        ');
        
        this.paint.barManager.addCustomIndicatorItem(indicator[0], 0, true);
        
        var inputNode = this.inputNode = <HTMLInputElement> $('#ext-zoom')[0];
        
        $(this.inputNode).on("change", function(ev){
            var zoom = parseInt($(inputNode).val());
            paint.currentPaper.Zoom = zoom / 100;
        }).change();
    }
    
    onZoom() {
        var zoom = this.paint.currentPaper.Zoom;

        this.paint.$('#ext-zoom').val((zoom * 100).toString());
        this.paint.$('#ext-zoom-val').text(Math.round(zoom * 100).toString() + '%');
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Zoom);