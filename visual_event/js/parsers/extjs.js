
(function(window, document){
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
								"func": events[event][k].fn.toString(),
								"removed": false,
								"source": 'ExtJS '+Ext.versions.core.version
							} );
						}
					}
				}

				if (listeners.length > 0) {
					if(cache.el&&cache.el.dom)
					{
						elements.push( {
						"node": cache.el.dom,
						"listeners": listeners
						} );
					}
					/*console.log({"node": cache.el.dom,
						"listeners": listeners});
					*/
				}
			}
		}
	}
	return elements;
})(window, document);
