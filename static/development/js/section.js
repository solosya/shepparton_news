Acme.SectionController = function() {
    return new Acme.section();
}
Acme.section = function() {
    this.events();
};

Acme.section.prototype.events = function() 
{
    console.log('')

    var totalPosts = parseInt($('main').data('article-count'));
    var limit = parseInt($('main').data('article-limit'));
    console.log('moo');
    console.log(totalPosts);
    if (totalPosts >= limit) {
        var waypoint = new Waypoint({
            element: $('.loadMoreArticles'),
            offset: '80%',
            handler: function (direction) {
                if (direction == 'down') {
                    Acme.cardController.loadMore($(this.element), waypoint);
                }
            }
        });
    }
}