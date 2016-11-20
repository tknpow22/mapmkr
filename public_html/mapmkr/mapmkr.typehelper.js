/*
 * ヘルパ
 */

////////////////////////////////////////////////////////////////////////
// タイプヘルパ
////////////////////////////////////////////////////////////////////////

MKR.TypeHelper = L.Class.extend({

	widget: null,

	geojson: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (figureType) {

		// NOTE: @figureTypeSwitch
		switch (figureType) {
		case MKR.FigureType.Marker:
			this.widget = MKR.TypeHelper.Widget.Marker;
			this.geojson = MKR.TypeHelper.GeoJSON.Marker;
			break;

		case MKR.FigureType.Polyline:
			this.widget = MKR.TypeHelper.Widget.Polyline;
			this.geojson = MKR.TypeHelper.GeoJSON.Polyline;
			break;

		case MKR.FigureType.Polygon:
			this.widget = MKR.TypeHelper.Widget.Polygon;
			this.geojson = MKR.TypeHelper.GeoJSON.Polygon;
			break;

		case MKR.FigureType.Circle:
			this.widget = MKR.TypeHelper.Widget.Circle;
			this.geojson = MKR.TypeHelper.GeoJSON.Circle;
			break;

		case MKR.FigureType.CircleMarker:
			this.widget = MKR.TypeHelper.Widget.CircleMarker;
			this.geojson = MKR.TypeHelper.GeoJSON.CircleMarker;
			break;

		case MKR.FigureType.DivIconMarker:
			this.widget = MKR.TypeHelper.Widget.DivIconMarker;
			this.geojson = MKR.TypeHelper.GeoJSON.DivIconMarker;
			break;
		}

		if (this.widget === null || this.geojson === null) {
			MKR.Debug.notImplemented();
		}
	}
});

////////////////////////////////////////////////////////////////////////
// タイプヘルパ(GeoJSON マーカー用)
////////////////////////////////////////////////////////////////////////

MKR.GeoJSONMarkerTypeHelper = L.Class.extend({

	geojson: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	// NOTE: 引数が markerType なので注意

	initialize: function (markerType) {

		// NOTE: @markerTypeSwitch
		switch (markerType) {
		case "Icon":
			this.geojson = MKR.TypeHelper.GeoJSON.Marker;
			break;

		case "Circle":
			this.geojson = MKR.TypeHelper.GeoJSON.Circle;
			break;

		case "CircleMarker":
			this.geojson = MKR.TypeHelper.GeoJSON.CircleMarker;
			break;

		case "DivIcon":
			this.geojson = MKR.TypeHelper.GeoJSON.DivIconMarker;
			break;
		}

		if (this.geojson === null) {
			MKR.Debug.notImplemented();
		}
	}
});


////////////////////////////////////////////////////////////////////////
// タイプヘルパ(GeoJSON Style 作成用)
////////////////////////////////////////////////////////////////////////

MKR.GeoJSONStyleTypeHelper = L.Class.extend({

	geojson: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (geometryType, markerType) {

		// NOTE: @geometryTypeSwitch
		switch (geometryType) {
		case "Point":
			var markerTypeHelper = new MKR.GeoJSONMarkerTypeHelper(markerType);
			this.geojson = markerTypeHelper.geojson;
			break;
		case "LineString":
			this.geojson = MKR.TypeHelper.GeoJSON.Polyline;
			break;
		case "Polygon":
			this.geojson = MKR.TypeHelper.GeoJSON.Polygon;
			break;
		}

		if (this.geojson === null) {
			MKR.Debug.notImplemented();
		}
	}
});

////////////////////////////////////////////////////////////////////////
// タイプヘルパ(ウィジェット)
////////////////////////////////////////////////////////////////////////

