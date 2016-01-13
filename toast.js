/*
 * toast.js
 *
 * Copyright 2016, Liam - http://exblr.com/liam
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github : http://github.com/liamwang/toast.js/
 * Version: 1.0
 */

window.toast = (function ($) {

    function Toast(message, options) {
        var t = this;
        t.hoving = false;
        t.closing = false;

        t.options = $.extend(toast.defaults, options || {});

        t.$toast = $('<div class="toast"></div>').addClass('toast-' + t.options.type).appendTo('body');
        t.$toastInner = $('<div class="toast-inner"></div>').appendTo(t.$toast);
        t.$content = $('<div class="toast-content"></div>').html(message).appendTo(t.$toastInner);

        if (t.options.icons[t.options.type]) {
            t.$toast.addClass('toast-has-icon');
            t.$toastInner.append('<span class="toast-icon"></span>');
        }

        if (t.options.closeButton) {
            t.$toast.addClass('toast-closeable');
            var $btnClose = $('<span class="toast-close">&times;</span>').appendTo(t.$toastInner).click(function () {
                //t.$toast.remove();
                t.close(500);
                t.closing = true;
            }).hover(function (e) {
                e.stopPropagation();
                return false;
            });
        }

        t.$toast.hover(function () {
            // 点击了关闭按钮
            if (t.closing) return;

            // Hoving时，停止Fade out.
            t.$toast.css('opacity', 1).stop();
            t.hoving = true;

        }).mouseleave(function () {
            t.hoving = false;
            t.show();
        });

        t.show();
    }

    Toast.prototype = {
        close: function (hideDuration) {
            var t = this;
            t.$toast.fadeOut(hideDuration || this.options.hideDuration, function () {
                t.$toast.stop().remove();
            });
        },
        show: function () {
            var t = this;
            t.$toast.fadeIn();
            if (t.options.timeOut) {
                setTimeout(function () {
                    if (t.hoving)
                        return;
                    t.close();
                }, t.options.timeOut);
            }
        }
    }

    function show(type, message, options) {
        // 清除所有
        $('.toast').stop().remove();

        options = options || {};
        options.type = type;
        return new Toast(message, options);
    }

    var toast = {
        info: function (message, options) {
            return show('info', message, options);
        },
        success: function (message, options) {
            return show('success', message, options);
        },
        error: function (message, options) {
            return show('error', message, options);
        },
        warning: function (message, options) {
            return show('warning', message, options);
        },
        show: function (type, message, options) {
            return show(type, message, options);
        }
    }

    toast.defaults = {
        type: 'info',
        timeOut: 4000, // ms
        closeButton: false,//'<a class="toast-close">&times;</a>',
        hideDuration: 3000,
        icons: {
            info: false,
            success: true,
            warning: false,
            error: true
        }
    };

    return toast;

})(jQuery);