(function($) {
	"use strict";
	$.fn.dither = function() {
		var threshold_map = [];
		for (var p = 0; p < 64; ++p) {
			var q = p ^ (p >> 3);
			threshold_map[p] = (((p & 4) >> 2) | ((q & 4) >> 1) | ((p & 2) << 1) | ((q & 2) << 2) | ((p & 1) << 4) | ((q & 1) << 5)) / 64;
		}
		var threshold = 256 / 8;
		this.each(function() {
			if (this.tagName !== "IMG") return;
			var canvas = document.createElement('canvas');
			var ctx    = canvas.getContext('2d');
			var width  = canvas.width = this.width;
			var height = canvas.height = this.height;
			canvas.style.imageRendering = "-moz-crisp-edges";
			this.style.imageRendering = "-moz-crisp-edges";
			canvas.style.imageRendering = "-o-crisp-edges";
			this.style.imageRendering = "-o-crisp-edges";
			canvas.style.imageRendering = "-webkit-optimize-contrast";
			this.style.imageRendering = "-webkit-optimize-contrast";
			canvas.style.msInterpolationMode = "nearest-neighbor";
			this.style.msInterpolationMode = "nearest-neighbor";
			ctx.drawImage(this, 0, 0, width, height);
			var imageData = ctx.getImageData(0, 0, width, height);
			var pixel  = imageData.data;
			for (var y = 0; y < height; ++y) {
				var ywidth = y * width;
				var yAnd7 = y & 7;
				for (var x = 0; x < width; ++x) {
					var index = (ywidth + x) * 4;
					var map_value = threshold_map[(x & 7) + (yAnd7 << 3)];
					var map_valueXthreshold = map_value * threshold;
					pixel[index] = (pixel[index] + map_valueXthreshold) >> 3 << 3;
					++index;
					pixel[index] = (pixel[index] + map_valueXthreshold) >> 3 << 3;
					++index;
					pixel[index] = (pixel[index] + map_valueXthreshold) >> 3 << 3;
				}
			}
			ctx.putImageData(imageData, 0, 0);
			this.src = canvas.toDataURL();
		});
	};
})(jQuery);

