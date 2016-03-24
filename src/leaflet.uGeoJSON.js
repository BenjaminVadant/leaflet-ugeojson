L.UGeoJSONLayer = L.GeoJSON.extend({
    options: {
      debug: false,
      light:true,
      endpoint: "-1",
      parameters: {},
      maxRequests: 5,
      pollTime:0,
	  once : false
    },

    callback: function(data) {
      if(this.options.light)
      {
        this.clearLayers();//if needed, we clean the layers
      }

      //Then we add the new data
      this.addData(data);
    },

  initialize: function (options) {
    L.Util.setOptions(this, options);
    this._layers = {};
    this._layersOld = [];
    this._requests = [];
  },

  onMoveEnd: function () {
    if (this.options.debug) {
      console.debug("load Data");
    }

    while(this._requests.length > this.options.maxRequests) //This allows to stop the oldest requests
    {
      this._requests.shift().abort();
    }

    var postData = new FormData();

    for(var k in this.options.parameters)
    {
      if(this.options.parameters[k].scope != undefined)
      {
        postData.append(k,this.options.parameters[k].scope[k]);
      }
      else
      {
        postData.append(k,this.options.parameters[k]);
      }
    }

    var bounds = this._map.getBounds();
    postData.append('zoom', this._map.getZoom());
    postData.append('south', bounds.getSouth());
    postData.append('north', bounds.getNorth());
    postData.append('east', bounds.getEast());
    postData.append('west', bounds.getWest());

    var self = this;
    var request = new XMLHttpRequest();
    request.open("POST", this.options.endpoint, true);
    request.onload = function() {
      for(var i in self._requests)
      {
        if(self._requests[i] === request)
        {
          self._requests.splice(i,1); //We remove the request from the list of currently running requests.
          break;
        }
      }

      if (this.status >= 200 && this.status < 400) {
        self.callback(JSON.parse(this.responseText));
      }
    };

    this._requests.push(request);
    request.send(postData);
    
  },

  onAdd: function (map) {
    this._map = map;

    if (this.options.endpoint.indexOf("http") != -1) {
		this.onMoveEnd();
		
		if(!once) {
			map.on('dragend', this.onMoveEnd, this);
			map.on('zoomend', this.onMoveEnd, this);
		
			if (this.options.pollTime > 0) {
			  this.intervalID = window.setInterval(this.onMoveEnd, this.options.pollTime);
			}
		}
	}

    if (this.options.debug) {
      console.debug("add layer");
    }
  },

  onRemove: function (map) {
    if (this.options.debug) {
      console.debug("remove layer");
    }
    L.LayerGroup.prototype.onRemove.call(this, map);

    if (!once && this.options.pollTime > 0) {
      window.clearInterval(this.intervalID);
    }
    
    while(this._requests.length > 0) 
    {
      this._requests.shift().abort();
    }

    if(!once) {
		map.off({
		  'dragend': this.onMoveEnd
		}, this);
		map.off({
		  'zoomend': this.onMoveEnd
		}, this);
	}

    this._map = null;
  }

});

L.uGeoJSONLayer = function (options) {
  return new L.UGeoJSONLayer(options);
};
