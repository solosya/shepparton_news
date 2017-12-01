/**
 * Handlebar Article templates for listing
 */

window.templates = {};


var screenArticles_1 = 
'<div class="row half-height top-row">\
    {¡{content:1-2}¡}\
</div>\
<div class="row half-height bottom-row">\
    {¡{content:3-5}¡}\
</div>\
';

var systemCardTemplate = 
'<div class="{{containerClass}}"> \
    <a  itemprop="url" \
        href="{{url}}" \
        class="card swap {{{hasArticleMediaClass}}}" \
        data-id="{{articleId}}" \
        data-position="{{position}}" \
        data-social="0" \
        data-article-image="{{{imageUrl}}}" \
        data-article-text="{{title}}"> \
        \
        <article class="">\
            {{#if hasMedia}}\
                <figure>\
                    <img class="img-responsive lazyload" data-original="{{imageUrl}}" src="{{imageUrl}}" style="background-image:url("{{placeholder}}"")>\
                </figure>\
            {{/if}} \
        \
            <div class="content">\
                    <div class="category">{{label}}</div>\
                    <h2>{{{ title }}}</h2>\
                    <div class="author">\
                        <img src="{{profileImg}}" class="img-circle">\
                        <p>{{ createdBy.displayName }}</p>\
                        <time datetime="{{publishDate}}">{{publishDate}}</time>\
                    </div>\
            </div>\
        </article>'+
        
        '{{#if userHasBlogAccess}}'+
            '<div class="btn_overlay articleMenu">'+
                '<button title="Hide" data-guid="{{guid}}" class="btnhide social-tooltip HideBlogArticle" type="button" data-social="0">'+
                    '<i class="fa fa-eye-slash"></i><span class="hide">Hide</span>'+
                '</button>'+
                '<button onclick="window.location=\'{{{editUrl}}}\'; return false;" title="Edit" class="btnhide social-tooltip" type="button">'+
                    '<i class="fa fa-edit"></i><span class="hide">Edit</span>'+
                '</button>'+
                '<button data-position="{{position}}" data-social="0" data-id="{{articleId}}" title="{{pinTitle}}" class="btnhide social-tooltip PinArticleBtn" type="button" data-status="{{isPinned}}">'+
                    '<i class="fa fa-thumb-tack"></i><span class="hide">{{pinText}}</span>'+
                '</button>'+
            '</div>'+
        "{{/if}}"+
    '</a>'+
'</div>';

window.templates.modal = 
'<div id="signin" class="flex_col"> \
    <div id="dialog"> \
        <div> \
            <div class="head"> \
                <h2>{{title}}</h2> \
                <a class="close" href="#"></a> \
            </div> \
            <div id="dialogContent"></div> \
        </div> \
    </div> \
</div>';

window.templates.pulldown = 
'<div id="{{ name }}" class="Acme-pulldown {{class}}"> \
    <p class="Acme-pulldown__selected-item"></p> \
    <span class="Acme-pulldown__span"></span> \
    <ul class="Acme-pulldown__list" data-key="{{ key }}" class="articleExtendedData"></ul> \
</div>';


