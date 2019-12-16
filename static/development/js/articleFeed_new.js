Acme.Feed = function() {
    this.domain = _appJsConfig.appHostName;
    this.requestType = 'post';
    this.csrf = $('meta[name="csrf-token"]').attr("content");
    this.dataType = 'json';
};

Acme.Feed.prototype.fetch = function()
{

    var self = this;
    // self.elem.html("Please wait...");
    // blogfeed makes 2 sql calls.  
    //      Offset is to get pinned contect 
    //      nonPinnedOffset gets the rest
    //      They're combined to return full result

    // if (this.options.search != null) {
    //     this.options.blogid = this.options.blogid; // search takes an id instead of a guid
    // }

    this.url = this.domain + '/home/load-articles';

    this.requestData = { 
        offset      : this.options.offset, 
        limit       : this.options.limit, 
        _csrf       : this.csrf, 
        dateFormat  : 'SHORT',
        existingNonPinnedCount: this.options.nonPinnedOffset
    };

    if (this.options.blogid) {
        this.requestData['blogGuid'] = this.options.blogid;
    }

    if (this.options.type) {
        this.requestData['type'] = this.options.type;
    }



    if (this.options.loadtype == 'user') {
        this.url = this.domain + '/api/'+options.loadtype+'/load-more-managed';
        this.requestType = 'get';
    }
    
    if (this.options.loadtype == 'user_articles') {
        var urlArr = window.location.href.split('/');
        var username = decodeURIComponent(urlArr[urlArr.length - 2]);
        this.url = this.domain + '/profile/'+ username + '/posts';
    }

    if (this.options.search) {
        var refinedSearch = this.options.search;
        if (this.options.blogid) {
            this.requestData['blogguid'] = this.options.blogid;
        }
        if (refinedSearch.indexOf(",listingquery") >= 0) {
            refinedSearch = refinedSearch.replace(",listingquery","");
            this.requestData['meta_info'] = refinedSearch;
        } else{
            this.requestData['s'] = refinedSearch;
        }
        this.url = this.domain + '/'+ this.options.loadtype;
        this.requestType = 'get';
    }
    return $.ajax({
        url      : this.url,
        data     : this.requestData,
        type     : this.requestType,
        dataType : this.dataType,
    }).done(function(data) {
        if (data.success == 1) {
            self.render(data);
        }
    });       

};




Acme.Feed.prototype.events = function() 
{
    var self = this;

    if (self.elem.length > 0) {
        self.elem.unbind().on('click', function(e) {
            e.preventDefault();
            self.fetch();
        });
    }


    self.lessElem.on('click', function(e) {
        var section = $(this).data('section');
        $('#' + section).empty();
        $(this).hide();
        self.options.nonPinnedOffset = self.originalCount;
        self.elem.show();
    });


    if (this.infinite && this.offset >= this.limit && self.elem.length > 0) {
        self.waypoint = new Waypoint({
            element: self.elem,
            offset: '80%',
            handler: function (direction) {
                
                if (direction == 'down') {
                    self.fetch();
                }
            }
        });
    }
};






Acme.View.articleFeed = function(options)
{
    console.log(options);
    this.cardModel  = options.model;
    this.limit      = options.limit      || 10;
    this.offset     = options.offset     || 0;
    this.infinite   = options.infinite   || false;
    this.failText   = options.failText   || null;
    this.container  = $('#' + options.container);
    this.template   = options.cardTemplate;
    this.cardClass  = options.card_class;
    this.renderType = options.renderType || 'append';
    this.before     = options.before     || false;
    this.after      = options.after      || false;
    this.beforeEach = options.beforeEach || false;
    this.afterEach  = options.afterEach  || false;
    this.button_label = options.label    || false;
    this.cardType   = options.cardType   || "";
    this.lightbox   = options.lightbox   || null;
    this.imgWidth   = options.imageWidth || null;
    this.imgHeight  = options.imageHeight|| null;
    this.ads        = options.ads        || false;
    // when clicking less, reset the original offset count
    this.originalCount = options.non_pinned;
    this.options    = {
        'nonPinnedOffset'   :   options.non_pinned  || -1,
        'search'            :   options.searchterm  || null,
        'loadtype'          :   options.loadtype    || "home",
        'offset'            :   options.offset      || 0,
        'blogid'            :   options.blogid,
        'limit'             :   options.limit,
        'type'              :   options.type        || null
        // 'page'              :   self.elem.data('page') || 1, // page is used for user articles
    };

    this.waypoint  = false;
    
    // This is the load more button
    this.elem      = $('#' + options.name);
    // This is the load LESS button if you have one
    this.lessElem  = $('#less-' + options.name);
    this.failText  = options.failText || null;
    this.events();
};