MKR.TypeHelper.Widget = {

	// 作図情報からアイコンを作成する
	//----------------------------------------------------------------------

	createIconWidget: function (self, widget, clazz, figureOption) {
		widget.addClass(clazz);

		self.setIconWidget(widget, figureOption);

		return widget;
	},

	// 図形上にマーカーアイコンを付ける時のアンカーの位置を返す
	//----------------------------------------------------------------------

	// 線、ポリゴン
	getPolyIconAnchor: function (iconSize, zoom) {
		var iconSizePoint = new L.Point(iconSize[0], iconSize[1]);
		var anchorPoint = iconSizePoint.divideBy(2);

		return [anchorPoint.x, anchorPoint.y];
	},

	// 円
	getCircleIconAnchor: function (iconSize, zoom) {
		var iconSizePoint = new L.Point(iconSize[0], iconSize[1]);
		var anchorPoint = iconSizePoint.divideBy(2);

		return [anchorPoint.x, anchorPoint.y];
	}
};

//----------------------------------------------------------------------
// マーカー(アイコン)
//----------------------------------------------------------------------

MKR.TypeHelper.Widget.Marker = {

	// 設定保存ダイアログ
	//----------------------------------------------------------------------

	createFigureSettingsSaveDialog: function (dialogManager, figureOption) {
		return new MKR.Dialog.ModalMarkerSettings(dialogManager, figureOption, {
					buttons: ["save"]
				});
	},

	// 設定既定または保存ダイアログ
	//----------------------------------------------------------------------

	createFigureSettingsSaveAsOrDefaultDialog: function (dialogManager, figureOption, nameCheckCallback) {
		return new MKR.Dialog.ModalMarkerSettings(dialogManager, figureOption, {
				buttons: ["saveDefault", "saveAs"],
				nameCheckCallback: nameCheckCallback
			});
	},

	// 図形レイヤを作図情報を元に設定する
	//----------------------------------------------------------------------

	setFigureLayerFromFigureOption: function (figureLayer, figureOption) {
		figureLayer.setIcon(figureOption.draw.icon);
	},

	// 作図情報を図形レイヤを元に設定する
	//----------------------------------------------------------------------

	setFigureOptionFromFigureLayer: function (figureOption, figureLayer) {
		figureOption.draw.icon = figureLayer.options.icon;
	},

	// 作図情報からアイコンを作成する
	//----------------------------------------------------------------------

	createIconWidget: function (clazz, figureOption) {
		return MKR.TypeHelper.Widget.createIconWidget(this, $("<img src='' />"), clazz, figureOption);
	},

	// 作図情報からアイコンを設定する
	//----------------------------------------------------------------------

	setIconWidget: function (widget, figureOption) {
		// <img />
		widget.attr("src", figureOption.draw.icon.options.iconUrl);
	},

	// 図形上にマーカーアイコンを付ける時のアンカーの位置を返す
	//----------------------------------------------------------------------

	getIconAnchor: function (iconSize, zoom) {
		return [0, 0];
	}
};

//----------------------------------------------------------------------
// 線
//----------------------------------------------------------------------

MKR.TypeHelper.Widget.Polyline = {

	createFigureSettingsSaveDialog: function (dialogManager, figureOption) {
		return new MKR.Dialog.ModalPolylineSettings(dialogManager, figureOption, {
			buttons: ["save"]
		});
	},

	createFigureSettingsSaveAsOrDefaultDialog: function (dialogManager, figureOption, nameCheckCallback) {
		return new MKR.Dialog.ModalPolylineSettings(dialogManager, figureOption, {
				buttons: ["saveDefault", "saveAs"],
				nameCheckCallback: nameCheckCallback
			});
	},

	setFigureLayerFromFigureOption: function (figureLayer, figureOption) {
		figureLayer.setStyle(figureOption.draw.shapeOptions);
	},

	setFigureOptionFromFigureLayer: function (figureOption, figureLayer) {
		figureOption.draw.shapeOptions.weight = figureLayer.options.weight;
		figureOption.draw.shapeOptions.color = figureLayer.options.color;
		figureOption.draw.shapeOptions.opacity = figureLayer.options.opacity;
	},

	createIconWidget: function (clazz, figureOption) {
		return MKR.TypeHelper.Widget.createIconWidget(this, $("<span></span>"), clazz, figureOption);
	},

	setIconWidget: function (widget, figureOption) {

		var rgbaColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.color);
		rgbaColor[3] = figureOption.draw.shapeOptions.opacity;

		widget.css({
			height: "2px",
			"border-bottom-color": MKR.Color.getColorRgba(rgbaColor),
			"border-bottom-width": "4px",
			"border-bottom-style": "solid"
		});
	},

	getIconAnchor: function (iconSize, zoom) {
		return MKR.TypeHelper.Widget.getPolyIconAnchor(iconSize, zoom);
	},
};

