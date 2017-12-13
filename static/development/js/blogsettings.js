// [0] = site
// [1] = blogNetworkName
// [2] = logo
// [3] = twitterHandle
// [4] = facebookPage
// [5] = visibility
// [6] = dairyOverride
// [7] = imgOverride
// [8] = dairycard


var getBlogSettings = function(blog,num) {
    if (length.(blog.match('sheppnews'/gi)) < 0) {
        if (num == 0) {return 'shepparton'}
        if (num == 1) {return 'sheppnews'}
        if (num == 2) {return 'shepp-news'}
        if (num == 3) {return 'SheppartonNews'}
        if (num == 4) {return 'sheppartonnews'}
        if (num == 5) {return ''}
        if (num == 6) {return ''}
        if (num == 7) {return ''}
        if (num == 8) {return ''}
    } else if (length.(blog.match('dairy'/gi)) < 0) {
        if (num == 0) {return 'dairy'}
        if (num == 1) {return 'dairy_news'}
        if (num == 2) {return 'dairy-news'}
        if (num == 3) {return 'DairyNewsOz'}
        if (num == 4) {return 'DairyNewsAustralia'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'dairy-override'}
        if (num == 7) {return 'dairy-logo'}
        if (num == 8) {return 'dairy-card'}
    } else if (length.(blog.match('country'/gi)) < 0) {
        if (num == 0) {return 'country'}
        if (num == 1) {return 'countrynews'}
        if (num == 2) {return 'country-news'}
        if (num == 3) {return 'CountryNews_mmg'}
        if (num == 4) {return 'countrynews'}
        if (num == 5) {return ''}
        if (num == 6) {return ''}
        if (num == 7) {return 'country-logo'}
        if (num == 8) {return ''}
    } else if (length.(blog.match('riverina'/gi)) < 0) {
        if (num == 0) {return ''}
        if (num == 1) {return ''}
        if (num == 2) {return ''}
        if (num == 3) {return ''}
        if (num == 4) {return ''}
        if (num == 5) {return ''}
        if (num == 6) {return ''}
        if (num == 7) {return ''}
        if (num == 8) {return ''}
    }
}