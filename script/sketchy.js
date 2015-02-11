
$(function() {
	var canvas = document.getElementById("sketchy");
	var ctx = canvas.getContext("2d");
	
    var elements = [];	
    var redo = [];
    var undoClearAll = [];
	var toolSelected = 'pencil'; //Default is Pencil
    var currentColor = '#000000';
    var currentStroke = 4; //Default is 4
    var currentText = '';
    var currentFontSize = 30;
    var userActive = false; //Canvas gets redrawn upon mosemove in down pos
	var elementDrawing; //Current element beeing drawn
    var elementMoving = false;
    var mI = 0; //Index of current object beeing moved

	function newElement() {
        switch(toolSelected) {
            case 'pencil':
                var element = new Pencil();
                element.color = currentColor;
                element.stroke = currentStroke;
                return element;
            case 'rect':
                var element = new Rect();
                element.color = currentColor;
                element.stroke = currentStroke;
                return element;
            case 'circle':
                var element = new Circle();
                element.color = currentColor;
                element.stroke = currentStroke;
                return element;
            case 'line':
                var element = new Line();
                element.color = currentColor;
                element.stroke = currentStroke;
                return element;
            case 'text':
                var element = new Text();
                element.color = currentColor;
                element.textValue = currentText;
                element.fontSize = currentFontSize;
                return element;
        }
	}
    
	$("#style_fill").on("click", function() {
        currentStroke = 0;
	});

	canvas.onmousedown = function(e) {
        console.log("Mouse down!");
		var x = e.clientX - this.offsetLeft;
		var y = e.clientY - this.offsetTop;
        userActive = true;
        if(toolSelected !== 'mover') {
            elementDrawing = newElement();
            elementDrawing.record(x,y,true); //True - Passing the first cords
            elementDrawing.fontSize = currentFontSize;
            elementDrawing.draw(ctx);
            if (toolSelected === 'text') {
                elements.push(elementDrawing);
            }
        } else {
            for(var i = 0; i < elements.length; ++i) {
                var found = elements[i].serach(x,y);
                if(found) {
                    elements[i].setOffset(x,y);
                    elementMoving = true;
                    console.log("element found!");
                    mI = i;
                    break;
                }
            }
        }
        clearall();
        drawElements();
	};
	
	canvas.onmousemove = function(e) {
		if(userActive) {
            var x = e.clientX - this.offsetLeft;
            var y = e.clientY - this.offsetTop;
            if(elementMoving) {
                elements[mI].move(x,y);
                clearall();
                drawElements();
            } else if (toolSelected !== 'mover') {
                elementDrawing.record(x,y,false);
                clearall();
                drawElements();
                elementDrawing.draw(ctx);                
            }
		}
	};
	
	canvas.onmouseup = function(e) {
		userActive = false;
        elementMoving = false;
        console.log("element moving set to false");
		if (toolSelected !== 'text' && toolSelected !== 'mover') {      
            elements.push(elementDrawing);
        }
	};
	
	function clearall() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
	}
	
	function drawElements() {
		for(var i = 0; i < elements.length; ++i) {
			elements[i].draw(ctx);
		}
	}
	
	$("#action_undo").on("click", function(e) {
		var indexOfMostRecent = elements.length - 1;
        if (indexOfMostRecent >= 0) {
            redo.push(elements[indexOfMostRecent]);
            elements.pop();
            clearall();
            drawElements();
        }
        if (undoClearAll.length > 0) {
            elements = undoClearAll;
            drawElements();
        }
	});
	$(document).keydown(function(e){
		if( e.which === 90 && e.ctrlKey){
                var indexOfMostRecent = elements.length - 1;
        if (indexOfMostRecent >= 0) {
            redo.push(elements[indexOfMostRecent]);
            elements.pop();
            clearall();
            drawElements();
        }
        if (undoClearAll.length > 0) {
            elements = undoClearAll;
            drawElements();
        }
		}
	}); 	
	$("#action_redo").on("click", function(e) {
        var indexOfMostRecent = redo.length - 1;
            if (indexOfMostRecent >= 0) {
            elements.push(redo[indexOfMostRecent]);
            redo.pop();
            clearall();
            drawElements();
        }
	});
	
	$("#action_clearall").on("click", function(e) {
		clearall();
        undoClearAll = elements;
        elements = [];
	});
	
    // Tool Selector handlers
	$("#tool_rect").on("click", function() {
		toolSelected = 'rect';
	});
	$("#tool_circle").on("click", function() {
		toolSelected = 'circle';
	});
	$("#tool_line").on("click", function() {
		toolSelected = 'line';
        currentStroke = 8;
	});
	$("#tool_pencil").on("click", function() {
		toolSelected = 'pencil';
        currentStroke = 8;
	});
    $("#tool_text").on("click", function() {
		toolSelected = 'text';
	});
    $("#tool_mover").on("click", function() {
		toolSelected = 'mover';
	});
    // Text handlers
    $("#tool_text_input").keyup(function(){
        currentText = $("#tool_text_input").val();
    });
    $('#style_fontSmall').on('click', function() {  
        currentFontSize = 10;
    });
    $('#style_fontMedium').on('click', function() {  
        currentFontSize = 30;  
    });
    $('#style_fontLarge').on('click', function() {  
        currentFontSize = 50;  
    }); 
    // Style Color handlers
    $('#color_white').on('click', function() {  
        currentColor = this.value;  
    });
    $('#color_black').on('click', function() {  
        currentColor = this.value;  
    }); 
    $('#color_red').on('click', function() {  
        currentColor = this.value;  
    }); 
    $('#color_green').on('click', function() {  
        currentColor = this.value;  
    }); 
    $('#color_blue').on('click', function() {  
        currentColor = this.value;  
    });     
    $('#color_yellow').on('click', function() {  
        currentColor = this.value;  
    }); 
    $('#color_pink').on('click', function() {  
        currentColor = this.value;  
    });
    $('#stroke_small').on('click', function() {  
        currentStroke = 4;  
    });
    $('#stroke_medium').on('click', function() {  
        currentStroke = 8;  
    });
    $('#stroke_big').on('click', function() {  
        currentStroke = 16;  
    });
});
