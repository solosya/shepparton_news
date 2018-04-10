$('document').ready(function() {
    // window.Acme = {};
    var isMenuBroken, isMobile;
    var sbCustomMenuBreakPoint = 992;
    var mobileView = 620;
    var desktopView = 1119;
    var pageWindow = $(window);
    var scrollMetric = [pageWindow.scrollTop()];
    var foldawayPanel = $("#foldaway-panel");
    var menuContainer = $("#mainHeader");
    var menu_top_foldaway = $("#menu-top-foldaway");
    var menu_bottom_foldaway = $("#menu-bottom-foldaway");
    var masthead = $('#masthead');
    var articleAd = $('#articleAdScroll');

    // $('.video-player').videoPlayer();
    
    $("img.lazyload").lazyload({
        effect : "fadeIn"
    });



    var isMobile = function(){
        if (window.innerWidth < mobileView) {
            return true;
        }
        return false;
    };

    var isDesktop = function(){
        if (window.innerWidth > desktopView) {
            return true;
        }
        return false;
    };


    var isScolledPast = function(position){
        if (scrollMetric[0] >= position) {
            return true;
        }
        return false;
    };


    var scrollUpMenu = function() {
        var isMob = isMobile();
        if ( scrollMetric[1] === 'up' && isScolledPast(400) && isMob === false ){
            foldawayPanel.addClass('showMenuPanel');
            menuContainer.show();
        } else {
            menu_top_foldaway.addClass('hide');
            menu_bottom_foldaway.addClass('hide');
            foldawayPanel.removeClass('showMenuPanel');
            menuContainer.show();
        }
    }


    //Onload and resize events
    $(window).on("resize", function () {
        scrollUpMenu();
    }).resize();

    //On Scroll
    $(window).scroll(function() {
        var direction = 'down';
        var scroll = $(window).scrollTop();
        if (scroll < scrollMetric[0]) {
            direction = 'up';
        }
        scrollMetric = [scroll, direction];
        scrollUpMenu();
    });




    var adScroll = function() {
        if ( scrollMetric[1] === 'up' && !isScolledPast(475)) {
            articleAd.removeClass('fixad').addClass('lockad');
        }
        else if ( scrollMetric[1] === 'up' && !isScolledPast(650)) {
            articleAd.removeClass('bottomAd').addClass('fixad');
        }
        else if ( scrollMetric[1] === 'down' && isScolledPast(650)) {
            articleAd.removeClass('fixad').addClass('bottomAd');
        } 
        else if ( scrollMetric[1] === 'down' && isScolledPast(475)) {
            articleAd.removeClass('lockad').addClass('fixad');
        }
        
    }


    var removeMobileMenuStyles = function() {
        var menu = $('#sb-custom-menu');

        if (pageWindow.width() > 620 ) {
            masthead.removeClass('mobile-menu-active')
                    .removeClass('fixHeader');
        } else if (pageWindow.width() < 620 && menu.hasClass('open')) {
            masthead.addClass('mobile-menu-active');
                    // .addClass('fixHeader'); 
        }
    }

    window.Acme.scrollThumbs = function(elem) {
        console.log('scrolling thumbs');
        if (elem.length === 0) {
            return;
        }
        var elem = $(elem);
        var elemWidth = elem.width();
        var container = elem.parent();
        var containerWidth = container.width();
        var scrollAmount = container.scrollLeft();
        var containerView = [scrollAmount, containerWidth + scrollAmount];

        var middle = (containerView[1] - containerView[0]) / 2 ;
        var middle = scrollAmount + middle;
        var elempos = elem[0].offsetLeft + elemWidth/2;

        if ( elempos > middle ) {
            var scroll = true;
            var scrollpos = scrollAmount + (elempos - middle);
        } else if ( elem[0].offsetLeft < middle ) {
            var scroll = true;
            var scrollpos = scrollAmount - (middle - elempos);
        }

        if (scroll) {
            container.animate({
                scrollLeft : scrollpos
            });
        }
    }



    // Onload and resize events
    pageWindow.on("resize", function () {
        // stickHeader();
        removeMobileMenuStyles();
        // scrollUpMenu();
    }).resize();

    //On Scroll
    pageWindow.scroll(function() {
        // console.log('scrolling');
        var direction = 'down';
        var scroll = pageWindow.scrollTop();
        if (scroll < scrollMetric[0]) {
            direction = 'up';
        }
        scrollMetric = [scroll, direction];
        adScroll();
        // console.log(scrollMetric);
    });




    $("#menu-foldaway").on("click", function (e) {
        menu_top_foldaway.toggleClass('hide');
        menu_bottom_foldaway.toggleClass('hide');
    });

    $("#menu-mobile > a").on("click", function (e) {
        $('body').toggleClass("active");

        var thisMenuElem = $( $(this).parent('.sb-custom-menu') );

        var menuButtons = $("#menu-mobile > a");

        menuButtons.toggleClass("active");
        thisMenuElem.find('.menuContainer').toggleClass("show-on-tablet");
        thisMenuElem.toggleClass('open');
        if (pageWindow.width() < 620) {
            masthead.toggleClass('mobile-menu-active');
                    // .toggleClass('fixHeader');
        }
        e.preventDefault();
    });

    $(".searchOpen").on("click", function (e) {
        $(".searchPanel").css('display', 'inline-block');
        $(".searchPanel input").focus();
    });
    $(".searchsubmit").on("click", function (e) {
        $(".searchPanel").css('display', 'inline-block');
        $(".searchPanel input").focus();
    });
    $(".searchclose").on("click", function (e) {
        $(".searchPanel").css('display', 'none');
    });


    $(".sb-custom-menu > .menuContainer > ul > li").hover(function (e) {

    // $(".sb-custom-menu > .menuContainer > ul > li").bind("mouseenter", function (e) {
        if (pageWindow.width() > sbCustomMenuBreakPoint) {
            $(this).children("ul").stop(true, false).slideToggle(0);
            $(this).toggleClass('now-active');
            e.preventDefault();
        }
    });


    $(".sb-custom-menu > .menuContainer > ul > li > span").on("click", function(e) {
        e.preventDefault();

        var elem = $(this);

        if (elem.hasClass('selected')) {
            elem.removeClass('selected');
            elem.parent().children('ul.sub-menu').stop(true,true).slideUp('fast');
            return;
        }

        var listItems = $('ul.menu.mobile > li');
        listItems.find('span').removeClass('selected');
        elem.addClass('selected');

        listItems.each(function(i) {
            var item = $(this);
            if ( !item.find('span').hasClass('selected') ) {
                item.children('ul.sub-menu').stop(true,true).slideUp('fast');
            }
        });
        

        if (elem.hasClass('selected')) {
            elem.parent().children('ul').stop(true,true).slideDown('fast');
        }

    });




    // $('#profile').on('click', function(e) {
    //     e.preventDefault();
    //     console.log('clicked profile');
    //     $('#header__menu').toggleClass('Profile_Open');
    //     $('body').toggleClass('no_profile');
    //     e.preventDefault();
    // });










    var cardHolder = '';
    clearTimeout(cardHolder);
    cardHolder = setTimeout((function() {
        $('.card .content > p, .card h2, a.card > article > .content > .author').dotdotdot({
            watch: true
        });
    }), 750);

    var cardHolderTwo = '';
    clearTimeout(cardHolderTwo);
    cardHolderTwo = setTimeout((function() {
        $('.card .content > p, .card h2, a.card > article > .content > .author').dotdotdot({
            watch: true
        });
    }), 750);


    // this is used for the gallery template
    // $("#owl-thumbnails").owlCarousel({
    //     items: 1,
    //     thumbs: true,
    //     thumbsPrerendered: true,
    //     URLhashListener:true,
    //     startPosition: 'URLHash',
    //     pagination: true,
    //     dots: false,
    //     nav: true,
    //     navText: [
    //         "",
    //         ""
    //     ]
    // });   

    // this is used for the article template that may contain
    // more than one gallery. one for images, one for videos
    $("#owl-gallery-image").owlCarousel({
        items: 1,
        dots: false,
        nav: true,
        navText: [
            "",
            ""
        ]
    });   
    $("#owl-gallery-video").owlCarousel({
        items: 1,
        dots: false,
        nav: true,
        navText: [
            "",
            ""
        ]
    });   

    $("#owl-thumbnails").owlCarousel({
        items: 1,
        dots: false,
        nav: true,
        navText: [
            "",
            ""
        ]
    });   



    adScroll();


});
