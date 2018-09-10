Acme.View.articleFeed = function(cardModel, limit, offset, infinite, failText, loadmax) {
    this.cardModel = cardModel;
    this.offset    = offset || 0;
    this.limit     = limit || 10;
    this.infinite  = infinite || false;
    this.waypoint  = false;
    this.options   = {};
    this.loadcount = 0;
    this.loadmax   = loadmax || null;
    this.elem      = $('.loadMoreArticles');
    this.failText  = failText || null;
    this.events();
};

Acme.View.articleFeed.prototype.fetch = function()
{

    var self = this;
    self.elem.html("Please wait...");

    var container = $('#'+self.elem.data('container'));

    // blogfeed makes 2 sql calls.  
    //      Offset is to get pinned contect 
    //      nonPinnedOffset gets the rest
    //      They're combined to return full result
    self.options = {
        'container'         :   container,
        'limit'             :   self.elem.data('limit'),
        'offset'            :   self.elem.data('offset') || self.elem.data('limit'),
        'nonPinnedOffset'   :   self.elem.data('non-pinned-offset') || -1,
        'blogid'            :   self.elem.data('blogguid'),
        'loadtype'          :   self.elem.data('loadtype')      || "home",
        'search'            :   self.elem.data('searchterm')    || null,
        'after'             :   self.elem.data('after')  || null,
        'before'            :   self.elem.data('before')  || null,
    };

    if (self.options.search != null) {
        self.options.blogid = self.elem.data("blogid"); // search takes an id instead of a guid
    }

    $.fn.Ajax_LoadBlogArticles(self.options).done(function(data) {

        if (data.success == 1) {
            self.loadcount++;

            if ( self.loadmax !== null && self.loadcount >= self.loadmax ) {
                self.waypoint.destroy();
            }

            self.render(data);
        }
    });
};


Acme.View.articleFeed.prototype.render = function(data) 
{
    var self = this;

    var cardClass  =   self.elem.data('card-class'),
        template   =   self.elem.data('card-template') || null,
        label      =   self.elem.data('button-label')  || "Load more",
        ads_on     =   self.elem.data('ads')           || null,
        rendertype =   self.elem.data('rendertype')    || null;

    self.elem.html(label);

    (data.articles.length < self.options.limit) 
        ? self.elem.css('display', 'none')
        : self.elem.show();

    // add counts to the dom for next request
    self.elem.data('non-pinned-offset', data.existingNonPinnedCount);
    self.elem.data('offset', (self.options.offset + self.options.limit));

    var html = [];
    if (ads_on == "yes") {
        html.push( window.templates.ads_infinite );
    }


    if (data.articles.length === 0 && self.failText) {
        html = ["<p>" + self.failText + "</p>"];
    } else {
        for (var i in data.articles) {
            if (self.options.before) {
                html.push( self.options.before );
            }

            html.push( self.cardModel.renderCard(data.articles[i], cardClass, template) );

            if (self.options.after) {
                html.push( self.options.after );
            }
        }
    }
    (rendertype === "write")
        ? self.options.container.empty().append( html.join('') )
        : self.options.container.append( html.join('') );
        
    if (self.waypoint) {
        (data.articles.length < self.options.limit)
            ? self.waypoint.disable()
            : self.waypoint.enable();
    }

    $(".card .content > p, .card h2").dotdotdot();     
    // $('.video-player').videoPlayer();
    $("div.lazyload").lazyload({
        effect: "fadeIn"
    });

    this.cardModel.events_refresh();


    self.elem.data('rendertype', '');

    if (ads_on == "yes") {
       self.InsertAds();
    }
};


Acme.View.articleFeed.prototype.events = function() 
{
    var self = this;
    self.elem.unbind().on('click', function(e) {
        e.preventDefault();
        self.fetch();
    });

    if (this.infinite && this.offset >= this.limit) {

        self.waypoint = new Waypoint({
            element: self.elem,
            offset: '100%',
            handler: function (direction) {
                if (direction == 'down') {
                    self.fetch();
                }
            }
        });
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

