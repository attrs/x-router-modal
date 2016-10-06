var path = require('path');
var modal = require('./modal.js');

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
    res.modal = function(src, options) {
      var done = arguments[arguments.length - 1];
      if( typeof done !== 'function' ) done = function(err) { if( err ) console.error('[x-router-modal]', err); };
      if( typeof options === 'string' ) options = {id:options};
      if( typeof options === 'number' ) options = {width:options};
      if( typeof options === 'boolean' ) options = {closable:options};
      if( typeof options !== 'object' ) options = {};
      
      var o = {};
      for(var k in defaults) o[k] = defaults[k];
      for(var k in options) o[k] = options[k];
      
      modal.open(o, function(err, instance) {
        if( err ) return done(err);
        
        options.target = instance.body;
        res.render(src, options, done);
      });
    };
    
    next();
  };
};

if( 'xrouter' in window ) window.xrouter.modal = modal;