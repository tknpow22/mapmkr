/*
 * レイヤ管理
 */

////////////////////////////////////////////////////////////////////////
// レイヤ情報
////////////////////////////////////////////////////////////////////////

MKR.Layer = {};

MKR.Layer.LayerInfo = function (name, displayName, layer) {
	this.name = name;
	this.displayName = displayName;
	this.layer = layer;
	this.visible = true;
};

////////////////////////////////////////////////////////////////////////
// ダウンロード用のレイヤの設定情報
////////////////////////////////////////////////////////////////////////

MKR.Layer.SettingLayerInfo = function (name, displayName) {
	this.name = name;
	this.displayName = displayName;
};

MKR.Layer.SettingMapTileInfo = function (name, urlTemplate) {
	this.name = name;
	this.urlTemplate = urlTemplate;
};

MKR.Layer.Settings = function (saveDate) {
	this.saveDate = saveDate;
	this.mapName = "";
	this.layers = [];	// [MKR.Layer.SettingLayerInfo, ...]
	this.mapTiles = [];	// [MKR.Layer.SettingMapTileInfo, ...]
};

////////////////////////////////////////////////////////////////////////
// レイヤ管理
////////////////////////////////////////////////////////////////////////

MKR.LayerManager = L.Class.extend({

	includes: L.Mixin.Events,

	_map: null,

	_mapManager: null,

	_contextMenu: null,

	_layerInfoList: null,	// [MKR.Layer.LayerInfo, ...]

	_currentLayerInfoIndex: -1,

	// レイヤ表示名の命名に使用する
	_tempNameNumber: 0,

	// 公開用ファイル
	// NOTE: 公開用ファイルは必ず UTF-8 で保存しておくこと
	_publishFilesVersion: "1.0.0",
	_publishFiles: [
		"index.html",
		"gsimaps.css",
		"viewmap.css",
		"viewmap.js"
	],

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (mapManager, contextMenu) {
		var self = this;

		this._map = mapManager.getMap();
		this._mapManager = mapManager;
		this._contextMenu = contextMenu;
		this._layerInfoList = [];
	},

	//
	// レイヤの表示・非表示状態を返す
	//----------------------------------------------------------------------
	//

	isLayerVisible: function (index) {

		var layerInfo = this.getLayerInfo(index);
		if (layerInfo === null) {
			return false;
		}

		return layerInfo.visible;
	},

	//
	// レイヤを非表示にする
	//----------------------------------------------------------------------
	//

	hideLayer: function (index) {

		var layerInfo = this.getLayerInfo(index);
		if (layerInfo === null) {
			return false;
		}

		var infoIndex = this._currentLayerInfoIndex;
		if (infoIndex === index) {
			return false;
		}

		this._map.removeLayer(layerInfo.layer);
		layerInfo.visible = false;

		this.fire("mkrLayer:layerVisible", { index: index, visible: false });

		this.setLayersOrder();

		return true;
	},

	//
	// レイヤを表示にする
	//----------------------------------------------------------------------
	//

	showLayer: function (index) {

		var layerInfo = this.getLayerInfo(index);
		if (layerInfo === null) {
			return false;
		}

		this._map.addLayer(layerInfo.layer);
		layerInfo.visible = true;

		this.fire("mkrLayer:layerVisible", { index: index, visible: true });

		this.setLayersOrder();

		return true;
	},

	//
	// レイヤを前面に移動する
	//----------------------------------------------------------------------
	//

	layerToForeground: function (index) {
		if (index - 1 < 0) {
			return false;
		}

		var layerInfoFore = this.getLayerInfo(index - 1);
		if (layerInfoFore === null) {
			return false;
		}

		var layerInfo = this.getLayerInfo(index);
		if (layerInfo === null) {
			return false;
		}

		this._layerInfoList[index - 1] = layerInfo;
		this._layerInfoList[index] = layerInfoFore;

		if (this._currentLayerInfoIndex === index) {
			this._currentLayerInfoIndex = index - 1;
		} else if (this._currentLayerInfoIndex === index - 1) {
			this._currentLayerInfoIndex = index;
		}

		this.fire("mkrLayer:layerToForeground", { index: index });

		this.setLayersOrder();

		return true;
	},

	//
	// レイヤを背面に移動する
	//----------------------------------------------------------------------
	//

	layerToBackground: function (index) {
		if (this._layerInfoList.length <= index + 1) {
			return false;
		}

		var layerInfoBack = this.getLayerInfo(index + 1);
		if (layerInfoBack === null) {
			return false;
		}

		var layerInfo = this.getLayerInfo(index);
		if (layerInfo === null) {
			return false;
		}

		this._layerInfoList[index] = layerInfoBack;
		this._layerInfoList[index + 1] = layerInfo;

		if (this._currentLayerInfoIndex === index) {
			this._currentLayerInfoIndex = index + 1;
		} else if (this._currentLayerInfoIndex === index + 1) {
			this._currentLayerInfoIndex = index;
		}

		this.fire("mkrLayer:layerToBackground", { index: index });

		this.setLayersOrder();

		return true;
	},

	//
	// レイヤを削除する
	//----------------------------------------------------------------------
	//

	removeLayer: function (index) {

		var removeLayerInfo = this.getLayerInfo(index);
		if (removeLayerInfo === null) {
			return false;
		}

		var length = this._layerInfoList.length;
		var lengthNew = length - 1;

		var indexNew = this._currentLayerInfoIndex;
		if (index <= indexNew) {
			--indexNew;
		}

		if (indexNew < 0) {
			indexNew = (0 < lengthNew) ? 0 : -1;
		}

		this._layerInfoList.splice(index, 1);
		this._currentLayerInfoIndex = indexNew;

		this.fire("mkrLayer:removed", { indexOld: index });
		this.fire("mkrLayer:changed");

		this._map.removeLayer(removeLayerInfo.layer);

		if (lengthNew <= 0) {
			this.addNewLayer();
		} else {
			this.showLayer(indexNew);
		}

		return false;
	},

	//
	// すべてのレイヤを削除する
	//----------------------------------------------------------------------
	//
	removeLayers: function () {
		var length = this._layerInfoList.length;
		for (var index = length - 1; 0 <= index; --index) {
			this.removeLayer(index);
		}
		this.fire("mkrLayer:removedAll");
	},

	//
	// 新しいレイヤを追加する
	//----------------------------------------------------------------------
	//

	addNewLayer: function () {
		var layer = new L.FeatureGroup();

		var name = this._getNewLayerName();
		var displayName = this._getNewLayerDisplayName();

		var layerInfo = new MKR.Layer.LayerInfo(name, displayName, layer);

		this._layerInfoList.push(layerInfo);
		this._currentLayerInfoIndex = this._layerInfoList.length - 1;

		this._map.addLayer(layer);

		this.fire("mkrLayer:add", { index: this._currentLayerInfoIndex, operation: "new" });
		this.fire("mkrLayer:changed");

		this.setLayersOrder();
	},

	//
	// レイヤを選択する
	//----------------------------------------------------------------------
	//

	setCurrentLayer: function (index) {
		var layerInfo = this.getLayerInfo(index);
		if (layerInfo === null) {
			return false;
		}

		this._currentLayerInfoIndex = index;

		if (!layerInfo.visible) {
			this.showLayer(index);
		} else {
			this.setLayersOrder();
		}

		this.fire("mkrLayer:changed");

		return true;
	},

	//
	// レイヤの表示名・ファイル名を変更する
	//----------------------------------------------------------------------
	//

	renameLayer: function (index, nameNew, displayNameNew) {

		if (!this.checkSameName(index, nameNew)) {
			return false;
		}

		this._layerInfoList[index].name = nameNew;
		this._layerInfoList[index].displayName = displayNameNew;

		this.fire("mkrLayer:rename", { index: index });

		return true;
	},

	//
	// レイヤのファイル名に同じものがないかチェックする
	//----------------------------------------------------------------------
	//

	checkSameName: function (index, nameNew) {

		if (!this._checkIndex(index)) {
			return false;
		}

		for (var i = 0; i < this._layerInfoList.length; ++i) {
			var layerInfo = this._layerInfoList[i];
			if (layerInfo.name === nameNew) {
				if (index === i) {
					return true;
				} else {
					return false;
				}
			}
		}

		return true;
	},

	//
	// レイヤ情報を取得する
	//----------------------------------------------------------------------
	//

	getLayerInfo: function (index) {
		if (0 <= index && index < this._layerInfoList.length) {
			return this._layerInfoList[index];
		}

		return null;
	},

	getLayerInfoByName: function (name) {
		for (var i = 0; i < this._layerInfoList.length; ++i) {
			var layerInfo = this._layerInfoList[i];
			if (name === layerInfo.name) {
				return layerInfo;
			}
		}
		return null;
	},

	//
	// 選択されているレイヤ情報を取得する
	//----------------------------------------------------------------------
	//

	getCurrentLayerInfo: function () {
		if (0 <= this._currentLayerInfoIndex && this._currentLayerInfoIndex < this._layerInfoList.length) {
			return this._layerInfoList[this._currentLayerInfoIndex];
		}

		return null;
	},

	//
	// 選択されているレイヤを取得する
	//----------------------------------------------------------------------
	//

	getCurrentLayer: function () {
		var layerInfo = this.getCurrentLayerInfo();
		if (layerInfo !== null) {
			return layerInfo.layer;
		}

		return null;
	},

	//
	// 選択されているレイヤ情報のインデックスを取得する
	//----------------------------------------------------------------------
	//

	getCurrentLayerInfoIndex: function () {
		if (0 <= this._currentLayerInfoIndex && this._currentLayerInfoIndex < this._layerInfoList.length) {
			return this._currentLayerInfoIndex;
		}

		return -1;
	},

	//
	// 表示されている図形の総計を返す
	//----------------------------------------------------------------------
	//

	getVisibleFiguresCount: function () {
		var count = 0;

		for (var i = 0; i < this._layerInfoList.length; ++i) {
			if (this._layerInfoList[i].visible) {
				count += this._layerInfoList[i].layer.getLayers().length;
			}
		}

		return count;
	},

	//
	// レイヤデータから ZIP ファイルを作成する
	//----------------------------------------------------------------------
	// successCallback: function (content) {}
	// errorCallback: function () {}
	//

	createZip: function (type, publishInfo, includePublishFiles, compress, successCallback, errorCallback) {
		var self = this;

		var saveDt = new Date();
		var saveDate = moment(saveDt).format("YYYY/MM/DD-HH:mm:ss.SSS");

		// NOTE: レイヤの GeoJSON ファイルの名前はユーザーが付与できるため、
		//       ファイル名が重なってしまわないよう、
		//       その他のファイル(設定ファイルや公開用ファイル)には拡張子 geojson を持つファイルを含めないこと。

		if (publishInfo !== null) {

			if (includePublishFiles) {

				var loaders = [];
				$.each(this._publishFiles, function (index, filename) {
					var loader = MKR.Ajax.fetchFile("bundle/" + filename + "?v=" + this._publishFilesVersion);
					loaders.push(loader);
				});

				$.when.apply($, loaders).done(function() {

					var loaderResults = arguments;

					var bundleFiles = [];

					$.each(loaderResults, function (index, loaderResult) {

						if (loaderResult[1] !== "success") {
							success = false;
							return false;	// break;
						}

						var publishFilename = self._publishFiles[index];

						var content = loaderResult[0];

						if (publishFilename === "index.html") {
							// NOTE: この処理は bundle/viewmap.js と密接に関連するので注意
							content = content.replace(/\/\*@saveDate\*\//g, "var MKR_saveDate = '" + saveDate + "';");
						}

						bundleFiles.push({
							filename: publishFilename,
							content: content
						});
					});

					if (loaderResults.length === bundleFiles.length) {
						// OK
						self._createZip(type, saveDt, saveDate, publishInfo.mapName, publishInfo.mapTileNames, compress, bundleFiles, successCallback);
					} else {
						errorCallback();
					}

				}).fail(function() {
					errorCallback();
				});
			} else {
				this._createZip(type, saveDt, saveDate, publishInfo.mapName, publishInfo.mapTileNames, compress, [], successCallback);
			}

		} else {
			this._createZip(type, saveDt, saveDate, "", [], compress, [], successCallback);
		}
	},

	_createZip: function (type, saveDt, saveDate, mapName, mapTileNames, compress, bundleFiles, successCallback) {
		var jszip = new JSZip();

		var zipDt = MKR.Date.getJSZipTimestamp(saveDt);

		function addFile(fname, data) {
			jszip.file(fname, data, {
				date: zipDt
			});
		}

		// 設定ファイルを追加する
		var layerSettings = new MKR.Layer.Settings(saveDate);
		layerSettings.mapName = mapName;
		for (var i = 0; i < this._layerInfoList.length; ++i) {
			var layerInfo = this._layerInfoList[i];
			var layers = layerInfo.layer.getLayers();
			if (layerInfo.visible && 0 < layers.length) {
				layerSettings.layers.push(new MKR.Layer.SettingLayerInfo(
					layerInfo.name,
					layerInfo.displayName
				));
			}
		}
		if (mapTileNames.length === 0) {
			mapTileNames.push(this._mapManager.getCurrentTileName());
		}
		for (var i = 0; i < mapTileNames.length; ++i) {
			var mapTileName = mapTileNames[i];

			var mapTile = MKR.ConfigUtil.findMapTileByName(MKR.Configs.mapTiles, mapTileName);
			if (mapTile !== null) {
				layerSettings.mapTiles.push(new MKR.Layer.SettingMapTileInfo(
					mapTile.displayName,
					mapTile.urlTemplate
				));
			}
		}
		addFile("settings.json", (compress) ? JSON.stringify(layerSettings) : JSON.stringify(layerSettings, null, "  "));

		// レイヤの GeoJSON ファイルを追加する
		for (var i = 0; i < this._layerInfoList.length; ++i) {
			var layerInfo = this._layerInfoList[i];
			var layers = layerInfo.layer.getLayers();
			if (layerInfo.visible && 0 < layers.length) {
				var geoJSONMaker = new MKR.Task.GeoJSONMaker(layers);
				var geojsonContent = geoJSONMaker.toGeoJSON();
				addFile(layerInfo.name + ".geojson", (compress) ? JSON.stringify(geojsonContent) : JSON.stringify(geojsonContent, null, "  "));
			}
		}

		// 公開用ファイルを追加する
		for (var i = 0; i < bundleFiles.length; ++i) {
			addFile(bundleFiles[i].filename, bundleFiles[i].content);
		}

		jszip.generateAsync({ type: type }).then(successCallback);
	},

	//
	// レイヤデータをダウンロードする
	//----------------------------------------------------------------------
	// successCallback: function (content) {}
	// errorCallback: function () {}
	//

	downloadLayers: function (zipFilename, publishInfo, includePublishFiles, compress) {
		var self = this;

		this.createZip("blob", publishInfo, includePublishFiles, compress, function (content) {
			saveAs(content, zipFilename);
		}, function () {
			self.fire("mkrLayer:downloadError");
		});
	},

	//
	// レイヤデータをロードする
	//----------------------------------------------------------------------
	//

	_createLoadedLayerInfo: function (layer, name, displayName) {
		return {
			layer: layer,
			name: name,
			displayName: displayName
		};
	},

	_getJsonFilePattern: /(\\|\/)*([^\\\/]+)\.geojson$/i,

	_getName: function (filename) {
		var m = filename.match(this._getJsonFilePattern);
		if (m && 2 < m.length) {
			return $.trim(m[2]);
		}
		return null;
	},

	// Base64 形式の ZIP データをロードする

	loadLayersFromBase64Zip: function (base64ZipData, removeExistsLayer) {
		var self = this;

		var jszip = new JSZip();

		jszip.loadAsync(base64ZipData, { base64: true }).then(function (zip) {
			self._loadLayersFromZip(zip, removeExistsLayer);
		}, function (ex) {
			self.fire("mkrLayer:loadError");
		});
	},

	// file で指定された ZIP データまたは geojson データをロードする

	loadLayersFromFile: function (file, removeExistsLayer) {
		var self = this;

		if (file.name.match(/\.zip$/i)) {

			var jszip = new JSZip();

			jszip.loadAsync(file).then(function (zip) {

				self._loadLayersFromZip(zip, removeExistsLayer);

			}, function (ex) {
				self.fire("mkrLayer:loadError");
			});

		} else {

			var fileReader = new FileReader();
			fileReader.onload = function (event) {
				var geoJSONLoader = new MKR.Task.GeoJSONLoader(event.target.result, self._contextMenu);
				var layer = geoJSONLoader.toLayer();
				if (layer !== null) {
					self._addLoadedLayers(
						[self._createLoadedLayerInfo(layer, self._getName(file.name), null)],
						1,
						removeExistsLayer
					);
				} else {
					self.fire("mkrLayer:loadError");
				}
			};
			fileReader.onerror = function(event) {
				self.fire("mkrLayer:loadError");
			};
			fileReader.readAsText(file);
		}
	},

	_loadLayersFromZip: function (zip, removeExistsLayer) {

		var self = this;

		var geoJsonContents = {};

		// すべてのファイルの一覧と同期待ちオブジェクトを作成する
		zip.forEach(function (relativePath, zipEntry) {
			if (!zipEntry.dir) {
				var defer = new $.Deferred;
				geoJsonContents[zipEntry.name] = {
					defer: defer,
					promise: defer.promise(),
					data: null
				};
			}
		});

		// ファイルの展開を行う
		zip.forEach(function (relativePath, zipEntry) {
			if (!zipEntry.dir) {
				var zipEntryname = zipEntry.name;

				zip.file(zipEntryname).async("string").then(function (data) {

					var geoJsonContent = geoJsonContents[zipEntryname];
					if (geoJsonContent) {
						geoJsonContent.data = data;
						geoJsonContent.defer.resolve();
					}

				}, function (ex) {

					var geoJsonContent = geoJsonContents[zipEntryname];
					if (geoJsonContent) {
						geoJsonContent.defer.reject();
					}

				});
			}
		});

		// 展開がすべて済んでから個々のファイルを処理する

		var promiseArr = [];
		for (var key in geoJsonContents) {
			promiseArr.push(geoJsonContents[key].promise);
		}

		$.when.apply($, promiseArr).done(function () {

			var layerSettings = {};
			var fileCount = 0;
			var loadedLayerInfos = [];

			// 設定ファイルがあれば先に読み込んでおく
			for (var zipEntryname in geoJsonContents) {

				if (zipEntryname.match(/settings\.json$/i)) {

					try {
						var layerSettingsJson = JSON.parse(geoJsonContents[zipEntryname].data);
						layerSettings = layerSettingsJson;
					} catch (ex) {
						console.log(ex);	// NOTE: @required
					}

					break;
				}
			}

			if (self._checkLayerSettings(layerSettings)) {

				// レイヤデータを設定ファイルの順に読み込む
				for (var i = 0; i < layerSettings.layers.length; ++i) {
					var settingLayerInfo = layerSettings.layers[i];

					for (var zipEntryname in geoJsonContents) {
						if (!zipEntryname.match(/\.geojson$/i)) {
							continue;
						}

						var filename = self._getName(zipEntryname);
						if (filename !== settingLayerInfo.name) {
							continue;
						}

						++fileCount;
						var data = geoJsonContents[zipEntryname].data;

						var geoJSONLoader = new MKR.Task.GeoJSONLoader(data, self._contextMenu);
						var layer = geoJSONLoader.toLayer();
						if (layer !== null) {
							loadedLayerInfos.push(self._createLoadedLayerInfo(layer, filename, $.trim(settingLayerInfo.displayName)));
						}
						geoJsonContents[zipEntryname].done = true;
					}
				}
			}

			// もし設定ファイルに記載のないレイヤデータがあれば読み込む
			for (var zipEntryname in geoJsonContents) {
				if (!zipEntryname.match(/\.geojson$/i)) {
					continue;
				}

				if (geoJsonContents[zipEntryname].done) {
					continue;
				}

				var data = geoJsonContents[zipEntryname].data;

				var filename = self._getName(zipEntryname);
				if (filename === null) {
					continue;
				}

				++fileCount;

				var geoJSONLoader = new MKR.Task.GeoJSONLoader(data, self._contextMenu);
				var layer = geoJSONLoader.toLayer();
				if (layer !== null) {
					loadedLayerInfos.push(self._createLoadedLayerInfo(layer, filename, null));
				}
			}

			self._addLoadedLayers(loadedLayerInfos, fileCount, removeExistsLayer);

		}).fail(function () {
			self.fire("mkrLayer:loadError");
		});
	},

	//
	// レイヤの並びを設定する
	//----------------------------------------------------------------------
	//

	setLayersOrder: function () {

		var zIndexBase;

		// NOTE: 並びの設定はレイヤの表示・非表示に関係無く行っておくこと。

		for (var i = this._layerInfoList.length - 1; 0 <= i; --i) {
			if (this._currentLayerInfoIndex === i) {
				continue;
			}

			var layer = this._layerInfoList[i].layer;

			zIndexBase = this.getLayerZIndexBase(i);
			this._bringToFront(layer, zIndexBase);
		}

		var layer = this._layerInfoList[this._currentLayerInfoIndex].layer;
		zIndexBase = this.getLayerZIndexBase(this._currentLayerInfoIndex);
		this._bringToFront(layer, zIndexBase);
	},

	//
	// z-index のベース値を得る
	//----------------------------------------------------------------------
	//

	getLayerZIndexBase: function (index) {
		if (index === this._currentLayerInfoIndex) {
			return this._layerInfoList.length + 1;
		} else {
			return index + 1;
		}
	},

	//
	// マーカーに z-index を設定する
	//----------------------------------------------------------------------
	//

	setCurrentZIndexIfMarker: function (figureLayer) {
		var zIndexBase = this.getLayerZIndexBase(this._currentLayerInfoIndex);
		MKR.WidgetUtil.setZIndexIfMarker(figureLayer, zIndexBase);
	},

	//
	// 指定されたレイヤを前面に表示し、マーカーの並びを設定する
	//----------------------------------------------------------------------
	//

	_bringToFront: function (layer, zIndexBase) {

		try {
			layer.bringToFront();
		} catch (ex) {
			// @Leaflet 0.7.3:
			// - L.Path.bringToFront(): レイヤ非表示→表示時に
			//   「Uncaught TypeError: Cannot read property '_pathRoot' of null」が起こる場合がある。

			// 当該メソッド内で this._map._pathRoot が存在しない場合は、そもそも処理対象外であるため、
			// 例外をキャッチすることで対応した。
		}

		layer.eachLayer(function (figureLayer) {
			MKR.WidgetUtil.setZIndexIfMarker(figureLayer, zIndexBase);
		});
	},

	//
	// ロードした設定ファイルの最低限のチェックする
	//----------------------------------------------------------------------
	//

	_checkLayerSettings: function (layerSettings) {
		if (typeof layerSettings.layers === "undefined") {
			return false;
		}

		if (!$.isArray(layerSettings.layers)) {
			return false;
		}

		if (0 < layerSettings.layers.length) {
			if (typeof layerSettings.layers[0].name === "undefined") {
				return false;
			}
			if (typeof layerSettings.layers[0].displayName === "undefined") {
				return false;
			}
		}

		return true;
	},

	//
	// ロードしたレイヤを追加する
	//----------------------------------------------------------------------
	//

	_addLoadedLayers: function (loadedLayerInfos, fileCount, removeExistsLayer) {

		if (loadedLayerInfos.length === 0) {
			this.fire("mkrLayer:loadError");
			return;
		}

		var prevLayerInfoListLength = this._layerInfoList.length;

		if (removeExistsLayer) {
			for (var i = 0; i < this._layerInfoList.length; ++i) {
				var layerInfo = this._layerInfoList[i];
				this._map.removeLayer(layerInfo.layer);
			}

			MKR.Array.clear(this._layerInfoList);
			this._currentLayerInfoIndex = -1;
		}

		for (var i = 0; i < loadedLayerInfos.length; ++i) {
			var loadedLayerInfo = loadedLayerInfos[i];

			var nameNew = this._getNewLayerName(loadedLayerInfo.name);
			var displayName = loadedLayerInfo.displayName || this._getNewLayerDisplayName();

			var layerInfo = new MKR.Layer.LayerInfo(nameNew, displayName, loadedLayerInfo.layer);

			this._layerInfoList.push(layerInfo);

			this._map.addLayer(loadedLayerInfo.layer);
		}

		if (removeExistsLayer) {
			for (var index = prevLayerInfoListLength - 1; 0 <= index; --index) {
				this.fire("mkrLayer:removed", { indexOld: index });
			}
			this.fire("mkrLayer:removedAll");
		}

		var addLayerIndex = (removeExistsLayer) ? 0 : prevLayerInfoListLength;

		for (var i = 0; i < loadedLayerInfos.length; ++i) {
			this.fire("mkrLayer:add", { index: addLayerIndex, operation: "load" });
			++addLayerIndex;
		}

		if (removeExistsLayer) {
			this._currentLayerInfoIndex = 0;
			this.fire("mkrLayer:changed");
		}

		if (loadedLayerInfos.length < fileCount) {
			this.fire("mkrLayer:someError");
		}

		this.setLayersOrder();
	},

	//
	// 新しいファイル名を返す
	//----------------------------------------------------------------------
	//

	_getNewLayerName: function (name) {
		var momt = moment();

		name = name || momt.format("YYYYMMDDHHmmssSSS");
		var nameNew = name;

		var existsLayerInfo;
		var suffix = 1;

		while ((existsLayerInfo = this.getLayerInfoByName(nameNew)) !== null) {
			nameNew = name + "_" + String(suffix++);
		}

		return nameNew;
	},

	//
	// 新しいレイヤの表示名を返す
	//----------------------------------------------------------------------
	//

	_getNewLayerDisplayName: function () {
		return "新規レイヤ_" + String(++this._tempNameNumber);
	},

	//
	// 引数インデックスをチェックする
	//----------------------------------------------------------------------
	//

	_checkIndex: function (index) {
		if (index < 0 || this._layerInfoList.length <= index) {
			return false;
		}
		return true;
	}
});

