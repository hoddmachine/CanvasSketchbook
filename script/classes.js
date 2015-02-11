function Element(type,x,y,xFin,yFin,w,h,color,stroke) {
    this.type = type || undefined;
    this.x = x || 0;
    this.y = y || 0;
    this.xFin = xFin || 1;
    this.yFin = yFin || 1;
    this.w = w || 1;
    this.h = h || 1;
    this.color = color || '#444';
    this.stroke = stroke || 0;
    this.moveOffsetX = 0;
    this.moveOffsetY = 0;
    this.fontSize = 0;
}

Element.prototype.record = function(x,y,start) {
    if(start) {
		this.x = x;
        this.y = y;
	}
    else {
		this.xFin = x;
        this.yFin = y;
        this.w = this.xFin - this.x;
        this.h = this.yFin - this.y;
	}
};


Element.prototype.draw = function(ctx) {
    switch(this.type) {
      case 'rect':
        ctx.beginPath();
        ctx.rect(this.x,this.y, this.w, this.h);
        break;
      case 'circle':
        var radius = this.w;
        if(radius < 0) {radius *= -1;}
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.xFin, this.yFin);
        break;
      case 'pencil':
        ctx.beginPath();
        for(var i = 0; i < this.xPoints.length; ++i) {
            if(i === 0) {
                ctx.moveTo(this.xPoints[i], this.yPoints[i]);
            }
            else {
                ctx.lineTo(this.xPoints[i], this.yPoints[i]);
            }
        }
        break;
    }
    if (this.stroke > 0) {
        ctx.lineWidth = this.stroke;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    } else {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

Element.prototype.serach = function(x,y) {
    return (this.x <= x && this.yFin >= y && this.y <= y && this.xFin >= x);
};

Element.prototype.setOffset = function(x,y) {
    this.moveOffsetX = x - this.x;
    this.moveOffsetY = y - this.y;
};

Element.prototype.move = function(x,y) {
    this.x = x - this.moveOffsetX;
    this.y = y - this.moveOffsetY;
    this.xFin = this.x + this.w;
    this.yFin = this.y + this.h;
};

function Circle() {
    this.type = 'circle';
}

Circle.prototype = new Element();

Circle.prototype.serach = function(x,y) {
    return (Math.pow(x-this.x,2) + Math.pow(y-this.y,2) < Math.pow(this.w,2));
};

function Rect() {
    this.type = 'rect';
}

Rect.prototype = new Element();

function Line() {
    this.type = 'line';
}

Line.prototype = new Element();

function Pencil() {
    this.type = 'pencil';
	this.xPoints = [];
    this.yPoints = [];
}

Pencil.prototype = new Element();

Pencil.prototype.record = function(x,y) {
	this.xPoints.push(x);
	this.yPoints.push(y);
};

Pencil.prototype.serach = function(x,y) {
    for(var i = 0; i < this.xPoints.length; ++i) {
        if (Math.pow(x-this.xPoints[i],2) + Math.pow(y-this.yPoints[i],2) < Math.pow((this.stroke*2),2)) {
            return true;
        }
    }
};

Pencil.prototype.setOffset = function(x,y) {
    this.moveOffsetX = x;
    this.moveOffsetY = y;
};

Pencil.prototype.move = function(x,y) {
    for(var i = 0; i < this.xPoints.length; ++i) {
        this.xPoints[i] = this.xPoints[i] + (x - this.moveOffsetX);
        this.yPoints[i] = this.yPoints[i] + (y - this.moveOffsetY);
    }
    this.moveOffsetX = x;
    this.moveOffsetY = y;
    this.xFin = this.xPoints[this.xPoints.length - 1];
    this.yFin = this.yPoints[this.yPoints.length - 1];
};

function Text() {
    this.type = 'text';
    this.textValue = '';
    this.xTop = 0;
    this.yTop = 0;
    this.fontSize = 40;
    this.fontString = this.fontSize + "px " + "Arial";
}

Text.prototype = new Element();

Text.prototype.record = function(x,y) {
    this.x = x;
    this.y = y;
    this.w = this.fontSize * 10;
    this.h = this.fontSize;
    this.xFin = x + this.w;
    this.yFin = y - this.h;
};

Text.prototype.draw = function(ctx) {
    var temp = this.textValue;
    ctx.font = this.fontString;
    ctx.fillStyle = this.color;
    ctx.fillText(temp, this.x, this.y);
};

Text.prototype.serach = function(x,y) {
    return (this.x <= x && this.yFin <= y && this.y >= y && this.xFin >= x);
};

Text.prototype.move = function(x,y) {
    this.x = x - this.moveOffsetX;
    this.y = y - this.moveOffsetY;
    this.xFin = this.x + this.w;
    this.yFin = this.y - this.h;
};
