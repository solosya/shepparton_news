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
        if ((blog.match(/shepp/g).length) > 0) {
            if (num == 0) {return 'shepparton'}
            if (num == 1) {return 'sheppnews'}
            if (num == 2) {return 'shepp-news'}
            if (num == 3) {return 'SheppartonNews'}
            if (num == 4) {return 'sheppartonnews'}
            if (num == 5) {return ''}
            if (num == 6) {return 'shepp-events'}
            if (num == 7) {return ''}
            if (num == 8) {return ''}
            if (num == 9) {return 'blogshepp'}    
        } else if ((blog.match(/dairy/g).length) > 0) {
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
        } else if ((blog.match(/country/g).length) > 0) {
            if (num == 0) {return 'country'}
            if (num == 1) {return 'countrynews'}
            if (num == 2) {return 'country-news'}
            if (num == 3) {return 'CountryNews_mmg'}
            if (num == 4) {return 'countrynews'}
            if (num == 5) {return ''}
            if (num == 6) {return 'country-events'}
            if (num == 7) {return 'country-logo'}
            if (num == 8) {return ''}
            if (num == 9) {return 'blogcountry'}
        } else if ((blog.match(/riverina/g).length) > 0) {
            if (num == 0) {return ''}
            if (num == 1) {return ''}
            if (num == 2) {return ''}
            if (num == 3) {return ''}
            if (num == 4) {return ''}
            if (num == 5) {return ''}
            if (num == 6) {return ''}
            if (num == 7) {return ''}
            if (num == 8) {return ''}
            if (num == 9) {return ''}
        } else {
            return '';
        }
    }

    var blogSettingsStyles = function(blog,url) {
        console.log(blog);
        var siteStyles = document.getElementsByClassName(" siteclass");
        var blogSite = getBlogSettings(blog,0);
        for (var i = 0; i < siteStyles.length; i++) {
            siteStyles[i].classList.add(blogSite);
            siteStyles[i].classList.remove('siteclass');
        }
        var evStyles = document.getElementsByClassName(" site-events");
        var evSite = getBlogSettings(blog,6);
        for (var i = 0; i < evStyles.length; i++) {
            evStyles[i].classList.add(evSite);
            evStyles[i].classList.remove('site-events');
        }
        var blogsStyles = document.getElementsByClassName(" blogsite");
        var blogsSite = getBlogSettings(blog,6);
        for (var i = 0; i < blogsStyles.length; i++) {
            blogsStyles[i].classList.add(blogsSite);
            blogsStyles[i].classList.remove('blogsite');
        }
        // url = '/themes/shepparton_news/'
        var blogLogo = document.getElementById("sitelogo");
        blogLogoLink = url + '/static/images/' + getBlogSettings(blog,2) + "-logo.svg";
        blogLogo.setAttribute("style","background-image:url("+blogLogoLink+")");

        var blogSocFac = document.getElementById("fb-icon");
        var blogFB = getBlogSettings(blog,4);
        blogSocFac.setAttribute("href","https://www.facebook.com/"+blogFB+"/");
        var blogSocTwi = document.getElementById("tw-icon");
        var blogTW = getBlogSettings(blog,3);
        blogSocTwi.setAttribute("href","https://twitter.com/"+blogTW);


    }