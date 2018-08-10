const jwt = require('jsonwebtoken');
const errors = require('restify-errors');
const includes = require('lodash/includes');

class RBAC {

    /**
     * Class constructor
     * @param {Object} admin Holds an object of all routes to be accessed by admin alone
     * @param {Array} excluded Holds an array of routes that does not need authentication
     */
    constructor(admin, excluded) {
        this.admin = admin;
        this.excluded = excluded;
    }
    /**
     * Authorize the incoming request
     * @param {object} req Restify request object
     * @param {object} res Restify response object
     * @param {function} next Restify routing callback
     */
    checkAuthorization(req, res, next) {
        const request = req.route.path;

        if (includes(this.excluded, request)) {
            return next();
        }

        const token = req.headers.token || req.params.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.send(new errors.ForbiddenError('Authentication failed. Invalid token provided'));
                }

                /**
                 * Only admin or account owners can perform an action on their account.
                 */
                req.user = decoded;
                const { params, body } = req;
                const user = Object.assign(params, body);
                if (Object.prototype.hasOwnProperty.call(user, 'user_id') && (user.user_id !== req.user.id) && req.user.admin !== 1) {
                    return res.send(new errors.ForbiddenError('You cannot perform this action'));
                }

                /**
                 * Is this request coming from an admin?
                 */
                if (Object.prototype.hasOwnProperty.call(this.admin, request.path)
                    && includes(this.admin[request.path], request.method) && req.user.admin !== 1) {
                    return res.send(new errors.ForbiddenError('You cannot perform this action'));
                }

                return next();
            });
        } else {
            return res.send(new errors.UnauthorizedError('No token provided'));
        }
        return true;
    }
}

module.exports = RBAC;
