var path = require('path');
var seq = 100;
var modals = {};
var current;

var mask = document.createElement('div');
mask.setAttribute('class', 'xrouter-modal');
mask.style.background = 'rgba(0,0,0,.5)';
mask.style.position = 'fixed';
mask.style.top = mask.style.bottom = mask.style.left = mask.style.right = 0;
mask.style.opacity = 0;
mask.style.zIndex = 10000;
mask.style.overflow = 'auto';
mask.style.transition = 'opacity .25s ease-in-out';
mask.onclick = function(e) {
  if( (e.target || e.srcElement) !== mask ) return;
  
  var id = current.id;
  current && current.close();
  current = null;
  delete modals[id];
};

function getBoundary() {
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0];
  
  return {
    width: w.innerWidth || e.clientWidth || g.clientWidth,
    height: w.innerHeight|| e.clientHeight|| g.clientHeight
  }
}

function defaultBuild(options, done) {
  // normalize style option
  var css = '';
  if( typeof options.style === 'object' ) {
    for(var k in options.style) {
      css += (k + ': ' + (options.style[k] || '') + ';');
    }
  }
  
  // normalize class option
  if( Array.isArray(options.className) ) options.className = options.className.join(' ');
  
  var div = document.createElement('div');
  div.setAttribute('id', options.id);
  if( options.style ) div.setAttribute('style', css);
  if( options.className ) div.setAttribute('class', 'xrouter-modal ' + options.className);
  else div.setAttribute('class', 'xrouter-modal');
  
  div.style.display = 'none';
  div.style.position = 'relative';
  div.style.boxSizing = 'border-box';
  div.style.transition = 'all .15s ease-in';
  div.style.transform = 'scale(.6,.6)';
  //div.style.borderRadius = '3px';
  //div.style.overflow = 'hidden';
  div.style.background = options.background;
  div.style.width = typeof options.width === 'number' ? (options.width + 'px') : options.width;
  div.style.height = typeof options.height === 'number' ? (options.height + 'px') : options.height;
  if( options.shadow !== false ) div.style.boxShadow = '0 5px 15px rgba(0,0,0,.5)';
  if( options.width ) div.style.overflowX = 'auto';
  if( options.height ) div.style.overflowY = 'auto';
  
  document.body.appendChild(div);
  done(null, div);
  return div;
}

function defaultOpen(div, options, done) {
  div.style.display = '';
  div.style.margin = (+options.margin || 0) + 'px auto';
  div.style.marginTop = (+options.marginTop || 0) + 'px';
  div.style.marginBottom = (+options.marginBottom || 0) + 'px';
  
  if( options.closable !== false ) {
    var closebtns = div.querySelectorAll('*[modal-close], .modal-close');
    var showclosebtn = closebtns.length ? false : true;
    if( 'closebtn' in options ) showclosebtn = options.closebtn;
    
    if( showclosebtn ) {
      var closebtn = document.createElement('div');
      closebtn.style.position = 'absolute';
      closebtn.style.right = '20px';
      closebtn.style.top = '20px';
      closebtn.style.cursor = 'pointer';
      closebtn.style.opacity = '0.5';
      closebtn.style.zIndex = 10001;
      closebtn.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAaRJREFUSA3tlltSwzAMRcsbVgBsC9gqfPBqYGNwzySn48kkrfP4a++MYsuSriJbcbvZnHDsO3CZDTifsQnEELsYFxMYpviO0r7E8tBZayrQhxhiJ8Hg50T9RX4irjkOEWpjJIZYOIC2Vht5eqb3sW8jEHxGbiJgiMS129jxJYZYOICcrbbn6Tkxvkcgooqh5GXS386XmJIjaj0kJFkTIflHxHWIJb/KvKx06AXjUg+TQERSt/CuoGDOtmKj0usIMLbVZjwlYPyOkIBtP+vERsJW+kZdDglpniZC8rdOmDcRbEDfVlvh6XlS6WuEhAhzoY/66Fjd5j0Gkgu3XH3V0e2jkTxTKrXyJnMbTt8sLYNEjNsI28sIqLaJuFb6Znk+JCpvpK/Q2UgwM7fb+eRW+4YhLm8kX6a8QFjzO+cofDF9s1QHu5PAQzeS5OUNR4zrch3MbKc/xrOsdN+NZJLyhqNyOICcrTbylMSfRRrJt9Y2FKqNsYnQcJN+FuO/w1Nm/rRJvDMOTPThjwCxi2HFNURTfEf5qKDqfHoMxFh9z3RSj2UH/gFDp0r+/I0dzwAAAABJRU5ErkJggg==" title="close">';
      div.appendChild(closebtn);
      
      closebtn.onclick = function() {
        current.close();
      };
    }
    
    [].forEach.call(closebtns, function(el) {
      el.onclick = function() {
        current.close();
      }
    });
  }
  
  mask.appendChild(div);
  document.body.appendChild(mask);
  
  setTimeout(function() {
    div.style.transform = 'scale(1,1)';
    div.style.opacity = 1;
    mask.style.opacity = 1;
  }, 1);
  
  current = modals[div.id] = {
    div: div,
    id: div.id,
    close: function() {
      div.style.transform = 'scale(.6,.6)';
      div.style.opacity = 0;
      mask.style.opacity = 0;
      
      setTimeout(function() {
        try { document.body.removeChild(mask); } catch(e) {}
        try { mask.removeChild(div); } catch(e) {}
      }, 200);
    }
  };
  
  done(null, div);
}


module.exports = function(options) {
  options = options || {};
  var defaults = options.defaults || {};
  defaults.background = 'background' in defaults ? defaults.background : '#fff';
  defaults.width = 'width' in defaults ? defaults.width : 800;
  defaults.marginTop = 'marginTop' in defaults ? defaults.marginTop : 90;
  defaults.marginBottom = 'marginBottom' in defaults ? defaults.marginBottom : 60;
  
  var builder = defaults.builder || {};
  builder.build = builder.build || defaultBuild;
  builder.open = builder.open || defaultOpen;
  
  return function modal(req, res, next) {
    res.modal = function(src, options) {
      var done = arguments[arguments.length - 1];
      if( typeof done !== 'function' ) done = function(err) { if( err ) console.error('[x-router-modal]', err); };
      if( typeof options === 'string' ) option = {width:options};
      if( typeof options === 'number' ) option = {width:options};
      if( typeof options === 'boolean' ) option = {closable:options};
      if( typeof options !== 'object' ) options = {};
      
      var o = {};
      for(var k in defaults) o[k] = defaults[k];
      for(var k in options) o[k] = options[k];
      o.id = o.id || 'modal-' + (seq++);
      
      builder.build(o, function(err, el) {
        if( err ) return done(err);
        
        options.target = '#' + o.id;
        res.render(src, options, function(err, target) {
          if( err ) return done(err);
          
          var scope = this;
          var args = arguments;
          
          builder.open(el, o, function(err) {
            if( err ) return done(err);
            done.apply(scope, args);
          });
        });
      });
    };
    
    next();
  };
};

if( 'xrouter' in window ) {
  var ctx = window.xrouter.modal = {
    ids: function() {
      var ids = [];
      for(var k in modals) ids.push(k);
      return ids;
    },
    get: function(id) {
      if( !arguments.length ) return current;
      return modals[id];
    },
    close: function(id) {
      if( !arguments.length ) ctx.closeAll();
      modals[id] && modals[id].close();
      return this;
    },
    closeAll: function() {
      for(var k in modals) {
        modals[k].close();
      }
      return this;
    }
  };
}