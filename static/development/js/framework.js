(function ($) {
    if (typeof window.Acme === 'undefined') {window.Acme = {};}

    Acme.View         = {};
    Acme.Model        = {};
    Acme.Collection   = {};
    Acme.Controller   = {};
    Acme.State        = {};

    $('html').on('click', function(e) {
        $('.Acme-pulldown ul').hide();
    });

    Acme.server = {

        create: function(uri, queryParams) {return this.call(uri, queryParams, 'post');},
        fetch: function(uri, queryParams, datatype){return this.call(uri, queryParams, 'get', datatype);},
        update: function(uri, queryParams) {return this.call(uri, queryParams, 'put');},
        delete: function(uri, queryParams) {return this.call(uri, queryParams, 'delete');},
        call: function(uri, queryParams, type, datatype) {

            if (!window.location.origin) {
                 window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
            type = (typeof type !== 'undefined') ? type : 'get';

            queryParams = (typeof queryParams !== 'undefined') ? queryParams : {};
            
            var url = (uri.indexOf("http") === 0) ? uri : _appJsConfig.appHostName + uri;
            console.log(url);
            return $.ajax({
                url: url,
                data: queryParams,
                dataType: datatype || "json",
                type: type
            }).fail(function(r) {
                console.log(r);
                if (r.status == 501 || r.status == 404) console.log(r.responseText);
                if (r.responseJSON) console.log(r.responseJSON);
                console.log(r.responseText);
            });
        },
        callClient: function(uri, queryParams, type) {
            type = (typeof type !== 'undefined') ? type : 'get';
            queryParams = (typeof queryParams !== 'undefined') ? queryParams : '';
            return $.ajax({
                url: window.location.origin + uri,
                data: queryParams,
                dataType: "json",
                type: type
            });
        }
    }

    Acme.listen = function() {};
    Acme.listen.prototype.listener = function(topic, data)
    {
        var keys = Object.keys(data);
        for (var i = 0; i<keys.length; i++) {
            for (var listener in this.listeners) {
                if ( listener === keys[i] ) {
                    this.listeners[listener].call(this, data, topic);
                    if (this.listeners.after) {
                        this.listeners.after.call(this, data, topic);
                    }
                    break;
                }
            }
        }
    };


    Acme.Model.create = function(config)
    {
        var obj = Object.create(
        Acme._Model.prototype, {
            'resource': {
                    'value' : config['url'],
                    'enumerable': true,
                },
                'alias' : {
                    'value' : config['alias'] || null,
                    'enumerable': true,
                },
                'resource_id': {
                    'value' : config['resource_id'],
                    'enumerable': true,
                },
                'query' : {
                    'value': [],
                    'writable': true,
                    'enumerable': true,
                }
            }
        );
        for (var param in config['this']) {
            obj[param] = config['this'][param];
        }
        obj.messages = {
            'set'   : 'updated',
            'delete': 'deleted',
        };

        if (config['messages']) {
            for (var msg in config['messages']) {
                obj.messages[msg] = config['messages'][msg];
            }
        }

        return obj;
    };



    Acme._View = function() {};
        Acme._View.prototype = new Acme.listen();
        Acme._View.prototype.updateData = function(data) {

            var key = Object.keys(data)[0];
            var keySplit = key.split('.');
            var scope = this.data;

            for(var i=0; i<keySplit.length; i++) {
                if (!scope[keySplit[i]]) {
                    scope[keySplit[i]] = {};
                }
                if(i == keySplit.length -1 ) {
                    scope[keySplit[i]] = data[key];
                }
                scope = scope[keySplit[i]];
            }
        }

    Acme.View.create = function(config)
    {
        var obj = function(){};

        for (conf in config) {
            obj.prototype[conf] = config[conf];
        }

        return obj;
    }

    Acme._Collection = function(model) {
        this.model = model || null;
    };
        Acme._Collection.prototype = Object.create(Acme.listen.prototype);
        Acme._Collection.prototype.fetch = function(url)
        {
            var self = this;
            var publishToken = self.name;
            var url = (url === undefined) ? this.url() : url;
            var data = Acme.server.fetch( url );
            data.done( function(response) {

                self.data = [];
                for (var i=0; i<response.length; i++) {
                    self.data.push( Object.create(self.model,
                        {   'data' : {
                                'value': response[i],
                                'writable': true
                            }
                        }
                    ));
                }

                var data = {};
                data[publishToken] = self;
                Acme.PubSub.publish('state_changed', data);
            });
            return data;
        };

    Acme._Model = function() {};
        Acme._Model.prototype = Object.create(Acme.listen.prototype);
        Acme._Model.prototype.url = function()
        {
            if (this.resource_id) {
                var scope = this;
                var scopeSplit = this.resource_id.split('.');
                for (var k = 0; k < scopeSplit.length; k++) {
                    scope = scope[scopeSplit[k]];
                    if (scope == undefined) return;
                }
                var resource_id = scope
            }
            var id = resource_id || this.data.id;
            return this.resource + '/' + id + this.buildParams();
        };
        Acme._Model.prototype.buildParams = function()
        {
            var query = '';
            for(var i=0;i<this.query.length; i+=2) {
                if (this.query[i+1] != false ) {
                    query += (i===0) ? '?' : '&';
                    query += this.query[i] + '=' + this.query[i+1];
                }
            }
            return query;
        };
        Acme._Model.prototype.fetch = function(set)
        {
            var self = this;
            var set = (set === void 0) ? true : set;
            return Acme.server.request(self.url())
            .done(function(r) {
                if (set) self.set(r.data);
            });
        };
        Acme._Model.prototype.update = function(data, msg)
        {
            var self = this;

            return Acme.server.update(self.url(), data)
            .done(function(d, status, xhr) {
                if (xhr.status === 200) {
                    self.set(data, msg);

                    var message = self.resource + '/update';

                    // console.log(Acme.socket.send(JSON.stringify({action: message, value: self.data.id})));

                }
            });
        };

        Acme._Model.prototype.updater = function()
        {
            var self = this;
            var _url = self.url();

            return function(data, msg) {
                return Acme.server.update(_url, data)
                .done(function(d, status, xhr) {
                    if (xhr.status === 200) {
                        self.set(data, msg);
                    }
                });
            }
        };

        Acme._Model.prototype.set = function(value, msg)
        {
            var suppress = msg || false;
            for (var v in value) {
                this.data[v] = value[v];
            }
            if (!suppress) {
                var resource = {};
                resource[this.resource] = this;
                // Acme.PubSub.publish('state_changed', resource);
                // Acme.PubSub.publish('update_state', resource);
                Acme.PubSub.publish(this.resource + '/' + this.messages.set, this);
            }
        };
        Acme._Model.prototype.delete = function()
        {
            var self = this;
            var name = self.alias || self.resource;
            var msg = name + '/delete';

            // console.log(Acme.socket.send(JSON.stringify({action: msg, value: self.data.id})));

            return Acme.server.delete(self.url())
            .done(function(response) {
                if (response.data == true) {
                    self.data = {};
                    var data =  {};
                    data[name] = null;
                    // console.log(data);
                    Acme.PubSub.publish('update_state', data);
                }
            });
        };




    Acme.PubSub = {
        topics : {},
        lastUid : -1,
    };

        Acme.PubSub.publisher = function(topic, data) {
            var self = this;
            var Deferred = function() {
                return {
                    done: function(func) {
                        this.func = func;
                    },
                    resolve: function() {
                        if (this.func) {
                            this.func();
                        }
                    }
                }
            };

            if ( !this.topics.hasOwnProperty( topic ) ){
                return false;
            }

            var dfd = Deferred();

            var notify = function(){
                var subscribers = self.topics[topic];

                for ( var i = 0, j = subscribers.length; i < j; i++ ){
                    var scope = window;
                    var scopeSplit = subscribers[i].context.split('.');

                    for (var k = 0; k < scopeSplit.length - 1; k++) {
                        scope = scope[scopeSplit[k]];
                        if (scope == undefined) return;
                    }

                    var caller = scope[scopeSplit[scopeSplit.length - 1]];
                    var func   = subscribers[i].func;
                    // console.log(topic, data);
                    // console.log(caller, func);
                    if (caller) {
                        caller[func]( topic, data );
                    }
                }
                dfd.resolve();
            };

            setTimeout( notify , 0 );

            return dfd;
        };

        Acme.PubSub.publish = function( topic, data ){
            return this.publisher( topic, data, false );
        };

        Acme.PubSub.reset = function( ){
            this.lastUid = -1;
        };

        Acme.PubSub.print = function(){
            var subscribers = this.topics;
            for (var sub in subscribers) {
                for ( var i = 0; i < subscribers[sub].length; i++ ) {
                }
            }
        };

        Acme.PubSub.subscribe = function( subscription ) {
            var callbacks = Object.keys(subscription);
            var ret_topics = {};

            for (var i=0;i<callbacks.length; i++) {
                for(var j=0;j<subscription[callbacks[i]].length;j++) {
                    var topic = subscription[callbacks[i]][j];

                    var context = callbacks[i].substring(0, callbacks[i].lastIndexOf('.'));

                    var func = callbacks[i].substring(callbacks[i].lastIndexOf('.') + 1);

                    if ( !this.topics.hasOwnProperty( topic ) ) {
                        this.topics[topic] = [];
                    }

                   for (var k=0;k<this.topics[topic].length; k++) {
                        if (this.topics[topic][k].context === context && this.topics[topic][k].func === func) {
                            return;
                        }
                    }

                    var token = (++this.lastUid).toString();

                    this.topics[topic].push( { token : token, func : func, context : context } );
                    ret_topics[topic] = this.topics[topic];
                }

            }
            return ret_topics;
        };

        Acme.PubSub.unsubscribe = function( token ){
            for ( var m in this.topics ){
                if ( this.topics.hasOwnProperty( m ) ){
                    for ( var i = 0, j = this.topics[m].length; i < j; i++ ){
                        if ( this.topics[m][i].token === token ){
                            this.topics[m].splice( i, 1 );
                            return token;
                        }
                    }
                }
            }
            return false;
        };










    Acme.listMenu = function(config)
    {
        this.defaultTemp      = Handlebars.compile(window.templates.pulldown);
        this.defaultItemTemp  = Handlebars.compile('<li data-clear="{{clear}}" data-value="{{value}}" style="text-align:left">{{label}}</li>');
        this.divider          = "<hr>";
        this.menuParent       = config.parent        || {};
        this.class            = config.class         || "";
        this.template         = config.template      || this.defaultTemp;
        this.itemTemp         = config.itemTemp      || this.defaultItemTemp;
        this.list             = config.list          || [];
        this.allowClear       = config.allowClear    || null;
        this.defaultSelection = config.defaultSelect || null;
        this.name             = config.name          || null;
        this.key              = config.key           || null;
        this.listContainer    = null;
        this.defaultItem      = null;
        return this;
    };
        Acme.listMenu.prototype.init = function(prepend)
        {
            var prepend = prepend || 'append';
            this.menuParent[prepend]( this.template({"name": this.name, "key":this.key, "class":this.class}) );
            this.defaultItem   = $('#' + this.name+' p');
            this.listContainer = $('#' + this.name+' ul');
            this.events();
            if (this.extendedEvents) this.extendedEvents();
            return this;
        };
        Acme.listMenu.prototype.render = function()
        {
            this.listContainer.empty();
            if (this.defaultSelection != null) {
                this.defaultItem.text(this.defaultSelection.label);
            }
            var html = this.createList();
            this.listContainer.append( html );
            this.listElements  = this.listContainer.find('li');
            this.listItemEvents();
            return this;
        };
        Acme.listMenu.prototype.events = function()
        {
            var self = this;
            this.defaultItem.parent().on('click', function(e) {
                e.stopPropagation();
                self.listContainer.toggle();
            });
        };
        Acme.listMenu.prototype.createList = function()
        {
            var itemTemp = this.itemTemp;
            var html = '';
            if (this.allowClear) {
                html = itemTemp({
                    'label'   :  'Any',
                    'value'   :  '',
                    'clear'   : true
                });      
            }

            for (var i=0; i<this.list.length; i++) {
                if (typeof this.list[i] === 'string') {
                    var label = value = this.list[i];
                } else {
                    var label = this.list[i].label;
                    var value = this.list[i].value;
                }
                html += itemTemp({
                    'label'   :  label,
                    'value'   :  value
                });
            }
            return html;
        };
        Acme.listMenu.prototype.listItemEvents = function()
        {
            var self = this;
            this.listContainer.on('click', function(e) {
                $.each(self.listElements, function(i,e) {
                    $(e).attr('checked', false);
                });
                var elem = $(e.target);
                var value = elem.data('value');
                var clear = elem.data('clear');
                elem.attr('checked', true);
                var data = {};
                data[self.key || self.name] = value;

                Acme.PubSub.publish('update_state', data);
                
                if (clear) {
                    self.reset();
                } else {
                    self.defaultItem.text(elem.text())
                                    .addClass('Acme-pulldown__selected-item--is-active');
                }

                $(self.listContainer).hide(100);
            });
        };
        Acme.listMenu.prototype.select = function(item)
        {
            var menuid = '#' + this.name + ' > p';
            $(menuid).text(item);
            return this;
        };
        Acme.listMenu.prototype.reset = function()
        {

            // var menuid = $('#' + this.name + ' > p');
            this.defaultItem.text(this.defaultSelection.label)
                  .removeClass('Acme-pulldown__selected-item--is-active');
            return this;
        };
        Acme.listMenu.prototype.remove = function()
        {
            $('#' + this.name).remove();
            return this;
        };
        Acme.listMenu.prototype.clear = function()
        {
            $('#' + this.name).html('');
            return this;
        };
        Acme.listMenu.prototype.empty = function()
        {
            this.listContainer.empty();
            return this;
        };
        Acme.listMenu.prototype.update = function(list)
        {
            this.list = list;
            this.empty();
            this.render();
            return this;
        };


    /***                             ****
        Base Class for all Forms
    ***                              ****/
   Acme.Form = function(validators, rules) {
    this.errorField;
    this.errorFields;
    this.validators = validators || Acme.Validators;
    this.validateRules = rules || {};
};
    Acme.Form.prototype = new Acme._View();
    Acme.Form.constructor = Acme.Form;
    Acme.Form.prototype.clearInlineErrors = function()
    {
        if (this.errorField) {
            this.errorField.removeClass('active');
        }
        for (var field in this.validateFields) {
            var fieldname = this.validateFields[field].split('.').reverse()[0];
            $('#'+fieldname).removeClass('formError');
        }
    };
    Acme.Form.prototype.addInlineErrors = function()
    {
        if (this.errorFields.length > 0 && this.errorField) {
            this.errorField.addClass('active');
        }
        for (var field in this.errorFields) {
            $('#'+this.errorFields[field]).addClass('formError');
        }
    };

    Acme.Form.prototype.validate = function( /* Array */ checkFields)  {
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
        if (checkFields && this.validateFields) {
            var fields = intersect(this.validateFields, checkFields);
            for (var j=0; j<fields.length;j++) {
                var fieldName = fields[j].split('.').reverse()[0];
                var index = this.errorFields.indexOf(fieldName);
                if (index === -1) break;
                this.errorFields.splice(index, 1);
            }
        } else {
            var fields = this.validateFields || [];
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

            // DO THE VALIDATE!!!
            var fieldValidators = this.validateRules[key];
            if (fieldValidators.length > 0) {

                var fieldname = fields[i].split('.').reverse()[0];
                for (var k=0; k<fieldValidators.length; k++) {
                    if ( !this.validators[ fieldValidators[k] ](scope) ) {
                        this.errorFields.push(fieldname); 
                        validated = false;
                        break;
                    }
                }
            }
        }
        return validated;
    };




Acme.Validators = {
    'notEmpty' : function(input) {
        return !input ? false : true;
    },
    'isNumeric' : function(n) {
        if (!n) return true;
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    'username' : function(text) {
        return (text.length > 4);
    },  
    'isTrue' : function(data) {
        return (data === 'true' || data === true) ? true : false;
    }
};








    Acme.modal = function(template, name, layouts, data) {
        this.parentCont = name || null;
        this.template = template || null;
        this.layouts = layouts   || null;
        this.data = data         || {};
        this.dfd = $.Deferred();
    }
        Acme.modal.prototype = new Acme.listen();

        Acme.modal.prototype.render = function(layout, title, data) {
            var preRendered = false;

            if (typeof data === 'string') {
                preRendered = true;
            } else {
                this.data = data || this.data;
            }
            
            if (title) {
                this.data['title'] = title;
            }


            this.data['name'] = this.parentCont;
            var tmp = Handlebars.compile(window.templates[this.template]);
            var tmp = tmp(this.data);

            $('body').addClass('active').append(tmp);

            if (layout) {
                this.renderLayout(layout, this.data);
            }

            if (preRendered) {
                this.renderPreLayout(data);
            }

            this.events();
            this.rendered(); // lifecycle hook that can be overriden
            return this.dfd.promise();
        };
        Acme.modal.prototype.renderLayout = function(layout, data) {
            var data = data || {};

            var tmp = Handlebars.compile(window.templates[this.layouts[layout]]);
            var layout = tmp(data);
            // var layout = window.templates[this.layouts[layout]];

            $('#'+this.parentCont).find('#dialogContent').empty().append(layout); 
        };
        Acme.modal.prototype.renderPreLayout = function(html) {
            $('#'+this.parentCont).find('#dialogContent').empty().append(html); 
        };
        Acme.modal.prototype.events = function() 
        {
            var self = this;
            $('#'+this.parentCont).on("click", function(e) {
                self.handle(e);
            });

        };
        Acme.modal.prototype.rendered = function() {
            return true;
        };
        Acme.modal.prototype.handle = function(e) {
            var $elem = $(e.target);

            if (!$elem.is('input')) {
                e.preventDefault();
            }

            if ( $elem.is('button') ) {
                if ($elem.text().toLowerCase() === "cancel" || $elem.data('role') == 'cancel') {
                    this.dfd.fail();
                    this.closeWindow();

                } else if ($elem.text().toLowerCase() === "okay" || $elem.data('role') == 'okay') {
                    this.dfd.resolve();
                    this.closeWindow();


                    // State can be provided by client external to 'show' call
                    // if (data === undefined && that.state) {
                    //     data = that.state;
                    // // If data is also provided we merge the two
                    // } else if (that.state) {
                    //     var keys = Object.keys(that.state)
                    //     for (var k=0; k<keys.length;k++) {
                    //         data[keys[k]] = that.state[keys[k]];
                    //     }
                    // }

                    // if (self != undefined) {
                    //     if (data != undefined) {
                    //         var result = callback.call(self, data);
                    //         this.dfd.resolve(result);
                    //     } else {
                    //         var result = callback.call(self);
                    //         this.dfd.resolve(result);
                    //     }
                    // } else {
                    //     var result = callback();
                    //     this.dfd.resolve(result);
                    // }
                }
            }
            return $elem;
        };
        Acme.modal.prototype.closeWindow = function() {
            $('body').removeClass('active');
            $('#'+this.parentCont).remove();
        };
    



    Acme.dialog = {
        type : '',
        state : {},

        show : function(message, type, callback, self, data) {
            var that = this;
            var template  = '<div id="wrapper" class="flex_col"> <div id="dialog"><div><p id="dialogTitle">{{title}}</p><div id="dialogMessage">{{message}}</div>';
                template += '<ul id="dialogButtons"><button>Okay</button><button>Cancel</button></div></div></div>';

            template = template.replace( /{{title}}/ig, type || "");
            template = template.replace( /{{message}}/ig, message);
            var dfd = $.Deferred();

            $('body').append(template);
            $('#dialog').on("click", function(e) {
                var $elem = $(e.target);
                if (!$elem.is('input')) {
                    e.preventDefault();
                }

                if ( $elem.is('button') ) {
                    if ($elem.text() === "Cancel") {
                        Acme.dialog.closeWindow();
                    } else if ($elem.text() === "Okay") {
                        Acme.dialog.closeWindow();

                        // State can be provided by client external to 'show' call
                        if (data === undefined && that.state) {
                            data = that.state;
                        // If data is also provided we merge the two
                        } else if (that.state) {
                            var keys = Object.keys(that.state)
                            for (var k=0; k<keys.length;k++) {
                                data[keys[k]] = that.state[keys[k]];
                            }
                        }

                        if (self != undefined) {
                            if (data != undefined) {
                                var result = callback.call(self, data);
                                dfd.resolve(result);
                            } else {
                                var result = callback.call(self);
                                dfd.resolve(result);
                            }
                        } else {
                            var result = callback();
                            dfd.resolve(result);
                        }
                    }
                }
            });
            return dfd.promise();
        },
        closeWindow : function() {
            $('#dialog').closest('#wrapper').remove();
        }
    };
    
}(jQuery));


    


