/**
 * Copyright of IsItWhack.com
 *
 * Authors:
 *     - Mike Lyons (m@IsItWhack.com)
 */

(function() {
    'use strict';

    var util = require( 'util' );

    module.exports.WebError = function( web_error, value, message ) {
        this.name = 'WebError';
        this.web_error = web_error || 500;
        this.value = value || 0;
        this.message = (message || '');
    };
    util.inherits( module.exports.WebError, Error );

    module.exports.AbortPromise = function() {
        this.name = 'AbortPromise';
        this.message = 'Intentionally aborted';
    };
    util.inherits( module.exports.AbortPromise, Error );
})();