var path = require('path');
var xmodal = require('x-modal');

module.exports = function(options) {
  var defaults = {};
  defaults.background = 'background' in options ? options.background : '#fff';
  defaults.width = 'width' in options ? options.width : 800;
  defaults.marginTop = 'marginTop' in options ? options.marginTop : 90;
  defaults.marginBottom = 'marginBottom' in options ? options.marginBottom : 60;
  defaults.autoClose = options.autoClose === true ? true : false;
  
  return function(req, res, next) {
    if( defaults.autoClose && req.app && typeof req.app.on ) {
      req.app.on('beforerender', function() {
        xmodal.close();
      });
    }
    
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