//----------------------------------------------------------------------
// ポリゴン
//----------------------------------------------------------------------

MKR.TypeHelper.Widget.Polygon = {

	createFigureSettingsSaveDialog: function (dialogManager, figureOption) {
		return new MKR.Dialog.ModalPolygonSettings(dialogManager, figureOption, {
					buttons: ["save"]
				});
	},

	createFigureSettingsSaveAsOrDefaultDialog: function (dialogManager, figureOption, nameCheckCallback) {
		return new MKR.Dialog.ModalPolygonSettings(dialogManager, figureOption, {
				buttons: ["saveDefault", "saveAs"],
				nameCheckCallback: nameCheckCallback
			});
	},

	setFigureLayerFromFigureOption: function (figureLayer, figureOption) {
		figureLayer.setStyle(figureOption.draw.shapeOptions);
	},

	setFigureOptionFromFigureLayer: function (figureOption, figureLayer) {
		figureOption.draw.shapeOptions.weight = figureLayer.options.weight;
		figureOption.draw.shapeOptions.color = figureLayer.options.color;
		figureOption.draw.shapeOptions.opacity = figureLayer.options.opacity;
		figureOption.draw.shapeOptions.fillColor = figureLayer.options.fillColor;
		figureOption.draw.shapeOptions.fillOpacity = figureLayer.options.fillOpacity;
	},

	createIconWidget: function (clazz, figureOption) {
		return MKR.TypeHelper.Widget.createIconWidget(this, $("<span></span>"), clazz, figureOption);
	},

	setIconWidget: function (widget, figureOption) {

		var rgbaColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.color);
		rgbaColor[3] = figureOption.draw.shapeOptions.opacity;

		var rgbaFillColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.fillColor || figureOption.draw.shapeOptions.color);
		rgbaFillColor[3] = figureOption.draw.shapeOptions.fillOpacity;

		widget.css({
			height: "16px",
			"border-color": MKR.Color.getColorRgba(rgbaColor),
			"border-width": "2px",
			"border-style": "solid",
			"background-color": MKR.Color.getColorRgba(rgbaFillColor)
		});
	},

	getIconAnchor: function (iconSize, zoom) {
		return MKR.TypeHelper.Widget.getPolyIconAnchor(iconSize, zoom);
	},
};

//----------------------------------------------------------------------
// 円
//----------------------------------------------------------------------

