var path = require('path');
var xmodal = require('x-modal');

module.exports = function(options) {
  options = options || {};
  var defaults = {};
  defaults.background = options.background;
  defaults.width = options.width;
  defaults.marginTop = options.marginTop;
  defaults.marginBottom = options.marginBottom;
  defaults.autoClose = options.autoClose === true ? true : false;
  
  return function(req, res, next) {
    if( defaults.autoClose ) xmodal.closeAll();
    
    res.modal = function(src, options, done) {
      var done = arguments[arguments.length - 1];
      if( typeof done !== 'function' ) done = function(err) { if( err ) console.error('[x-router-modal]', err); };
      if( typeof options === 'string' ) options = {id:options};
      if( typeof options === 'number' ) options = {width:options};
      if( typeof options === 'boolean' ) options = {closable:options};
      if( typeof options !== 'object' ) options = {};
      
      var o = {};
      for(var k in defaults) o[k] = defaults[k];
      for(var k in options) o[k] = options[k];
      
      xmodal.open(o, function(err, instance) {
        if( err ) return done(err);
        
        var renderOptions = {
          target: instance.body
        };
        for(var k in defaults.render) renderOptions[k] = defaults.render[k];
        for(var k in options.render) renderOptions[k] = options.render[k];
        
        res.render(src, renderOptions, function() {
          var args = [].slice.call(arguments);
          args.push(instance);
          done.apply(this, args);
        });
      });
      
      return this;
    };
    
    res.modal.html = function() {
      arguments[0] = {html:arguments[0]};
      res.modal.apply(res, arguments);
      return this;
    };
    
    res.modal.close = function() {
      xmodal.close.apply(xmodal, arguments);
      return this;
    };
    
    res.modal.closeAll = function() {
      xmodal.closeAll.apply(xmodal, arguments);
      return this;
    };
    
    next();
  };
};

if( 'xrouter' in window ) window.xrouter.modal = xmodal;