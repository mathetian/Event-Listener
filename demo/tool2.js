//jQuery测试结果: 
//1.基本有效果 
//2.测试的例子douban, http://url.cn/EGHxDt, bbs.sjtu.edu.cn
//3.测试失败的例子: changba
//4.问题：4.1 代理注册（指利用库注册）4.2 动态注册（这个问题也许算是最严重的) 4.3数量上存在问题
//5.未解决的问题：代理事件

//6.jsBase不再支持，因为jsBase库已经两年没更新。同时jsBase库是独立开发者开发的库，使用不广泛。

//8. Mootools和jQuery存在命名冲突的问题($), prototype中也应该有这样的问题。
//9. 不同版本的js库处理方案不一样（prototype >1.7就不可以，仅适用于1.6.0.3。其他库也存在这样的问题）。
(function(window, document){
	window.VisualEvent = { parsers:[]};
})(window,document);

//dom0

//10. 为了简单，把不可见的全部干掉, 主要不会打印太多
//把document干掉
//creatEvent的事件存在问题
(function(window, document, VisualEvent){
	VisualEvent.parsers.push( (function () {
		var
			elements = [], n,
			all = document.getElementsByTagName('*'),
			types = [ 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 
				'mouseup', 'change', 'focus', 'blur', 'scroll', 'select', 'submit', 'keydown', 'keypress', 
				'keyup', 'load', 'unload' ],
			i, iLen, j, jLen = types.length;
		
		for ( i=0, iLen=all.length ; i<iLen ; i++ ) {
			for ( j=0 ; j<jLen ; j++ ) {
				if ( typeof all[i]['on'+types[j]] == 'function' ) {
					elements.push( {
						"node": all[i],
						"listeners": [ {
							"type": types[j],
							"func": all[i]['on'+types[j]],
							"removed": false,
							"source": 'DOM 0 event'
						} ]
					} );
				}
			}
		}
		
		return elements;
	} )());
})(window, document, VisualEvent);
//jquery
(function(window, document, VisualEvent){
	if ( typeof jQuery == 'undefined' ){
		window.VisualEvent.parsers.push([]);
		return;
	}
	//jquery 1.4+
	(function(window, document, $, VisualEvent){
		// jQuery 1.5, 1.6
		var version = jQuery.fn.jquery.substr(0,3)*1;
		if ( jQuery && version >= 1.5 && version < 1.7 ) {
			VisualEvent.parsers.push( (function () {
				var elements = [];
				for ( j in jQuery.cache ) {
					jQueryGeneric( elements, jQuery.cache[j] );
				}
				return elements;
			})());
		}
		else if(jQuery && version>=1.4){
			VisualEvent.parsers.push( (function () {
				var elements = [];
				jQueryGeneric( elements, jQuery.cache );
				
				return elements;
			})() );
		}
		function jQueryGeneric (elements, cache)
		{
			for ( i in cache ) {
				if ( typeof cache[i].events == 'object' ) {
					var eventAttachedNode = cache[i].handle.elem;
					var func;
					
					for ( type in cache[i].events ) {
						/* Ignore live event object - live events are listed as normal events as well */
						if ( type == 'live' ) {
							continue;
						}
						
						var oEvents = cache[i].events[type];
						
						for (var j=0;j<oEvents.length;j++) {
							var aNodes = [];
							var sjQuery = "jQuery "+jQuery.fn.jquery;
							
							if ( typeof oEvents[j].selector != 'undefined' && oEvents[j].selector !== null ) {
								/*aNodes = $(oEvents[j].selector, cache[i].handle.elem);
								sjQuery += " (live event)";*/
								continue;
							}
							else {
								aNodes.push( eventAttachedNode );
							}
							
							for ( var k=0, kLen=aNodes.length ; k<kLen ; k++ ) {
								elements.push( {
									"node": aNodes[k],
									"listeners": []
								} );
								
								if ( typeof oEvents[j].origHandler != 'undefined' ) {
									func = oEvents[j].origHandler;
								}
								else if ( typeof oEvents[j].handler != 'undefined' ) {
									func = oEvents[j].handler;
								}
								else {
									func = oEvents[j];
								}
								
								/* We use jQuery for the Visual Event events... don't really want to display them */
								if ( oEvents[j] && oEvents[j].namespace != "VisualEvent" && func != "0" )
								{
									elements[ elements.length-1 ].listeners.push( {
										"type": type,
										"func": func,
										"removed": false,
										"source": sjQuery
									} );
								}
							}

							// Remove elements that didn't have any listeners (i.e. might be a Visual Event node)
							if ( elements[ elements.length-1 ].listeners.length === 0 ) {
								elements.splice( elements.length-1, 1 );
							}
						}
					}
				}
			}
		};
	})(window, document, jQuery, VisualEvent);
	//jquery 1.3
	(function(window, document, $, VisualEvent){
		// jQuery 1.3
		if ( !jQuery || jQuery.fn.jquery.substr(0,3)*1 > 1.3 ) {
				return [];
		}
		VisualEvent.parsers.push( (function () {
			var elements = [];
			var cache = jQuery.cache;
			
			for ( i in cache ) {
				if ( typeof cache[i].events == 'object' ) {
					var nEventNode = cache[i].handle.elem;
					
					elements.push( {
						"node": nEventNode,
						"listeners": []
					} );
					
					for ( type in cache[i].events )
					{
						var oEvent = cache[i].events[type];
						var iFunctionIndex;
						for (iFunctionIndex in oEvent) break;
						
						/* We use jQuery for the Visual Event events... don't really want to display them */
						var func = oEvent[ iFunctionIndex ];
						if ( !func.match(/VisualEvent/) && !func.match(/EventLoader/) )
						{
							elements[ elements.length-1 ].listeners.push( {
								"type": type,
								"func": func,
								"removed": false,
								"source": 'jQuery'
							} );
						}
					}
				}
			}
			
			return elements;
		})() );
	})(window, document, jQuery, VisualEvent);
})(window,document,VisualEvent);
if(typeof(jQuery) == "undefined") {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
		document.head.appendChild(script);
		jQuery.noConflict();
}
//extjs
(function(window, document,VisualEvent){
	if ( typeof Ext == 'undefined' ){
		window.VisualEvent.parsers.push([]);
		return;
	}
	VisualEvent.parsers.push( (function () {
		var elements = [];
		for ( var j in Ext.cache ) {
			var cache = Ext.cache[j];
			if ( typeof cache.events == 'object' ) {
				var events = cache.events;
				if (events) {
					var listeners = [];
					for ( var event in events ) {
						// there is an array of handlers for each event
						if (events[event].length > 0) {
							for (var k=0; k<events[event].length; ++k) {
								listeners.push( {
									"type": event,
									"func": events[event][k].fn,
									"removed": false,
									"source": 'ExtJS '+Ext.versions.core.version
								} );
							}
						}
					}

					if (listeners.length > 0) {
						if(cache.dom&&!cache.el){
							elements.push( {
							"node": cache.dom,
							"listeners": listeners
							} );
						}
					}
				}
			}
		}
	return elements;
	})());
})(window, document,VisualEvent);
//glow
(function(window, document,VisualEvent){
	if ( typeof glow == 'undefined' || typeof glow.events.listenersByObjId == 'undefined' ) {
		VisualEvent.parsers.push([]);
		return;
	}
	VisualEvent.parsers.push( (function(){
		var listeners = glow.events.listenersByObjId;
		var globalGlow = "__eventId"+glow.UID;
		var elements = [];
		var all = document.getElementsByTagName('*');
		var i, iLen, j, jLen;
		var eventIndex, eventType, typeEvents;
		for ( i=0, iLen=all.length ; i<iLen ; i++ ) {
			/* If the element has a "__eventId"+glow.UID parameter, then it has glow events */
			if ( typeof all[i][globalGlow] != 'undefined' ) {
				eventIndex = all[i][globalGlow];
				
				elements.push( {
					"node": all[i],
					"listeners": []
				} );
				
				for ( eventType in listeners[eventIndex] ) {
					typeEvents = listeners[eventIndex][eventType];
					
					/* There is a sub array for each event type in Glow, so we loop over that */
					for ( j=0, jLen=typeEvents.length ; j<jLen ; j++ ) {
						elements[ elements.length-1 ].listeners.push( {
							"type": eventType,
							"func": typeEvents[j][2],
							"removed": false,
							"source": "Glow"
						} );
					}
				}
			}
		}
		return elements;
	})());
})(window, document, VisualEvent);
//jsBase
(function(window, document,VisualEvent){
	VisualEvent.parsers.push( (function () {
		if ( typeof jsBase == 'undefined' ) {
			return [];
		}
		var elements = [];
		var a = jsBase.aEventCache;
		var i, iLen;
		
		for ( i=0, iLen=a.length ; i<iLen ; i++ )
		{
			elements.push( {
				"node": a[i].nElement,
				"listeners": [ {
					"type": a[i].type,
					"func": a[i].fn,
					"removed": false,
					"source": 'jsBase'
				} ]
			} );
		}
		
		return elements;
	})());
})(window, document, VisualEvent);
//mooTools
(function(window, document,VisualEvent){
	VisualEvent.parsers.push( (function () {
		if ( typeof MooTools == 'undefined' ) {
			return [];
		}
		var elements = [];
		var all = document.getElementsByTagName('*');
		var i, iLen;
		var events, mooEvent;
		
		for ( i=0, iLen=all.length ; i<iLen ; i++ ) {
			events = all[i].retrieve('events', {});
			
			if ( !jQuery.isEmptyObject( events ) ) {
				elements.push( {
					"node": all[i],
					"listeners": []
				} );
				for ( mooEvent in events ) {
					elements[ elements.length-1 ].listeners.push( {
						"type": mooEvent,
						"func": events[mooEvent].keys[0],
						"removed": false,
						"source": 'MooTools'
					} );
				}
			}
		}
		return elements;
	})());	
})(window, document, VisualEvent);
//prototype
(function(window,document,VisualEvent){
	VisualEvent.parsers.push( (function () {
		if ( typeof Prototype == 'undefined' ) {
			return [];
		}
		
		var elements = [];
		var all = document.getElementsByTagName('*');
		var i, iLen;
		var eventType;
	
		for ( i=0, iLen=all.length ; i<iLen ; i++ ) {
			if ( typeof all[i]._prototypeEventID != 'undefined' ) {
				console.log(all[i]);
				elements.push( {
					"node": all[i],
					"listeners": []
				} );
				
				for ( eventType in Event.cache[ all[i]._prototypeEventID ] ) {
					elements[ elements.length-1 ].listeners.push( {
						"type": eventType,
						"func": Event.cache[ all[i]._prototypeEventID ][eventType][0].handler,
						"removed": false,
						"source": 'Prototype'
					} );
				}
			}
		}
		return elements;
} )());
})(window, document, VisualEvent);
//yui2
(function(window, document, VisualEvent){
	VisualEvent.parsers.push( (function () {
		if ( typeof YAHOO == 'undefined' || typeof YAHOO.util == 'undefined' ||
		 	typeof YAHOO.util.Event == 'undefined' )
		{
			return [];
		}
		
		/*
		 * Since the YUI cache is a private variable - we need to use the getListeners function on
		 * all nodes in the document
		 */
		var all = document.getElementsByTagName('*');
		var i, iLen, j, jLen;
		var elements = [], events;
		
		for ( i=0, iLen=all.length ; i<iLen ; i++ )
		{
			events = YAHOO.util.Event.getListeners( all[i] );
			if ( events != null && events.length != 0 )
			{
				elements.push( {
					"node": events[0].scope,
					"listeners": []
				} );
				
				for ( j=0, jLen=events.length ; j<jLen ; j++ )
				{
					elements[ elements.length-1 ].listeners.push( {
						"type": events[j].type,
						"func": events[j].fn,
						"removed": false,
						"source": 'YUI 2'
					} );
				}
			}
		}
		
		return elements;
	} )());
})(window, document, VisualEvent);
//process
(function(window,document,VisualEvent){
	var arr=VisualEvent.parsers;
	//dom 0
	for(var index=0;index<arr[0].length;index++){
		var elem=arr[0][index];
		var node=elem['node'];
		var listeners=elem['listeners'][0];
		//closure
		if(jQuery(node).filter(':visible').length==0)
			continue;
		node['on'+listeners['type']]=(function(){
			var fn=node['on'+listeners['type']];
			var a={
	        "node": node,
	        "listeners": [ {
	        	"type": listeners['type'],
	        	"func": fn.toString(),
	        	"removed": false,
	        	"source": 'DOM 0 event'
	    	}]}; 
	    	return function(){
				console.log(a);		
				var res = fn.apply(this, arguments);
	        	return res;
			};
	    	})();
	}
	//jquery
	for(var index=0;index<arr[1].length;index++){
		var elem=arr[1][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			jQuery(node).unbind(listener['type']);
		}
	}
	for(var index=0;index<arr[1].length;index++){
		var elem=arr[1][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			var func=listener['func'];
			if(func instanceof Function){
				jQuery(node).bind(listener['type'],(function(node,type,func){
					var data={
					    "node": node,
					    "listeners": [ {
					    "type": type,
					    "func":func.toString()
					}]}; 

					return function(e){
						console.log(data);
					}
				})(node,listener['type'],func));
				jQuery(node).bind(listener['type'],func);
			}
		}
	}
	//extjs
	for(var index=0;index<arr[2].length;index++){
		var elem=arr[2][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			Ext.EventManager.removeListener(node,listener['type'],listener['func']);
		}
	}
	for(var index=0;index<arr[2].length;index++){
		var elem=arr[2][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			Ext.EventManager.addListener(node,listener['type'],(function(node,type,func){
					var data={
					    "node": node,
					    "listeners": [ {
					    "type": type,
					    "func":func.toString()
					}]}; 
					return function(e){
						console.log(data);
					}
			})(node,listener['type'],listener['func']));
			Ext.EventManager.addListener(node,listener['type'],listener['func']);
		}
	}
	//glow
	for(var index=0;index<arr[3].length;index++){
		var elem=arr[3][index];
		var node=elem['node'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		glow.events.removeAllListeners(node);
	}
	for(var index=0;index<arr[3].length;index++){
		var elem=arr[3][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			glow.events.addListener(node,listener['type'],(function(node,type,func){
					var data={
					    "node": node,
					    "listeners": [ {
					    "type": type,
					    "func":func.toString()
					}]}; 
					return function(e){
						console.log(data);
					}
			})(node,listener['type'],listener['func']));
			glow.events.addListener(node,listener['type'],listener['func']);
		}
	}
	//jsBase
	for(var index=0;index<arr[4].length;index++){
	}
	for(var index=0;index<arr[4].length;index++){
	}
	//moontools
	//var testTmp=[];
	for(var index=0;index<arr[5].length;index++){
		var elem=arr[5][index];
		var node=elem['node'];
		console.log(node);
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		console.log(elem);
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			$(node).removeEvent(listener['type'],listener['func']);
		}
	}
	//console.log(testTmp);
	for(var index=0;index<arr[5].length;index++){
		var elem=arr[5][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];

			$(node).addEvent(listener['type'],(function(node,type,func){
					var data={
					    "node": node,
					    "listeners": [ {
					    "type": type,
					    "func":func.toString()
					}]}; 
					return function(e){
						console.log(data);
					}
			})(node,listener['type'],listener['func']));
			$(node).addEvent(listener['type'],listener['func']);
		}
	}
	//prototype
	for(var index=0;index<arr[6].length;index++){
		var elem=arr[6][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			node.stopObserving(listener['type']);
		}
	}
	for(var index=0;index<arr[6].length;index++){
		var elem=arr[6][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			node.observe(listener['type'],(function(node,type,func){
					var data={
					    "node": node,
					    "listeners": [ {
					    "type": type,
					    "func":func.toString()
					}]}; 
					return function(e){
						console.log(data);
					}
			})(node,listener['type'],listener['func']));
			node.observe(listener['type'],listener['func']);
		}
	}
	//yui2
	for(var index=0;index<arr[7].length;index++){
		var elem=arr[7][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			YAHOO.util.Event.removeListener(node, listener['type']);
		}
	}
	for(var index=0;index<arr[7].length;index++){
		var elem=arr[7][index];
		var node=elem['node'];
		var listeners=elem['listeners'];
		if(jQuery(node).filter(':visible').length==0)
			continue;
		for(var subIndex=0;subIndex<listeners.length;subIndex++){
			var listener=listeners[subIndex];
			YAHOO.util.Event.addListener(node, listener['type'], (function(node,type,func){
					var data={
					    "node": node,
					    "listeners": [ {
					    "type": type,
					    "func":func.toString()
					}]}; 
					return function(e){
						console.log(data);
					}
			})(node,listener['type'],listener['func']));
			YAHOO.util.Event.addListener(node,listener['type'],listener['func']);
		}
	}
})(window,document,VisualEvent);