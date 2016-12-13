/*
 * viewmap: v.1.0.1
 * encoding: UTF-8 & LF
 */

////////////////////////////////////////////////////////////////////////
// 参考としたソースコード
//----------------------------------------------------------------------
// gsimaps (地理院地図)（GitHub）
//    https://github.com/gsi-cyberjapan/gsimaps
//    commit: 020f5e47265b4c8b508b37ffd8acc025b308083e
//----------------------------------------------------------------------
// スタイルつき GeoJSON 規約（GitHub）
//    https://github.com/gsi-cyberjapan/geojson-with-style-spec
//    commit: fa8e35bf68f35905a34db21db05af147cb2bc9b6
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
// グローバル
////////////////////////////////////////////////////////////////////////

// マップオブジェクト
var map = null;

// マップディレクトリ
var MKR_mapPath = "";

// 保存日時
var MKR_saveDate = MKR_saveDate || String((new Date()).getTime());

// リサイズするか
var MKR_mapViewResize = true;

////////////////////////////////////////////////////////////////////////
// GSI
////////////////////////////////////////////////////////////////////////

var GSI = GSI || {};
GSI.Utils = GSI.Utils || {};

GSI.Utils.encodeHTML = function(src) {
	src = src.replace(/&/g, "&amp;");
	src = src.replace(/</g, "&lt;");
	src = src.replace(/>/g, "&gt;");
	return src;
};

GSI.DivIcon = L.DivIcon.extend( {
	options: {
		iconSize: null,
		className: "gsi-div-icon",
		html: false
	},
	createIcon: function(oldIcon) {
		var div = L.DivIcon.prototype.createIcon.call(this, oldIcon);
		return div;
	}
});

GSI.divIcon = function(options) {
	return new GSI.DivIcon(options);
};

////////////////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////////////////

var CONFIG = CONFIG || {};

//
// GeoJSON 独自パラメータ
//----------------------------------------------------------------------
//

CONFIG.GEOJSONSPECIALKEYS = {
	"_markerType": true,

	"_iconUrl": true,
	"_iconSize": true,
	"_iconAnchor": true,
	"_html": true,
	"_radius": true,

	"_className": true,
	"_stroke": true,
	"_radius": true,

	"_dashArray": true,
	"_lineCap": true,
	"_lineJoin": true,
	"_clickable": true,

	"_color": true,
	"_opacity": true,
	"_weight": true,
	"_fill": true,
	"_fillColor": true,
	"_fillOpacity": true,
	"_weight": true
};

//
//  設定：作図
//----------------------------------------------------------------------
//

CONFIG.SAKUZU = {
	SYMBOL: {
		ICONSIZE : [20, 20]
	}
};

////////////////////////////////////////////////////////////////////////
// GSI.GeoJSON
////////////////////////////////////////////////////////////////////////

//
// _xxx 形式のアイコンのオプション設定を xxx 形式にして返す
//----------------------------------------------------------------------
//

function createIconOptions(properties, optionKeys) {
	var options = {};

	$.each(optionKeys, function(i, key) {
		var value = properties["_" + key];
		if (value) {
			options[key] = value;
		}
	});

	return options;
}

//
// _xxx 形式のマーカーのオプション設定を xxx 形式にして返す
//----------------------------------------------------------------------
//

function createMarkerOptions(properties) {
	var options = {};

	for (var key in properties) {
		if (!properties[key]) {
			continue;
		}

		if (key !== "" && key.charAt(0) === "_" && key !== "_markerType") {
			var value = properties[key];
			key = key.slice(1);
			options[key] = value;
		}
	}

	return options;
}

//
// デフォルトのマーカーを返す
//----------------------------------------------------------------------
//

function getDefaultMarker(latlng) {
	return L.marker(latlng, {
		icon: L.icon({
			iconUrl: "//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/080.png",
			iconSize: [20, 20],
			iconAnchor: [10, 10]
		})
	});
}

//
// GeoJSON 形式のデータを読み込む L.geoJson() へのオプション
//----------------------------------------------------------------------
//

