/*!
 * Galleria Fullscreen Theme
 * http://galleria.aino.se
 *
 * Copyright (c) 2010, Aino
 * Licensed under the MIT license.
 */

(function($) {

Galleria.addTheme({
    name: 'fullscreen',
    author: 'Galleria',
    version: '2.0',
    css: 'galleria.fullscreen.css',
    defaults: {
        transition: 'none',
        image_crop: false,
        thumb_crop: 'height',
        maxScaleRatio: 1,
    },
    init: function(options) {
        
        this.addElement('thumbnails-tab');
        this.appendChild('thumbnails-container','thumbnails-tab');

        var tab = this.$('thumbnails-tab');
        var loader = this.$('loader');
        var thumbs = this.$('thumbnails-container');
        var list = this.$('thumbnails-list');
        var infotext = this.$('info-text');
        var info = this.$('info');

        // My hacking
        var menu = $("#menu");
        menu.find('>div').append(thumbs);
        /*
        thumbs.css({
          left: $('ul',menu).position().left + $('ul',menu).outerWidth(),
          width: menu.width() - $('ul',menu).outerWidth() - $('#menu h1').outerWidth()
        });
        */
        
        var OPEN = false;
        var POS = 0;

        if (Galleria.IE) {
            this.addElement('iefix');
            this.appendChild('container','iefix');
            this.setStyle(this.get('iefix'), {
                zIndex:3,
                position:'absolute',
                backgroundColor: '#000',
                opacity:.4
            })
        }
        
        if (options.thumbnails === false) {
            thumbs.hide();
        }
        
        var fixCaption = this.proxy(function(img) {
            if (!(img || img.width)) {
                return;
            }
            var w = Math.min(img.width, $(window).width());
            infotext.width(w-40);
            if (Galleria.IE && this.options.show_caption) {
                this.$('iefix').width(info.outerWidth()).height(info.outerHeight());
            }
        });
        
        this.bind(Galleria.RESCALE, function() {
            //POS = this._stageHeight - tab.height()-6;
            POS = $('body').height();
            menu.css({ top: OPEN ? POS - list.outerHeight() + 2 : POS});
            thumbs.css({
              left: $('ul',menu).position().left + $('ul',menu).outerWidth(),
              width: menu.width() - $('ul',menu).outerWidth() - $('#menu h1').outerWidth()
            });
            var img = this.getActiveImage();
            if (img) {
                fixCaption(img);
            }
        });
        
        this.bind(Galleria.LOADSTART, function(e) {
            if (!e.cached) {
                loader.show().fadeTo(100, 1);
            }
            $(e.thumbTarget).css('opacity',1).parent().siblings('.active').children().css('opacity',.5);
        });

        var firstLoad = true;
        this.bind(Galleria.LOADFINISH, function(e) {
            loader.fadeOut(300);
            this.$('info,iefix').toggle(this.hasInfo());
            if(firstLoad) {
              tab.click();
              firstLoad = false;
            }
        });
        
        this.bind(Galleria.IMAGE, function(e) {
            fixCaption(e.imageTarget);
        });
        
        /*
        this.bind(Galleria.THUMBNAIL, function(e) {
            $(e.thumbTarget).click(function() {
                if (OPEN) {
                    tab.click();
                }
            });
        });
        */
        
        this.trigger(Galleria.RESCALE);
        
        /*
        this.addIdleState(menu, { opacity:0 });
        this.addIdleState(this.get('info'), { opacity:0 });
        
        if (Galleria.IE) {
            this.addIdleState(this.get('iefix'), { opacity:0 });
        }
        */
        
        this.attachKeyboard({
            up: function(e) {
                if (!OPEN) {
                    tab.click();
                }
                e.preventDefault();
            },
            down: function(e) {
                if (OPEN) {
                    tab.click();
                }
                e.preventDefault();
            }
        });
        
        this.$('image-nav-left, image-nav-right').css('opacity',0.01).hover(function() {
            $(this).animate({opacity:1},100);
        }, function() {
            $(this).animate({opacity:0});
        }).show();
        
        tab.click(this.proxy(function() {
            tab.toggleClass('open', !OPEN);
            if (!OPEN) {
                menu.animate({
                    top: POS - list.outerHeight() + 2
                },400,'galleria');
            } else {
                menu.animate({
                    top: POS
                },400,'galleria');
            }
            OPEN = !OPEN;
        }));
        
        this.$('thumbnails').children().hover(function() {
            $(this).not('.active').children().css('opacity', 1);
        }, function() {
            $(this).not('.active').children().fadeTo(200, .5);
        }).children().css('opacity',.5)
        
        this.enterFullscreen();
    }
});

})(jQuery);
