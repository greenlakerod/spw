(function($) {
	'use strict';

	/* Page Section Intro Effects */
	/* -------------------------------------------------------------------- */

	function mk_section_intro_effects() {
	  if ( !MK.utils.isMobile() ) {
	    if($.exists('.mk-page-section.intro-true')) {

			console.log('chuj2');
	      $('.mk-page-section.intro-true').each(function() {
	        var that = this;
	        MK.core.loadDependencies([ MK.core.path.plugins + 'jquery.sectiontrans.js', MK.core.path.plugins + 'tweenmax.js' ], function() {
	          var $this = $(that),
	              $pageCnt = $this.nextAll('div'),
	              windowHeight = $(window).height(),
	              effectName = $this.attr('data-intro-effect'),
	              $header = $('.mk-header');

	              var effect = {
	                    fade :    new TimelineLite({paused: true})
	                              .set($pageCnt, { opacity: 0, y: windowHeight * 0.3 })
	                              .to($this, 1, { opacity: 0, ease:Power2.easeInOut })
	                              .to($pageCnt, 1, { opacity: 1, y: 0, ease:Power2.easeInOut}, "-=.7")
	                              .set($this, { zIndex: '-1'}),

	                    zoom_out : new TimelineLite({paused: true})
	                              .set($pageCnt, { opacity: 0, y: windowHeight * 0.3})
	                              .to($this, 1.5, { opacity: .8, scale: 0.8, y: -windowHeight - 100, ease:Strong.easeInOut })
	                              .to($pageCnt, 1.5, { opacity: 1, y:  0, ease:Strong.easeInOut}, "-=1.3"),

	                    shuffle : new TimelineLite({paused: true})
	                              .to($this, 1.5, { y: -windowHeight/2, ease:Strong.easeInOut })
	                              .to($this.nextAll('div').first(), 1.5, { paddingTop: windowHeight/2, ease:Strong.easeInOut }, "-=1.3")
	              }
	      

	          $this.sectiontrans({
	            effect : effectName,
	          });

	          if($this.hasClass('shuffled')) {
	            TweenLite.set($this, { y: -windowHeight/2 });
	            TweenLite.set($this.nextAll('div').first(), { paddingTop: windowHeight/2 });
	          }

	          $('body').on('page_intro', function() {
	            MK.utils.scroll.disable();
	            $(this).data('intro', true);
	            effect[effectName].play();
	            setTimeout(function() {
	              $header.addClass('pre-sticky');
	              $header.addClass('a-sticky');
	              $('.mk-header-padding-wrapper').addClass('enable-padding');
	              $('body').data('intro', false);
	              if(effectName === 'shuffle') $this.addClass('shuffled');
	            }, 1000);

	            setTimeout(MK.utils.scroll.enable, 1500);
	          });

	          $('body').on('page_outro', function() {
	            MK.utils.scroll.disable();
	            $(this).data('intro', true);
	            effect[effectName].reverse();
	            setTimeout(function() {
	              $header.removeClass('pre-sticky');
	              $header.removeClass('a-sticky');
	              $('.mk-header-padding-wrapper').removeClass('enable-padding');
	              $('body').data('intro', false);
	              if($this.hasClass('shuffled')) $this.removeClass('shuffled');
	            }, 1000);
	            
	            setTimeout(MK.utils.scroll.enable, 1500);
	          });
	        });
	      });
	    }
	  } else {
	    $('.mk-page-section.intro-true').each(function() {
	      $(this).attr('data-intro-effect', '');
	    });
	  }
	}

	mk_section_intro_effects();

    var debounceResize = null;
    $(window).on("resize", function() {
        if( debounceResize !== null ) { clearTimeout( debounceResize ); }
        debounceResize = setTimeout( mk_section_intro_effects, 300 );
    });

}(jQuery)); 
 (function($) {
    'use strict';

    function mk_animated_cols() {
        function equalheight (container){
            var currentTallest = 0,
                 currentRowStart = 0,
                 rowDivs = new Array(),
                 $el,
                 topPosition = 0;
             $(container).each(function() {

               $el = $(this);
               $($el).height('auto')
               topPosition = $el.position().top;

               if (currentRowStart != topPosition) {
                 for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                   rowDivs[currentDiv].height(currentTallest);
                 }
                 rowDivs.length = 0; // empty the array
                 currentRowStart = topPosition;
                 currentTallest = $el.height();
                 rowDivs.push($el);
               } else {
                 rowDivs.push($el);
                 currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
              }
               for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                 rowDivs[currentDiv].height(currentTallest);
               }

             });

            // console.log('recalc' + container + ' ' + currentTallest);

            return currentTallest;
        }


        function prepareCols(el) {
            var $this = el.parent().parent().find('.mk-animated-columns');

            var iconHeight  = equalheight('.vc_row .animated-column-icon'),
                titleHeight = equalheight('.vc_row .animated-column-title'),
                descHeight  = equalheight('.vc_row .animated-column-desc'),
                btnHeight   = $this.find('.animated-column-btn').innerHeight();

            if ($this.hasClass('full-style')) {
                $this.find('.animated-column-item').each(function() {
                    var $this = $(this),
                        contentHeight = (iconHeight + 30) + (titleHeight + 10) + (descHeight + 70) + 34;

                    $this.height(contentHeight * 1.5 + 50);

                    var $box_height = $this.outerHeight(true),
                        $icon_height = $this.find('.animated-column-icon').height();

                    $this.find('.animated-column-holder').css({
                        'paddingTop': $box_height / 2 - $icon_height
                    });


                    $this.animate({opacity:1}, 300);
                });
            } else {
                $this.find('.animated-column-item').each(function() {
                    var $this = $(this),
                        halfHeight = $this.height() / 2,
                        halfIconHeight = $this.find('.animated-column-icon').height()/2,
                        halfTitleHeight = $this.find('.animated-column-simple-title').height()/2;

                    $this.find('.animated-column-holder').css({
                        'paddingTop': halfHeight - halfIconHeight
                    });

                    $this.find('.animated-column-title').css({
                        'paddingTop': halfHeight - halfTitleHeight
                    });

                    $this.animate({
                        opacity:1
                    }, 300);

                });
            }
        }

        $('.mk-animated-columns').each(function() {
            var that = this;
            MK.core.loadDependencies([ MK.core.path.plugins + 'tweenmax.js' ], function() {
                var $this = $(that),
                    $parent = $this.parent().parent(),
                    $columns = $parent.find('.column_container'),
                    index = $columns.index($this.parent());
                    // really bad that we cannot read it before bootstrap - needs full shortcode refactor

                if($this.hasClass('full-style')) {
                    $this.find('.animated-column-item').hover(
                    function() {
                        TweenLite.to($(this).find(".animated-column-holder"), 0.5, {
                            top: '-15%',
                            ease: Back.easeOut
                        });
                        TweenLite.to($(this).find(".animated-column-desc"), 0.5, {
                            top: '50%',
                            ease: Expo.easeOut
                        }, 0.4);
                        TweenLite.to($(this).find(".animated-column-btn"), 0.3, {
                            top: '50%',
                            ease: Expo.easeOut
                        }, 0.6);
                    },
                    function() {

                        TweenLite.to($(this).find(".animated-column-holder"), 0.5, {
                            top: '0%',
                            ease: Back.easeOut, easeParams:[3]
                        });
                        TweenLite.to($(this).find(".animated-column-desc"), 0.5, {
                            top: '100%',
                            ease: Back.easeOut
                        }, 0.4);
                        TweenLite.to($(this).find(".animated-column-btn"), 0.5, {
                            top: '100%',
                            ease: Back.easeOut
                        }, 0.2);
                    });
                }

                if($this.hasClass('simple-style')) {
                    $this.find('.animated-column-item').hover(
                    function() {
                        TweenLite.to($(this).find(".animated-column-holder"), 0.7, {
                            top: '100%',
                            ease: Expo.easeOut
                        });
                        TweenLite.to($(this).find(".animated-column-title"), 0.7, {
                            top: '0%',
                            ease: Back.easeOut
                        }, 0.2);
                    },
                    function() {
                        TweenLite.to($(this).find(".animated-column-holder"), 0.7, {
                            top: '0%',
                            ease: Expo.easeOut
                        });
                        TweenLite.to($(this).find(".animated-column-title"), 0.7, {
                            top: '-100%',
                            ease: Back.easeOut
                        }, 0.2);
                    });
                };

                if($columns.length === index + 1) {
                    prepareCols($this);
                    $(window).on("resize", function() {
                            setTimeout(prepareCols($this), 1000);
                    });
                }
            });

        });
    }

    $(window).on('load', mk_animated_cols);

}(jQuery)); 
 (function($) {
	'use strict';

	MK.component.EdgeSlider = function( el ) {
		var self = this,
			$this = $( el ), 
            $window = $(window),
            $wrapper = $this.parent(),
			config = $this.data( 'edgeslider-config' );

        var callbacks = { 

    		onInitialize : function( slides ) {
    			self.$slides = $( slides );
				
				self.slideContents = $.map( self.$slides, function( slide ) {
					var $slide = $( slide ),
						title = $slide.find('.edge-slide-content .edge-title').first().text(),
						skin = $slide.attr("data-header-skin"),
						image = $slide.find('.mk-section-image').css('background-image') || 
								$slide.find('.mk-video-section-touch').css('background-image'),
						bgColor = $slide.find('.mk-section-image').css('background-color');

					return {
						skin: skin,
						title: title,
						image: image,
						bgColor: bgColor
					};
				});

				setNavigationContent( 1, self.$slides.length - 1 );
				setSkin( 0 );

                setTimeout( function() {
                    $( '.edge-slider-loading' ).fadeOut( '100' );
                }, 1000 );
    		},

    		onAfterSlide : function( id ) {
    			var currentId = id;

				var len = self.$slides.length,
					nextId = ( currentId + 1 === len ) ? 0 : currentId + 1,
					prevId = ( currentId - 1 === -1 ) ? len - 1 : currentId - 1; 

    			setNavigationContent( nextId, prevId );
    			setSkin( id );
    		}
    	};


    	var $nav = $( config.nav ),
    		$prev = $nav.find( '.mk-edge-prev' ),
    		$prevTitle = $prev.find( '.nav-item-caption' ),
    		$prevBg = $prev.find('.edge-nav-bg'),
    		$next = $nav.find( '.mk-edge-next' ),
    		$nextTitle = $next.find( '.nav-item-caption' ),
    		$nextBg = $next.find('.edge-nav-bg');

        var setNavigationContent = function( nextId, prevId ) {

            if(self.slideContents[ prevId ]) {
        		$prevTitle.text( self.slideContents[ prevId ].title );
        		$prevBg.css( 'background', 
        			self.slideContents[ prevId ].image !== 'none' ? 
        				self.slideContents[ prevId ].image :
        				self.slideContents[ prevId ].bgColor );
            }

            if(self.slideContents[ nextId ]) {
        		$nextTitle.text( self.slideContents[ nextId ].title ); 
        		$nextBg.css( 'background', 
        			self.slideContents[ nextId ].image !== 'none' ? 
        				self.slideContents[ nextId ].image :
        				self.slideContents[ nextId ].bgColor );
            }
        };


        var $navBtns = $nav.find( 'a' ),  
        	$pagination = $( '.swiper-pagination' ),
        	$skipBtn = $( '.edge-skip-slider' ),
            currentSkin = null;

        var setSkin = function( id ) {  
        	currentSkin = self.slideContents[ id ].skin;

          	$navBtns.attr('data-skin', currentSkin);
          	$pagination.attr('data-skin', currentSkin);
         	$skipBtn.attr('data-skin', currentSkin); 

         	if( self.config.firstEl ) {
         		MK.utils.eventManager.publish( 'firstElSkinChange', currentSkin );
         	}
        };


        var currentPoint;
        var $opacityLayer = $this.find('.edge-slide-content');
        var winH = null;
        var opacity = null;
        var offset = null;

        var onResize = function onResize() {
            var height = $wrapper.height();
            $this.height( height );

            var width = $wrapper.width();
            $this.width( width );

            winH = $window.height();
            offset = $this.offset().top;

            if(MK.utils.isResponsiveMenuState()) {
                $this.css({
                    '-webkit-transform': 0,
                    '-moz-transform': 0,
                    '-ms-transform': 0,
                    '-o-transform': 0,
                    'transform': 0,
                    'position': 'absolute'
                });
                $opacityLayer.css({
                    'opacity': 1
                });
            } else {
                onScroll();
            }
        };

        var onScroll = function onScroll() {
            currentPoint = - MK.val.scroll();

            if( offset + currentPoint <= 0 ) {
                opacity = 1 + ((offset + currentPoint) / winH) * 2;
                opacity = Math.min(opacity, 1);
                opacity = Math.max(opacity, 0);

                $opacityLayer.css({
                    opacity: opacity
                });
            }

            $this.css({
                '-webkit-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
                '-moz-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
                '-ms-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
                '-o-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
                'transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
                'position': 'fixed'
            });  
        };

        onResize();
        $window.on('load resize', onResize);
        window.addResizeListener( $wrapper.get(0), onResize );

        onScroll();
        $window.on('scroll', function() {
            if(MK.utils.isResponsiveMenuState()) return;
            window.requestAnimationFrame(onScroll);
        });

		this.el = el;
		this.config = $.extend( config, callbacks );
		this.slideContents = null; // cache slide contents
	};

	MK.component.EdgeSlider.prototype = {
		init : function() {
			// Inherit from Slider. add prototypes if needed
			var slider = new MK.ui.Slider( this.el, this.config );
			slider.init();
		}
	};

})(jQuery); 
 (function ($) {
	'use strict';  

	function dynamicHeight() {
		var $this = $( this );

		$this.height( 'auto' );

		if( window.matchMedia( '(max-width: 768px)' ).matches ) {
			return;
		} 
		 
		$this.height( $this.height() );
	}


	var $window = $( window );
	var container = document.getElementById( 'mk-theme-container' );

	$( '.equal-columns' ).each( function() { 
		dynamicHeight.bind( this );
	    $window.on( 'load', dynamicHeight.bind( this ) );
	    $window.on( 'resize', dynamicHeight.bind( this ) );
	    window.addResizeListener( container, dynamicHeight.bind( this ) );
	});

}( jQuery )); 
 (function( $ ) {
    'use strict';

    // If we want to get access to API of already initilised component we run a regular new conctructor.
    // When instance is discovered in cache object then we return exisiting instance.
    // 
    // TODO move it to core functions and run logic on init
    var _instancesCollecetion = {};

    MK.component.SwipeSlideshow = function( el ) {
        var $this = $( el );
        var id = $this.parent().attr('id');

        this.el = el;
        this.id = id;
        this.config = $this.data( 'swipeslideshow-config' );
        if( this.config ) this.config.hasPagination = false;
    };

    MK.component.SwipeSlideshow.prototype = {
        init : function() {
            var slider = new MK.ui.Slider( this.el, this.config );
            slider.init();

            _instancesCollecetion[ this.id ] = slider;
        }
    };


    // Additional nav

    MK.component.SwipeSlideshowExtraNav = function( el ) {
        this.el = el;
    };

    MK.component.SwipeSlideshowExtraNav.prototype = {
        init : function init() {
            this.cacheElements();
            this.bindEvents();
        },

        cacheElements : function cacheElements() {
            var $this = $( this.el ),
                sliderId = $this.data( 'gallery' );

            this.slider = _instancesCollecetion[sliderId]; // convert to js obj
            this.$thumbs = $( '#' + sliderId ).find( '.thumbnails a');
        },

        bindEvents : function bindEvents() {
            this.$thumbs.on( 'click', this.clickThumb.bind( this ) );
        },

        clickThumb : function clickThumb( e ) {
            e.preventDefault();
            var $this = $( e.currentTarget ),
                id = $this.index();

            this.slider.goTo( id );
        }
    };

})( jQuery ); 
 