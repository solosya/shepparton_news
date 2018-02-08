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
        if (num == 2) {return 'dairy-news'}
        if (num == 3) {return 'DairyNewsOz'}
        if (num == 4) {return 'DairyNewsAustralia'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'dairy-events'}
        if (num == 7) {return 'dairy-logo'}
        if (num == 8) {return 'dairy-card'}
        if (num == 9) {return 'blogdairy'}
    } else if (blog.match(/shepp/g) != null) {
        if (num == 0) {return 'shepparton'}
        if (num == 1) {return 'sheppnews'}
        if (num == 2) {return 'shepp-news'}
        if (num == 3) {return 'SheppartonNews'}
        if (num == 4) {return 'sheppartonnews'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'shepp-events'}
        if (num == 7) {return 'shepp-logo'}
        if (num == 8) {return 'shepp-card'}
        if (num == 9) {return 'blogshepp'}     
    } else if (blog.match(/country/g) != null) {
        if (num == 0) {return 'country'}
        if (num == 1) {return 'countrynews'}
        if (num == 2) {return 'country-news'}
        if (num == 3) {return 'CountryNews_mmg'}
        if (num == 4) {return 'countrynews'}
        if (num == 5) {return ' visible-md-block visible-lg-block'}
        if (num == 6) {return 'country-events'}
        if (num == 7) {return 'country-logo'}
        if (num == 8) {return 'country-card'}
        if (num == 9) {return 'blogcountry'}
    } else if (blog.match(/riverine/g) != null) {
        if (num == 0) {return 'riverine'}
        if (num == 1) {return 'riverineherald'}
        if (num == 2) {return 'riverineherald'}
        if (num == 7) {return 'riverine-logo'}
        else {return 'default'}
    } else if (blog.match(/benalla/g) != null) {
        if (num == 0) {return 'benalla'}
        if (num == 1) {return 'benallaensign'}
        if (num == 2) {return 'benallaensign'}
        if (num == 7) {return 'benalla-logo'}
        else {return 'default'}
    } else if (blog.match(/campaspe/g) != null) {
        if (num == 0) {return 'campaspe'}
        if (num == 1) {return 'campaspenews'}
        if (num == 2) {return 'campaspenews'}
        if (num == 7) {return 'campaspe-logo'}
        else {return 'default'}
    } else if (blog.match(/cobram/g) != null) {
        if (num == 0) {return 'cobram'}
        if (num == 1) {return 'cobramcourier'}
        if (num == 2) {return 'cobramcourier'}
        if (num == 7) {return 'cobram-logo'}
        else {return 'default'}
    } else if (blog.match(/corowa/g) != null) {
        if (num == 0) {return 'corowa'}
        if (num == 1) {return 'corowafreepress'}
        if (num == 2) {return 'corowafreepress'}
        if (num == 7) {return 'corowa-logo'}
        else {return 'default'}
    } else if (blog.match(/deniliquin/g) != null) {
        if (num == 0) {return 'deniliquin'}
        if (num == 1) {return 'deniliquinpastoraltimes'}
        if (num == 2) {return 'deniliquinpastoraltimes'}
        if (num == 7) {return 'deniliquin-logo'}
        else {return 'default'}
    } else if (blog.match(/kyabram/g) != null) {
        if (num == 0) {return 'kyabram'}
        if (num == 1) {return 'kyabramfreepress'}
        if (num == 2) {return 'kyabramfreepress'}
        if (num == 7) {return 'kyabram-logo'}
        else {return 'default'}
    } else if (blog.match(/mcivor/g) != null) {
        if (num == 0) {return 'mcivor'}
        if (num == 1) {return 'mcivortimes'}
        if (num == 2) {return 'mcivortimes'}
        if (num == 7) {return 'mcivor-logo'}
        else {return 'default'}
    } else if (blog.match(/seymour/g) != null) {
        if (num == 0) {return 'seymour'}
        if (num == 1) {return 'seymourtelegraph'}
        if (num == 2) {return 'seymourtelegraph'}
        if (num == 7) {return 'seymour-logo'}
        else {return 'default'}
    } else if (blog.match(/tatura/g) != null) {
        if (num == 0) {return 'tatura'}
        if (num == 1) {return 'taturaguardian'}
        if (num == 2) {return 'taturaguardian'}
        if (num == 7) {return 'tatura-logo'}
        else {return 'default'}
    } else if (blog.match(/yarrawonga/g) != null) {
        if (num == 0) {return 'yarrawonga'}
        if (num == 1) {return 'yarrawongachronicle'}
        if (num == 2) {return 'yarrawongachronicle'}
        if (num == 7) {return 'yarrawonga-logo'}
        else {return 'default'}
    } else if (blog.match(/riverina/g) != null) {
        if (num == 0) {return 'riverina'}
        if (num == 1) {return 'southernriverinanews'}
        if (num == 2) {return 'southernriverinanews'}
        if (num == 7) {return 'riverina-logo'}
        else {return 'default'}
    } else {
        return 'default';
    }
}

