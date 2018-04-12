Acme.InsertAds = function() {
    var pageAdSlots = $('.advert');
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
                var slotDiv = document.createElement('div');
                adSlot.appendChild(slotDiv);
                if (adDivId == 'infinite-variable-mobile-tablet-desktop') {
                    console.log('LOADMORE ONLY:');
                    var slotName = generateNextAdName(theAd[0]);
                    slotDiv.id = slotName;
                    slotDiv.setAttribute( 'class', 'google_ad' );
                    googletag.cmd.push(function() {
                    var slot = googletag.defineSlot('/'+dfpacct+'/'+blogAd, theAd[1], theAd[0]).setTargeting(theAd[3],[theAd[4]]).defineSizeMapping(theAd[2]).setTargeting('BLOGPREFIX', [section]).addService(googletag.pubads());
                    console.log(slot);
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
                if (adslots[i] == 'interstitial-ad-desktop-tablet') {continue};
                var theslot = adSizes[adslots[i]];
                if (theslot == undefined) {
                    console.log('undefined gpt ad space:');
                    console.log(adslots[i]);
                    continue
                }
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