Acme.View.articleFeed.prototype = new Acme.Feed();
Acme.View.articleFeed.constructor = Acme.View.articleFeed;
Acme.View.articleFeed.prototype.render = function(data) 
{
    var self = this;
    var articles = [];
    if (data.articles) {
        articles = data.articles;
    }
    if (data.userArticles) {
        articles = data.userArticles;
    }
    if (data.users) {
        articles = data.users.users;
    }


    var label = "";
    if (typeof self.button_label != "undefined" || self.button_label != false ) {
        label = self.button_label;
    }
    var ads_on =   self.ads || null;

    self.elem.html(label);
    self.lessElem.show();

    // add counts to the dom for next request
    self.options.offset += self.options.limit;
    self.options.nonPinnedOffset = data.existingNonPinnedCount;

    var html = [];
    if (ads_on == "yes") {
        html.push( window.templates.ads_infinite );
    }

    if (articles.length === 0 && self.failText) {
        html = ["<p>" + self.failText + "</p>"];
    } else {
        for (var i in articles) {

            if (self.beforeEach) {
                html.push( self.beforeEach );
            }


            articles[i].imageOptions = {'width': self.imgWidth, 'height': self.imgHeight};
            html.push( self.cardModel.renderCard(articles[i], {
                cardClass: self.cardClass,
                template: self.template,
                type: self.cardType,
                lightbox: self.lightbox || null
            }));

            if (self.afterEach) {
                html.push( self.afterEach );
            }



        }
        if (self.before ) {
            var beforeStr =  self.before.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            html = [beforeStr].concat(html);
        }
        if (self.after) {
            var afterStr =  self.after.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            html = html.concat([afterStr]);
        }
    }

    (self.renderType === "write")
        ? self.container.empty().append( html.join('') )
        : self.container.append( html.join('') );
    

    // show or hide the load more button depending on article count
    (articles.length < self.options.limit && !this.infinite) 
        ? self.elem.css('display', 'none')
        : self.elem.show();

    // reset infinite load depending on article count
    // console.log(self.waypoint);
    if (self.waypoint) {
        (articles.length < self.options.limit)
            ? self.waypoint.disable()
            : self.waypoint.enable();
    }


    // $('.video-player').videoPlayer();
    $(".lazyload").lazyload({
        effect: "fadeIn"
    });
    $('.j-truncate').dotdotdot({
        watch: true
    });

    this.cardModel.events();

    if (ads_on == "yes") {
        self.InsertAds();
    }
 

};










