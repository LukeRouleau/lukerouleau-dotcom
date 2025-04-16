/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 */
module.exports = {
    "port": 2015,
    "files": ["*.html", "*.css", "*.js", "assets/**/*", "blog/**/*"],
    "server": {
        "baseDir": "./",
        "middleware": function(req, res, next) {
            // Handle URLs without file extensions
            if (req.url.indexOf('.') === -1 && req.url.substr(-1) !== '/') {
                // Special case for root URL
                if (req.url === '/index') {
                    req.url = '/';
                    return next();
                }
                
                // For blog posts and other pages
                req.url += '.html';
            }
            return next();
        }
    }
}; 