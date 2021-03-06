/// <reference path="../../common-headers/paintjs.d.ts" />

class SizeChooser
{
    public EXTENSION_NAME : string = "com.paintjs.SizeChooser";
    paint: Paint.Global;
    toolbarGroup: Paint.BarGroup;

    private inputNode : HTMLInputElement;
    
    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }
    
    init() {
        var paint = this.paint;
        var $ = this.paint.$;

        this.toolbarGroup = this.paint.barManager.addGroup('tabTools', 'Size');
        this.toolbarGroup.addCustom('Size: 1 <input type = "range" id = "toolSize" value = "3" min = "1" max ="20" /> 20');
        //$("#miscToolbar").append('Size: 1 <input type="range" id="toolSize" value="3" min="1" max="20" /> 20');
        
        var inputNode = this.inputNode = <HTMLInputElement> $('#toolSize')[0];
        
        $(this.inputNode).on("change", function(ev){
            var size = parseInt(paint.$(inputNode).val());
            paint.toolSize = size; 
        }).change();
    }
    
    onToolSizeChanged() {
        var size = this.paint.toolSize;
        
        this.paint.$(this.inputNode).val(size.toString());
    }
}

exports.Extensions = new Array();
exports.Extensions.push(SizeChooser);