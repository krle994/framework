/**
 * Lightweight Javascript framework with special emphasis on the view.
 * Think Backbone.js with View features from Angular.js
 *
 * @author Josh Crawmer <joshcrawmer4@yahoo.com>
 */
(function (factory) {
    var root = self;
    root.Simple = factory({}, $, _);
})(function (Simple, $, _) {

    Simple.version = '1.0.0';

    Simple.emulateJSON = false;

    Simple.emulateHTTP = false;

    Simple.$ = $;

    var Events = Simple.Events = {};

    var eventSeparator = /\s+/;

    var eventsApi = function (iteree, events, name, callback, opts) {
        var i = 0, names;
        if (name && typeof name === 'object') {
            if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
            for (i = 0, names = _.keys(name); i < names.length; i++) eventsApi(iteree, events, names[i], name[names[i]], opts);
        } else if (name && eventSeparator.test(name)) {
            for (i = 0, names = name.split(eventSeparator); i < names.length; i++) eventsApi(iteree, events, names[i], callback, opts);
        } else {
            events = iteree(events, name, callback, opts);
        }
        return events;
    };

    Events.on = function (name, callback, context) {
        return internalOn(this, name, callback, context);
    };

    var internalOn = function (obj, name, callback, context, listening) {
        obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
            ctx: obj,
            context: context,
            listening: listening
        });
        if (listening) {
            var listeners = obj._listeners || (obj._listeners = {});
            listeners[listening.thisId] = listening;
        }
        return obj;
    };

    Events.trigger = function (name) {
        if (!this._events) {
            return this;
        }
        var s = Math.max(0, arguments.length - 1);
        var args = Array(s);
        for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
        eventsApi(triggerApi, this._events, name, void 0, args);
        return this;
    };

    var triggerApi = function (objEvents, name, callback, args) {
        if (objEvents[name]) {
            var events = objEvents[name];
            trigger(events, args);
        }
    };

    var trigger = function (events, args) {
        var i = -1, e, l = events.length, arg1 = args[0], arg2 = args[1], arg3 = args[2];
        switch (args.length) {
            case 0:
                while (++i < l) (e = events[i]).callback.call(e.ctx);
                return;
            case 1:
                while (++i < l) (e = events[i]).callback.call(e.ctx, arg1);
                return;
            case 2:
                while (++i < l) (e = events[i]).callback.call(e.ctx, arg1, arg2);
                return;
            case 3:
                while (++i < l) (e = events[i]).callback.call(e.ctx, arg1, arg2, arg3);
                return;
            default:
                while (++i < l) (e = events[i]).callback.call(e.ctx, args);
                return;
        }
    };

    var onApi = function (events, name, callback, options) {
        var handler = events[name] || (events[name] = []);
        var context = options.context, ctx = options.ctx, listening = options.listening;
        if (listening) {
            listening.count++;
        }
        handler.push({name: name, callback: callback, ctx: context || ctx, context: context, listening: listening});
        return events;
    };

    Events.listenTo = function (obj, name, callback) {
        var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var listening = listeningTo[id];
        if (!listening) {
            var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
            listening = listeningTo[id] = {thisId: thisId, objId: id, obj: obj, count: 0, listeningTo: listeningTo};
        }
        internalOn(obj, name, callback, this, listening);
        return this;
    };

    Events.off = function (name, callback, context) {
        if (!this._events) return this;
        this._events = eventsApi(offApi, this._events, name, callback, {
            context: context,
            listeners: this._listeners
        });
        return this;
    };

    Events.stopListening = function (obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;
        var ids = obj ? [obj._listenId] : _.keys(listeningTo);
        for (var i = 0; i < ids.length; i++) {
            var listening = listeningTo[ids[i]];

            if (!listening) break;

            listening.obj.off(name, callback, this);
        }
        return this;
    };

    var offApi = function (events, name, callback, opts) {
        if (!events) return;
        var context = opts.context, i = 0, listeners = opts.listeners;
        var listening;
        if (!name && !callback && !context) {
            var ids = _.keys(listeners);
            for (; i < ids.length; i++) {
                listening = listeners[ids[i]];
                delete listeners[listening.thisId];
                delete listening.listeningTo[listening.objId];
            }
            return;
        }

        var names = name ? [name] : _.keys(events);
        for (; i < names.length; i++) {
            name = names[i];
            var handlers = events[name];
            var remaining = [];
            for (var j = 0; j < handlers.length; j++) {
                var handler = handlers[j];
                if (callback && callback !== handler.callback || context && context !== handler.context) {
                    remaining.push(handler);
                } else {
                    listening = handler.listening;
                    if (listening && --listening.count === 0) {
                        delete listeners[listening.thisId];
                        delete listening.listeningTo[listening.objId];
                    }
                }
            }
            if (remaining.length > 0) {
                events[name] = remaining;
            } else {
                delete events[name];
            }
        }
        return events;
    };


    Events.once = function (name, callback, context) {
        var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
        if (name && typeof name === 'string') callback = void 0;
        this.on(events, callback, context);
        return this;
    };


    Events.listenToOnce = function (obj, name, callback) {
        var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
        return this.listenTo(obj, events);
    };

    var onceMap = function (map, name, callback, offer) {
        var once = map[name] = function () {
            offer(name, once);
            callback.apply(this, arguments);
        };
        return map;
    };


    // allow SimpleJs to serve as a global event bus for those who
    // would like access to the pub/sub system on a global level
    _.extend(Simple, Events);


    var Model = Simple.Model = function (attributes, options) {
        debugger;
        var attrs = attributes || {};
        this.cid = _.uniqueId(this.cidPrefix);
        var defaults = _.result(this, 'defaults');
        attrs = _.defaults(_.extend({}, defaults, attrs), defaults);
        this.attributes = {};
        this.set(attrs, options);
        this.initialize.apply(this, arguments);
    };

    _.extend(Model.prototype, Events, {

        cidPrefix: 'c',

        initialize: function () {
            // left to be implemented if desired
        },

        sync: function () {
            return Simple.sync.apply(this, arguments);
        },

        get: function (attr) {
            return this.attributes[attr];
        },
        set: function (name, value, options) {
            debugger;
            if (name == null) return this;
            var attrs;
            if (typeof  name === 'object') {
                attrs = name;
                options = value;
            } else {
                (attrs = {})[name] = value;
            }
            options || (options = {});

            // return if model does not validate
            if (!this._validate(attrs, options)) return this;

            debugger;

            // set up some properties and variables
            var changing = this._changing;
            var changes = [];
            var changed = this._changed || (this._changed = {});
            this._changing = true;
            var unset = options.unset;
            var silent = options.silent;
            if (!changing) {
                this._previousAttributes = _.clone(this.attributes);
            }
            var current = this.attributes;
            var prev = this._previousAttributes;
            for (var attr in attrs) {
                var value = attrs[attr];
                if (!_.isEqual(current[attr], value)) changes.push(attr);
                if (!_.isEqual(prev[attr], value)) {
                    changed[attr] = value;
                } else {
                    delete changed[attr];
                }
                unset ? delete current[attr] : current[attr] = value;
            }
            if (!silent) {
                if (changes.length > 0) {
                    options.pending = true;
                    for (var i = 0; i < changes.length; i++) {
                        this.trigger('change:' + changes[i]);
                    }
                }
            }
            if (!silent) {
                while (options.pending) {
                    options.pending = false;
                    this.trigger('change');
                }
            }

            this._changing = false;
            return this;
        },


        fetch: function (options) {
            options = _.extend({parse: true}, options);
            var success = options.success;
            var model = this;
            options.success = function (resp) {
                var serverAttrs = options.parse ? model.parse(resp, options) : resp;
                if (!model.set(serverAttrs, options)) return false;
                if (success) success.call(model, resp, options);
                this.trigger('sync', model, resp, options);
            };
            return Simple.sync('read', this, options);
        },

        save: function (name, value, options) {
            var attrs;
            if (name == null || typeof name === 'object') {
                attrs = name;
                options = value;
            } else {
                (attrs = {})[name] = value;
            }
            options = _.extend({validate: true, parse: true}, options);
            var wait = options.wait;

            if (attrs && !wait) {
                if (!this.set(attrs, options)) return false;
            } else if (!this._validate(attrs, options)) return false;


            var success = options.success;
            var model = this;
            var attributes = this.attributes;
            options.success = function (resp) {
                var serverAttributes = options.parse ? model.parse(resp) : resp;
                if (!model.set(serverAttributes, options)) return false;
                if (success) success.call(model, resp, options);
                model.trigger('sync', model, resp, options);
            };
            if (attrs && wait) _.extend(attributes, attrs);
            var method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'put');
            if (options.patch) options.attrs = attrs;
            return Simple.sync(method, model, options);
        },

        parse: function (resp, options) {
            // override this method if you need to parse the response on the model
            return resp;
        },

        url: function () {
            // for now just return the URL you want
            return 'https://jsonplaceholder.typicode.com/posts/1';
        },

        isNew: function () {
            return !_.has(this, 'id');
        },

        _validate: function (attrs, options) {
            debugger;
            if (!options.validate || !this.validate) return true;
            attrs = _.extend({}, this.attributes, attrs);
            var error = this.validationError = this.validate(attrs, options) || null;
            if (!error) return true;
            this.trigger('invalid', this, error, options);
            return false;
        }
    });

    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }
        _.extend(child, parent, staticProps);
        child.prototype = _.create(parent.prototype, protoProps);
        child.prototype.constructor = child;
        child.__parent__ = parent.prototype;
        return child;
    };

    Model.extend = extend;


    /**
     * https://www.w3schools.com/jquery/ajax_ajax.asp
     *
     * @param type
     * @param model
     * @param options
     */
    Simple.sync = function (type, model, options) {

    };

    Simple.ajax = function (params) {
        return Simple.$.ajax.call(Simple.$, params);
    };

    var methodMap = {
        'read': 'GET',
        'create': 'POST',
        'patch': 'PATCH',
        'update': 'PUT',
        'delete': 'DELETE'
    };

    var wrapError = function (model, options) {
        var error = options.error;
        options.error = function (resp) {
            if (error) error.call(model, resp, options);
            model.trigger('error', model, resp, options);
        };
    };


    return Simple;

});