Acme.View.articleFeed.prototype.InsertAds = function() {
    var screenWidth = $(window).width();
    if (screenWidth >= 300 && screenWidth <= 767) {
        var pageAdSlots = $('.advert-mobile');
        var mediaSize = 'mobile'; 
    } else if (screenWidth >= 768 && screenWidth <= 991) {
        var pageAdSlots = $('.advert-tablet');
        var mediaSize = 'tablet';
    } else if (screenWidth >= 992) {
        var pageAdSlots = $('.advert-desktop');
        var mediaSize = 'desktop';
    } else {
        console.log('screen too small for advertising.');
    }
    if (pageAdSlots.length > 0 ){
        var adSlotIds = [pageAdSlots.length];
        var adSlotSizes = [pageAdSlots.length];
        for (var i=0;i<pageAdSlots.length;i++) {
            var thisSlot = pageAdSlots[i];
            var newID = generateNextAdName(mediaSize+'-');
            thisSlot.id = newID;
            thisSlot = $('#'+thisSlot.id);
            var slotSize = thisSlot.data('adsize');
            
            if (slotSize == 'interstitial') { 
                newID = 'ad-'+mediaSize+'-interstitial';
                thisSlot = pageAdSlots[i];
                thisSlot.id = newID;
            };

            if (mediaSize == 'mobile') {
                if (slotSize == 'banner-main') {
                    for (x=adSlotSizes.length;x>0;x--){
                       adSlotSizes[x] = adSlotSizes[x-1];
                       adSlotIds[x] = adSlotIds[x-1]; 
                    }
                    adSlotSizes[0] = mediaSize+'-'+slotSize;
                    adSlotIds[0] = newID;
                } else {
                    adSlotSizes[i] = mediaSize+'-'+slotSize;
                    adSlotIds[i] = newID;
                }
            } else {
                adSlotSizes[i] = mediaSize+'-'+slotSize;
                adSlotIds[i] = newID;
            }
           

        }
        var siteSection = getSiteSection(effectiveURL,effectiveSection,siteAdSections,effectiveType);
        var networkSite = networkSelect[effectiveURL];
        if (rubiconAcct != undefined) {
            (function() {
                var rct = document.createElement('script');
                rct.type = 'text/javascript';
                rct.async = true;
                rct.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//ads.rubiconproject.com/header/' + rubiconAcct + '.js';
                var node = document.getElementsByTagName('script')[0];
                node.parentNode.appendChild(rct);
            })();
            rubiconTagPush(adSlotIds,siteSection,networkSite,effectiveType,adSlotSizes);
        }
        gptTagPush(adSlotIds,siteSection,networkSite,effectiveType,adSlotSizes);
        for (var i=0;i<adSlotIds.length;i++) {

            loadNextAd(networkSite,adSlotIds[i],siteSection,adSlotSizes[i]);
        }
    }

    function loadNextAd(blogAd,adDivId,section,size) {
        var theAd = adSizes[size];
        var adSlot = document.getElementById(adDivId);
        if ((undefined == theAd || undefined == adSlot || undefined == theAd[0] || undefined == theAd[1])) {
            console.log('id/slot not found:');
            console.log(adDivId);
            console.log(adSlot);
            return;
        }
        if ((size == 'desktop-teads' || size == 'tablet-teads' || size == 'mobile-teads') && teadsAd == false){ return };
        var slotDiv = document.createElement('div');
        adSlot.appendChild(slotDiv);
        adSlot.classList.remove("advert-"+mediaSize);
        var slotName = 'div-gpt-'+adDivId;
        slotDiv.id = slotName;
        slotDiv.setAttribute( 'class', 'google_ad '+size);
        var adAttempts = 0;
        var adSuccess = false;
        while (adAttempts <= 5 && adSuccess == false) {
            try {
                googletag.cmd.push(function() { 
                    googletag.display(slotName); 
                });
                adSuccess = true;
                //console.log(slotName,adSuccess);
            } catch(err) {
                console.log('THISISANERROR',err);
                adSuccess = false;
                adAttempts = adAttempts + 1;
            }
        }       
    }

    function rubiconTagPush(adslots,section,network,page,sizes) {
        rubicontag.cmd.push(function() {
            rubicontag.addFPV('BLOGPREFIX', section);
            rubicontag.addFPV('page-type', page);
            for (var i=0;i<adslots.length;i++) {
                if (sizes[i] == 'desktop-teads' || sizes[i] == 'tablet-teads' || sizes[i] == 'mobile-teads') {continue};
                if (sizes[i] == 'desktop-banner-main' || sizes[i] == 'tablet-banner-main' || sizes[i] == 'mobile-banner-main') { 
                    var rubPos = 'atf';
                } else {
                    var rubPos = 'btf';
                }
                var adSpecs = adSizes[sizes[i]];
                if (adSpecs == undefined || adSpecs[0] == undefined) {
                    console.log('undefined rubicon ad space:');
                    console.log(sizes[i]);
                    continue;
                }

                rubicontag.defineSlot('/'+dfpacct+'/'+network, adSpecs[0], 'div-gpt-'+adslots[i]).setPosition(rubPos);
            }
            rubicontag.run(gptrun);
        });
    }
    var gptrun = function() {
      // don't run again if already ran
      if (gptran) {
          return;
      }
      gptran = true;
      var gads = document.createElement('script');
          gads.async = true;
          gads.type = 'text/javascript';
      var useSSL = 'https:' === document.location.protocol;
          gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
      var node = document.getElementsByTagName('script')[0];
          node.parentNode.insertBefore(gads, node);
    };

    function gptTagPush(adslots,section,network,page,sizes) {
        var gptadslots = [];
        googletag.cmd.push(function() {
            for (var i=0;i<adslots.length;i++) {
                // if (sizes[i] == 'desktop-teads' || sizes[i] == 'tablet-teads' || sizes[i] == 'mobile-teads') {
                //     var theNetwork = 'sheppnews';
                // } else {
                    var theNetwork = network;
                // }
                var theslot = adSizes[sizes[i]];
                if ((theslot || theslot[0] || theslot[1] || theslot[2]) == undefined) {
                    continue;
                }
                if (sizes[i] == 'desktop-banner-main' || sizes[i] == 'tablet-banner-main' || sizes[i] == 'mobile-banner-main') { 
                    var thePOS = '1';
                } else {
                    var sizeSplit = sizes[i].split("-");
                    if (sizeSplit[1] == 'mrec') {
                        var thePOS = mrecPOStarget.toString();
                        mrecPOStarget++;
                    } else if (sizeSplit[1] == 'banner') {
                        var thePOS = bannerPOStarget.toString();
                        bannerPOStarget++;
                    } else {
                        var thePOS = POStarget.toString();
                        POStarget++;
                    }
                }

                gptadslots[i] = googletag.defineSlot('/'+dfpacct+'/'+theNetwork, theslot[0], 'div-gpt-'+adslots[i]).setTargeting(theslot[2], [thePOS]).defineSizeMapping(theslot[1]).setTargeting('BLOGPREFIX', [section]).addService(googletag.pubads());
                // console.log(gptadslots[i]);
                rubicontag && rubicontag.setTargetingForGPTSlot && rubicontag.setTargetingForGPTSlot(gptadslots[i]);
            }
            googletag.pubads().enableSingleRequest();
            googletag.pubads().collapseEmptyDivs();
            googletag.pubads().setCentering(true);
            googletag.pubads().setTargeting('page-type', [page]).setTargeting('tag', []);
            //googletag.pubads().enableSyncRendering();
            googletag.enableServices();
        });    
    }

    function getSiteSection(site,section,adsections,type) {

        if (adsections.length < 0) {
            return section;
        }
        for (theSection in adsections){
            for (var x=0;x<adsections[theSection].length;x++) {
                if (section == adsections[theSection][x]) {
                    return adsections[theSection][0];
                }
            }
        }
        if (type == 'article') {
            return section;
        }
        if (section == site) {
            return 'www';
        }
        return section;
    };

    function generateNextAdName(basename) {
        var id = nextAdId++;
        return basename + id;
    }
};

