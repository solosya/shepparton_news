(function ($) {


console.log('In the events. jay ess');















var ListingForm = function() {};
ListingForm.prototype = new Acme._View();
ListingForm.constructor = ListingForm;
    ListingForm.prototype.init = function(blogId, layout) 
    {
        this.blogId = blogId;

        this.data = {
            'id': 0,
            'blogs':this.blogId,
            'media_ids': ''
        };
        this.layout = layout;
        this.addPulldowns();
        this.events();
    };
    ListingForm.prototype.container = {
        'main' : $('#listingForm')
    };
    ListingForm.prototype.listeners = 
    {
        "user listing" : function(data, topic) {
            if (data['user listing'] == null) {
                this.clear();
                return;
            }
            this.data = data['user listing'];
            this.render();
        },
        "after" : function(data, topic) {
            var keys = Object.keys(data);

            if(keys[0] === 'user listing') return;
            var validated = this.validate(keys);

            // if (!validated) {
                this.render();
                // return;
            // }
        }
    };
    ListingForm.prototype.render = function() 
    {
        console.log('rendering');
        var form = this.container.main;
        var title = form.find("#title");
        var content = form.find("#content");

        title.val(this.data.title);
        content.val(this.data.content);

        this.clearErrorHightlights();

        for (key in this.data.extendedData) {
            if (key === 'region') {
                this.menus.regionMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'type') {
                this.menus.propertyMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'contracttype') {
                this.menus.buyMenu.select(this.data.extendedData[key]);
                continue;
            }
            if (key === 'salary') {
                $('#'+key+this.data.extendedData[key]).prop("checked", true);
            }

            $('#'+key).val(this.data.extendedData[key]);
        }


        this.addErrorHightlights();

        if (this.data.id) {
            $('#listingFormSubmit').text('UPDATE');
        }
        if (this.data.mediaData){
            this.renderImageThumbs(this.data.mediaData);
        }
    };
    ListingForm.prototype.clearErrorHightlights = function()
    {
        $("#formerror").removeClass('active');
        for (var field in this.compulsoryFields) {
            var fieldname = this.compulsoryFields[field].split('.').reverse()[0];
            $('#'+fieldname).removeClass('formError');
        }
    }
    ListingForm.prototype.addErrorHightlights = function()
    {
        if (this.errorFields.length > 0) {
            $("#formerror").addClass('active');
        }
        for (var field in this.errorFields) {
            $('#'+this.errorFields[field]).addClass('formError');
        }
    }
    ListingForm.prototype.renderImageThumbs = function(images) 
    {
        var imageArray = $('#imageArray');
        var html = "";
        for (var i=0;i<images.length;i++) {
            var imagePath = images[i].url || images[i].path;
            html += '<div class="formimage" style="background-image:url(' + imagePath + ')"></div>';
        }
        imageArray.append(html);
    },
    ListingForm.prototype.clear = function(images) 
    {
        if (this.menus) {
            var menus = Object.keys(this.menus);
            for(var i=0;i<menus.length;i++) {
                this.menus[menus[i]].reset();
            }
        }
        $('#imageArray').empty();
        this.clearErrorHightlights();
        this.data = {
            'id': 0,
            'blogs': this.blogId,
            'media_ids': ''
        };
    },
    ListingForm.prototype.events = function() 
    {
        console.log('calling events!!');
        var self = this;
        $('input, textarea').on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            var elemid = elem.attr('name');

            data[elemid] = elem.val();
            self.updateData(data);

            if (self.compulsoryFields.indexOf(elemid) > -1 ) {

                if (elem.val() == '') {
                    elem.addClass("formError");
                } else {
                    elem.removeClass("formError");
                }
            } 

        });


        $('.uploadFileBtn').uploadFile({
               onSuccess: function(data, obj){

                    var resultJsonStr = JSON.stringify(data);

                    var postdata = {
                        'blogs' : self.blogId,
                        'imgData' : resultJsonStr
                    };

                    Acme.server.create('/api/article/save-image', postdata).done(function(r) {

                        var newImageId = r.media.media_id;
                        var arrayid = $(obj).data('id');
                        var mediaids = [];
                        if (self.data.media_ids != "") {
                            mediaids = self.data.media_ids.split(',');
                        }
                        mediaids.push(newImageId);
                        self.data.media_ids = mediaids.join(',');
                        self.data.media_id = mediaids[0];

                        self.renderImageThumbs([data]);
                        $().General_ShowNotification({message: 'Image added successfully' });

                    }).fail(function(r) {
                        console.log(r);
                    });
                }
        });

        $('#listingFormClear').on('click', function(e) {
            $('#listingFormSubmit').text('SUBMIT');
            self.clear();
        });

        $('#listingForm').submit(function(e) {
            e.preventDefault();

            var validated = self.validate();
            console.log(validated);
            if (!validated) {
                self.render();
                console.log('rendering and returning');
                return;
            }

            self.data.theme_layout_name = self.layout;
            console.log('article.create!!!', self.data);
            Acme.server.create('/api/article/create', self.data).done(function(r) {
                $('#listingFormClear').click();
                Acme.PubSub.publish('update_state', {'userArticles': ''});
            }).fail(function(r) {
                console.log(r);
            });
        });
    }
    ListingForm.prototype.validate = function(checkFields) {
        console.log('validating');
        console.log(this.data);
        // checkFields is used to validate a single field, 
        // otherwise itereate through all compulsory fields

        // intersect used to clear the field we want to check 
        // from errorFields.  if still an error it will add again.
        function intersect(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        var validated = true, fields = [];
        console.log(this.compulsoryFields);

        if (checkFields) {
            var fields = intersect(this.compulsoryFields, checkFields);
            for (var j=0; j<fields.length;j++) {
                var fieldName = fields[j].split('.').reverse()[0];
                var index = this.errorFields.indexOf(fieldName)
                this.errorFields.splice(index, 1);
            }
        } else {
            var fields = this.compulsoryFields;
            this.errorFields = []; // reset and re-calcuate all fields
        }


        for (var i=0;i<fields.length; i++) {
            var key = fields[i];
            var keySplit = key.split('.');
            var scope = this.data;
            for(var j=0; j<keySplit.length; j++) {

                if (!scope[keySplit[j]]) {
                    scope = false;
                    break;
                }
                if(j == keySplit.length -1 ) {
                    scope = scope[keySplit[j]];
                    break;
                }
                scope = scope[keySplit[j]];
            }

            if (!scope) {
                var fieldname = fields[i].split('.').reverse()[0];
                this.errorFields.push(fieldname); 
                validated = false;
            }
        }
        console.log(this.errorFields);
        return validated;
    };




Acme.EventForm = function(blogId) {
        console.log(blogId);
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.eventForm.listener' : ['state_changed', 'update_state']
        });

        this.errorFields = [];

        this.compulsoryFields = [
            "title", 
            "content" 
        ];

        this.data = {
            'id': 0,
            'blogs': blogId,
            'media_ids': '',
            'type': 'event'
        };

        this.events();
        this.events2();
        // this.init(blogId, layout);
    }
    Acme.EventForm.prototype = new ListingForm();
    Acme.EventForm.prototype.constructor=Acme.EventForm;
    Acme.EventForm.prototype.events2 = function() {

        $('#eventStart, #eventEnd').datetimepicker({
            format: "DD-MM-YYYY h:mm A",
            useCurrent: false,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-angle-up",
                down: "fa fa-angle-down"
            },
            tooltips: {selectTime: ''}
        }).on('dp.change', function (e) {
            if(e.target.id === 'eventStart') {
                $('#eventEnd').data("DateTimePicker").minDate(e.date);
            }
        });

        var EventPostGoogleMap = function () {
            var marker, geocoder;
            var elem = $('#addressMap');
            var latitude = elem.data('latitude');
            var longitude = elem.data('longitude');
            var map;
            
            //google.maps.event.addDomListener(window, 'load', initMap);
            function initMap() {
                var mapLat;
                var mapLong;
                if (latitude !== '' && longitude !== '') {
                    mapLat = latitude;
                    mapLong = longitude;

                    geocoder = new google.maps.Geocoder();
                    map = new google.maps.Map(document.getElementById('addressMap'), {
                        zoom: 10,
                        center: {lat: mapLat, lng: mapLong}
                    });

                    //set current marker
                    if (latitude != '' && longitude != '') {
                        updateMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(latitude, longitude),
                            map: map
                        });
                    }
                } 
                else {
                    //navigator.geolocation.getCurrentPosition(function (position) {});
                    geocoder = new google.maps.Geocoder();
                    map = new google.maps.Map(document.getElementById('addressMap'), {
                        zoom: 1,
                        center: {lat: 43.197167, lng: 56.425781}
                    });
                    
                }
                
                pointLocation(geocoder, map, marker);
            }
            
            initMap();
        };

        var pointLocation = function (geocoder, map, marker) {
            $('#address').on('change', function(e){
                mapLocation();
            });
            
            function mapLocation() {
                var address = $('#address').val();

                geocoder.geocode({address: address}, function (results, status) {
                    
                    if (status === google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(10);

                        //clear the previous marker
                        if (marker) {
                            marker.setMap(null);
                        }
                        marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                        
                        // Set Lat and Long
                        var latitude = results[0].geometry.location.lat();
                        var longitude = results[0].geometry.location.lng();
                        $('#event_latitude').val(latitude);
                        $('#event_longitude').val(longitude);
                    } 
                });
            } 
        };

        EventPostGoogleMap();

    }




}(jQuery));