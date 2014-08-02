/// <reference path="../../common-headers/paintjs.d.ts" />

class Pen
{
    public EXTENSION_NAME : string = "com.paintjs.Pen";
    paint: Paint.Global;
    
    private _layer: Paint.PaperLayer;
    private _points: Paint.Point[] = [];
    
    public constructor(paint: Paint.Global) {
        this.paint = paint;
    }
    
    init() {
        this.paint.barManager.addToolbarToolItem(null, "Pen", this);
        this.paint.registerTool(this);
    }

    activated(id:string) {
        this.paint.currentPaper.setCursorFromURL("cursors/brush.cur");
    }
    
    deactivated() {
        this.paint.currentPaper.restoreCursor();
    }
    
    onStartDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._points = [];
        
        this._layer = paper.addLayer(null);
        var context = this._layer.getContext();
        
        context.lineWidth = this.paint.toolSize;
        context.strokeStyle = this.paint.primaryColor.HexString;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        this.onDraw(paper, point);
    }
    
    onDraw(paper: Paint.Paper, point: Paint.Point) {     
        var context = this._layer.getContext();
        var canvas = this._layer.canvas;
        
        this._points.push(point);
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        
        var len = this._points.length;
        
        if(len == 1) {
            // FIXME Draw a dot 
            
        } else if(len == 2) {
            context.moveTo(this._points[0].X, this._points[0].Y);
            context.lineTo(point.X, point.Y);
            
        } else {
           
            // move to the first point
            context.moveTo(this._points[0].X, this._points[0].Y);
            
            for (var i = 1; i < len - 2; i++) {
                var xc = (this._points[i].X + this._points[i + 1].X) / 2;
                var yc = (this._points[i].Y + this._points[i + 1].Y) / 2;
                context.quadraticCurveTo(this._points[i].X, this._points[i].Y, xc, yc);
            }
            
            // curve through the last two points
            context.quadraticCurveTo(this._points[i].X, this._points[i].Y, this._points[i+1].X,this._points[i+1].Y);
            
        }
        
        context.stroke();
        context.closePath();
    }
    
    onStopDrawing(paper: Paint.Paper, point: Paint.Point) {
        this._layer.copyTo(paper.baseLayer);
        paper.removeLayer(this._layer);
        
        this._points = [];
    }
}

exports.Extensions = new Array();
exports.Extensions.push(Pen);