Acme.ArticleController = function() {
    return new Acme.article();
}
Acme.article = function() {
    this.events();
};

Acme.article.prototype.getOovvuuVideos = function() {
    // console.log('getting oovvuu videos');
    var url = 'https://905wo67qr6.execute-api.us-west-2.amazonaws.com/v1/MMGP/list/publisher/47?limit=3';

    Acme.server.fetch(url).then(function(r) {
        console.log(r);
    });
}



// Acme.article.prototype.insertOovvuu = function() {
//     articleContent = $("#articleContent").children();
//     try {
//         oovvuu = jQuery.parseJSON($("#oovvuu").text());
//         brightcove = $("#brightcove").text().trim();
//         if (brightcove == '') {brightcove = "5370537724001";} 
//         if (oovvuu.status_code == 200) {
//             oovvuu = oovvuu.embedCodes.group1;
//             minPars = 9;
//             targetPars = [3, 100];
//             for (i=0; i < targetPars.length; i++) {

//                 //if ($('.article_content > p').length > targetPars[i]) {

//                     if (oovvuu.length > i) {

//                         content = 
//                         '<div class="oovvuu-video"> \
//                             <div style="padding-top: 56.25%;">\
//                                 <iframe src="//players.brightcove.net/'+brightcove+'/default_default/index.html?videoId='+oovvuu[i].embed_code+'" \
//                                         allowfullscreen\
//                                         webkitallowfullscreen\
//                                         mozallowfullscreen\
//                                         style="width: 100%; height: 100%; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;"> \
//                                 </iframe>\
//                             </div> \
//                         </div> \
//                         <p class="oovvuu-video__text">Related videos powered by Oovvuu</p>';

//                         targetPar = targetPars[i];
//                         if( $('.article_content > p').length < targetPars[i]) {
//                             targetPar =  $('.article_content > p').length-1;
//                             i = targetPars.length;
//                             if ($('.article_content > p').length < minPars) {
//                                 targetPar = -1;
//                             }
//                         }
//                         if (targetPar > 0) {
//                             $(content).insertAfter( $('.article_content > p')[targetPar-1]);
//                         }
//                     }
//                 //}
//             }
//         }
//     } catch(err) {
//         console.log(err);
//     }
        

    
// };


Acme.article.prototype.InsertInterstitial = function() {
    if ($('.article_content > p').length >= 9) {
        // $("<div class='teads-inread' ></div>").insertAfter( $('.article_content > p')[5] );        
    	teadsAd = true;       
    }
    if ($('.article_content > p').length >= 7) {
        $("<div class='visible-xs-block ad-article' style='position:relative;width:300px;margin: 0 auto;'><div class='advert-mobile' data-adsize='mrec'></div></div>").insertAfter( $('.article_content > p')[6] );
	}
}
Acme.article.prototype.events = function() {
    var self=this;

    $('#oovvuu-curate').on('click', function(e) {
        e.preventDefault();
        console.log('go gadget go!');
        var article_text = $('#articleContent').text();
        var id = $('#article-content').data('id');
        var headline = $('#article-title').text();
        var status = $('#article-content').data('status');

        console.log(content, id, title);
        OVU.OovvuuCurateVideos(id, null, headline, null, article_text, status);
        // OVU.OovvuuCurateVideos(id, user_id, headline, lede, article_text,article_status, tags);

    });
}


Acme.GalleryToggle = function() {
    this.events();
};
Acme.GalleryToggle.prototype.events = function() {
    $('#gallery-toggle').on('click', function(e) {
        var option = $(e.target);

        if (option.hasClass('gallery-toggle__item')) {
            var types = ['image', 'video'];
            var items = $('.gallery-toggle__item').removeClass('gallery-toggle__item--selected');

            option.addClass('gallery-toggle__item--selected');
            var type = types.indexOf( option.data('type') );

            var show = $('.owl-gallery-' + types[type]);
            var hide = $('.owl-gallery-' + types[!type | 0]);
            hide.removeClass('default');
            show.addClass('default');

        }
    });
};