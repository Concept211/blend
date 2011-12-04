// Blend 2.2b for jQuery 1.3+
// Copyright (c) 2011 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

// Blend creates a 2nd layer on top of the selected element.
// This layer is faded in and out to create the effect.  The original, bottom layer
// has it's class set to 'hover' and remains that way for the duration to
// keep the CSS :hover state from being apparent when the object is moused-over.
//
// ----------------------------------------------------------------------------------
// Modified by Pablo D. Carrau - info@conceptualintegration.com (12/03/2011)
//
// Effects: fade,
//          slide up, slide down, slide left, slide right,
//          wipe up, wipe down, wipe left, wipe right,
//          wipe vertical, wipe horizontal, wipe all
//
// $('a#nav').blend(300, '.selected', 'fade', function(){ alert('hello'); });

(function ($, window) {

    var blend = $.fn.blend = function (speed, selected, effect, callback) {
		var $this = this,
		background = 'background',
		padding = 'padding',
		properties = [
		    background + 'Color',
		    background + 'Image',
		    background + 'Repeat',
		    background + 'Attachment',
		    background + 'Position', // Standards browsers
		    background + 'PositionX', // IE only
		    background + 'PositionY', // IE only
			padding + 'Top',
			padding + 'Left',
			padding + 'Right',
			padding + 'Bottom',
			'width',
			'height'
		];

		speed    = speed    || $.fn.blend.speed;
		selected = selected || $.fn.blend.selected;
		effect   = effect   || $.fn.blend.effect;
		callback = callback || $.fn.blend.callback;

		// 1. Check to see if the jQuery object contains elements.
		// 2. Check to see if the effect has already been applied
		if ($this[0] && !$this.is('.jQblend')) {

			$this.each(function () {
                var
                layer = '<span style="position:absolute;top:0;left:0;display:block"/>',
                content = $(layer)[0],
                hover = $(layer)[0],
                base = this,
                style = base.currentStyle || window.getComputedStyle(base, null),
                property,
                i;

				$(base).css('overflow','hidden');

				if ($(base).css('position') !== 'absolute') {
					base.style.position = 'relative';
				}

				for(i = 0; property = properties[i]; i++){
                    if (property in style) {
						hover.style[property] = content.style[property] = style[property];
					}
				}

				content.style.backgroundImage = content.style.backgroundColor = '';

				$(base)
                .wrapInner(content)
                .addClass('hover jQblend')
                .prepend(hover)
                .hover(function (e) {
						/*
						$(hover).stop().fadeTo(speed, 0, function () {
							if ($.isFunction(callback)) {
								callback();
							}
						});
						*/
						if (!$(base).is(selected)) {
							switch (effect.toLowerCase()) {
								case 'slide up':
									animation = 'top:-$(hover).height()';
									break;

								case 'slide down':
									animation = 'top:$(hover).height()';
									break;

								case 'slide left':
									animation = 'left:-$(hover).width()';
									break;

								case 'slide right':
									animation = 'left:$(hover).width()';
									break;

								case 'wipe up':
									animation = 'height:"toggle"';
									//clip: 'rect(auto, auto, ' + -$(hover).height() + ', auto)'
									break;

								case 'wipe left':
									animation = 'width:"toggle"';
									//clip: 'rect(auto, -' + $(hover).width() + ', auto, auto)'
									break;

								case 'wipe down':
									animation = 'clip: "rect(" + $(hover).height() + ", auto, auto, auto)"';
									break;

								case 'wipe right':
									animation = 'clip: "rect(auto, auto, auto, " + $(hover).width() + ")"';
									break;

								case 'wipe vertical':
									animation = 'clip: "rect(" + $(hover).height() + ", " + $(hover).width() + ", 0, 0)"';
									break;

								case 'wipe horizontal':
									animation = 'clip: "rect(0, 0, " + $(hover).height() + ", " + $(hover).width() + ")"';
									break;

								case 'wipe all':
									animation = 'clip: "rect(" + $(hover).height()/2 + ", " + $(hover).width()/2 + ", " + $(hover).height()/2 + ", " + $(hover).width()/2 + ")"';
									break;

								default: //fade
									animation = 'opacity:"toggle"';
									break;
							}

							$(hover).stop(true,true).animate(eval('({' + animation + '})'), speed, function(){
								if ($.isFunction(callback)) {
									callback();
								}
							});
						}

                }, function (e) {
						/*
						$(hover).stop().fadeTo(speed, 1);
						*/
						if (!$(base).is(selected)) {
							aniFunction = '';
							switch (effect.toLowerCase()) {
								case 'slide up':
								case 'slide down':
								case 'slide left':
								case 'slide right':
									animation = 'top:0,left:0';
									break;

								case 'wipe up':
									animation = 'height:"toggle"';
									break;

								case 'wipe left':
									animation = 'width:"toggle"';
									break;

								case 'wipe down':
								case 'wipe right':
								case 'wipe vertical':
								case 'wipe horizontal':
								case 'wipe all':
									animation = 'clip: "rect(auto, auto, auto, auto)"';
									aniFunction = '$(hover).css({"clip":""});';
									break;

								default: //fade
									animation = 'opacity:"toggle"';
									break;
							}

							$(hover).animate(eval('({' + animation + '})'), speed, function(){
								if (aniFunction != '') {
									eval(aniFunction);
								}
							});
						}
                });
			});
		}

		return $this;
	};

	blend.speed    = 350;
	blend.effect   = 'fade';
	blend.selected = '.selected';
	blend.callback = false;

}(jQuery, this));

