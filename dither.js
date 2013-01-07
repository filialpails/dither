(function($) {
	"use strict";
	$.fn.dither = function() {
		this.each(function() {
			if (this.tagName !== "IMG") return;
			var canvas = document.createElement('canvas');
			var ctx    = canvas.getContext('2d');
			var width  = canvas.width = this.width;
			var height = canvas.height = this.height;
			canvas.style.imageRendering = "-moz-crisp-edges";
			this.style.imageRendering = "-moz-crisp-edges";
			ctx.drawImage(this, 0, 0, width, height);
			var imageData = ctx.getImageData(0, 0, width, height);
			var threshold_map = [];
			for (var p = 0; p < 64; ++p) {
				var q = p ^ (p >> 3);
				threshold_map[p] = (((p & 4) >> 2) | ((q & 4) >> 1) | ((p & 2) << 1) | ((q & 2) << 2) | ((p & 1) << 4) | ((q & 1) << 5)) / 64;
			}
			var pixel  = imageData.data;
			var threshold = 256 / 8;
			for (var y = 0; y < height; ++y) {
				for (var x = 0; x < width; ++x) {
					var index = (y * width + x) * 4;
					var map_value = threshold_map[(x & 7) + ((y & 7) << 3)];
					var map_valueXthreshold = map_value * threshold;
					pixel[index + 0] = (pixel[index + 0] + map_valueXthreshold) >> 3 << 3;
					pixel[index + 1] = (pixel[index + 1] + map_valueXthreshold) >> 3 << 3;
					pixel[index + 2] = (pixel[index + 2] + map_valueXthreshold) >> 3 << 3;
				}
			}
			ctx.putImageData(imageData, 0, 0);
			this.src = canvas.toDataURL();
		});
	};
})(jQuery);

