/*
 * 作図処理
 */

////////////////////////////////////////////////////////////////////////
// 図形・編集種別
////////////////////////////////////////////////////////////////////////

MKR.FigureType = {
	Marker: String(L.Draw.Marker.TYPE),
	Polyline: String(L.Draw.Polyline.TYPE),
	Polygon: String(L.Draw.Polygon.TYPE),
	Circle: String(L.Draw.Circle.TYPE),
	CircleMarker: String(MKR.Draw.CircleMarker.TYPE),
	DivIconMarker: String(MKR.Draw.DivIconMarker.TYPE)
};

MKR.EditType = {
	Edit: String(L.EditToolbar.Edit.TYPE),
	Setting: String(MKR.EditToolbar.Setting.TYPE),
	Delete: String(MKR.EditToolbar.Delete.TYPE)
};

////////////////////////////////////////////////////////////////////////
// 作図
////////////////////////////////////////////////////////////////////////

/*
o	draw:drawstart
o	draw:drawstop
o	draw:created
o	draw:canceled
-	draw:drawvertex
-	draw:editmove
-	draw:editvertex
-	draw:editresize
o	draw:editstart
o	draw:editstop
o	draw:edited
o	draw:deletestart
o	draw:deletestop
o	draw:deleted
*/

MKR.DrawFigure = L.Class.extend({

	includes: L.Mixin.Events,

	_map: null,

	_layerManager: null,

	_dialogManager: null,

	_popupWindow: null,

	_contextMenu: null,

	_currentLayer: null,

	_currentDrawHandler: null,

	_currentEditHandler: null,

	_currentDrawFigureType: null,

	_currentDrawFigureOption: null,

	_currentDrawRepeat: false,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (map, layerManager, dialogManager, popupWindow, contextMenu) {
		var self = this;

		this._map = map;
		this._layerManager = layerManager;
		this._dialogManager = dialogManager;
		this._popupWindow = popupWindow;
		this._contextMenu = contextMenu;

		// レイヤ

		layerManager.on("mkrLayer:changed", function (event) {
			self._layerChanged(event);
		});

		// 作図

		map.on("draw:drawstart", function (event) {
			self.fire("mkrFigure:figureStart", { figureType: self._currentDrawFigureType });
		});

		map.on("draw:created", function (event) {

			var figureLayer = event.layer;

			if (self._currentLayer !== null && self._currentDrawFigureOption !== null) {

				var figureOption = MKR.LeafletUtil.getFigureOption(figureLayer);
				if (figureOption === null) {
					figureOption = self._currentDrawFigureOption;
				}

				MKR.LeafletUtil.setFigureOption(figureLayer, figureOption);

				MKR.WidgetUtil.bindPopup(figureLayer, figureOption.figureInfo);

				// コンテキストメニューを設定する
				contextMenu.bind(figureLayer);

				self._currentLayer.addLayer(figureLayer);

				layerManager.setCurrentZIndexIfMarker(figureLayer);
			}

			self.fire("mkrFigure:figureCreated");
		});

		map.on("draw:canceled", function (event) {
			self.fire("mkrFigure:figureCanceled");
		});

		map.on("draw:drawstop", function (event) {

			var figureType = self._currentDrawFigureType;
			var figureOption = self._currentDrawFigureOption;
			var drawRepeat = self._currentDrawRepeat;

			self._currentDrawHandler = null;
			self._currentDrawFigureType = null;
			self._currentDrawFigureOption = null;

			self._popupWindow.enable();
			self._contextMenu.enable();

			////layerManager.setLayersOrder();

			self.fire("mkrFigure:figureStop");

			if (drawRepeat) {
				setTimeout(function () {
					self.beginFigure(figureType, figureOption, drawRepeat);
				}, 0);
			}
		});

		// 編集

		map.on("draw:editstart", function (event) {
			self.fire("mkrFigure:editStart");
		});

		map.on("draw:edited", function (event) {
			self.fire("mkrFigure:edited");
		});

		map.on("draw:editstop", function (event) {

			self._currentEditHandler = null;

			self._popupWindow.enable();
			self._contextMenu.enable();

			layerManager.setLayersOrder();

			self.fire("mkrFigure:editStop");
		});

		// 設定

		map.on("mkrDraw:settingStart", function (event) {
			self.fire("mkrFigure:settingStart");
		});

		map.on("mkrDraw:setting", function (event) {
			self.fire("mkrFigure:setting");
		});

		map.on("mkrDraw:settingStop", function (event) {

			self._currentEditHandler = null;

			self._popupWindow.enable();
			self._contextMenu.enable();

			layerManager.setLayersOrder();

			self.fire("mkrFigure:settingStop");
		});

		// 削除

		map.on("draw:deletestart", function (event) {
			self.fire("mkrFigure:deleteStart");
		});

		map.on("draw:deleted", function (event) {
			self.fire("mkrFigure:deleted");
		});

		map.on("draw:deletestop", function (event) {

			self._currentEditHandler = null;

			self._popupWindow.enable();
			self._contextMenu.enable();

			layerManager.setLayersOrder();

			self.fire("mkrFigure:deleteStop");
		});
	},

	//
	// 作図開始
	//----------------------------------------------------------------------
	//

	beginFigure: function (figureType, figureOption, drawRepeat) {

		this.cancelFigure();
		this.cancelEdit();

		if (this._currentLayer === null) {
			MKR.Debug.notImplemented();
			return;
		}

		this._currentDrawRepeat = drawRepeat;
		this._currentDrawFigureType = figureType;
		this._currentDrawFigureOption = figureOption;

		// NOTE: @figureTypeSwitch
		switch (figureType) {
		case MKR.FigureType.Marker:
			this._currentDrawHandler = new L.Draw.Marker(this._map, this._currentDrawFigureOption.draw);
			break;

		case MKR.FigureType.Polyline:
			this._currentDrawHandler = new L.Draw.Polyline(this._map, this._currentDrawFigureOption.draw);
			break;

		case MKR.FigureType.Polygon:
			this._currentDrawHandler = new L.Draw.Polygon(this._map, this._currentDrawFigureOption.draw);
			break;

		case MKR.FigureType.Circle:
			this._currentDrawHandler = new L.Draw.Circle(this._map, this._currentDrawFigureOption.draw);
			break;

		case MKR.FigureType.CircleMarker:
			this._currentDrawHandler = new MKR.Draw.CircleMarker(this._map, this._currentDrawFigureOption.draw);
			break;

		case MKR.FigureType.DivIconMarker:
			// NOTE: 他の作図クラスとはコンストラクタの引数が違うので注意
			this._currentDrawHandler = new MKR.Draw.DivIconMarker(this._map, this._dialogManager, this._currentDrawFigureOption);
			break;
		}

		if (this._currentDrawHandler === null) {
			MKR.Debug.notImplemented();
			return;
		}

		this._popupWindow.disable();
		this._contextMenu.disable();
		this._currentDrawHandler.enable();
	},

	//
	// 作図確定
	//----------------------------------------------------------------------
	//

	endFigure: function () {
		if (this._currentDrawHandler !== null) {
			if (this._currentDrawHandler.completeShape) {
				this._currentDrawHandler.completeShape();
			}
		}
	},

	//
	// 最後の点を削除
	//----------------------------------------------------------------------
	//

	deleteLastPoint: function () {
		if (this._currentDrawHandler !== null) {
			if (this._currentDrawHandler.deleteLastVertex) {
				this._currentDrawHandler.deleteLastVertex();
			}
		}
	},

	//
	// 作図キャンセル
	//----------------------------------------------------------------------
	//

	cancelFigure: function () {
		this._currentDrawRepeat = false;
		if (this._currentDrawHandler !== null) {
			this._currentDrawHandler.disable();
		}
	},

	//
	// 編集開始
	//----------------------------------------------------------------------
	//

	beginEdit: function (editType) {

		this.cancelFigure();
		this.cancelEdit();

		if (this._currentLayer === null) {
			MKR.Debug.notImplemented();
			return;
		}

		var editOption = {
			featureGroup: this._currentLayer
		};

		// NOTE: @editTypeSwitch
		switch (editType) {
		case MKR.EditType.Edit:

			editOption.selectedPathOptions = {
				dashArray: "10, 10",
				// Whether to user the existing layers color
				maintainColor: false,
				// NOTE: マーカーについてはこの値を使わず css で設定している。ここでの値と css の設定をあわせておくこと
				color: "#777777",
				opacity: 0.9,
				fillColor: '#777777',
				fillOpacity: 0.2
			};

			this._currentEditHandler = new L.EditToolbar.Edit(this._map, editOption);
			break;

		case MKR.EditType.Setting:

			editOption.selectedPathOptions = {
				iconUrl: "images/icon_cog.png"
			};

			this._currentEditHandler = new MKR.EditToolbar.Setting(this._map, this._dialogManager, editOption);
			break;

		case MKR.EditType.Delete:

			editOption.selectedPathOptions = {
				iconUrl: "images/icon_trash_o.png"
			};

			this._currentEditHandler = new MKR.EditToolbar.Delete(this._map, editOption);
			break;

		default:
			MKR.Debug.notImplemented();
			return;
		}

		this._popupWindow.disable();
		this._contextMenu.disable();
		this._currentEditHandler.enable();
	},

	//
	// 編集確定
	//----------------------------------------------------------------------
	//

	saveEdit: function() {
		if (this._currentEditHandler !== null) {
			this._currentEditHandler.save();
			this._currentEditHandler.disable();
		}
	},

	//
	// 編集キャンセル
	//----------------------------------------------------------------------
	//

	cancelEdit: function () {
		if (this._currentEditHandler !== null) {
			this._currentEditHandler.revertLayers();
			this._currentEditHandler.disable();
		}
	},

	//
	// レイヤに属する図形の個数を返す
	//----------------------------------------------------------------------
	//

	getFigureCount: function () {
		var result = 0;

		if (this._currentLayer !== null) {
			result = this._currentLayer.getLayers().length;
		}

		return result;
	},

	//
	// すべての作図処理をキャンセルする
	//----------------------------------------------------------------------
	//

	cancelAll: function () {
		this.cancelFigure();
		this.cancelEdit();
		this._popupWindow.close();
	},

	//
	// カレントレイヤが変更された時のハンドラ
	//----------------------------------------------------------------------
	//

	_layerChanged: function (event) {

		this.cancelFigure();
		this.cancelEdit();
		this._popupWindow.close();

		if (this._currentLayer !== null) {
			this._currentLayer.off("layeradd", this._layerModified, this);
			this._currentLayer.off("layerremove", this._layerModified, this);
		}

		this._currentLayer = this._layerManager.getCurrentLayer();

		if (this._currentLayer !== null) {
			this._currentLayer.on("layeradd", this._layerModified, this);
			this._currentLayer.on("layerremove", this._layerModified, this);
		}
	},

	//
	// レイヤの内容が変更された時のハンドラ
	//----------------------------------------------------------------------
	//

	_layerModified: function (event) {
		this.fire("mkrFigure:layerModified");
	},

	//
	// 作図中かを得る
	//----------------------------------------------------------------------
	//

	isDrawing: function () {
		return (this._currentDrawHandler !== null);
	}
});

