/*
 * 処理全般
 */

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.TaskUtil = {

	//
	// ポップアップ表示用のコンテンツを作成する
	//----------------------------------------------------------------------
	//

	createPopupContent: function (figureInfo) {

		var content = $("<div></div>");

		if (figureInfo.name !== "") {
			content.append($("<h2></h2>").text(figureInfo.name));
		}

		if (figureInfo.type() === MKR.Option.FigureInfoType.Text) {

			// NOTE: gsimaps とはやり方が違うのでポップアップ表示も若干変わってしまう
			content.append($("<div></div>").html(figureInfo.text));

		} else {

			var rows = [];

			for (var i = 0; i < figureInfo.keyValues.length; ++i) {
				var key = figureInfo.keyValues[i].key;
				if (key !== "") {
					rows.push(
						$("<tr></tr>")
							.append($("<td></td>").text(key))
							.append($("<td></td>").text(figureInfo.keyValues[i].value))
					);
				}
			}

			if (0 < rows.length) {
				var table = $("<table></table>");
				$.each(rows, function (index, row) {
					table.append(row);
				});

				content.append(table);
			}
		}

		var popupContent = $.trim(content.html());
		if (popupContent === "") {
			popupContent = null;
		}

		return popupContent;
	}
};


MKR.Task = {};

////////////////////////////////////////////////////////////////////////
// レイヤデータから GeoJSON データを作成する
////////////////////////////////////////////////////////////////////////

MKR.Task.GeoJSONMaker = L.Class.extend({

	_figureLayers: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (figureLayers) {
		this._figureLayers = figureLayers;
	},

	//
	// GeoJSON データを返す
	//----------------------------------------------------------------------
	//

	toGeoJSON: function () {

		var result = {
			"type": "FeatureCollection",
			"features": []
		};

		for (var i = 0; i < this._figureLayers.length; ++i) {
			var figureLayer = this._figureLayers[i];

			var figureType = MKR.LeafletUtil.getFigureType(figureLayer);
			var figureInfo = MKR.LeafletUtil.getFigureInfo(figureLayer);

			var typeHelper = new MKR.TypeHelper(figureType);

			var feature = figureLayer.toGeoJSON();
			feature.properties = this._getPropertiesFromFigureInfo(figureInfo);

			typeHelper.geojson.setPropertiesFromFigureLayer(feature.properties, figureLayer);

			result.features.push(feature);
		}

		return result;
	},

	//
	// 名称・内容情報を GeoJSON データにして返す
	//----------------------------------------------------------------------
	//

	_getPropertiesFromFigureInfo: function (figureInfo) {
		var properties = {};

		if (figureInfo.name !== "") {
			properties["name"] = figureInfo.name;
		}

		if (figureInfo.type() === MKR.Option.FigureInfoType.KeyValue) {
			// NOTE: key は必ず入力されている前提
			for (var i = 0; i < figureInfo.keyValues.length; ++i) {
				properties[figureInfo.keyValues[i].key] = figureInfo.keyValues[i].value;
			}
		} else {
			if (figureInfo.text !== "") {
				properties["description"] = figureInfo.text;
			}
		}

		return properties;
	}
});

////////////////////////////////////////////////////////////////////////
// GeoJSON データをロードするための関数群
////////////////////////////////////////////////////////////////////////

MKR.Task.GeoJson = {

	//
	// デフォルトのマーカーを返す
	//----------------------------------------------------------------------
	//

	getDefaultMarker: function (latlng) {
		return new L.Marker(latlng, {
			icon: new L.Icon({
				iconUrl: MKR.Configs.markerIconDefault,
				iconSize: MKR.Configs.markerIconSizeDefault,
				iconAnchor: MKR.Configs.markerIconAnchorDefault
			})
		});
	}
};

////////////////////////////////////////////////////////////////////////
// L.GeoJSON() で GeoJSON データをロードする処理群
////////////////////////////////////////////////////////////////////////

