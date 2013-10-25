/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery)

/*
 * jQuery.counter plugin
 *
 * Copyright (c) 2012 Sophilabs <hi@sophilabs.com>
 * MIT License
 */
 
!(function (context, definition) {
  if (typeof define == 'function' && typeof define.amd  == 'object') define(['jquery'], definition);
  else definition(context['$']);
}(this, function ($) {

    var checkStop = function(data) {
        var stop = 0;
        var current = 0;
        $.each(data.parts, function(i, part) {
            stop += (stop * part.limit) + part.stop;
            current += (current * part.limit) + part.value;
        });
        return data.down ? stop >= current : stop <= current;
    };

    var tick = function() {
        var e = $(this);
        var data = e.data('counter');
        var i = data.parts.length - 1;
        while(i >= 0) {
            var part = data.parts[i];
            part.value += data.down ? -1 : 1;
            if (data.down && part.value < 0) {
                part.value = part.limit;
            } else if (!data.down && part.value > part.limit) {
                part.value = 0;
            } else {
                break;
            }
            i--;
        }
        refresh(e, i);
        if (checkStop(data)) {
            clearInterval(data.intervalId);
            e.trigger("counterStop");
        }
    };

    var refresh = function(e, to) {
        var data = e.data('counter');
        var i = data.parts.length - 1;
        var animateIJ = function(j, digit) {
            animate(e, i, j, digit);
        };
        while (i >= to) {
            var part = data.parts[i];
            var digits = part.value + '';
            while (digits.length < part.padding) {
                digits = '0' + digits;
            }
            $.each(split(digits, ''), animateIJ);
            i--;
        }
    };

    var animate = function(e, ipart, idigit, digit) {
        var edigit = $($(e.children('span.part').get(ipart)).find('span.digit').get(idigit));
        edigit.attr('class', 'digit digit' + digit +  ' digit' + edigit.text() + digit).text(digit);
    };

    //from http://blog.stevenlevithan.com/archives/cross-browser-split
    var split = function(undef) {

        var nativeSplit = String.prototype.split,
            compliantExecNpcg = /()??/.exec("")[1] === undef, // NPCG: nonparticipating capturing group
            self;

        self = function (str, separator, limit) {
            // If `separator` is not a regex, use `nativeSplit`
            if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
                return nativeSplit.call(str, separator, limit);
            }
            var output = [],
                flags = (separator.ignoreCase ? "i" : "") +
                        (separator.multiline  ? "m" : "") +
                        (separator.extended   ? "x" : "") + // Proposed for ES6
                        (separator.sticky     ? "y" : ""), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator = new RegExp(separator.source, flags + "g"),
                separator2, match, lastIndex, lastLength;
            str += ""; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === undef ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                limit >>> 0; // ToUint32(limit)
            while (match = separator.exec(str)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(str.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === undef) {
                                    match[i] = undef;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < str.length) {
                        Array.prototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === str.length) {
                if (lastLength || !separator.test("")) {
                    output.push("");
                }
            } else {
                output.push(str.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
        return self;
    }();

    var methods = {
        init: function(options) {
            options = options || {};
            return this.each(function() {
                var e = $(this);
                var data = e.data('counter') || {};
                data.interval = parseInt(options.interval || e.attr('data-interval') || '1000', 10);
                data.down = (options.direction || e.attr('data-direction') || 'down') == 'down';
                data.parts = [];
                var initial = split(options.initial || e.text(), /([^0-9]+)/);
                //WARN: Use attr() no data()
                var format = split(options.format || e.attr('data-format') || "23:59:59", /([^0-9]+)/);
                var stop =  options.stop || e.attr('data-stop');
                if (stop) {
                    stop = split(stop, /([^0-9]+)/);
                }
                e.html('');
                $.each(format, function(index, value) {
                    if (/^\d+$/.test(value)) {
                        var part = {};
                        part.index = index;
                        part.padding = (value + '').length;
                        part.limit = parseInt(value, 10);
                        part.value = parseInt(initial[initial.length - format.length + index] || 0, 10);
                        part.value = part.value > part.limit ? part.limit : part.value;
                        part.reset = part.value;
                        part.stop = parseInt(stop ? stop[stop.length - format.length + index] : (data.down ? 0 : part.limit), 10);
                        part.stop = part.stop > part.limit ? part.limit : part.stop;
                        part.stop = part.stop < 0 ? 0 : part.stop;
                        var epart = $('<span>').addClass('part').addClass('part' + index);
                        var digits = part.value + '';
                        while (digits.length < part.padding) {
                            digits = '0' + digits;
                        }
                        $.each(split(digits, ''), function(dindex, dvalue){
                            epart.append($('<span>').addClass('digit digit' + dvalue).text(dvalue));
                        });
                        e.append(epart);
                        data.parts.push(part);
                    } else {
                        e.append($('<span>').addClass('separator').addClass('separator' + index).text(value));
                    }
                });
                if (!checkStop(data)) {
                    data.intervalId = setInterval($.proxy(tick, this), data.interval);
                } else {
                    e.trigger("counterStop");
                }
                e.data('counter', data);
                return this;
            });
        },
        play: function() {
            return this.each(function() {
                var e = $(this);
                var data = e.data('counter');
                if (!data.intervalId) {
                    data.intervalId = setInterval($.proxy(tick, this), data.interval);
                }
            });
        },
        reset: function() {
            return this.each(function() {
                var e = $(this);
                var data = e.data('counter');
                $.each(data.parts, function(pindex, pvalue){
                    pvalue.value = pvalue.reset;
                });
                refresh($(this), 0);
                if (data.intervalId) {
                    clearInterval(data.intervalId);
                    data.intervalId = setInterval($.proxy(tick, this), data.interval);
                }
            });
        },
        stop: function() {
            return this.each(function() {
                var e = $(this);
                var data = e.data('counter');
                clearInterval(data.intervalId);
                data.intervalId = 0;
                e.trigger("counterStop");
            });
        }
    };

    $.fn.counter = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.counter');
        }
    };

}));



$(document).ready(function(){
	
	setTimeout(function(){

		$('li.card-vertical').addClass('blowup');
		

		$('div.loading-bar').addClass('go');
		setTimeout(function(){
            $('div.modal-a').addClass('resolve');

            setTimeout(function(){
                $('div.modal-a').remove();
            },300);
			$('div.loading-bar').addClass('resolve');
			$('div.loading-bar').removeClass('go');
				$('div.loading-bar').removeClass('resolve');
				$('section.marketplace').addClass('move');
                
                

                var total = 0;

                $('li.card-vertical').each(function(index){

                    total++;


                });

                total = total+1;

                var count = 0;
                (function loop() {
                    setTimeout(function() {
                        // logic
                        $('li.card-vertical').eq(count).addClass('movein');
                        /***setTimeout(function(){
                
                            $('.counter-loan').counter({
                                interval: 20
                            });
                             $('.counter-days').counter({
                                interval: 20
                            });
                             $('.counter-apr').counter({
                                interval: 20
                            }); 
                            
                        }, 2000);**/
                        
                        setTimeout(function(){
                           
                            $('li.card-vertical').eq(count).find('div.loading-item').addClass('dissipate');
                           
                            
                            
                                $('li.card-vertical').eq(count).find('div.stats span').addClass('letsgo');
                                $('li.card-vertical').eq(count).find('h1').addClass('enter');
                                $('li.card-vertical').eq(count).find('h2').addClass('enter');

                          
                               
                            count++;

                             if (count < total) {
                            loop();
                            }

                        },0); 


                        
                       
                    },0);
                })();

                setTimeout(function(){
                    $('section.discover').addClass('activate');
                },1000);



		}, 300);

		
    
	},30);


    
    /** **/

	var windowHeight = $(window).height();
	var windowHeight = windowHeight - 70;

	$('section.marketplace.content').css('height',windowHeight);
	$('section.discover').css('height',windowHeight);

	$(window).resize(function(){


		var windowHeight = $(window).height();
		var windowHeight = windowHeight - 70;

		$('section.marketplace.content').css('height',windowHeight);
		$('section.discover').css('height',windowHeight);

	});

	

	function hoverOn(){
		
        console.log('test');
        var passCurrent = $(this);
		/**$(passCurrent).find('div.hover-region h1').addClass('move');
		
        $(passCurrent).find('div.hover-region h2').addClass('move');
		$(passCurrent).find('div.hover-region p.desc').addClass('move');
		$(passCurrent).find('div.overlay').addClass('darken');
		$(passCurrent).find('img').addClass('scale');
		$(passCurrent).find('div.funded').addClass('move');
		var percentFundedNum = $(passCurrent).find('span.percent-funded').attr('data-id');
		var percentFunded = percentFundedNum + '%';
		setTimeout(function(){

			$(passCurrent).find('div.progress').css('width',percentFunded);

		},400);**/
        
		$(passCurrent).find('div.funded').addClass('move');
		

	}
	
	function hoverOff(){
		var passCurrent = $(this);
		/**$(passCurrent).find('div.hover-region h1').addClass('rest');
        setTimeout(function(){
            $(passCurrent).find('div.hover-region h1').removeClass('move');
            $(passCurrent).find('div.hover-region h1').removeClass('rest');
        },200);

        $(passCurrent).find('div.hover-region h2').addClass('rest');
        setTimeout(function(){
            $(passCurrent).find('div.hover-region h2').removeClass('move');
            $(passCurrent).find('div.hover-region h2').removeClass('rest');
        },200);

		$(passCurrent).find('div.hover-region p.desc').removeClass('move');
		$(passCurrent).find('div.overlay').removeClass('darken');
		$(passCurrent).find('img').removeClass('scale');
		$(passCurrent).find('div.funded').removeClass('move');	
		$(passCurrent).find('div.progress').css('width',0);
        **/
        $(passCurrent).find('div.funded').removeClass('move');
        console.log('off');
	}


    $('a.logo').click(function(){

       

        if($('section.marketplace').hasClass('close')){
            $('section.marketplace').removeClass('close');
            $('section.discover').removeClass('turnedon');
        }else{
            $('section.marketplace').addClass('close');
            $('section.discover').addClass('turnedon');
        }

    });


    $('div.modal-overlay').click(function(){
        $('div.modal-overlay').removeClass('turnon');
        $('div.modal-overlay').removeClass('animate');
        $('section.placeholder-story').removeClass('move');
        $('section.placeholder-story').removeClass('activate');
    });

	$('li.card-vertical').hover(function(){
        var passCurrent = $(this);
        $(passCurrent).find('div.hover-region h1').addClass('move');

        $(passCurrent).find('div.hover-region h2').addClass('move');
        $(passCurrent).find('div.hover-region p.desc').addClass('move');
        $(passCurrent).find('div.overlay').addClass('darken');
        $(passCurrent).find('img').addClass('scale');
        $(passCurrent).find('div.funded').addClass('move');
        var percentFundedNum = $(passCurrent).find('span.percent-funded').attr('data-id');
        var percentFunded = percentFundedNum + '%';
        setTimeout(function(){

            $(passCurrent).find('div.progress').css('width',percentFunded);

        },400);

        
    }, function(){

        var passCurrent = $(this);

        $(passCurrent).find('div.hover-region h1').addClass('rest');
        setTimeout(function(){
            $(passCurrent).find('div.hover-region h1').removeClass('move');
            $(passCurrent).find('div.hover-region h1').removeClass('rest');
        },100);

        $(passCurrent).find('div.hover-region h2').addClass('rest');
        setTimeout(function(){
            $(passCurrent).find('div.hover-region h2').removeClass('move');
            $(passCurrent).find('div.hover-region h2').removeClass('rest');
        },100);

        $(passCurrent).find('div.hover-region p.desc').removeClass('move');
        $(passCurrent).find('div.overlay').removeClass('darken');
        $(passCurrent).find('img').removeClass('scale');
        $(passCurrent).find('div.funded').removeClass('move');  
        $(passCurrent).find('div.progress').css('width',0);
    });


    $('div.filter-placeholder').click(function(){

       
        if($('div.filter-placeholder').hasClass('extend')){
            $('div.filter-placeholder').removeClass('extend');
        }else{
            $('div.filter-placeholder').addClass('extend');
        }
    
    });

	$('li.card-vertical').click(function(){
		$('div.loading-bar').addClass('go');
        $('section.placeholder-story').addClass('activate');
		setTimeout(function(){
			$('div.loading-bar').addClass('resolve');
			setTimeout(function(){
				$('div.loading-bar').removeClass('go');
				$('div.loading-bar').removeClass('resolve');
                $('section.placeholder-story').addClass('move');



			}, 200);

            

		}, 300);

        $('div.modal-overlay').addClass('turnon');
            $('div.modal-overlay').addClass('animate');


	});	


    $('li.home-icn a').click(function(){

        if($('section.marketplace').hasClass('moveout')){
            $('section.marketplace').removeClass('moveout');
            setTimeout(function(){
                $('section.discover').removeClass('moveout');
            }, 500);
        }else{
            $('section.marketplace').addClass('moveout');
            setTimeout(function(){
                $('section.discover').addClass('moveout');
            }, 500);
        }
        

    });


});