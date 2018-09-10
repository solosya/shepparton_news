if (typeof OVU === "undefined") {
    OVU = {};
  }
  
  // Config
  OVU.bcRecPublisherId = 'MMGP';
  OVU.videoURL = "https://video."+window.location.href.replace('www.','').split("//")[1];
  if(window.location.href.indexOf("shepp") > -1)
    OVU.bcArticleId = 'masthead_sn';
  else if(window.location.href.indexOf("riverine") > -1)
    OVU.bcArticleId = 'masthead_rh';
  else
    OVU.bcArticleId = 'masthead';
  OVU.bcRecPublisherAccountId = '5370537724001';
  OVU.bcRecDefaultPlayerId = 'Skfq4xLob';
  OVU.bcVideoInfoBgColour = '#EEEEEE';
  OVU.dsAwsAPIUrl = "https://api.videos.oovvuu.com/v1/recommendations";
  
  ////////////////////////////////////
  // Custom functions
  ////////////////////////////////////
  OVU.getArticleId = function() {
    return OVU.bcArticleId;
  };
  
  ////////////////////////////////////
  // Common functions
  ////////////////////////////////////
  OVU.getParameters = function() {
      return {
          'article': OVU.getArticleId(),
          'publisher': OVU.bcRecPublisherId,
          'url': encodeURIComponent(window.location.href)
      }
  };
  
  OVU.getRecommendedVideoList = function() {
      var params = OVU.getParameters();
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              console.log(this.responseText);
              var respObj = JSON.parse(this.responseText);
              OVU.showRecommendedVideos(respObj);
              }
          };
      xhttp.open(
          "GET",
          OVU.dsAwsAPIUrl + "?" + OVU.objToQueryString(params),
          true);
      xhttp.send();
  };
  
  OVU.showRecommendedVideos = function(respObj) {
      if (respObj) {
      var countVideos = 1;
          var articleId = respObj['article_id'];
          var publisherID = respObj['publisher_id'];
          var articleDetails = respObj['article_params'];
          var ovuHomePageContainer = document.getElementById('home-video');
  
          if (typeof articleDetails !== 'undefined') {
        if(ovuHomePageContainer !== null){
          var homeHeaderHTML = '<div class="row"><div class="col-sm-9 section-header"><p><a href="'+OVU.videoURL+'">View All</a></p><div class="hk"><h2>Videos</h2><p></p></div></div></div><div class="row" id="ovu-inner-div"></div>';
          ovuHomePageContainer.insertAdjacentHTML('beforeend', homeHeaderHTML);
        }
        var ovuHomePageDivContainer = document.getElementById('ovu-inner-div');
              articleDetails.forEach((article, index) => {
                  var articlePlayer = article['player'] || OVU.bcRecDefaultPlayerId;
          // TODO: Fire an event if template is missing any of the DIV's
          if(ovuHomePageDivContainer !== null && countVideos <= 3) {
           ovuHomePageDivContainer.insertAdjacentHTML('beforeend', OVU.getVideoHomeHtml(article));
           countVideos++;
          }
              });
  
          }
      }
  };
  
  OVU.getVideoHomeHtml = function(article) {
    var assetURL = '';
    if(article['play_url'])
      assetURL = OVU.videoURL+article['play_url'];
    else
      assetURL = OVU.videoURL+'watch/'+article['image'].substring(0, article['image'].indexOf('.'));
    ovuVideoContainerHtml = '<div class="ovu-video-wrapper col-sm-3 card-sm-wide card-sm-tablet card-sm-mobile">'
      + '<a href="'+assetURL+'" class="swap card article withImage__content"><article class><figure class><picture>'
      + '<img class="img-responsive lazyload" src="https://cdn-images.oovvuu.com/300x160/'+article['image']+'" data-original=""></picture></figure>'
      + '<div class="ovu-video-information content"><div class="category">video</div>'
      + '<h2 class="ovu-video-headline" style="height: auto;">'+article['headline']+'</h2>'
      + '<div class="author"><p class="shepparton">'
      + OVU.getVideoDateFormatHtml(article['timestamp'])+'</p>'
      + '<time datetime="" style="padding-left:5px;">'+OVU.getVideoDurationHtml(article['duration'])+'</time>'
      + '</div></article></a></div><hr class="divide visible-xs-block">';
  
    return ovuVideoContainerHtml;
  };
  
  OVU.objToQueryString = function(obj) {
      var k = Object.keys(obj);
      var s = "";
      for(var i=0;i<k.length;i++) {
          s += k[i] + "=" + encodeURIComponent(obj[k[i]]);
          if (i != k.length -1) s += "&";
      }
      return s;
  };
  
  OVU.getVideoDurationHtml = function(durationMs) {
    var durationText = "";
    if (durationMs == 0 || durationMs == "0" || typeof durationMs == 'undefined' || durationMs == null) {
      return "";
    } else {
      var durationSeconds = durationMs / 1000;
      durationSeconds = Math.ceil(durationSeconds);
      if (durationSeconds < 60) {
        durationText = durationSeconds + "s";
      } else if (durationSeconds < 600) {
        durationText = Math.floor(durationSeconds / 60) + "m ";
        durationText += (durationSeconds % 60) + "s";
      } else {
        durationText = Math.ceil(durationSeconds / 60) + "m";
      }
    }
    return '<div class="ovu-video-duration">'+durationText+'</div>';
  };
  
  OVU.getVideoDateFormatHtml = function(dateValue) {
    var strDate = '';
    if(dateValue.includes("T"))
      strDate = dateValue.substring(0, dateValue.indexOf('T'));
    else {
      strDate = dateValue.substring(0, dateValue.indexOf(' '));
    }
    strDate = strDate.split('-');
    return strDate[2]+'-'+strDate[1]+'-'+strDate[0];
  };
  
  document.addEventListener("DOMContentLoaded", OVU.getRecommendedVideoList);