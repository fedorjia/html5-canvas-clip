(function($){
  var methods = {

    init: function(options) {
      return this.each(function(){
        var $this = $(this),
            data = $this.data('clip');
            
        var image_data = new Image();
        image_data.onload = function() { };
		image_data.src = options.src;
        
        if (!data) {

          var handleImage = function() {
            var width = $this.width(),
                height = $this.height(),
                pos = $this.offset(),
                $canvas = $('<canvas/>'),
                canvas = $canvas.get(0),
                zIndex = $this.css('z-index') == "auto"?1:$this.css('z-index'),
                ctx = canvas.getContext('2d'),
                that = $this[0];

            // replace target with canvas
            $this.after($canvas);
            canvas.id = that.id;
            canvas.className = that.className;
            canvas.width = width;
            canvas.height = height;
//            ctx.drawImage(that, 0, 0);
	        ctx.drawImage(that, 0, 0, that.width, that.height);
            
            $this.remove();
			
            // prepare context for drawing operations
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(255,0,0,255)';
            ctx.lineWidth = 4;

//            ctx.lineCap = 'round';

            // store values
            data = {
              posX: pos.left,
              posY: pos.top,
              canvas: $canvas,
              ctx: ctx,
              w: width,
              h: height,
              source: that,
              zIndex: zIndex,
              image: image_data
            };
            $canvas.data('clip', data);

            // listen for resize event to update offset values
            $(window).resize(function() {
              var pos = $canvas.offset();
              data.posX = pos.left;
              data.posY = pos.top;
            });
          };

          if (this.complete && this.naturalWidth > 0) {
            handleImage();
          } else {
            //this.onload = handleImage;
            $this.load(handleImage);
          }
        }
      });
    },
	
    drawImageScaled: function (img, ctx) {
    	
	},
	
	clear: function(ctx) {
		var $this = $(this),
            data = $this.data('clip');
        
        ctx.globalCompositeOperation = 'source-over';
		ctx.drawImage(data.image, 0, 0, data.w, data.h);
		ctx.globalCompositeOperation = 'destination-out';
	},
    
    reset: function() {
      var $this = $(this),
          data = $this.data('clip');

      if (data) {
        data.ctx.globalCompositeOperation = 'source-over';
        data.ctx.drawImage( data.source, 0, 0 );
        data.ctx.globalCompositeOperation = 'destination-out';
        var n = data.numParts;
        while (n--) data.parts[n] = 1;
        data.ratio = 0;
        data.complete = false;
        data.touchDown = false;
      }
    }
  };

  $.fn.clip = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not yet exist on jQuery.clip');
    }
  };
})(jQuery);