var geoJsonOptions = {

	// pointToLayer
	//----------------------------------------------------------------------

	pointToLayer: function (feature, latlng) {

		if (!feature.properties) {
			return getDefaultMarker(latlng);
		}

		var marker = null;

		if (feature.properties["_markerType"]) {

			var markerType = feature.properties["_markerType"];

			switch (markerType) {

			case "DivIcon":
				var options = createIconOptions(feature.properties, ["iconSize", "iconAnchor", "html", "className"]);
				marker = L.marker(latlng, {
										icon: GSI.divIcon(options)
									});
				break;

			case "CircleMarker":
				var options = createMarkerOptions(feature.properties);
				marker = L.circleMarker(latlng, options);
				marker.setRadius(options["radius"]);
				break;

			case "Circle":
				var options = createMarkerOptions(feature.properties);
				marker = L.circle(latlng, options["radius"],options);
				break;
			}
		}

		if (!marker) {
			if (!feature.properties["_iconUrl"]) {
				return getDefaultMarker(latlng);
			}

			var options = createIconOptions(feature.properties, ["iconUrl", "iconSize", "iconAnchor", "className"]);
			if (options.iconSize) {
				options._iconScale = options.iconSize[0] / CONFIG.SAKUZU.SYMBOL.ICONSIZE[0];
			}

			marker = L.marker(latlng, {
									icon: L.icon(options)
								});
		}

		return marker;
	},

	// style
	//----------------------------------------------------------------------

	style: function (feature) {

		if (!feature.properties) {
			return null;
		}

		var style = null;
		var iconStyleKeys = {
			"_markerType": true,
			"_iconUrl": true,
			"_iconSize": true,
			"_iconAnchor": true,
			"_html": true,
			"_radius": true
		};

		for (var key in feature.properties) {
			if (!feature.properties[key] && feature.properties[key] !== 0 ) {
				continue;
			}

			if (key !== "" && key.charAt(0) === "_") {
				if (iconStyleKeys[key]) {
					continue;
				} else {
					var value = feature.properties[key];
					key = key.slice(1);
					if (!style) { style = {}; }
					style[key] = value;
				}
			}
		}
		return style;
	},

	// onEachFeature
	//----------------------------------------------------------------------

	onEachFeature: function (feature, layer) {

		if (!feature.properties) {
			return;
		}

		var popupContent = "";

		if (feature.properties["name"]) {
			popupContent += "<h2>" + GSI.Utils.encodeHTML(feature.properties["name"]) + "</h2>";
		}

		if (feature.properties["description"]) {

			popupContent += feature.properties["description" ];

		} else {

			var table = "";

			for (var key in feature.properties) {

				if (!feature.properties[key]) {
					continue;
				}

				if (key !== "" && key !== "name" && !CONFIG.GEOJSONSPECIALKEYS[key]) {
					table +=
						"<tr>" +
						"<td>" + key + "</td>" +
						"<td>" + feature.properties[key] + "</td>" +
						"</tr>";
				}
			}

			if (table !== "") {
				table = "<table>" + table + "</table>";
				popupContent += table;
			}
		}

		if (popupContent !== "") {
			layer.bindPopup(popupContent, {
					maxWidth: 5000
				});
		}
	}

};

////////////////////////////////////////////////////////////////////////
// マップの作成とレイヤのロードを行う
////////////////////////////////////////////////////////////////////////

//
// エラー表示を行う
//----------------------------------------------------------------------
//

function displayError(message) {
	$("#load_error_message").html(message);
	console.log(message);	// NOTE: @required
}

//
// URL パラメータを取得する
//----------------------------------------------------------------------
//

function splitLocationSearch() {

	var result = {};

	var search = window.location.search;
	if (search === null) {	// 念のため
		return {};
	}

	var searchArr = search.split(/[?&]/);
	for (var i = 0; i < searchArr.length; ++i) {
		var aSearch = $.trim(searchArr[i]);
		var nvArr = aSearch.split(/[=]/);
		if (nvArr.length === 0) {
			continue;
		}
		var name = $.trim(nvArr[0]);
		var value = "";
		if (1 < nvArr.length) {
			value = $.trim(nvArr[1]);
		}

		if (name.length !== 0) {
			result[name] = value;
		}
	}

	return result;
}

//
// すべてのタイルレイヤを作成する
//----------------------------------------------------------------------
//

function createTileLayers(settings) {

	var tileLayers = [];

	for (var i = 0; i < settings.mapTiles.length; ++i) {
		var mapTile = settings.mapTiles[i];

		var tileLayer = L.tileLayer(mapTile.urlTemplate, {
						attribution: "<a href='//maps.gsi.go.jp/development/ichiran.html' target='_blank'>" + MKR_Lang.tileCopyright + "(" + mapTile.name + ")</a>",
						errorTileUrl: MKR_Lang.errorTileUrl
					});

		tileLayers.push({
			name: mapTile.name,
			tileLayer: tileLayer
		});
	}

	return tileLayers;
}