// Clip Animation Plugin
(function($){if(!document.defaultView||!document.defaultView.getComputedStyle){var oldCurCSS=$.curCSS;$.curCSS=function(elem,name,force){var curStyle=elem.currentStyle,ret;if(name==='font-size'){name='fontSize'}if((name!=='clip'&&name!=='fontSize')||!curStyle){return oldCurCSS.apply(this,arguments)}var style=elem.style;if(!force&&style){ret=style[name]}if(name==='clip'){ret=ret||'rect('+(curStyle.clipTop||'auto')+' '+(curStyle.clipRight||'auto')+' '+(curStyle.clipBottom||'auto')+' '+(curStyle.clipLeft||'auto')+')'}else{ret=ret||curStyle.fontSize;if(!(/px/.test(ret))){var width=style.width,rsWidth=elem.runtimeStyle.width;elem.runtimeStyle.width=elem.currentStyle.width;style.width='100em';ret=style.pixelWidth/100+"px";style.width=width;elem.runtimeStyle.width=rsWidth}}return ret}}})(jQuery);(function($){var calcClipAuto=[function(){return 0},function(elem){return $(elem).outerWidth()},function(elem){return $(elem).outerHeight()},function(elem){return 0}],calcNumClip=function(prop,elem){return((/em/.test(prop)))?(parseFloat($.curCSS(elem,'fontSize'),10)||1)*(parseFloat(prop,10)||0):(parseInt(prop,10)||0)};var calcClip=function(css,fx,isEnd){var ret=[];if(css==='auto'){css='rect(auto auto auto auto)'}css=css.replace(/rect\(|\)/g,'').split(/,\s*|\s/);if(isEnd){fx.endClipStyle='rect('+css.join(' ')+')'}for(var i=0;i<css.length;i++){ret[i]=(css[i]!=='auto')?calcNumClip(css[i],fx.elem):calcClipAuto[i](fx.elem)}return ret};jQuery.fx.step.clip=function(fx){if(!fx.clipInit){fx.start=calcClip($.curCSS(fx.elem,'clip'),fx);fx.end=calcClip(fx.end,fx,true);fx.elmStyle=fx.elem.style;fx.clipInit=true}fx.elmStyle.clip='rect('+(fx.pos*(fx.end[0]-fx.start[0])+fx.start[0])+'px '+(fx.pos*(fx.end[1]-fx.start[1])+fx.start[1])+'px '+(fx.pos*(fx.end[2]-fx.start[2])+fx.start[2])+'px '+(fx.pos*(fx.end[3]-fx.start[3])+fx.start[3])+'px)';if(fx.pos===1&&fx.endClipStyle){fx.elmStyle.clip=fx.endClipStyle}}})(jQuery);