MKR.Task.GeoJsonOptions = {

	//
	// pointToLayer
	//----------------------------------------------------------------------
	//

	pointToLayer: function (feature, latlng) {

		// NOTE: 今の仕様では feature.geometry.type === "Point" 時のみ呼び出される

		if (!feature.properties) {
			return MKR.Task.GeoJson.getDefaultMarker(latlng);
		}

		var marker = null;

		if (feature.properties["_markerType"]) {
			var markerType = feature.properties["_markerType"];
			var markerTypeHelper = new MKR.GeoJSONMarkerTypeHelper(markerType);
			marker = markerTypeHelper.geojson.pointToLayer(latlng, feature.properties);
		}

		if (!marker) {
			if (!feature.properties["_iconUrl"]) {
				marker = MKR.Task.GeoJson.getDefaultMarker(latlng);
			} else {
				marker = MKR.TypeHelper.GeoJSON.Marker.pointToLayer(latlng, feature.properties);
			}
		}

		return marker;
	},

	//
	// style
	//----------------------------------------------------------------------
	//

	style: function (feature) {

		if (!feature.geometry || !feature.properties) {
			return null;
		}

		var styleTypeHelper = new MKR.GeoJSONStyleTypeHelper(feature.geometry.type, feature.properties["_markerType"]);
		var style = styleTypeHelper.geojson.style(feature.properties);

		return style;
	},

	//
	// onEachFeature
	//----------------------------------------------------------------------
	//

	onEachFeature: function (feature, figureLayer) {

		if (!feature.properties) {
			return;
		}

		var figureType = MKR.LeafletUtil.getFigureType(figureLayer);
		var figureOption = MKR.SettingUtil.getNewFigureOption(figureType);

		var typeHelper = new MKR.TypeHelper(figureType);

		typeHelper.widget.setFigureOptionFromFigureLayer(figureOption, figureLayer);

		var geoJSONKeys = {};
		typeHelper.geojson.setGeoJSONKeys(geoJSONKeys);

		// 名称・内容情報を作成する
		var figureInfo = figureOption.figureInfo;

		if (feature.properties["name"]) {
			figureInfo.name = $.trim(feature.properties["name"]);
		}

		if (feature.properties["description"]) {

			figureInfo.text = $.trim(feature.properties["description"]);

		} else {

			for (var key in feature.properties) {

				if (!feature.properties[key]) {
					continue;
				}

				if (key !== "" && key !== "name" && !geoJSONKeys[key]) {
					figureInfo.addKeyValues(key, feature.properties[key]);
				}
			}
		}

		// ポップアップ処理
		MKR.WidgetUtil.bindPopup(figureLayer, figureInfo);

		MKR.LeafletUtil.setFigureOption(figureLayer, figureOption);
	}
};

////////////////////////////////////////////////////////////////////////
// GeoJSON データをロードし、レイヤに変換する
////////////////////////////////////////////////////////////////////////

MKR.Task.GeoJSONLoader = L.Class.extend({

	_content: null,

	_contextMenu: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (content, contextMenu) {
		this._content = content;
		this._contextMenu = contextMenu;
	},

	//
	// GeoJSON デーからレイヤを取得する
	//----------------------------------------------------------------------
	//

	toLayer: function () {
		var self = this;

		var layer = null;
		try {
			var contentJson = JSON.parse(this._content);

			// コンテキストメニューを設定する
			layer = new L.GeoJSON(contentJson, MKR.Task.GeoJsonOptions);
			layer.eachLayer(function (figureLayer) {
				self._contextMenu.bind(figureLayer);
			});

		} catch (ex) {
			console.log(ex);	// NOTE: @required
		}

		return layer;
	}
});

////////////////////////////////////////////////////////////////////////
// URL フラグメントを使用する
////////////////////////////////////////////////////////////////////////

MKR.Task.UseLH = {

	//
	// 拡大率
	//----------------------------------------------------------------------
	//

	getZoom: function () {
		var zoomValue = MKR.LocationHash.getValue("zoom");
		zoomValue = zoomValue || 5;
		var zoom = MKR.Number.parseInt(zoomValue);
		return Math.max(0, Math.min(zoom, 18));
	},

	setZoom: function (zoom) {
		MKR.LocationHash.setValue("zoom", zoom);
	},

	//
	// 緯度
	//----------------------------------------------------------------------
	//

	getLat: function () {
		var latValue = MKR.LocationHash.getValue("lat");
		latValue = latValue || 35.362222;
		var lat = MKR.Number.parseFloat(latValue, 6);
		return Math.max(-90, Math.min(lat, 90));
	},

	//
	// 経度
	//----------------------------------------------------------------------
	//

	getLng: function () {
		var lngValue = MKR.LocationHash.getValue("lng");
		lngValue = lngValue || 138.731389;
		var lng = MKR.Number.parseFloat(lngValue, 6);
		return Math.max(-180, Math.min(lng, 180));
	},

	//
	// 緯度・経度
	//----------------------------------------------------------------------
	//

	setLatLng: function (lat, lng) {
		MKR.LocationHash.setValues({
			"lat": lat,
			"lng": lng
		});
	},

	//
	// タイル名
	//----------------------------------------------------------------------
	//

	getTileName: function () {
		var tileName = MKR.LocationHash.getValue("base");
		tileName = tileName || "";
		return tileName;
	},

	setTileName: function (tileName) {
		MKR.LocationHash.setValue("base", tileName);
	}

};