//
// GeoJSON 形式ファイルの取得結果からレイヤを作成する
//----------------------------------------------------------------------
//

function createLayer(loaderResult) {

	if (loaderResult[1] !== "success") {
		return null;
	}

	var layer = null;

	try {

		// 以下の場合には null を返却する。
		//
		// - 空のファイルや json として正しくないファイルを読み込んだ場合
		// - 空データを読み込んだ場合
		//     空データ:
		//       {
		//         "type": "FeatureCollection",
		//         "features": []
		//       }

		var data = JSON.parse(loaderResult[0]);
		layer = L.geoJson(data, geoJsonOptions);

		var innerLayers = layer.getLayers();
		if (innerLayers.length === 0) {
			// 空データの場合、表示する図形がないため、レイヤを作成できなかったものとして扱い null を返却する。

			// @Leaflet 0.7.3:
			// - L.geoJson() に空データを渡すと、返却されるオブジェクトには _leaflet_id が振られていない。

			// 本メソッドは、レイヤの表示・非表示のチェックボックスの並び順を考慮して呼び出されるため、
			// もし、空データから生成したオブジェクトを返却してしまうとチェックボックスの並び順がおかしくなるので注意すること。

			layer = null;
		}

	} catch (ex) {
		console.log(ex);	// NOTE: @required
		layer = null;
	}

	return layer;
}

//
// すべての GeoJSON 形式ファイルの取得結果からすべてのレイヤを作成する
//----------------------------------------------------------------------
//

function createLayers(settings, loaderResults) {

	// @Leaflet 0.7.3:
	// - レイヤの表示・非表示のチェックボックスの並び順は、Leaflet 内部で振られた _leaflet_id の順となる。

	// このコードでは createLayer() でレイヤが作成された順に _leaflet_id が振られる。
	// チェックボックスの並び順が settings.layers の指定順になるよう、レイヤを作成する。

	var layers = [];

	for (var i = 0; i < settings.layers.length; ++i) {
		var layerInfo = settings.layers[i];
		var loaderResult = loaderResults[i];

		var layer = createLayer(loaderResult);
		if (layer !== null) {
			layers.push({
					name: layerInfo.name,
					displayName: layerInfo.displayName,
					layer: layer
				});
		}
	}

	return layers;
}

//
// マップ上に表示するコントロールをセットアップする
//----------------------------------------------------------------------
//

function setupControls(map, tileLayers, layers) {

	var baseLayers = {};

	for (var i = 0; i < tileLayers.length; ++i) {
		baseLayers[tileLayers[i].name] = tileLayers[i].tileLayer;
	}

	var overlays = {};

	for (var i = 0; i < layers.length; ++i) {
		overlays[layers[i].displayName] = layers[i].layer;
	}

	L.control.layers(baseLayers, overlays, {
			position: "topright",
			collapsed: true
		}).addTo(map);
}

//
// レイヤの重なりを設定する
//----------------------------------------------------------------------
//

function setLayersOrder(layers) {

	for (var i = layers.length - 1; 0 <= i; --i) {
		var layer = layers[i].layer;

		try {
			layer.bringToFront();
		} catch (ex) {
			// @Leaflet 0.7.3:
			// - L.Path.bringToFront(): レイヤ非表示→表示時に
			//   「Uncaught TypeError: Cannot read property '_pathRoot' of null」が起こる場合がある。

			// 当該メソッド内で this._map._pathRoot が存在しない場合は、そもそも処理対象外であるため、
			// 例外をキャッチすることで対応した。
		}
	}
}

//
// ファイルを取得する
//----------------------------------------------------------------------
//

function loadFile(filename) {

	var defer = new $.Deferred;

	var requestUrl = MKR_mapPath + filename + "?v=" + encodeURIComponent(MKR_saveDate);

	$.ajax({url: requestUrl, dataType: "text"}).done(function() {
		defer.resolve(arguments);
	}).fail(function() {
		// NOTE: ファイルが取得できない場合でも正常終了扱いとする
		//       利用する側は結果をチェックすること。
		////defer.reject(arguments);
		defer.resolve(arguments);
	});

	return defer.promise();
}

//
// マップとレイヤを表示する
//----------------------------------------------------------------------
//