var blogSettingsStyles = function(blog) {

    var blogSocFac = document.getElementById("fb-icon");
    var blogFB = getBlogSettings(blog,4);
    blogSocFac.setAttribute("href","https://www.facebook.com/"+blogFB+"/");
    var blogSocTwi = document.getElementById("tw-icon");
    var blogTW = getBlogSettings(blog,3);
    blogSocTwi.setAttribute("href","https://twitter.com/"+blogTW);
}
var setMyAppleIcons = function(blog,url) {
    var blogAppleIconSm = document.getElementById("apple-icon-sm");
    blogAppleIconSm.setAttribute("href", url + '/static/icons/apple/' + getBlogSettings(blog,0) + "-mobile-homescreen-57px.png");
    var blogAppleIconMd = document.getElementById("apple-icon-md");
    blogAppleIconMd.setAttribute("href", url + '/static/icons/apple/' + getBlogSettings(blog,0) + "-mobile-homescreen-72px.png");
    var blogAppleIconLg = document.getElementById("apple-icon-lg");
    blogAppleIconLg.setAttribute("href", url + '/static/icons/apple/' + getBlogSettings(blog,0) + "-mobile-homescreen-144px.png");
}
var setMyBlogLogo = function(blog,url) {
    var siteLogo = document.getElementsByClassName("site-logo");
    var clossImgOver = getBlogSettings(blog,7);
    for (var i = 0; i < siteLogo.length; i++) {
        siteLogo[i].classList.add(clossImgOver);
        siteLogo[i].classList.remove('site-logo');
    }
    
    var blogLogo = document.getElementsByClassName("sitelogo");
    blogLogoLink = url + '/static/images/' + getBlogSettings(blog,2) + "-logo.svg";
    for (var i = 0; i < blogLogo.length; i++) {
        blogLogo[i].setAttribute("style","background-image:url("+blogLogoLink+")");
        blogLogo[i].classList.add(clossImgOver);
    }
}

var setMyBlogStyles = function(blog){
    
    var blogsStyles = document.getElementsByClassName(" blogsite");
    var blogsSite = getBlogSettings(blog,9);
    
    for (var i = 0; i < blogsStyles.length; i++) {
        blogsStyles[i].classList.add(blogsSite);
        blogsStyles[i].classList.remove('blogsite');
    }
}

var setMySiteStyles = function(blog){
    var siteStyles = document.getElementsByClassName("siteclass");
    var blogSite = getBlogSettings(blog,0);
    for (var i = 0; i < siteStyles.length; i++) {
       
        siteStyles[i].classList.add(blogSite);
        siteStyles[i].classList.remove('siteclass');
    }
    siteStyles = document.getElementsByClassName("siteclass");
    if (siteStyles != null) {
        var siteStyles = document.getElementsByClassName("siteclass");
        var blogSite = getBlogSettings(blog,0);
        for (var i = 0; i < siteStyles.length; i++) {
            siteStyles[i].classList.add(blogSite);
            siteStyles[i].classList.remove('siteclass');
        }
    }
}

var setMyEventStyles = function(blog) {

var evStyles = document.getElementsByClassName("site-events");
    var evSite = getBlogSettings(blog,6);
    for (var i = 0; i < evStyles.length; i++) {
        evStyles[i].classList.add(evSite);
        evStyles[i].classList.remove('site-events');
    }
}