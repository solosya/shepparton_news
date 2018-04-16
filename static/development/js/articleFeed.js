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
    console.log('fetching');
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
        console.log('setting infinite');
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

Acme.InsertAds = function() {
    var pageAdSlots = $('.advert');
    //console.log('pageAdSlots:');
    //console.log(pageAdSlots);
    if (pageAdSlots.length > 0 ){

        var adSlotIds = [pageAdSlots.length];
        for (var i=0;i<pageAdSlots.length;i++) {
            adSlotIds[i] = pageAdSlots[i].id;
        }
        var slotOne = $('#'+pageAdSlots[0].id);
        var siteSection = getSiteSection(slotOne.data('site'),slotOne.data('section'),siteAdSections);
        var networkSite = networkSelect[slotOne.data('site')];
        if (rubiconAcct != undefined) {
            (function() {
                var account_id = rubiconAcct;
                var rct = document.createElement('script');
                rct.type = 'text/javascript';
                rct.async = true;
                rct.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//ads.rubiconproject.com/header/' + account_id + '.js';
                var node = document.getElementsByTagName('script')[0];
                node.parentNode.appendChild(rct);
            })();
            rubiconTagPush(adSlotIds,siteSection,networkSite);
        }
        gptTagPush(adSlotIds,siteSection,networkSite);

        for (var i=0;i<adSlotIds.length;i++) {
            function loadNextAd(blogAd,adDivId,section) {
                var theAd = adSizes[adDivId];
                var adSlot = document.getElementById(adDivId);
                if ((theAd || adSlot) == undefined) {
                    console.log('id/slot not found:');
                    console.log(adDivId);
                    console.log(adSlot);
                    return
                }
                if (adDivId == 'teads-ad-mobile-tablet-desktop' && teadsAd == false){ return };
                var slotDiv = document.createElement('div');
                adSlot.appendChild(slotDiv);
                adSlot.classList.remove("advert");
                if (adDivId == 'infinite-variable-mobile-tablet-desktop') {
                    adSlot.id = "infinite-loaded";
                    console.log('LOADMORE ONLY:');
                    var slotName = generateNextAdName(theAd[0]);
                    slotDiv.id = slotName;
                    slotDiv.setAttribute( 'class', 'google_ad' );
                    googletag.cmd.push(function() {
                    var slot = googletag.defineSlot('/'+dfpacct+'/'+blogAd, theAd[1], theAd[0]).setTargeting(theAd[3],[theAd[4]]).defineSizeMapping(theAd[2]).setTargeting('BLOGPREFIX', [section]).addService(googletag.pubads());
                    //console.log(slot);
                    googletag.display(slotName);
                    googletag.pubads().refresh([slot]);
                });
                } else {
                    var slotName = theAd[0];
                    slotDiv.id = slotName;
                    slotDiv.setAttribute( 'class', 'google_ad' );
                    googletag.cmd.push(function() { googletag.display(slotName); });
                }         
            }
            //test sites =
            loadNextAd(networkSite,adSlotIds[i],siteSection);
            //final sites, with properly set up dfp =
            //loadNextAd(container.data('site'),container.data('id'),container.data('class'),container.data('size'),container.data('map'));
        }
    }

    function rubiconTagPush(adslots,section,network,page) {
        rubicontag.cmd.push(function() {
            rubicontag.addFPV('BLOGPREFIX', section);
            rubicontag.addFPV('page-type', page);
            for (var i=0;i<adslots.length;i++) {
                if (adslots[i] == ('interstitial-ad-tablet-desktop' || 'teads-ad-mobile-tablet-desktop')) {continue};
                var adSpecs = adSizes[adslots[i]];
                if (adSpecs == undefined) {
                    console.log('undefined rubicon ad space:');
                    console.log(adslots[i]);
                    continue
                }
                rubicontag.defineSlot('/'+dfpacct+'/'+network, adSpecs[1], adSpecs[0]).setPosition(adSpecs[5]);
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

    function gptTagPush(adslots,section,network,page) {
        var gptadslots = [];
        googletag.cmd.push(function() {
            for (var i=0;i<adslots.length;i++) {
                if (adslots[i] == ('interstitial-ad-tablet-desktop' || 'teads-ad-mobile-tablet-desktop')) {continue};
                var theslot = adSizes[adslots[i]];
                if (theslot == undefined) {
                    console.log('undefined gpt ad space:');
                    console.log(adslots[i]);
                    continue
                }
                //console.log(theslot);
                gptadslots[i] = googletag.defineSlot('/'+dfpacct+'/'+network, theslot[1], theslot[0]).setTargeting(theslot[3], [theslot[4]]).defineSizeMapping(theslot[2]).setTargeting('BLOGPREFIX', [section]).addService(googletag.pubads());
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

    function getSiteSection(site,section,adsections) {
        if (adsections.length < 0) {
            return section;
        }
        if (section == site) {
            return 'www';
        }
        for (theSection in adsections){
            for (var x=0;x<adsections[theSection].length;x++) {
                if (section == adsections[theSection][x]) {
                    return adsections[theSection][0];
                }
            }
        }
        return section;
    };

    function generateNextAdName(basename) {
        var id = nextAdId++;
        return basename + id;
    }
};

