// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['helper/tinycolor-min'], function(tinycolorMin) {
    'use strict';

    var ColorEditor;
    return ColorEditor = (function() {

      ColorEditor.prototype.defaultColor = 'rgba(0,0,0,1)';

      ColorEditor.prototype.hsv = tinycolor('rgba(0,0,0,1)').toHsv();

      function ColorEditor(element, color, callback, swatches) {
        this.element = element;
        this.callback = callback != null ? callback : null;
        this.swatches = swatches != null ? swatches : null;
        this.registerFocusHandler = __bind(this.registerFocusHandler, this);

        this.handleOpacityFocus = __bind(this.handleOpacityFocus, this);

        this.handleHueFocus = __bind(this.handleHueFocus, this);

        this.handleSelectionFocus = __bind(this.handleSelectionFocus, this);

        this.registerDragHandler = __bind(this.registerDragHandler, this);

        this.handleOpacityDrag = __bind(this.handleOpacityDrag, this);

        this.handleHueDrag = __bind(this.handleHueDrag, this);

        this.color = tinycolor(color);
        this.lastColor = color;
        this.$element = $(this.element);
        this.$colorValue = this.$element.find('.color_value');
        this.$buttonList = this.$element.find('ul.button-bar');
        this.$rgbaButton = this.$element.find('.rgba');
        this.$hexButton = this.$element.find('.hex');
        this.$hslButton = this.$element.find('.hsla');
        this.$currentColor = this.$element.find('.current_color');
        this.$lastColor = this.$element.find('.last_color');
        this.$selection = this.$element.find('.color_selection_field');
        this.$selectionBase = this.$element.find('.color_selection_field .selector_base');
        this.$hueBase = this.$element.find('.hue_slider .selector_base');
        this.$opacityGradient = this.$element.find('.opacity_gradient');
        this.$hueSlider = this.$element.find('.hue_slider');
        this.$opacitySlider = this.$element.find('.opacity_slider');
        this.$hueSelector = this.$element.find('.hue_slider .selector_base');
        this.$opacitySlider = this.$element.find('.opacity_slider');
        this.$opacitySelector = this.$element.find('.opacity_slider .selector_base');
        this.$swatches = this.$element.find('.swatches');
        this.addFieldListeners();
        this.addSwatches();
        this.$lastColor.css('background-color', this.lastColor);
        this.commitColor(color);
      }

      ColorEditor.prototype.addFieldListeners = function() {
        this.bindColorFormatToRadioButton('rgba');
        this.bindColorFormatToRadioButton('hex');
        this.bindColorFormatToRadioButton('hsla');
        this.$colorValue.change(this.colorSetter);
        this.bindOriginalColorButton();
        this.bindColorSwatches();
        this.registerDragHandler('.color_selection_field', this.handleSelectionFieldDrag);
        this.registerDragHandler('.hue_slider', this.handleHueDrag);
        this.registerDragHandler('.opacity_slider', this.handleOpacityDrag);
        this.registerFocusHandler(this.$selection.find('.selector_base'), this.handleSelectionFocus);
        this.registerFocusHandler(this.$hueSlider.find('.selector_base'), this.handleHueFocus);
        return this.registerFocusHandler(this.$opacitySlider.find('.selector_base'), this.handleOpacityFocus);
      };

      ColorEditor.prototype.synchronize = function() {
        var colorObject, colorValue, hueColor;
        colorValue = this.getColor().toString();
        colorObject = tinycolor(colorValue);
        hueColor = 'hsl(' + this.hsv.h + ', 100%, 50%)';
        this.updateColorTypeRadioButtons(colorObject.format);
        this.$colorValue.attr('value', colorValue);
        this.$currentColor.css('background-color', colorValue);
        this.$selection.css('background-color', hueColor);
        this.$hueBase.css('background-color', hueColor);
        this.$selectionBase.css('background-color', colorObject.toHexString());
        this.$opacityGradient.css('background-image', '-webkit-gradient(linear, 0% 0%, 0% 100%, from(' + hueColor + '), to(transparent))');
        this.$hueSelector.css('bottom', (this.hsv.h / 360 * 100) + "%");
        this.$opacitySelector.css('bottom', (this.hsv.a * 100) + "%");
        if (!isNaN(this.hsv.s)) {
          this.hsv.s = (this.hsv.s * 100) + '%';
        }
        if (!isNaN(this.hsv.v)) {
          this.hsv.v = (this.hsv.v * 100) + '%';
        }
        return this.$selectionBase.css({
          left: this.hsv.s,
          bottom: this.hsv.v
        });
      };

      ColorEditor.prototype.focus = function() {
        if (!this.$selection.find('.selector_base').is(":focus")) {
          this.$selection.find('.selector_base').focus();
          return true;
        }
        return false;
      };

      ColorEditor.prototype.colorSetter = function() {
        var newColor, newValue;
        newValue = $.trim(this.$colorValue.val());
        newColor = tinycolor(newValue);
        if (!newColor.ok) {
          newValue = this.getColor();
          newColor = tinycolor(newValue);
        }
        this.commitColor(newValue, true);
        this.hsv = newColor.toHsv();
        return this.synchronize();
      };

      ColorEditor.prototype.getColor = function() {
        return this.color || this.defaultColor;
      };

      ColorEditor.prototype.updateColorTypeRadioButtons = function(format) {
        this.$buttonList.find('li').removeClass('selected');
        this.$buttonList.find('.' + format).parent().addClass('selected');
        switch (format) {
          case 'rgb':
            return this.$buttonList.find('.rgba').parent().addClass('selected');
          case 'hex':
          case 'name':
            return this.$buttonList.find('.hex').parent().addClass('selected');
          case 'hsl':
            return this.$buttonList.find('.hsla').parent().addClass('selected');
        }
      };

      ColorEditor.prototype.bindColorFormatToRadioButton = function(buttonClass, propertyName, value) {
        var handler,
          _this = this;
        handler = function(event) {
          var colorObject, newColor, newFormat;
          newFormat = $(event.currentTarget).html().toLowerCase();
          newColor = _this.getColor();
          colorObject = tinycolor(newColor);
          switch (newFormat) {
            case 'hsla':
              newColor = colorObject.toHslString();
              break;
            case 'rgba':
              newColor = colorObject.toRgbString();
              break;
            case 'hex':
              newColor = colorObject.toHexString();
              _this.hsv.a = 1;
              _this.synchronize();
          }
          return _this.commitColor(newColor, false);
        };
        return this.$element.find('.' + buttonClass).click(handler);
      };

      ColorEditor.prototype.bindOriginalColorButton = function() {
        var _this = this;
        return this.$lastColor.click(function(event) {
          return _this.commitColor(_this.lastColor, true);
        });
      };

      ColorEditor.prototype.bindColorSwatches = function() {
        var handler;
        handler = function(event) {
          var $swatch, color, hsvColor;
          $swatch = $(event.currentTarget);
          if ($swatch.attr('style').length > 0) {
            color = $swatch.css('background-color');
          }
          if (color.length > 0) {
            hsvColor = tinycolor(color).toHsv();
            return this.setColorAsHsv(hsvColor, true);
          }
        };
        return this.$element.find('.color_swatch').click(handler);
      };

      ColorEditor.prototype.addSwatches = function() {
        var index, swatch, _i, _len, _ref,
          _this = this;
        _ref = this.swatches;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          swatch = _ref[index];
          this.$swatches.append("<li><div class=\"swatch_bg\"><div class=\"swatch\" style=\"background-color: " + swatch.value + ";\"></div></div> <span class=\"value\">" + swatch.value + "</span></li>");
        }
        return this.$swatches.find('li').click(function(event) {
          return _this.commitColor($(event.currentTarget).find('.value').html());
        });
      };

      ColorEditor.prototype.setColorAsHsv = function(hsv, commitHsv) {
        var colorVal, k, newColor, newHsv, oldColor, oldFormat, v;
        newHsv = this.hsv;
        for (k in hsv) {
          v = hsv[k];
          newHsv[k] = v;
        }
        newColor = tinycolor(newHsv);
        oldColor = tinycolor(this.getColor());
        oldFormat = oldColor.format;
        colorVal;

        switch (oldFormat) {
          case 'hsl':
            colorVal = newColor.toHslString();
            break;
          case 'rgb':
            colorVal = newColor.toRgbString();
            break;
          case 'hex':
          case 'name':
            colorVal = this.hsv.a < 1 ? newColor.toRgbString() : newColor.toHexString();
        }
        return this.commitColor(colorVal, commitHsv);
      };

      ColorEditor.prototype.commitColor = function(colorVal, resetHsv) {
        var colorObj;
        if (resetHsv == null) {
          resetHsv = true;
        }
        this.callback(colorVal);
        this.color = colorVal;
        this.$colorValue.val(colorVal);
        if (resetHsv) {
          colorObj = tinycolor(colorVal);
          this.hsv = colorObj.toHsv();
          this.color = colorObj;
        }
        return this.synchronize();
      };

      ColorEditor.prototype.handleSelectionFieldDrag = function(event) {
        var height, hsv, width, xOffset, yOffset;
        yOffset = event.clientY - this.$selection.offset().top;
        xOffset = event.clientX - this.$selection.offset().left;
        height = this.$selection.height();
        width = this.$selection.width();
        xOffset = Math.min(width, Math.max(0, xOffset));
        yOffset = Math.min(height, Math.max(0, yOffset));
        hsv = {};
        hsv.s = xOffset / width;
        hsv.v = 1 - yOffset / height;
        this.setColorAsHsv(hsv, false);
        if (!this.$selection.find('.selector_base').is(":focus")) {
          return this.$selection.find('.selector_base').focus();
        }
      };

      ColorEditor.prototype.handleHueDrag = function(event) {
        var height, hsv, offset;
        offset = event.clientY - this.$hueSlider.offset().top;
        height = this.$hueSlider.height();
        offset = Math.min(height, Math.max(0, offset));
        hsv = {};
        hsv.h = (1 - offset / height) * 360;
        this.setColorAsHsv(hsv, false);
        if (!this.$hueSlider.find('.selector_base').is(":focus")) {
          return this.$hueSlider.find('.selector_base').focus();
        }
      };

      ColorEditor.prototype.handleOpacityDrag = function(event) {
        var height, hsv, offset;
        offset = event.clientY - this.$opacitySlider.offset().top;
        height = this.$opacitySlider.height();
        offset = Math.min(height, Math.max(0, offset));
        hsv = {};
        hsv.a = 1 - offset / height;
        this.setColorAsHsv(hsv, false);
        if (!this.$opacitySlider.find('.selector_base').is(":focus")) {
          return this.$opacitySlider.find('.selector_base').focus();
        }
      };

      ColorEditor.prototype.registerDragHandler = function(selector, handler) {
        var _this = this;
        return this.$element.find(selector).on("mousedown.coloreditorview", function(event) {
          handler.call(_this, event);
          return $(window).on("mousemove.coloreditorview", function(event) {
            return handler.call(_this, event);
          }).on("mouseup.coloreditorview", function() {
            $(window).off("mouseup.coloreditorview");
            return $(window).off("mousemove.coloreditorview");
          });
        });
      };

      ColorEditor.prototype.handleSelectionFocus = function(event) {
        var hsv, sat, value;
        switch (event.keyCode) {
          case 37:
            hsv = {};
            sat = $.trim(this.hsv.s.replace('%', ''));
            if (sat > 0) {
              hsv.s = (sat - 1) <= 0 ? 0 : sat - 1;
              this.setColorAsHsv(hsv);
            }
            return false;
          case 39:
            hsv = {};
            sat = $.trim(this.hsv.s.replace('%', ''));
            if (sat < 100) {
              hsv.s = (Number(sat) + 1) >= 100 ? 100 : Number(sat) + 1;
              this.setColorAsHsv(hsv);
            }
            return false;
          case 40:
            hsv = {};
            value = $.trim(this.hsv.v.replace('%', ''));
            if (value > 0) {
              hsv.v = (value - 1) <= 0 ? 0 : value - 1;
              this.setColorAsHsv(hsv);
            }
            return false;
          case 38:
            hsv = {};
            value = $.trim(this.hsv.v.replace('%', ''));
            if (value < 100) {
              hsv.v = (Number(value) + 1) >= 100 ? 100 : Number(value) + 1;
              this.setColorAsHsv(hsv);
            }
            return false;
        }
      };

      ColorEditor.prototype.handleHueFocus = function(event) {
        var hsv, hue, step;
        step = 3.6;
        switch (event.keyCode) {
          case 40:
            hsv = {};
            hue = Number(this.hsv.h);
            if (hue > 0) {
              hsv.h = (hue - step) <= 0 ? 360 - step : hue - step;
              this.setColorAsHsv(hsv);
            }
            return false;
          case 38:
            hsv = {};
            hue = Number(this.hsv.h);
            if (hue < 360) {
              hsv.h = (hue + step) >= 360 ? step : hue + step;
              this.setColorAsHsv(hsv);
            }
            return false;
        }
      };

      ColorEditor.prototype.handleOpacityFocus = function(event) {
        var alpha, hsv, step;
        step = 0.01;
        switch (event.keyCode) {
          case 40:
            hsv = {};
            alpha = this.hsv.a;
            if (alpha > 0) {
              hsv.a = (alpha - step) <= 0 ? 0 : alpha - step;
              this.setColorAsHsv(hsv);
            }
            return false;
          case 38:
            hsv = {};
            alpha = this.hsv.a;
            if (alpha < 100) {
              hsv.a = (alpha + step) >= 1 ? 1 : alpha + step;
              return this.setColorAsHsv(hsv);
            }
        }
      };

      ColorEditor.prototype.registerFocusHandler = function(element, handler) {
        element.focus(function(event) {
          return element.bind('keydown', handler);
        });
        return element.blur(function(event) {
          return element.unbind('keydown', handler);
        });
      };

      return ColorEditor;

    })();
  });

}).call(this);
