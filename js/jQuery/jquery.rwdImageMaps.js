/*
* rwdImageMaps jQuery plugin v1.6
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2016 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/
;(function ($) {
    $.fn.rwdImageMaps = function () {
        const $img = this;

        const rwdImageMap = function () {
            $img.each(function () {
                if (typeof ($(this).attr('usemap')) == 'undefined')
                    return;

                const that = this,
                    $that = $(that);

                // Since WebKit doesn't know the height until after the image has loaded, perform everything in an onload copy
                $('<img  alt="" src=""/>').on('load', function () {
                    let attrW = 'width',
                        attrH = 'height',
                        w = $that.attr(attrW),
                        h = $that.attr(attrH);

                    if (!w || !h) {
                        const temp = new Image();
                        temp.src = $that.attr('src');
                        if (!w)
                            w = temp.width;
                        if (!h)
                            h = temp.height;
                    }

                    const wPercent = $that.width() / 100,
                        hPercent = $that.height() / 100,
                        map = $that.attr('usemap').replace('#', ''),
                        c = 'coords';

                    $('map[name="' + map + '"]').find('area').each(function () {
                        const $this = $(this);
                        if (!$this.data(c))
                            $this.data(c, $this.attr(c));

                        const coords = $this.data(c).split(','),
                            coordsPercent = new Array(coords.length);

                        for (let i = 0; i < coordsPercent.length; ++i) {
                            if (i % 2 === 0)
                                coordsPercent[i] = parseInt(((coords[i] / w) * 100) * wPercent);
                            else
                                coordsPercent[i] = parseInt(((coords[i] / h) * 100) * hPercent);
                        }
                        $this.attr(c, coordsPercent.toString());
                    });
                }).attr('src', $that.attr('src'));
            });
        };
        $(window).resize(rwdImageMap).trigger('resize');

        return this;
    };
})(jQuery);