MKR.TypeHelper.Widget.Circle = {

	createFigureSettingsSaveDialog: function (dialogManager, figureOption) {
		return new MKR.Dialog.ModalCircleSettings(dialogManager, figureOption, {
					buttons: ["save"]
				});
	},

	createFigureSettingsSaveAsOrDefaultDialog: function (dialogManager, figureOption, nameCheckCallback) {
		return new MKR.Dialog.ModalCircleSettings(dialogManager, figureOption, {
				buttons: ["saveDefault", "saveAs"],
				nameCheckCallback: nameCheckCallback
			});
	},

	setFigureLayerFromFigureOption: function (figureLayer, figureOption) {
		figureLayer.setStyle(figureOption.draw.shapeOptions);
	},

	setFigureOptionFromFigureLayer: function (figureOption, figureLayer) {
		figureOption.draw.shapeOptions.weight = figureLayer.options.weight;
		figureOption.draw.shapeOptions.color = figureLayer.options.color;
		figureOption.draw.shapeOptions.opacity = figureLayer.options.opacity;
		figureOption.draw.shapeOptions.fillColor = figureLayer.options.fillColor;
		figureOption.draw.shapeOptions.fillOpacity = figureLayer.options.fillOpacity;
	},

	createIconWidget: function (clazz, figureOption) {
		return MKR.TypeHelper.Widget.createIconWidget(this, $("<span></span>"), clazz, figureOption);
	},

	setIconWidget: function (widget, figureOption) {
		var rgbaColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.color);
		rgbaColor[3] = figureOption.draw.shapeOptions.opacity;

		var rgbaFillColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.fillColor || figureOption.draw.shapeOptions.color);
		rgbaFillColor[3] = figureOption.draw.shapeOptions.fillOpacity;

		widget.css({
			height: "16px",
			"border-color": MKR.Color.getColorRgba(rgbaColor),
			"border-width": "2px",
			"border-style": "solid",
			"background-color": MKR.Color.getColorRgba(rgbaFillColor),
			"border-radius": "50%"
		});
	},

	getIconAnchor: function (iconSize, zoom) {
		return MKR.TypeHelper.Widget.getCircleIconAnchor(iconSize, zoom);
	},
};

//----------------------------------------------------------------------
// マーカー(円)
//----------------------------------------------------------------------

MKR.TypeHelper.Widget.CircleMarker = {

	createFigureSettingsSaveDialog: function (dialogManager, figureOption) {
		return new MKR.Dialog.ModalCircleMarkerSettings(dialogManager, figureOption, {
					buttons: ["save"]
				});
	},

	createFigureSettingsSaveAsOrDefaultDialog: function (dialogManager, figureOption, nameCheckCallback) {
		return new MKR.Dialog.ModalCircleMarkerSettings(dialogManager, figureOption, {
				buttons: ["saveDefault", "saveAs"],
				nameCheckCallback: nameCheckCallback
			});
	},

	setFigureLayerFromFigureOption: function (figureLayer, figureOption) {
		figureLayer.setStyle(figureOption.draw.shapeOptions);
	},

	setFigureOptionFromFigureLayer: function (figureOption, figureLayer) {
		figureOption.draw.shapeOptions.weight = figureLayer.options.weight;
		figureOption.draw.shapeOptions.color = figureLayer.options.color;
		figureOption.draw.shapeOptions.opacity = figureLayer.options.opacity;
		figureOption.draw.shapeOptions.fillColor = figureLayer.options.fillColor;
		figureOption.draw.shapeOptions.fillOpacity = figureLayer.options.fillOpacity;
	},

	createIconWidget: function (clazz, figureOption) {
		return MKR.TypeHelper.Widget.createIconWidget(this, $("<span></span>"), clazz, figureOption);
	},

	setIconWidget: function (widget, figureOption) {
		var rgbaColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.color);
		rgbaColor[3] = figureOption.draw.shapeOptions.opacity;

		var rgbaFillColor = MKR.Color.getRgba(figureOption.draw.shapeOptions.fillColor || figureOption.draw.shapeOptions.color);
		rgbaFillColor[3] = figureOption.draw.shapeOptions.fillOpacity;

		widget.css({
			height: "16px",
			"border-color": MKR.Color.getColorRgba(rgbaColor),
			"border-width": "2px",
			"border-style": "solid",
			"background-color": MKR.Color.getColorRgba(rgbaFillColor),
			"border-radius": "50%"
		});
	},

	getIconAnchor: function (iconSize, zoom) {
		return MKR.TypeHelper.Widget.getCircleIconAnchor(iconSize, zoom);
	},
};

//----------------------------------------------------------------------
// マーカー(テキスト)
//----------------------------------------------------------------------

