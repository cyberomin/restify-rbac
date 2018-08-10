### RBAC

`Role Based Access Control for Restify`

A tiny module that handles RBAC for Restify. 

_Usage_
```javascript
// Routes that can only be accessed by admins. 
const admin = {
    '/users': ['GET']
};

// Routes that does not need any authentication
const excludes = ['/login', '/register', '/auth/verify?code=:code'];

const RBAC = require('./rbac');

const rbac = new RBAC(admin, excludes);
server.use(rbac.checkAuthorization);
```

> Note that for `admin` to take an effect, the `user` model must have an admin column to set to `admin = 1` 

The `admin` object holds routes that only an administrator will see. The `exludes` array holds content 
that does not need authentication.  