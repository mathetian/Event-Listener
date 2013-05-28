(function(window, document){
	window.VisualEvent = { parsers:[]};
})(window,document);

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

//如果需要按照需求变更的话，修改console.log(a);	将之变为需要处理的逻辑。
(function(window,document,VisualEvent){
	var arr=VisualEvent.parsers;
	//dom 0
	for(var index=0;index<arr[0].length;index++){
		var elem=arr[0][index];
		var node=elem['node'];
		var listeners=elem['listeners'][0];
		//closure
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
				//修改这里
				console.log(a);

				var res = fn.apply(this, arguments);
	        	return res;
			};
	    	})();
	}
})(window,document,VisualEvent);	