MKR.TypeHelper.Widget.DivIconMarker = {

	createFigureSettingsSaveDialog: function (dialogManager, figureOption) {
		return new MKR.Dialog.ModalDivIconMarkerSettings(dialogManager, figureOption, {
			buttons: ["save"]
		});
	},

	createFigureSettingsSaveAsOrDefaultDialog: function (dialogManager, figureOption, nameCheckCallback) {
		return new MKR.Dialog.ModalDivIconMarkerSettings(dialogManager, figureOption, {
				buttons: ["saveDefault", "saveAs"],
				nameCheckCallback: nameCheckCallback
			});
	},

	setFigureLayerFromFigureOption: function (figureLayer, figureOption) {
		figureLayer.setIcon(figureOption.draw.icon);
	},

	setFigureOptionFromFigureLayer: function (figureOption, figureLayer) {
		figureOption.draw.icon = figureLayer.options.icon;
	},

	createIconWidget: function (clazz, figureOption) {
		return MKR.TypeHelper.Widget.createIconWidget(this, $("<span></span>"), clazz, figureOption);
	},

	setIconWidget: function (widget, figureOption) {
		// なし
		widget.css({
			width: "0px",
			margin: "0px",
			padding: "0px"
		});
	},

	getIconAnchor: function (iconSize, zoom) {
		return [0, 0];
	}
};

////////////////////////////////////////////////////////////////////////
// タイプヘルパ(GeoJSON)
////////////////////////////////////////////////////////////////////////

MKR.TypeHelper.GeoJSON = {

	// 線に関する GeoJSON のキーを設定する
	//----------------------------------------------------------------------

	setLineGeoJSONKeys: function (keys) {

		var figureKeys = {
			"_color": true,
			"_opacity": true,
			"_weight": true
		};

		$.extend(keys, figureKeys);
	},

	// 塗潰しに関する GeoJSON のキーを設定する
	//----------------------------------------------------------------------

	setFillGeoJSONKeys: function (keys) {

		var figureKeys = {
			"_fillColor": true,
			"_fillOpacity": true
		};

		$.extend(keys, figureKeys);
	},

	// GeoJSON データに設定するオプション情報を取得する
	//----------------------------------------------------------------------

	getFigureOptions: function (figureLayer) {

		var options = figureLayer.options;
		if (!options && figureLayer.getLayers) {
			var figureSubLayers = figureLayer.getLayers();
			if (0 < figureSubLayers.length) {
				options = figureSubLayers[0].options;
			}
		}

		options = options || {};

		return options;
	},

	// 線に関する情報をオプションから取得しプロパティに設定する
	//----------------------------------------------------------------------

	setLineProperties: function (properties, options) {

		var color = MKR.Color.getColor(MKR.Color.getRgba(options.color));
		var opacity = MKR.Number.parseFloat(options.opacity, 2);
		var weight = MKR.Number.parseInt(options.weight);

		properties["_color"] = color;
		properties["_opacity"] = (typeof options.opacity === "undefined") ? 1 : opacity;
		properties["_weight"] = weight;
	},

	// 塗潰しに関する情報をオプションから取得しプロパティに設定する
	//----------------------------------------------------------------------

	setFillProperties: function (properties, options) {

		var color = MKR.Color.getColor(MKR.Color.getRgba(options.color));
		var fillColor = MKR.Color.getColor(MKR.Color.getRgba(options.fillColor));
		var fillOpacity = MKR.Number.parseFloat(options.fillOpacity, 2);

		properties["_fillColor"] = (typeof options.fillColor === "undefined") ? color : fillColor;
		properties["_fillOpacity"] = (typeof options.fillOpacity === "undefined") ? 1 : fillOpacity;
	},

	// 線に関する情報をプロパティから取得しオプションに設定する
	//----------------------------------------------------------------------

	setLineOptions: function (options, properties) {

		var color = MKR.Color.getColor(MKR.Color.getRgba(properties["_color"]));
		var opacity = MKR.Number.parseFloat(properties["_opacity"], 2);
		var weight = MKR.Number.parseInt(properties["_weight"]);

		options.color = color;
		options.opacity = Math.min(Math.max(0, opacity), 1);
		options.weight = (weight <= 0) ? 1 : weight;
	},

	// 塗潰しに関する情報をプロパティから取得しオプションに設定する
	//----------------------------------------------------------------------

	setFillOptions: function (options, properties) {

		var color = MKR.Color.getColor(MKR.Color.getRgba(properties["_color"]));
		var fillColor = MKR.Color.getColor(MKR.Color.getRgba(properties["_fillColor"]));
		var fillOpacity = MKR.Number.parseFloat(properties["_fillOpacity"], 2);

		options.fillColor = (typeof properties["_fillColor"] === "undefined") ? color : fillColor;
		options.fillOpacity = Math.min(Math.max(0, fillOpacity), 1);
	},

	// 図形が保持する情報があれば GeoJSON データに設定する
	//----------------------------------------------------------------------
	// NOTE: gsimaps にあるこのコードの意味が謎。
	//       feature プロパティは GeoJSON からロードした時のみ存在する。
	//       とりあえずキー縛りをなくした形で移植した。

	setPropertiesOther: function (properties, figureLayer, options) {
		var npKey;	// prefix '_' のないキー

		if (figureLayer.feature && figureLayer.feature.properties) {
			for (var key in figureLayer.feature.properties) {
				npKey = key.slice(1);
				if (typeof properties[key] === "undefined" && typeof options[npKey] !== "undefined") {
					properties[key] = options[npKey];
				}
			}
		}
	}
};