window.templates.listingSavedTmpl =  '<p>Following approval it will be posted to the events page within 24 hours.</p><div><form><button class="btn _btn dialogButton">Okay</button></form></div>';

                                        
var socialCardTemplate =  '<div class="{{containerClass}}">' +
                                '<a href="{{social.url}}"\
                                    target="_blank"\
                                    class="card swap social {{social.source}} {{#if social.hasMedia}} withImage__content {{else }} without__image {{/if}} {{videoClass}}"\
                                    data-id="{{socialId}}"\
                                    data-position="{{position}}"\
                                    data-social="1"\
                                    data-article-image="{{{social.media.path}}}"\
                                    data-article-text="{{social.content}}">\
                                    <article class="">\
                                        {{#if social.hasMedia}}\
                                            <figure class="{{videoClass}}">\
                                                <img class="img-responsive" src="{{social.media.path}}" style="background-image:url(placeholder">\
                                            </figure>\
                                        {{/if}}\
                                        \
                                        <div class="content">\
                                            <div class="category {{social.source}}">{{social.source}}</div>\
                                            <p id="updateSocial{{article.socialId}}" data-update="0">{{{social.content}}}</p>\
                                            <time datetime="2016-11-16"></time>\
                                            <div class="author">\
                                                <p class="">{{ social.user.name }}</p>\
                                            </div>\
                                        </div>'+


                                        '{{#if userHasBlogAccess}}\
                                            <div class="btn_overlay articleMenu">\
                                                <button title="Hide" data-guid="{{social.guid}}" class="btnhide social-tooltip HideBlogArticle" type="button" data-social="1">\
                                                    <i class="fa fa-eye-slash"></i><span class="hide">Hide</span>\
                                                </button>\
                                                <button title="Edit" class="btnhide social-tooltip editSocialPost" type="button" data-url="/admin/social-funnel/update-social?guid={{blog.guid}}&socialguid={{social.guid}}">\
                                                <i class="fa fa-edit"></i><span class="hide">Edit</span>\
                                                </button>\
                                                <button data-position="{{position}}" data-social="1" data-id="{{socialId}}" title="{{pinTitle}}" class="btnhide social-tooltip PinArticleBtn" type="button" data-status="{{isPinned}}">\
                                                    <i class="fa fa-thumb-tack"></i><span class="hide">{{pinText}}</span>\
                                                </button>\
                                            </div>\
                                        {{/if}}\
                                    </article>\
                                </a>\
                            </div>';


var socialPostPopupTemplate = function(channel) {
    return '<div class="modal-content">'+
    '<button type="button" class="close close__lg-modal" data-dismiss="modal" aria-label="Close">'+
            '<span aria-hidden="true">'+
                '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'+
                        '<title>Close</title>'+
                        '<g stroke-width="3" fill-rule="evenodd" stroke-linecap="round">'+
                                '<path d="M17.803 2L2 17.803M2.08 2.08l15.803 15.803"/>'+
                        '</g>'+
                '</svg>'+
                '<div class="close__text">esc</div>'+
            '</span>'+
        '</button>'+
        '<button type="button" class="close close__sm-modal" data-dismiss="modal" aria-label="Close">'+
            '<span aria-hidden="true">'+
                    '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Close</title><g stroke="#000" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><path d="M17.803 2L2 17.803M2.08 2.08l15.803 15.803"/></g></svg>'+
            '</span>'+
        '</button>'+

        '<div class="social-modal__content {{blog.title}} {{#unless hasMedia}} no_image {{/unless}}">'+
                        '<div class="social-modal__channel social-modal__channel--technology ">' + channel + '</div>'+
                        '<div class="social-modal__overflow">'+

        '{{#if hasMedia}}'+
                            '<div class="social-modal__image_container">'+
                                    '<div class="social-modal__image_wrap">'+
                                            '{{#if hasMediaVideo}}'+
                                                    '<div class="social-modal__video-wrap">'+
                                                            '<iframe style="min-height:360px;width:100%;" src="{{media.videoUrl}}" frameborder="0" allowfullscreen></iframe>'+
                                                    '</div>'+
                                            '{{else}}'+
                                                    '<div class="social-modal__image" style="background-image: url(\'{{media.path}}\');" >'+
                                                            '<img class="social-modal__image_image" src="{{media.path}}" alt="" />'+
                                                    '</div>'+
                                            '{{/if}}'+
                                    '</div>'+
                            '</div>'+
        '{{/if}}'+

                        '<a href="{{url}}" target="_blank"><div class="social-modal__text"><br>{{{content}}}</div></a>'+
                        '</div>'+
                        '<div class="social-user">'+
                            '<div class="social-user__author-wrap">'+
                                '<span class="social-user__author">@{{user.name}}</span>'+
                            '</div>'+
                        '</div>'+
        '</div>'+
     '</div>'   ;   
}
