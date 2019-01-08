'use strict';

const boundedAlignment =  helper => {
    return (string, options) => {
      if (options.width <= string.length) {
        return string
      }
      let whitespace = options.placeholder.repeat(options.width)
      return helper(string, options, whitespace)
    }
  }
  
  
  const align = {
    center: boundedAlignment(function (string, options) {
      var left = Math.floor((options.width - string.length) / 2)
        , right = options.width - string.length - left
  
      return options.placeholder.repeat(left) + string + options.placeholder.repeat(right)
    }),
    left: boundedAlignment(function (string, options, whitespace) {
      return (string + whitespace).slice(0, options.width)
    }),
    right: boundedAlignment(function (string, options, whitespace) {
      return (whitespace + string).slice(-options.width)
    }),
    fill: function (string, options) {
      return repeat(string, Math.ceil(options.width / string.length)).slice(0, options.width)
    }
  }


/**
 * Align string with whitespace.
 *
 * @arg {*} string - Data to be aligned. Converted to a string.
 * @arg {number} width
 * @arg {"center","left","right","fill"} [alignment="center"]
 * @arg {string} [placeholder=" "]
 */
module.exports = (string, width, alignment, placeholder) => {

  var options = {
    width: width,
    alignment: alignment,
    placeholder: placeholder
  };

  options.alignment = options.alignment || 'center';
  options.placeholder = options.placeholder == null ? ' ' : options.placeholder;

  if (options.placeholder.length != 1) {
    throw new Error('Placeholder must be of length 1');
  }

  if (align[options.alignment]) {
    return align[options.alignment](string.toString(), options);
  }
  else {
    throw new Error('Invalid alignment type: ' + options.alignment);
  }
};