//----------------------------------------------------------------------
// マーカー(アイコン)
//----------------------------------------------------------------------

MKR.TypeHelper.GeoJSON.Marker = {

	// GeoJSON のキーを設定する
	//----------------------------------------------------------------------

	setGeoJSONKeys: function (keys) {

		var figureKeys = {
			"_markerType": true,
			"_iconUrl": true,
			"_iconSize": true,
			"_iconAnchor": true
		};

		$.extend(keys, figureKeys);
	},

	// GeoJSON データにオプション情報を設定する
	//----------------------------------------------------------------------

	setPropertiesFromFigureLayer: function (properties, figureLayer) {

		var options = MKR.TypeHelper.GeoJSON.getFigureOptions(figureLayer);

		var iconUrl = options.icon.options.iconUrl;
		var iconSize = MKR.Array.getPairInt(options.icon.options.iconSize);
		var iconAnchor = MKR.Array.getPairInt(options.icon.options.iconAnchor);

		properties["_markerType"] = "Icon";
		properties["_iconUrl"] = iconUrl;
		properties["_iconSize"] = (iconSize[0] === 0 || iconSize[1] === 0) ? MKR.Configs.markerIconSizeDefault : iconSize;
		properties["_iconAnchor"] = (iconAnchor[0] === 0 || iconAnchor[1] === 0) ? MKR.Configs.markerIconAnchorDefault : iconAnchor;

		MKR.TypeHelper.GeoJSON.setPropertiesOther(properties, figureLayer, options.icon.options);
	},

	// GeoJSON プロパティからマーカーを作成する
	//----------------------------------------------------------------------

	pointToLayer: function (latlng, properties) {

		var options = {};

		var iconUrl = properties["_iconUrl"];
		var iconSize = MKR.Array.getPairInt(properties["_iconSize"]);
		var iconAnchor = MKR.Array.getPairInt(properties["_iconAnchor"]);

		options.iconUrl = iconUrl;
		options.iconSize = (iconSize[0] === 0 || iconSize[1] === 0) ? MKR.Configs.markerIconSizeDefault : iconSize;
		options.iconAnchor = (iconAnchor[0] === 0 || iconAnchor[1] === 0) ? MKR.Configs.markerIconAnchorDefault : iconAnchor;

		return new L.Marker.Touch(latlng, { icon: new L.Icon(options) });
	},

	// GeoJSON プロパティからスタイル(オプション)を作成する
	//----------------------------------------------------------------------

	style: function (properties) {
		return null;
	}
};

