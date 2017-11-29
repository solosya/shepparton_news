Acme.ArticleController = function() {
    return new Acme.article();
}
Acme.article = function() {
    // this.events();
};

Acme.article.prototype.InsertInterstitial = function() {
    if ($('.article_content > p').length >= 9) {
        $("<div class='teads-inread' ></div>").insertAfter( $('.article_content > p')[5] );        
    	googletag.cmd.push(function() { googletag.display('div-gpt-ad-teads'); });       
    }
    if ($('.article_content > p').length >= 4) {
        $("<div class='ad-container hidden-md hidden-lg'><div id='div-gpt-ad-mrec-7' class='card__announcement-image google_ad google_ad_mrec text-center' ></div></div>").insertAfter( $('.article_content > p')[3] );        
    	googletag.cmd.push(function() { googletag.display('div-gpt-ad-mrec-7'); });
	}
}