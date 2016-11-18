/*
 * viewmap: v.1.0.0
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
						attribution: "<a href='//maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル（" + mapTile.name + "）</a>",
						errorTileUrl: "data:image/png;base64,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"
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
		center: [35.362222, 138.731389],
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
		displayError("タイル情報を指定してください。");
		return;
	}


	//
	// マップに表示する GeoJSON 形式ファイルをロードし、作図情報からレイヤを作成・表示する
	//

	if (settings.layers.length === 0) {
		displayError("レイヤデータを指定してください。");
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
				displayError("レイヤデータの作成に失敗しました。");
			}

		} catch (ex) {
			displayError("レイヤデータの読込みに失敗しました。");
		}

	}).fail(function () {
		displayError("レイヤデータを取得できません。");
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
				var mapName = settings.mapName || "マップ"
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
				displayError("設定ファイルの内容の取得に失敗しました。");
			}

		} else {
			displayError("設定ファイルの読込みに失敗しました。");
		}
	}).fail(function () {
		displayError("設定ファイルを取得できません。");
	});
});