////////////////////////////////////////////////////////////////////////
// マップマネージャ
////////////////////////////////////////////////////////////////////////

MKR.MapManager = L.Class.extend({

	_map: null,

	_currentTileName: "",

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (mapId) {

		var zoom = MKR.Task.UseLH.getZoom();
		var lat = MKR.Task.UseLH.getLat();
		var lng = MKR.Task.UseLH.getLng();

		var map = L.map(mapId, {
			center: [lat, lng],
			zoom: Number(zoom),
			zoomControl: false,
			maxBounds: [[-90, -180], [90, 180]],
			contextmenu: true	// コンテキストメニューに必要
		});
		this._map = map;

		MKR.Task.UseLH.setZoom(map.getZoom());
		var centerLatLng = map.getCenter();
		MKR.Task.UseLH.setLatLng(
			centerLatLng.lat,
			centerLatLng.lng
		);

		// スケール
		L.control.scale({imperial: false}).addTo(map);

		// ズーム
		L.control.zoom({
			position: "bottomleft"
		}).addTo(map);

		// タイルレイヤの表示
		this._setTileLayers();

		map.on("zoomend", this._onZoomEnd, this);
		map.on("moveend", this._onMoveEnd, this);
		map.on("baselayerchange", this._onBaseLayerChange, this);
	},

	//
	// マップインスタンスを取得する
	//----------------------------------------------------------------------
	//

	getMap: function () {
		return this._map;
	},

	//
	// 現在表示されているタイル名を得る
	//----------------------------------------------------------------------
	//

	getCurrentTileName: function () {
		return this._currentTileName;
	},

	//
	// タイル(地図画像)を表示する
	//----------------------------------------------------------------------
	//

	_setTileLayers: function (map) {

		var tileName = MKR.Task.UseLH.getTileName();

		var tileLayers = [];
		var baseLayers = {};

		var initIndex = 0;

		for (var i = 0; i < MKR.Configs.mapTiles.length; ++i) {
			var mapTile = MKR.Configs.mapTiles[i];

			var tileLayer = L.tileLayer(mapTile.urlTemplate, {
							attribution: "<a href='//maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル（" + mapTile.displayName + "）</a>",
							errorTileUrl: mapTile.errorTileUrl
						});

			tileLayers.push(tileLayer);

			baseLayers[mapTile.displayName] = tileLayers[i];

			if (tileName === mapTile.name) {
				initIndex = i;
			}
		}
		if (0 < tileLayers.length) {
			// 初期表示タイルの設定
			tileLayers[initIndex].addTo(this._map);

			tileName = MKR.Configs.mapTiles[initIndex].name;

			MKR.Task.UseLH.setTileName(tileName);

			this._currentTileName = tileName;
		}

		L.control.layers(baseLayers, {}, {
				position: "bottomright",
				collapsed: true
			}).addTo(this._map);
	},

	//
	// マップズーム完了時の処理
	//----------------------------------------------------------------------
	//

	_onZoomEnd: function (e) {
		MKR.Task.UseLH.setZoom(this._map.getZoom())
	},

	//
	// マップ移動完了時の処理
	//----------------------------------------------------------------------
	//

	_onMoveEnd: function (e) {
		var centerLatLng = this._map.getCenter();
		MKR.Task.UseLH.setLatLng(
			centerLatLng.lat,
			centerLatLng.lng
		);
	},

	//
	// ベースレイヤ変更時の処理
	//----------------------------------------------------------------------
	//

	_onBaseLayerChange: function (e) {
		var mapTile = MKR.ConfigUtil.findMapTileByDisplayName(MKR.Configs.mapTiles, e.name);
		if (mapTile !== null) {
			MKR.Task.UseLH.setTileName(mapTile.name);
			this._currentTileName = mapTile.name;
		}
	}
});

