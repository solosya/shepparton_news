if (typeof OVU === "undefined") {
    OVU = {};
  }
  
  // Config
  OVU.client_PublisherID = "MMGP";
  OVU.client_VideoPlayerID = "Skfq4xLob";
  OVU.client_RecommendationsPlayerID = "Skfq4xLob";
  OVU.client_VideoPlayerAccount = "5370537724001";
  OVU.dsAwsImagesUrl = "https://videos.oovvuu.com/"+OVU.client_PublisherID.toLowerCase()+"/";
  OVU.dsAwsAPIUrl = "https://api.videos.oovvuu.com/v1/dev/recommendations";
  
  // Global config
  OVU.client_UserID = "";
  OVU.client_PublisherArticleID = "";
  OVU.client_PublisherArticleStatus = "";
  OVU.client_ArticleHeadLine = "";
  OVU.client_ArticleLede = "";
  OVU.client_ArticleText = "";
  OVU.client_ArticleTags = "";
  OVU.dsContentLoadingText = "Video Recommendations being retrieved";
  
  OVU.setArticleVideoVars = function(article_id, user_id, headline, lede, article_text, article_status, tags){
    OVU.client_PublisherArticleID = article_id;
    OVU.client_UserID = user_id;
    OVU.client_ArticleHeadLine = headline;
    OVU.client_ArticleLede = lede;
    OVU.client_ArticleText = article_text;
    OVU.client_PublisherArticleStatus = article_status;
    OVU.client_ArticleTags = tags;
  };
  
  OVU.OovvuuCurateVideos = function(article_id, user_id, headline, lede, article_text, article_status, tags) {
    OVU.setArticleVideoVars(article_id, user_id, headline, lede, article_text, article_status, tags);
    OVU.doVideoFormAction('get_recommendations', true);
  };
  
  OVU.closeVideoPlayer = function() {
    bcMyPlayer = videojs("OVU_myPlayerID");
    bcMyPlayer.pause();
    document.getElementById("OVU_videoWrapper").style.display = "none";
  };
  
  OVU.videoLoadedCallback = function() {
    bcMyPlayer = videojs("OVU_myPlayerID");
    bcMyPlayer.play();
  };
  
  OVU.loadVideoPlayer = function(objVideoImage) {
    var videoId = objVideoImage.parentNode.getElementsByClassName("video-id")[0].value;
    if (document.getElementById("OVU_myPlayerID") === null) {
      var playerHTML = '<div id="OVU_videoWrapper" style="position:absolute;top:0;left:0;background-color:#000;width:100%;height:100%;padding:40px 20px 20px;text-align:center;">'
            + '<div id="OVU_videoWrapperInner" style="margin:0 auto;width:100%;height:100%;">'
            + '<video id="OVU_myPlayerID" style="width:100%;height:100%;" data-video-id="'+videoId+'" data-account="'+OVU.client_VideoPlayerAccount+'" data-player="'+OVU.client_VideoPlayerID+'" data-embed="default" class="video-js" controls></video>'
            + '</div>' // END OVU_videoWrapperInner
            + '<a href="javscript:;" onclick="OVU.closeVideoPlayer();" style="display:block;position:absolute;top:0;right:0;padding:10px 15px;color:#fff;text-decoration:none;">Close</a>'
            + '</div>'; // END OVU_videoWrapper
      document.getElementById("getVideosModalInner").insertAdjacentHTML("beforeend", playerHTML);
    } else {
      videojs("OVU_myPlayerID").ready(function() {
        document.getElementById("OVU_videoWrapper").style.display = "block";
        var bcMyPlayer = this;
        bcMyPlayer.catalog.getVideo(videoId, function(error, video) {
          bcMyPlayer.catalog.load(video);
        });
      });
    }
  
    if (document.getElementById("OVU_videoPlayerCore") === null) {
      var bcPlayerScript = document.createElement("script");
      bcPlayerScript.src = "https://players.brightcove.net/"+OVU.client_VideoPlayerAccount+"/"+OVU.client_VideoPlayerID+"_default/index.min.js";
      bcPlayerScript.setAttribute("id", "OVU_videoPlayerCore");
      document.body.appendChild(bcPlayerScript);
      bcPlayerScript.onload = OVU.videoLoadedCallback;
    }
  };
  
  OVU.populateAssetObjFromDisplayRow = function(objRow, position, priority) {
    var objAsset = {};
    objAsset["headline"] = objRow.getElementsByClassName("video-headline")[0].innerText;
    objAsset["short_description"] = objRow.getElementsByClassName("video-description")[0].innerText;
    objAsset["image"] = objRow.getElementsByClassName("video-image")[0].getAttribute("data-src");
    objAsset["player"] = objRow.getElementsByClassName("video-player")[0].value;
    objAsset["position"] = position;
    objAsset["priority"] = priority;
    objAsset["provider_logo"] = objRow.getElementsByClassName("video-provider-logo")[0].value;
    objAsset["duration"] = parseInt(objRow.getElementsByClassName("video-duration")[0].value);
    objAsset["timestamp"] = objRow.getElementsByClassName("video-timestamp")[0].value;
    objAsset["video"] = objRow.getElementsByClassName("video-id")[0].value;
    if (objRow.getElementsByClassName("video-show-name")[0].value != "") {
      objAsset["show_name"] = objRow.getElementsByClassName("video-show-name")[0].value;
    }
    if (objRow.getElementsByClassName("video-advisory")[0].value != "") {
      objAsset["advisory"] = objRow.getElementsByClassName("video-advisory")[0].value;
    }
    return objAsset;
  };
  
  OVU.removeDisplayRow = function(objRow) {
    objRow.parentNode.removeChild(objRow);
  };
  
  OVU.rewritePrioritiesPositions = function() {
    var data = {},
        articleParams = [],
        priorityCounter = 1,
        modalBody = document.getElementById("getVideosModalBody");
  
    // Get hero
    var selectedHeroImage = modalBody.getElementsByClassName("hero-selected")[0];
    if (typeof selectedHeroImage !== 'undefined') {
      // Hero exists
      heroImageRow = selectedHeroImage.parentNode;
      objAsset = OVU.populateAssetObjFromDisplayRow(heroImageRow, "hero", 1);
      articleParams.push(objAsset);
      OVU.removeDisplayRow(heroImageRow);
    }
    priorityCounter++;
  
    // Get fourth
    var selectedFourthImage = modalBody.getElementsByClassName("fourth-selected")[0];
    if (typeof selectedFourthImage !== 'undefined') {
      // Hero exists
      fourthImageRow = selectedFourthImage.parentNode;
      objAsset = OVU.populateAssetObjFromDisplayRow(fourthImageRow, "4th", 2);
      articleParams.push(objAsset);
      OVU.removeDisplayRow(fourthImageRow);
    }
    priorityCounter++;
  
    // Get remaining rows (TICKED ONES ONLY)
    var featureRows = modalBody.getElementsByClassName("video-recommendation-row");
    for (i=0; i<featureRows.length; i++) {
      objRow = featureRows[i];
      // Move checked feature images into the list
      if (objRow.getElementsByClassName("checkbox-input")[0].checked) {
        objAsset = OVU.populateAssetObjFromDisplayRow(objRow, "playlist", priorityCounter);
        articleParams.push(objAsset);
        priorityCounter++;
      }
    }
  
    // Get remaining rows
    var untickedRows = modalBody.getElementsByClassName("video-recommendation-row");
    for (k=0; k<untickedRows.length; k++) {
      objRow = untickedRows[k];
      // Move checked feature images into the list
      if (!objRow.getElementsByClassName("checkbox-input")[0].checked) {
        objAsset = OVU.populateAssetObjFromDisplayRow(objRow, "N/A", 0);
        articleParams.push(objAsset);
      }
    }
    data["article_params"] = articleParams;
    OVU.showRecommendedVideos(JSON.stringify(data));
  };
  
  OVU.setFeatureVideo = function(objImage, priority) {
    if (priority == 1) { // Hero
      classNamePart = "hero";
      secItemNamePart = "fourth";
    } else if (priority == 2) { // Fourth paragraph
      classNamePart = "fourth";
      secItemNamePart = "hero";
    }
    if (objImage.className == classNamePart+"-selected") {
      // UNSELECT ITEM
      objImage.className = classNamePart+"-unselected";
      objImage.style.background = "none";
    } else {
      // SELECT ITEM
      // Unselect others
      var alreadySelectedItem = document.getElementsByClassName(classNamePart+"-selected")[0];
      try {
        alreadySelectedItem.className = classNamePart+"-unselected";
        alreadySelectedItem.style.background = "none";
      } catch(e) {}
      // Select item
      objImage.className = classNamePart+"-selected";
      objImage.style.background = "green";
      // If other feature image is also selected in same row, SWAP it
      var objRow = objImage.parentNode,
          objOtherSelectedImage = objRow.getElementsByClassName(secItemNamePart+"-selected")[0];
      try {
        objOtherSelectedImage.className = secItemNamePart+"-unselected";
        objOtherSelectedImage.style.background = "none";
      } catch(e) {}
      if ((typeof alreadySelectedItem !== 'undefined') && (typeof objOtherSelectedImage !== 'undefined')) {
        objOtherRow = alreadySelectedItem.parentNode;
        objOtherRowImageToSelect = objOtherRow.getElementsByClassName(secItemNamePart+"-unselected")[0];
        try {
          objOtherRowImageToSelect.className = secItemNamePart+"-selected";
          objOtherRowImageToSelect.style.background = "green";
        } catch(e) {}
      }
    }
    OVU.rewritePrioritiesPositions();
  };
  
  OVU.toggleGetVideoCheckbox = function(objRowChild) {
    var objRow = objRowChild.parentNode,
        objRowCheckbox = objRow.getElementsByClassName("checkbox-input")[0],
        objRowCheckboxIcon = objRow.getElementsByClassName("chechbox-icon")[0];
    objRowCheckbox.checked = !objRowCheckbox.checked;
    if (objRowCheckbox.checked) {
      // Checkbox ticked
      objRowCheckboxIcon.src = OVU.dsAwsImagesUrl+"tick-icon.png";
    } else {
      // Checkbox unticked
      objRowCheckboxIcon.src = OVU.dsAwsImagesUrl+"untick-icon.png";
      // If hero or 4th par image selected, unselect this
      var selectedHero = objRow.getElementsByClassName("hero-selected")[0],
          selectedFourth = objRow.getElementsByClassName("fourth-selected")[0];
      if (typeof selectedHero !== 'undefined') {
        selectedHero.className = "hero-unselected";
        selectedHero.style.background = "none";
      } else if (typeof selectedFourth !== 'undefined') {
        selectedFourth.className = "fourth-unselected";
        selectedFourth.style.background = "none";
      }
    }
    OVU.rewritePrioritiesPositions();
  };
  
  OVU.hideModalActionButtons = function() {
    var actionButtons = document.getElementById("getVideosModalInner").getElementsByClassName("video-action-button");
    for(i=0; i<actionButtons.length; i++) {
      actionButtons[i].style.visibility = "hidden";
    }
  };
  
  OVU.showRecommendedVideos = function(responseText, isLoaded) {
    var modalBody = document.getElementById("getVideosModalBody");
    try {
      modalBody.innerHTML = "";
      var responseJson = JSON.parse(responseText),
          assetsArray = responseJson.article_params;
      if (assetsArray.length == 0) {
        modalBody.innerHTML = "<p>No recommended videos have been found for this article</p>";
      } else {
        assetsArray.forEach(function(entry) {
          var heroImageExtraCss = (entry.position == "hero") ? "background:green;" : "",
              heroImageCssClass = (entry.position == "hero") ? "hero-selected" : "hero-unselected",
              fourthImageExtraCss = (entry.position == "4th") ? "background:green;" : "",
              fourthImageCssClass = (entry.position == "4th") ? "fourth-selected" : "fourth-unselected",
              videoHeadline = entry.headline,
              videoShowName = entry.show_name,
              videoAdvisory = entry.advisory,
              videoDescription = entry.short_description,
              videoPlayerId = entry.player,
              checkboxCheckedHtml = (entry.priority == 0) ? "" : "checked='checked'",
              checkboxHtml = "<input class='checkbox-input' type='checkbox' id='chk-"+entry.video+"' style='display:none;' "+checkboxCheckedHtml+">",
              checkboxIcon = (entry.priority == 0) ? "untick-icon.png" : "tick-icon.png";
          try { videoHeadline = videoHeadline.replace(/\'/gi, "&#39;").replace(/\"/gi, "&#34;"); } catch(e1) {}
          try { videoShowName = videoShowName.replace(/\'/gi, "&#39;").replace(/\"/gi, "&#34;"); } catch(e2) {videoShowName = "";}
          try { videoDescription = videoDescription.replace(/\'/gi, "&#39;").replace(/\"/gi, "&#34;"); } catch(e3) {}
          try { videoAdvisory = videoAdvisory.replace(/\'/gi, "&#39;").replace(/\"/gi, "&#34;"); } catch(e4) {videoAdvisory = "";}
          var showNameHtml = (videoShowName == "") ? "" : "<strong>Show Name: </strong>"+videoShowName+"<br>";
          var advisoryHtml = (videoAdvisory == "") ? "" : "<strong>Advisory: </strong>"+videoAdvisory+"<br>";
          if (typeof videoPlayerId === 'undefined' || videoPlayerId === null) {videoPlayerId = OVU.client_RecommendationsPlayerID;}
          var videoRowHtml = "<div style='overflow:hidden;padding:5px 0;' class='video-recommendation-row'>"
            + "<input type='hidden' class='video-id' value='"+entry.video+"'>"
            + "<input type='hidden' class='video-provider-logo' value='"+entry.provider_logo+"'>"
            + "<input type='hidden' class='video-duration' value='"+entry.duration+"'>"
            + "<input type='hidden' class='video-timestamp' value='"+entry.timestamp+"'>"
            + "<input type='hidden' class='video-show-name' value='"+videoShowName+"'>"
            + "<input type='hidden' class='video-player' value='"+videoPlayerId+"'>"
            + "<input type='hidden' class='video-advisory' value='"+videoAdvisory+"'>"
            + checkboxHtml
            + "<img onclick='OVU.toggleGetVideoCheckbox(this);' class='chechbox-icon' src='"+OVU.dsAwsImagesUrl+checkboxIcon+"' style='cursor:pointer;float:left;margin:25px 12px 0 0;width:25px;height:25px;'>"
            + "<div onclick='OVU.loadVideoPlayer(this);' style='float:left;margin-right:15px;position:relative;cursor:pointer;'>"
            + "<img class='video-image' src='https://cdn-images.oovvuu.com/150x0/"+entry.image+"' data-src='"+entry.image+"' style='display:block;width:150px;height:84px;'>"
            + "<img src='"+OVU.dsAwsImagesUrl+"play-icon.png' style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.85;'>"
            + "<div style='text-align:right;'><strong>Duration:</strong> "+OVU.getVideoDurationText(entry.duration)+"</div>"
            + "</div>"
            + "<p style='margin:0;font-size: 13px;display: inline-block;width: calc(100% - 487px);'>"
            + "<strong>Headline:</strong> <span class='video-headline'>"+videoHeadline+"</span><br>"
            + showNameHtml
            + "<strong>Description:</strong> <span class='video-description'>"+videoDescription+"</span><br>"
            + advisoryHtml
            + "<strong>Position:</strong> <span class='video-position'>"+entry.position+"</span><br>"
            + "</p>"
            + "<img onclick='OVU.setFeatureVideo(this,1)' class='"+heroImageCssClass+"' src='"+OVU.dsAwsImagesUrl+"wireframe-hero.png' style='cursor:pointer;display: inline-block;vertical-align:top;position: relative;width: 130px;border: 5px solid transparent;top: -5px;right:0;"+heroImageExtraCss+"'>"
            + "<img onclick='OVU.setFeatureVideo(this,2)' class='"+fourthImageCssClass+"' src='"+OVU.dsAwsImagesUrl+"wireframe-fourth.png' style='cursor:pointer;display: inline-block;margin-left: 5px;vertical-align:top;position: relative;width: 130px;border: 5px solid transparent;top: -5px;right:0;"+fourthImageExtraCss+"'>"
            + "</div>";
          modalBody.insertAdjacentHTML("beforeend", videoRowHtml);
        });
        modalBody.scrollTo({
          'behavior': 'smooth',
          'top': 0
        });
      }
    } catch(e) {
        console.log('in the catch', e);
      modalBody.innerHTML = "<p>" + JSON.parse(responseText).response+"<br><br><a href='javascript:;' onclick='OVU.getVideosClose();'>Return to article &raquo;</a></p>";
      OVU.hideModalActionButtons();
    }
  };
  
  OVU.getVideoDurationText = function(durationMs) {
    var durationText = "";
    if (durationMs == 0 || durationMs == "0" || typeof durationMs == 'undefined' || durationMs == null) {
      durationText = "0s";
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
    return durationText;
  };
  
  OVU.showGetVideosModal = function() {
    var modalTemplate = "<div id='getVideosModal' style='position:fixed;background-color:rgba(0,0,0,0.7);top:0;left:0;width:100%;height:100%;z-index:100000'>"
      + "<div id='getVideosModalInner' style='position:absolute;background-color:#fff;width:80%;height:80%;top:10%;left:10%;'>"
      + "<div style='height:100%;padding: 0 20px;box-sizing:border-box;'>"
      + "<h2 style='margin:0 0 10px;line-height: 49px;border-bottom: 1px solid #222;position:relative;'>"
      + "<img src='"+OVU.dsAwsImagesUrl+"oovvuu-logo.png' style='float: left;height: 30px;margin: 10px 10px 0 0;'>Recommendations"
      + "<input type='button' value='Close' onclick='OVU.getVideosClose();' style='cursor:pointer;outline:none;background-color:transparent;border:0;line-height:35px;font-size: 15px;float: right;padding: 0 6px;margin-top: 7px;'>"
      + "</h2>"
      + "<div style='height: 45px;'>"
      + "<input type='button' value='Save' class='video-action-button' onclick='OVU.confirmVideoSaveAction();' style='cursor:pointer;outline:none;padding:0 20px;display:inline-block;background-color:#222;color:#fff;font-size: 14px;border:0;margin: 5px 0 0 20px;line-height: 32px;float:right;'>"
      + "<input type='button' value='Refresh' class='video-action-button' onclick='OVU.doVideoFormAction(\"refresh\", true);' style='cursor:pointer;outline:none;display:inline-block;background:transparent url("+OVU.dsAwsImagesUrl+"ajax-loader-reload-frame.png) no-repeat center center;float:right;border: 0;text-indent: -9999px;width: 32px;height: 32px;padding: 0;background-size: 22px auto;margin-top: 5px;'>"
      + "<h3 style='margin:0 0 2px;font-weight: normal;font-size: 16px;line-height: 18px;float:left;width:calc(100% - 160px);height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'><strong>Headline:</strong> "+OVU.client_ArticleHeadLine+"</h3>"
      + "<p style='margin:0;font-size:14px;line-height:16px;float:left;clear:left;width:calc(100% - 160px);height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'><strong>Short description:</strong> "+OVU.client_ArticleLede+"</h3></p>"
      + "</div>"
      + "<div id='getVideosModalBody' style='height:calc(100% - 168px);min-height:200px;overflow-y:scroll;margin-bottom:15px;'>"
      + "<p style='line-height:33px;margin:0;'><img src='"+OVU.dsAwsImagesUrl+"ajax-loader-blue.gif' style='float:left;margin-right:10px;'>"+OVU.dsContentLoadingText+"</p>"
      + "</div>" // END getVideosModalBody
      + "<div id='getVideosModalButtons' style='text-align:right;'>"
      + "<input type='button' value='Save' class='video-action-button' onclick='OVU.confirmVideoSaveAction();' style='cursor:pointer;outline:none;padding:0 20px;display:inline-block;background-color:#222;color:#fff;font-size:14px;border:0;line-height:32px;'>"
      + "</div>" // END getVideosModalButtons
      + "</div>"
      + "</div>" // END getVideosModalInner
      + "</div>"; // END getVideosModal
    document.body.insertAdjacentHTML("beforeend", modalTemplate);
  };
  
  OVU.getVideosClose = function() {
    try {document.body.removeChild(document.getElementById("getVideosModal"));} catch(e) {}
    try {document.body.removeChild(document.getElementById("OVU_videoPlayerCore"));} catch(e) {}
  };
  
  OVU.sendJsonData = function(data, doCallback, sendMethod) {
    var xhttp = new XMLHttpRequest();
    if (doCallback) {
      xhttp.onload = function(){ OVU.showRecommendedVideos(xhttp.responseText, true); }
      xhttp.onerror = function(){ OVU.showRecommendedVideos(xhttp.responseText, false); }
    } else {
      xhttp.onload = function(){}
      xhttp.onerror = function(){}
    }
    xhttp.open(sendMethod, OVU.dsAwsAPIUrl, true);
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhttp.send(JSON.stringify(data));
  };
  
  OVU.compileData = function(actionType) {
    var data = {};
    data["action"] = actionType;
    data["user_id"] = OVU.client_UserID;
    data["publisher_id"] = OVU.client_PublisherID;
    data["article_id"] = OVU.client_PublisherArticleID;
  
    if ((actionType == "get_recommendations") || (actionType == "refresh")) {
      data["article_status"] = OVU.client_PublisherArticleStatus;
      data["headline"] = encodeURIComponent(OVU.client_ArticleHeadLine);
      data["lede"] = encodeURIComponent(OVU.client_ArticleLede);
      data["article_text"] = encodeURIComponent(OVU.client_ArticleText);
      data["tags"] = encodeURIComponent(OVU.client_ArticleTags);
    } else if (actionType = "save_selection") {
      // Save user's selection
      var articleParams = [],
          priorityCounter = 1;
      var videoRows = document.getElementsByClassName("video-recommendation-row");
      for (i=0; i<videoRows.length; i++) {
        var row = videoRows[i];
        if (row.getElementsByClassName("checkbox-input")[0].checked) {
          objAsset = {};
          objAsset["headline"] = row.getElementsByClassName("video-headline")[0].innerText;
          objAsset["short_description"] = row.getElementsByClassName("video-description")[0].innerText;
          objAsset["image"] = row.getElementsByClassName("video-image")[0].getAttribute("data-src");
          objAsset["player"] = row.getElementsByClassName("video-player")[0].value;
          objAsset["position"] = row.getElementsByClassName("video-position")[0].innerText;
          objAsset["priority"] = priorityCounter;
          objAsset["provider_logo"] = row.getElementsByClassName("video-provider-logo")[0].value;
          objAsset["duration"] = parseInt(row.getElementsByClassName("video-duration")[0].value);
          objAsset["timestamp"] = row.getElementsByClassName("video-timestamp")[0].value;
          objAsset["video"] = row.getElementsByClassName("video-id")[0].value;
          if (row.getElementsByClassName("video-show-name")[0].value != "") {
            objAsset["show_name"] = row.getElementsByClassName("video-show-name")[0].value;
          }
          if (row.getElementsByClassName("video-advisory")[0].value != "") {
            objAsset["advisory"] = row.getElementsByClassName("video-advisory")[0].value;
          }
          articleParams.push(objAsset);
          priorityCounter++;
        }
      }
      data["article_params"] = articleParams;
    }
    return data;
  };
  
  OVU.showConfirmModal = function(modalText) {
    var continueQuestionHtml = "<br><br>Do you wish to continue?<br><br>",
        modalHTML = '<div id="OVU_modalWrapper" style="position:absolute;top:0;left:0;background-color:rgba(0,0,0,0.9);width:100%;height:100%;padding:40px 20px 20px;box-sizing:border-box;">'
          + '<div id="OVU_modal" style="position:absolute;background-color:#fff;padding:20px;top:50%;left:50%;transform:translate(-50%,-50%);">'
          + '<p style="margin:0;">'+modalText+continueQuestionHtml
          + '<a href="javscript:;" onclick="OVU.doModalAction(\'save_selection\', true);" style="display:inline-block;padding:0 20px;color:#fff;text-decoration:none;line-height:35px;background-color:#000;">Yes</a>'
          + '<a href="javscript:;" onclick="OVU.doModalAction(\'save_selection\', false);" style="display:inline-block;padding:0 20px;color:#555;text-decoration:none;line-height:35px;">Go back</a>'
          + '</p>'
          + '</div>' // END OVU_modal
          + '</div>'; // END OVU_modalWrapper
    document.getElementById("getVideosModalInner").insertAdjacentHTML("beforeend", modalHTML);
  };
  
  OVU.doModalAction = function(actionType, doAction) {
    if (doAction) {
      OVU.doVideoFormAction(actionType, false);
    } else {
      var modalWrapper = document.getElementById("OVU_modalWrapper");
      modalWrapper.parentNode.removeChild(modalWrapper);
    }
  };
  
  OVU.confirmVideoSaveAction = function() {
    var data = OVU.compileData("save_selection"),
        articleParams = data["article_params"],
        modalBody = document.getElementById("getVideosModalBody");
    if (articleParams.length == 0) {
      OVU.showConfirmModal("You have not chosen any videos for the article.");
    } else if (modalBody.getElementsByClassName("hero-selected").length == 0) {
      OVU.showConfirmModal("You have not chosen a video for the Hero spot.");
    } else if (modalBody.getElementsByClassName("fourth-selected").length == 0) {
      OVU.showConfirmModal("You have not chosen a video for the 4th Paragraph spot.");
    } else {
      var featureVideoFound = false;
      for (i=0; i<articleParams.length; i++) {
        if (articleParams[i].position == "playlist") {
          featureVideoFound = true;
          break;
        }
      }
      if (!featureVideoFound) {
        OVU.showConfirmModal("You have not chosen videos for the playlist.");
      } else {
        OVU.doVideoFormAction("save_selection", false);
      }
    }
  };
  
  OVU.doVideoFormAction = function(actionType, doCallback) {
      console.log('getting video recomendations');
    data = OVU.compileData(actionType);
    sendMethod = "POST";
    console.log('sending data');
    OVU.sendJsonData(data, doCallback, sendMethod);
    console.log('after send json data');
    if (actionType == "get_recommendations") {
        console.log('getting video modal');
      OVU.showGetVideosModal();
      console.log('done ');
    } else if (actionType == "refresh") {
      document.getElementById("getVideosModalBody").innerHTML = "<p style='line-height:33px;margin:0;'><img src='"+OVU.dsAwsImagesUrl+"ajax-loader-blue.gif' style='float:left;margin-right:10px;'>"+OVU.dsContentLoadingText+"</p>";
    } else if (actionType == "save_selection") {
      OVU.getVideosClose();
    }
  };
  