//----------------------------------------------------------------------
// 線
//----------------------------------------------------------------------

MKR.TypeHelper.GeoJSON.Polyline = {

	setGeoJSONKeys: function (keys) {

		var figureKeys = {
		};

		MKR.TypeHelper.GeoJSON.setLineGeoJSONKeys(keys);
		$.extend(keys, figureKeys);
	},

	setPropertiesFromFigureLayer: function (properties, figureLayer) {

		var options = MKR.TypeHelper.GeoJSON.getFigureOptions(figureLayer);

		MKR.TypeHelper.GeoJSON.setLineProperties(properties, options);

		MKR.TypeHelper.GeoJSON.setPropertiesOther(properties, figureLayer, options);
	},

	pointToLayer: function (latlng, properties) {
		return null;	// 実際には呼ばれない
	},

	style: function (properties) {

		style = {};

		MKR.TypeHelper.GeoJSON.setLineOptions(style, properties);

		return style;
	}
};

//----------------------------------------------------------------------
// ポリゴン
//----------------------------------------------------------------------

MKR.TypeHelper.GeoJSON.Polygon = {

	setGeoJSONKeys: function (keys) {

		var figureKeys = {
		};

		MKR.TypeHelper.GeoJSON.setLineGeoJSONKeys(keys);
		MKR.TypeHelper.GeoJSON.setFillGeoJSONKeys(keys);
		$.extend(keys, figureKeys);
	},

	setPropertiesFromFigureLayer: function (properties, figureLayer) {

		var options = MKR.TypeHelper.GeoJSON.getFigureOptions(figureLayer);

		MKR.TypeHelper.GeoJSON.setLineProperties(properties, options);
		MKR.TypeHelper.GeoJSON.setFillProperties(properties, options);

		MKR.TypeHelper.GeoJSON.setPropertiesOther(properties, figureLayer, options);
	},

	pointToLayer: function (latlng, properties) {
		return null;	// 実際には呼ばれない
	},

	style: function (properties) {

		style = {};

		MKR.TypeHelper.GeoJSON.setLineOptions(style, properties);
		MKR.TypeHelper.GeoJSON.setFillOptions(style, properties);

		return style;
	}
};

//----------------------------------------------------------------------
// 円
//----------------------------------------------------------------------

MKR.TypeHelper.GeoJSON.Circle = {

	setGeoJSONKeys: function (keys) {

		var figureKeys = {
			"_markerType": true,
			"_radius": true
		};

		MKR.TypeHelper.GeoJSON.setLineGeoJSONKeys(keys);
		MKR.TypeHelper.GeoJSON.setFillGeoJSONKeys(keys);
		$.extend(keys, figureKeys);
	},

	setPropertiesFromFigureLayer: function (properties, figureLayer) {

		var options = MKR.TypeHelper.GeoJSON.getFigureOptions(figureLayer);

		MKR.TypeHelper.GeoJSON.setLineProperties(properties, options);
		MKR.TypeHelper.GeoJSON.setFillProperties(properties, options);

		var radius = MKR.Number.parseFloat(figureLayer.getRadius(), 1);

		properties["_markerType"] = "Circle";
		properties["_radius"] = (radius <= 1) ? 1 : radius;	// NOTE: L.Circle の半径の最小は 1 m(だと思う)

		MKR.TypeHelper.GeoJSON.setPropertiesOther(properties, figureLayer, options);
	},

	pointToLayer: function (latlng, properties) {
		var options = {};

		MKR.TypeHelper.GeoJSON.setLineOptions(options, properties);
		MKR.TypeHelper.GeoJSON.setFillOptions(options, properties);

		var radius = MKR.Number.parseFloat(properties["_radius"], 1);

		return new L.Circle(latlng, radius, options);
	},

	style: function (properties) {

		style = {};

		MKR.TypeHelper.GeoJSON.setLineOptions(style, properties);
		MKR.TypeHelper.GeoJSON.setFillOptions(style, properties);

		return style;
	}
};

