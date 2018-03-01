Acme.ArticleController = function() {
    return new Acme.article();
}
Acme.article = function() {
    // this.events();
};

Acme.article.prototype.InsertInterstitial = function() {
    if ($('.article_content > p').length >= 9) {
        // $("<div class='teads-inread' ></div>").insertAfter( $('.article_content > p')[5] );        
    	googletag.cmd.push(function() { googletag.display('div-gpt-ad-teads'); });       
    }
    if ($('.article_content > p').length >= 4) {
        $("<div class='ad-container hidden-md hidden-lg mobad2' style='position:relative;width:300px;margin: 0 auto;'><div id='div-gpt-ad-mrec-2' class='card__announcement-image google_ad google_ad_mrec text-center' ></div></div>").insertAfter( $('.article_content > p')[2] );        
    	googletag.cmd.push(function() { googletag.display('div-gpt-ad-mrec-2'); });
	}
}

Acme.GalleryToggle = function() {
    console.log('running gallery events');
    this.events();
};
Acme.GalleryToggle.prototype.events = function() {
    $('#gallery-toggle').on('click', function(e) {
        var option = $(e.target);

        if (option.hasClass('gallery-toggle__item')) {
            console.log(option);
            var types = ['image', 'video'];
            // var component = $(this);
            // var list = component.children('ul');
            var items = $('.gallery-toggle__item').removeClass('gallery-toggle__item--selected');
            option.addClass('gallery-toggle__item--selected');
            var type = types.indexOf( option.data('type') );

            // var z_index = type ? '3' : '1';
            // $( $('.owl-carousel')[1] ).css('z-index', z_index);
            // console.log($( $('.owl-carousel')[0])) ;
            var show = $('.owl-gallery-' + types[type]);
            var hide = $('.owl-gallery-' + types[!type | 0]);
            hide.removeClass('default');
            show.addClass('default');

        }


        console.log(option);
    });
};