/*
 * NOTE: 以下のような不具合に、以下のように対応しようとしたが他の問題が出た。
 *       今のところ L.Draw.Rectangle は使ってないので未対応。
 *----------------------------------------------------------------------
 * Leaflet.draw の L.Control.Draw で生成されるツールバーで、
 *
 *   - L.Draw.Rectangle の作図ボタンをクリック
 *   - L.Draw.Circle の作図ボタンをクリック
 *   - L.Draw.Circle の作図を開始
 *
 * を行うと、マウスカーソルが本来の十字カーソルにならず、また、マップが
 * ドラッグできてしまうため、うまく作図できない。
 *
 * 原因は、L.Draw.Feature#enable() において、ベースクラスの enable() 呼び出し後に、
 * "enabled" イベントを発火しているためで、結果として、
 * 有効になった作図クラス(L.Draw.Circle など)の addHooks() が呼ばれた後、
 * 無効になった作図クラス(L.Draw.Rectangle など)の removeHooks() が呼ばれていた。
 * L.Draw.Circle と L.Draw.Rectangle の addHooks() および removeHooks() では、
 * マウスカーソルおよびマップのドラッグ停止・開始の処理を行っており、
 * 呼び出しの順序が逆になってしまうことで、意図したとおりに動作していなかった。
 *
 * 対応として、L.Draw.Feature#enable() のベースクラスの enable() 呼び出しと
 * "enabled" イベントの発火の順を逆にしても良さそうだったが、他処理に影響しないよう
 * "enabling" イベントをベースクラスの enable() 呼び出し前に発火し、
 * L.Toolbar#_handlerActivated() の呼び出しイベントの設定で使うようにした。
 */