//----------------------------------------------------------------------
// マーカー(円)
//----------------------------------------------------------------------

MKR.TypeHelper.GeoJSON.CircleMarker = {

	setGeoJSONKeys: function (keys) {

		var figureKeys = {
			"_markerType": true,
			"_radius": true
		};

		MKR.TypeHelper.GeoJSON.setLineGeoJSONKeys(keys);
		MKR.TypeHelper.GeoJSON.setFillGeoJSONKeys(keys);
		$.extend(keys, figureKeys);
	},

	setPropertiesFromFigureLayer: function (properties, figureLayer) {

		var options = MKR.TypeHelper.GeoJSON.getFigureOptions(figureLayer);

		MKR.TypeHelper.GeoJSON.setLineProperties(properties, options);
		MKR.TypeHelper.GeoJSON.setFillProperties(properties, options);

		var radius = MKR.Number.parseFloat(figureLayer.getRadius(), 1);

		properties["_markerType"] = "CircleMarker";
		properties["_radius"] = (radius <= 1) ? 1 : radius;	// NOTE: L.Circle の半径の最小は 1 px(だと思う)

		MKR.TypeHelper.GeoJSON.setPropertiesOther(properties, figureLayer, options);
	},

	pointToLayer: function (latlng, properties) {
		var options = {};

		MKR.TypeHelper.GeoJSON.setLineOptions(options, properties);
		MKR.TypeHelper.GeoJSON.setFillOptions(options, properties);

		var radius = MKR.Number.parseFloat(properties["_radius"], 1);
		options.radius = radius;

		return new L.CircleMarker(latlng, options);
	},

	style: function (properties) {

		style = {};

		MKR.TypeHelper.GeoJSON.setLineOptions(style, properties);
		MKR.TypeHelper.GeoJSON.setFillOptions(style, properties);

		return style;
	}
};

//----------------------------------------------------------------------
// マーカー(テキスト)
//----------------------------------------------------------------------

MKR.TypeHelper.GeoJSON.DivIconMarker = {

	setGeoJSONKeys: function (keys) {

		var figureKeys = {
			"_markerType": true,
			"_html": true
		};

		$.extend(keys, figureKeys);
	},

	setPropertiesFromFigureLayer: function (properties, figureLayer) {

		var options = MKR.TypeHelper.GeoJSON.getFigureOptions(figureLayer);

		var html = $.trim(options.icon.options.htmlValue);

		properties["_markerType"] = "DivIcon";
		properties["_html"] = (html === "") ? "　" : html;

		MKR.TypeHelper.GeoJSON.setPropertiesOther(properties, figureLayer, options.icon.options);
	},

	pointToLayer: function (latlng, properties) {
		var options = {};

		var html = $.trim(properties["_html"]);

		options.htmlValue = html;

		return new MKR.DivIconMarker(latlng, { icon: new MKR.DivIcon(options) });
	},

	style: function (properties) {
		return null;
	}
};

////////////////////////////////////////////////////////////////////////
// タイプヘルパ(実行時設定)
////////////////////////////////////////////////////////////////////////

MKR.TypeHelper.Setting = {

	// 新しい作図設定のオブジェクトを取得する
	//----------------------------------------------------------------------

	getNewFigureOption: function (figureType) {

		// NOTE: @figureTypeSwitch
		switch (figureType) {
		case MKR.FigureType.Marker:
			return new MKR.Option.Marker();

		case MKR.FigureType.Polyline:
			return new MKR.Option.Polyline();

		case MKR.FigureType.Polygon:
			return new MKR.Option.Polygon();

		case MKR.FigureType.Circle:
			return new MKR.Option.Circle();

		case MKR.FigureType.CircleMarker:
			return new MKR.Option.CircleMarker();

		case MKR.FigureType.DivIconMarker:
			return new MKR.Option.DivIconMarker();
		}

		MKR.Debug.notImplemented();
		return {};
	}
};

