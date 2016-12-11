var path = require('path');
var xmodal = require('x-modal');

module.exports = function(options) {
  options = options || {};
  var defaults = options.defaults || {};
  defaults.background = 'background' in defaults ? defaults.background : '#fff';
  defaults.width = 'width' in defaults ? defaults.width : 800;
  defaults.marginTop = 'marginTop' in defaults ? defaults.marginTop : 90;
  defaults.marginBottom = 'marginBottom' in defaults ? defaults.marginBottom : 60;
  
  /*var builder = defaults.builder || {};
  builder.build = builder.build || defaultBuild;
  builder.open = builder.open || defaultOpen;*/
  
  return function(req, res, next) {
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
        
        options.target = instance.body;
        res.render(src, options, function() {
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
    
    next();
  };
};

if( 'xrouter' in window ) window.xrouter.modal = xmodal;