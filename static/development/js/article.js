Acme.ArticleController = function() {
    return new Acme.article();
}
Acme.article = function() {
    // this.events();
};

Acme.article.prototype.InsertInterstitial = function() {
    if ($('.article_content > p').length >= 9) {
        $("<div id='interAd'></div>").insertAfter( $('.article_content > p')[4] );        
    }
}