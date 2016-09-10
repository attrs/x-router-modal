# x-router-modal
> modal middleware for x-router

```sh
$ npm install x-router x-router-modal --save
```

```javascript
var router = require('x-router');
var modal = require('x-router-modal');

router()
.use(modal({defaults: {width: 700}}))
.get('/', function(req, res, next) {
    res.modal('modal.html', {
    	width: 800,
        height: 600
    }, function(err) {
    	if( err ) return next(err);
        res.end();
    });
});
```