function displayMapAndLayers(settings) {

	//
	// マップを作成し表示する
	//
	map = L.map("map_view", {
		center: MKR_Lang.mapCenterDefault,
		zoom: 5,
		zoomControl: false
	});

	//
	// マップに表示するタイルレイヤを作成する
	//
	var tileLayers = createTileLayers(settings);
	if (0 < tileLayers.length) {
		// 先頭のタイルレイヤを初期表示タイルとする。

		// @Leaflet 0.7.3:
		// - タイルレイヤの選択オプションの並び順は、Leaflet 内部で振られた _leaflet_id の順となる。

		// このコードでは layer.addTo(map) でタイルレイヤがマップに追加された時に _leaflet_id が振られる。
		// 初期表示しないタイルレイヤは作成時には _leaflet_id が振られていないため、
		// 選択オプションの並びは Leaflet の実装に依存する。

		tileLayers[0].tileLayer.addTo(map);
	} else {
		displayError(MKR_Lang.noTileLayersInfoMessage);
		return;
	}


	//
	// マップに表示する GeoJSON 形式ファイルをロードし、作図情報からレイヤを作成・表示する
	//

	if (settings.layers.length === 0) {
		displayError(MKR_Lang.noLayersDataMessage);
		return;
	}

	var layerDataLoaders = [];

	for (var i = 0; i < settings.layers.length; ++i) {
		var loader = loadFile(settings.layers[i].name + ".geojson");
		layerDataLoaders.push(loader);
	}

	$.when.apply($, layerDataLoaders).done(function () {

		try {

			var layers = createLayers(settings, arguments);
			if (0 < layers.length) {

				$.each(layers, function() {
					this.layer.addTo(map);
				});

				setupControls(map, tileLayers, layers);

				setLayersOrder(layers);

				map.on("overlayadd", function(event) {
					setLayersOrder(layers);
				});

				var bounds = new L.LatLngBounds();
				$.each(layers, function() {
					var layerBounds = this.layer.getBounds();
					bounds.extend(layerBounds);
				});

				if (bounds.isValid()) {
					// NOTE: 日本以外の領域だと拡大されて地図画像がなく、うまく表示できない場合がある
					map.fitBounds(bounds);
				}

				// マップにスケールを設定する
				L.control.scale({imperial: false}).addTo(map);

				// ズーム
				L.control.zoom({
					position: "topleft"
				}).addTo(map);

			} else {
				displayError(MKR_Lang.createLayersErrorMessage);
			}

		} catch (ex) {
			displayError(MKR_Lang.readLayersErrorMessage);
		}

	}).fail(function () {
		displayError(MKR_Lang.fetchLayersErrorMessage);
	});
}

//
// マップのリサイズを行う
//----------------------------------------------------------------------
//

function resizeMapView() {

	if (MKR_mapViewResize) {

		var windowHeight = $(window).height();
		var captionHeight = $("#viewmap_caption").outerHeight(true);

		// マップの上下を、キャプションの高さ分空ける
		var mapHeight = windowHeight - (captionHeight * 2);

		$("#map_view").height(mapHeight);

		if (map != null) {
			map.invalidateSize();
		}
	}
}

//
// スタートアップ
//----------------------------------------------------------------------
//

$(function() {

	var searchParams = splitLocationSearch();
	if (searchParams["mapDir"]) {
		MKR_mapPath += encodeURIComponent(searchParams["mapDir"]) + "/";
	}
	if (searchParams["mapId"]) {
		MKR_mapPath += encodeURIComponent(searchParams["mapId"]) + "/";
	}

	if (searchParams["maximize"] && searchParams["maximize"] == "true") {
		$("#viewmap_caption").hide();
		$("#viewmap_area").css({
			"width": "100%",
			"height": "100%"}
		);
		$("#map_view").css({
			"width": "100%",
			"height": "100%",
			"border": "none"
		});
		MKR_mapViewResize = false;
	}

	var settingsLoader = loadFile("settings.json");

	$.when(settingsLoader).done(function (loaderResult) {

		if (loaderResult[1] === "success") {

			try {

				var settings = JSON.parse(loaderResult[0]);
				if (settings.saveDate) {
					MKR_saveDate = settings.saveDate;
				}

				// タイトルとキャプションを設定する
				var mapName = settings.mapName || MKR_Lang.mapNameDefault;
				$("title").text(mapName);
				$("#viewmap_caption").text(mapName);

				// マップとレイヤを表示する
				displayMapAndLayers(settings);

				resizeMapView();

				// ウィンドウサイズ変更時にマップの大きさを調整する
				$(window).on("load resize", function(event) {
					resizeMapView();
				});

			} catch (ex) {
				displayError(MKR_Lang.loadSettingErrorMessage);
			}

		} else {
			displayError(MKR_Lang.readSettingErrorMessage);
		}
	}).fail(function () {
		displayError(MKR_Lang.fetchSettingErrorMessage);
	});
});
