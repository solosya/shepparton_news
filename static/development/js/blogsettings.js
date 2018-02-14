// [0] = site
// [1] = blogNetworkName
// [2] = logo
// [3] = twitterHandle
// [4] = facebookPage
// [5] = visibility
// [6] = site-events
// [7] = imgOverride
// [8] = dairycard
// [9] = blogspage
var getBlogSettings = function(blog,num) {
    if (blog.match(/dairy/g) != null) {
        if (num == 0) {return 'dairy'}
        if (num == 1) {return 'dairy_news'}
        if (num == 2) {return 'dairy'}
        if (num == 3) {return 'DairyNewsOz'}
        if (num == 4) {return 'DairyNewsAustralia'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'dairy'}
        if (num == 7) {return 'dairy'}
        if (num == 8) {return 'dairy-card'}
        if (num == 9) {return 'dairy'}
    } else if (blog.match(/shepp/g) != null) {
        if (num == 0) {return 'shepparton'}
        if (num == 1) {return 'sheppnews'}
        if (num == 2) {return 'shepp'}
        if (num == 3) {return 'SheppartonNews'}
        if (num == 4) {return 'sheppartonnews'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'shepparton'}
        if (num == 7) {return 'shepparton'}
        if (num == 8) {return 'shepp-card'}
        if (num == 9) {return 'shepparton'}     
    } else if (blog.match(/country/g) != null) {
        if (num == 0) {return 'country'}
        if (num == 1) {return 'countrynews'}
        if (num == 2) {return 'country'}
        if (num == 3) {return 'CountryNews_mmg'}
        if (num == 4) {return 'countrynews'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'country'}
        if (num == 7) {return 'country'}
        if (num == 8) {return 'country-card'}
        if (num == 9) {return 'country'}
    } else if (blog.match(/riverine/g) != null) {
        if (num == 0) {return 'riverine'}
        if (num == 1) {return 'riverineherald'}
        if (num == 2) {return 'riverineherald'}
        if (num == 7) {return 'riverine'}
        else {return 'default'}
    } else if (blog.match(/benalla/g) != null) {
        if (num == 0) {return 'benalla'}
        if (num == 1) {return 'benallaensign'}
        if (num == 2) {return 'benallaensign'}
        if (num == 7) {return 'benalla'}
        else {return 'default'}
    } else if (blog.match(/campaspe/g) != null) {
        if (num == 0) {return 'campaspe'}
        if (num == 1) {return 'campaspenews'}
        if (num == 2) {return 'campaspenews'}
        if (num == 7) {return 'campaspe'}
        else {return 'default'}
    } else if (blog.match(/cobram/g) != null) {
        if (num == 0) {return 'cobram'}
        if (num == 1) {return 'cobramcourier'}
        if (num == 2) {return 'cobramcourier'}
        if (num == 7) {return 'cobram'}
        else {return 'default'}
    } else if (blog.match(/corowa/g) != null) {
        if (num == 0) {return 'corowa'}
        if (num == 1) {return 'corowafreepress'}
        if (num == 2) {return 'corowafreepress'}
        if (num == 7) {return 'corowa'}
        else {return 'default'}
    } else if (blog.match(/deniliquin/g) != null) {
        if (num == 0) {return 'deniliquin'}
        if (num == 1) {return 'deniliquinpastoraltimes'}
        if (num == 2) {return 'deniliquinpastoraltimes'}
        if (num == 7) {return 'deniliquin'}
        else {return 'default'}
    } else if (blog.match(/kyabram/g) != null) {
        if (num == 0) {return 'kyabram'}
        if (num == 1) {return 'kyabramfreepress'}
        if (num == 2) {return 'kyabramfreepress'}
        if (num == 7) {return 'kyabram'}
        else {return 'default'}
    } else if (blog.match(/mcivor/g) != null) {
        if (num == 0) {return 'mcivor'}
        if (num == 1) {return 'mcivortimes'}
        if (num == 2) {return 'mcivortimes'}
        if (num == 7) {return 'mcivor'}
        else {return 'default'}
    } else if (blog.match(/seymour/g) != null) {
        if (num == 0) {return 'seymour'}
        if (num == 1) {return 'seymourtelegraph'}
        if (num == 2) {return 'seymourtelegraph'}
        if (num == 7) {return 'seymour'}
        else {return 'default'}
    } else if (blog.match(/tatura/g) != null) {
        if (num == 0) {return 'tatura'}
        if (num == 1) {return 'taturaguardian'}
        if (num == 2) {return 'taturaguardian'}
        if (num == 7) {return 'tatura'}
        else {return 'default'}
    } else if (blog.match(/yarrawonga/g) != null) {
        if (num == 0) {return 'yarrawonga'}
        if (num == 1) {return 'yarrawongachronicle'}
        if (num == 2) {return 'yarrawongachronicle'}
        if (num == 7) {return 'yarrawonga'}
        else {return 'default'}
    } else if (blog.match(/riverina/g) != null) {
        if (num == 0) {return 'riverina'}
        if (num == 1) {return 'southernriverinanews'}
        if (num == 2) {return 'southernriverinanews'}
        if (num == 7) {return 'riverina'}
        else {return 'default'}
    } else {
        return 'default';
    }
}

var blogSettingsStyles = function(blog) {
    var blogFB = getBlogSettings(blog,4);
    var blogSocFac = document.getElementById("fb-icon");
    blogSocFac.setAttribute("href","https://www.facebook.com/"+blogFB+"/");
    blogSocFac.setAttribute("id","");
    var blogSocFac = document.getElementById("fb-icon");
    blogSocFac.setAttribute("href","https://www.facebook.com/"+blogFB+"/");
    blogSocFac.setAttribute("id","");

    var blogTW = getBlogSettings(blog,3);
    var blogSocTwi = document.getElementById("tw-icon");
    blogSocTwi.setAttribute("href","https://twitter.com/"+blogTW);
    blogSocTwi.setAttribute("id","");
    var blogSocTwi = document.getElementById("tw-icon");
    blogSocTwi.setAttribute("href","https://twitter.com/"+blogTW);
    blogSocTwi.setAttribute("id","");
}
