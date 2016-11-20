/*
 * Leaflet.draw への変更・拡張
 */

////////////////////////////////////////////////////////////////////////
// メッセージ
////////////////////////////////////////////////////////////////////////

L.drawLocal = {
	draw: {
		toolbar: {
			actions: {
				title: "Cancel drawing",
				text: "Cancel"
			},
			finish: {
				title: "Finish drawing",
				text: "Finish"
			},
			undo: {
				title: "Delete last point drawn",
				text: "Delete last point"
			},
			buttons: {
				polyline: "Draw a polyline",
				polygon: "Draw a polygon",
				rectangle: "Draw a rectangle",
				circle: "Draw a circle",
				marker: "Draw a marker"
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: "円の中心位置を左マウスボタンで押し、そのままドラッグ"
				},
				radius: "半径"
			},
			marker: {
				tooltip: {
					start: "マーカーを置く位置をクリック"
				}
			},
			polygon: {
				tooltip: {
					start: "ポリゴンの開始位置をクリック",
					cont: "次の位置をクリック",
					end: "次の位置をクリック(又は最終点を再度クリックして確定)"
				}
			},
			polyline: {
				error: "<strong>エラー:</strong> 図形の縁は交差できません!",
				tooltip: {
					start: "線の開始位置をクリック",
					cont: "次の位置をクリック",
					end: "次の位置をクリック(又は最終点を再度クリックして確定)"
				}
			},
			rectangle: {
				tooltip: {
					start: "Click and drag to draw rectangle."
				}
			},
			simpleshape: {
				tooltip: {
					end: "マウスボタンを放して確定"
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: "Save changes.",
					text: "Save"
				},
				cancel: {
					title: "Cancel editing, discards all changes.",
					text: "Cancel"
				}
			},
			buttons: {
				edit: "Edit layers.",
				editDisabled: "No layers to edit.",
				remove: "Delete layers.",
				removeDisabled: "No layers to delete."
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: "マーカーや図形上のハンドルをドラッグして移動や変更",
					subtext: ""
				}
			},
			remove: {
				tooltip: {
					text: "マーカーや図形およびハンドルをクリックして削除"
				}
			}
		}
	}
};

MKR.drawLocal = {
	draw: {
		handlers: {
			diviconmarker: {
				tooltip: {
					start: "テキストを置く位置をクリック"
				}
			},
		}
	},
	edit: {
		handlers: {
			setting: {
				tooltip: {
					text: "マーカーや図形およびハンドルをクリックして作図設定"
				}
			}
		}
	}
};

////////////////////////////////////////////////////////////////////////
// ポリゴンの作図確定を最終位置のダブルクリックからクリックに変更する
////////////////////////////////////////////////////////////////////////

L.Draw.Polygon.prototype._updateFinishHandler = function () {
	var markerCount = this._markers.length;

	// The first marker should have a click handler to close the polygon
	if (markerCount === 1) {
		this._markers[0].on('click', this._finishShape, this);
	}

	// Add and update the double click handler
	if (markerCount > 2) {
		this._markers[markerCount - 1].on('click', this._finishShape, this);
		// Only need to remove handler if has been added before
		if (markerCount > 3) {
			this._markers[markerCount - 2].off('click', this._finishShape, this);
		}
	}
};

////////////////////////////////////////////////////////////////////////
// キーボードによるキャンセル処理をさせない
////////////////////////////////////////////////////////////////////////

L.Draw.Feature.prototype._cancelDrawing = function (e) {
	////if (e.keyCode === 27) {
	////	this._map.fire('draw:canceled', { layerType: this.type });
	////	this.disable();
	////}
};

////////////////////////////////////////////////////////////////////////
// 編集時、マップ上をクリックすると Leaflet の L.Mixin.Events#fireEvent()
// でエラーが発生するのを抑止する
//----------------------------------------------------------------------
// NOTE: 拡張用のメソッドのように思われる。
//       実害はないようだが、エラーにならないよう定義しておく
////////////////////////////////////////////////////////////////////////

L.EditToolbar.Edit.include({
	_editStyle: function (event) {
	}
});

////////////////////////////////////////////////////////////////////////
// 線、ポリゴンを左クリックでのみ作成するように変更
////////////////////////////////////////////////////////////////////////

L.Draw.Polyline.prototype._MKR__onMouseDown_original = L.Draw.Polyline.prototype._onMouseDown;

L.Draw.Polyline.prototype._onMouseDown = function (e) {

	if (e.type === "mousedown" && (e.originalEvent.which === 3 || e.originalEvent.button === 2)) {
		// 右マウスダウン時は処理をしない
	} else {
		L.Draw.Polyline.prototype._MKR__onMouseDown_original.call(this, e);
	}
};

////////////////////////////////////////////////////////////////////////
// NOTE: touch: 描画時のタッチ用アイコンのサイズを設定
////////////////////////////////////////////////////////////////////////

L.Draw.Polyline.prototype.options.touchIcon.options.iconSize = new L.Point(40, 40);

////////////////////////////////////////////////////////////////////////
// NOTE: touch: 編集時のタッチ用アイコンのサイズを設定
////////////////////////////////////////////////////////////////////////

L.Edit.PolyVerticesEdit.prototype.options.touchIcon.options.iconSize = new L.Point(40, 40);

////////////////////////////////////////////////////////////////////////
// 円(および四角)を左クリックでのみ作成するように変更
////////////////////////////////////////////////////////////////////////

L.Draw.SimpleShape.prototype._MKR__onMouseDown_original = L.Draw.SimpleShape.prototype._onMouseDown;

L.Draw.SimpleShape.prototype._onMouseDown = function (e) {

	if (e.type === "mousedown" && (e.originalEvent.which === 3 || e.originalEvent.button === 2)) {
		// 右マウスダウン時は処理をしない
	} else {
		L.Draw.SimpleShape.prototype._MKR__onMouseDown_original.call(this, e);
	}
};

////////////////////////////////////////////////////////////////////////
// 図形
////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------
// マーカー(テキスト)
//----------------------------------------------------------------------

MKR.DivIconMarker = L.Marker.Touch.extend({

	options: {
		icon: new MKR.DivIcon()
	},

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (latlng, options) {

		this.options = $.extend(true, {}, this.options, options);

		L.Marker.prototype.initialize.call(this, latlng, this.options);
	}
});

////////////////////////////////////////////////////////////////////////
// 作図
////////////////////////////////////////////////////////////////////////

MKR.Draw = {};

//----------------------------------------------------------------------
// マーカー(円)
//----------------------------------------------------------------------

MKR.Draw.CircleMarker = L.Draw.Circle.extend({

	statics: {
		TYPE: 'circleMarker'
	},

	_latlng: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (map, options) {

		L.Draw.Circle.prototype.initialize.call(this, map, options);

		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = MKR.Draw.CircleMarker.TYPE;
	},

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {
		L.Draw.Circle.prototype.addHooks.call(this);

		this._map.on("zoomend", this._onZoomEnd, this);
	},

	//
	// 無効化時の処理
	//----------------------------------------------------------------------
	//

	removeHooks: function () {

		this._map.off("zoomend", this._onZoomEnd, this);

		L.Draw.Circle.prototype.removeHooks.call(this);
	},

	//
	// 作図確定時の処理
	//----------------------------------------------------------------------
	//

	_fireCreatedEvent: function () {

		this._shape.projectLatlngs();
		var pixelRadius = this._shape._radius;

		this.options.shapeOptions.radius = pixelRadius;

		var circleMarker = new L.CircleMarker(this._startLatLng, this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, circleMarker);
	},

	//
	// マウス移動時の処理
	//----------------------------------------------------------------------
	//

	_onMouseMove: function (e) {
		this._drawCircle(e.latlng);
	},

	//
	// マップズーム完了時の処理
	//----------------------------------------------------------------------
	//

	_onZoomEnd: function (e) {
		if (this._latlng) {
			this._drawCircle(this._latlng);
		}
	},

	//
	// 図形の表示とツールチップを処理する
	//----------------------------------------------------------------------
	//

	_drawCircle: function (latlng) {
		var showRadius = this.options.showRadius;

		this._tooltip.updatePosition(latlng);
		if (this._isDrawing) {
			this._drawShape(latlng);

			this._shape.projectLatlngs();
			var pixelRadius = this._shape._radius;

			this._tooltip.updateContent({
				text: this._endLabelText,
				subtext: showRadius ? L.drawLocal.draw.handlers.circle.radius + ": " +
					String(pixelRadius) + " px" : ""
			});

			this._latlng = latlng;
		}
	}
});

//----------------------------------------------------------------------
// マーカー(テキスト)
//----------------------------------------------------------------------

MKR.Draw.DivIconMarker = L.Draw.Marker.extend({

	statics: {
		TYPE: 'divIconMarker'
	},

	options: {
		icon: new MKR.DivIcon()
	},

	_dialogManager: null,

	_figureOption: null,

	_figureCreated: false,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (map, dialogManager, figureOption) {

		this._dialogManager = dialogManager;
		this._figureOption = figureOption;

		this.options = $.extend(true, {}, this.options, figureOption.draw);

		L.Draw.Marker.prototype.initialize.call(this, map, this.options);

		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = MKR.Draw.DivIconMarker.TYPE;
	},

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {
		L.Draw.Marker.prototype.addHooks.call(this);

		this._tooltip.updateContent({ text: MKR.drawLocal.draw.handlers.diviconmarker.tooltip.start });
	},

	//
	// マーカー配置位置クリック時の処理
	//----------------------------------------------------------------------
	//

	_onClick: function () {
		this._fireCreatedEvent();
	},

	//
	// 無効化する
	//----------------------------------------------------------------------
	//

	_disableDivIconMarker: function () {
		this.disable();
		////if (this.options.repeatMode) {
		////	this.enable();
		////}
	},

	//
	// キーボードによる作図のキャンセルの処理
	//----------------------------------------------------------------------
	//

	_cancelDrawing: function (e) {
		// マーカーを配置する前のみキャンセルさせる
		if (!this._figureCreated) {
			L.Draw.Marker.prototype._cancelDrawing.call(this, e);
		}
	},

	//
	// 作成完了イベント
	//----------------------------------------------------------------------
	//

	_fireCreatedEvent: function () {
		var self = this;

		if (this._figureCreated) {
			return;
		}

		this._figureCreated = true;

		var figureSettingsDialog = new MKR.Dialog.ModalDivIconMarkerSettings(this._dialogManager,
			this._figureOption, {
				buttons: ["save"]
			});

		figureSettingsDialog.on("mkrDialog:save", function (event) {
			var marker = new MKR.DivIconMarker(self._marker.getLatLng(), { icon: event.figureOption.draw.icon });
			MKR.LeafletUtil.setFigureOption(marker, event.figureOption);
			L.Draw.Feature.prototype._fireCreatedEvent.call(self, marker);
			self._disableDivIconMarker();
		});

		figureSettingsDialog.on("mkrDialog:cancel", function (event) {
			// キャンセルされた場合は、配置しない
			////var marker = new MKR.DivIconMarker(self._marker.getLatLng(), { icon: self.options.icon });
			////L.Draw.Feature.prototype._fireCreatedEvent.call(self, marker);
			self._disableDivIconMarker();
		});

		figureSettingsDialog.showModal();
	}
});

////////////////////////////////////////////////////////////////////////
// 図形編集
////////////////////////////////////////////////////////////////////////

MKR.Edit = {};

//----------------------------------------------------------------------
// 線、ポリゴン
//----------------------------------------------------------------------

MKR.Edit.Poly = L.Edit.Poly.extend({

	_map: null,

	_markerGroup: null,

	_moveMarker: null,

	_iconUrl: "images/icon_move.png",

	_iconSize: (L.Browser.touch) ? [48, 48] : [24, 24],

	_typeHelper: null,

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {
		L.Edit.Poly.prototype.addHooks.call(this);

		this._map = this._poly._map;

		var figureType = MKR.LeafletUtil.getFigureType(this._poly);
		this._typeHelper = new MKR.TypeHelper(figureType);

		var latlng = this._getMoveMarkerLatLng();

		var zoom = this._map.getZoom();
		var iconAnchor = this._typeHelper.widget.getIconAnchor(this._iconSize, zoom);

		var marker = new L.Marker.Touch(latlng, {
			draggable: true,
			icon: new L.Icon({
				iconUrl: this._iconUrl,
				iconSize: this._iconSize,
				iconAnchor: iconAnchor,
				className: "leaflet-edit-move",
			})
		});
		marker._origLatLng = latlng;

		this._poly.on("edit", this._onEdit, this);
		marker
			.on("dragstart", this._onMarkerDragStart, this)
			.on("drag", this._onMarkerDrag, this)
			.on("dragend", this._onMarkerDragEnd, this)
			.on("touchstart", this._onTouchStart, this)
			.on("touchmove", this._onTouchMove, this)
			.on("MSPointerMove", this._onTouchMove, this)
			.on("touchend", this._onTouchEnd, this)
			.on("MSPointerUp", this._onTouchEnd, this);

		this._moveMarker = marker;
		this._markerGroup = new L.LayerGroup();
		this._markerGroup.addLayer(marker);
		this._map.addLayer(this._markerGroup);
	},

	//
	// 無効化時の処理
	//----------------------------------------------------------------------
	//

	removeHooks: function () {
		this._moveMarker
			.off("dragstart", this._onMarkerDragStart, this)
			.off("drag", this._onMarkerDrag, this)
			.off("dragend", this._onMarkerDragEnd, this)
			.off("touchstart", this._onTouchStart, this)
			.off("touchmove", this._onTouchMove, this)
			.off("MSPointerMove", this._onTouchMove, this)
			.off("touchend", this._onTouchEnd, this)
			.off("MSPointerUp", this._onTouchEnd, this);
		this._poly.off("edit", this._onEdit, this);

		this._map.removeLayer(this._markerGroup);
		this._markerGroup = null;
		this._moveMarker = null;

		L.Edit.Poly.prototype.removeHooks.call(this);
	},

	//
	// 図形に変更があった時の処理
	//----------------------------------------------------------------------
	//

	_onEdit: function (e) {

		if (this._moveMarker) {
			var latlng = this._getMoveMarkerLatLng();

			this._moveMarker._origLatLng = latlng;
			this._moveMarker.setLatLng(latlng);
		}
	},

	//
	// 変更イベントを発生する
	//----------------------------------------------------------------------
	//

	_fireEdit: function () {
		this._poly.edited = true;
		this._poly.fire('edit');
	},

	//
	// ドラッグ開始
	//----------------------------------------------------------------------
	//

	_onMarkerDragStart: function (e) {
		this._poly.fire('editstart');
	},

	//
	// ドラッグ中
	//----------------------------------------------------------------------
	//

	_onMarkerDrag: function (e) {
		var latlng = this._moveMarker.getLatLng();

		this._move(latlng);

		this._poly.fire('editdrag');
	},

	//
	// ドラッグ終了
	//----------------------------------------------------------------------
	//

	_onMarkerDragEnd: function (e) {
		this._fireEdit();
	},

	//
	// タッチ開始
	//----------------------------------------------------------------------
	//

	_onTouchStart: function (e) {
		this._poly.fire('editstart');
	},

	//
	// タッチ移動
	//----------------------------------------------------------------------
	//

	_onTouchMove: function (e) {
		var layerPoint = this._map.mouseEventToLayerPoint(e.originalEvent.touches[0]);
		var latlng = this._map.layerPointToLatLng(layerPoint);

		// NOTE: touch: マップが動かないようにする
		L.DomEvent.preventDefault(e.originalEvent);

		this._move(latlng);

		// prevent touchcancel in IOS
		// e.preventDefault();
		return false;
	},

	//
	// タッチ終了
	//----------------------------------------------------------------------
	//

	_onTouchEnd: function (e) {
		this._fireEdit();
	},

	//
	// 図形の移動処理
	//----------------------------------------------------------------------
	//

	_move: function (latlng) {
		var marker = this._moveMarker;

		for (var index = 0; index < this.latlngs.length; ++index) {

			// NOTE: L.Edit.Poly と各点の制御をする L.Edit.PolyVerticesEdit は
			//       poly._latlngs を参照を通じて共有しているため、参照関係を壊すような操作をしないこと。

			var latlngs = this.latlngs[index];
			var latMove = latlng.lat - marker._origLatLng.lat;
			var lngMove = latlng.lng - marker._origLatLng.lng;

			for (var i = 0; i < latlngs.length; ++i) {
				latlngs[i].lat += latMove;
				latlngs[i].lng += lngMove;
			}
		}

		// NOTE: touch: 移動マーカーの位置設定
		marker.setLatLng(latlng);

		marker._origLatLng = latlng;
		this._poly.redraw();
		this.updateMarkers();

		this._map.fire('draw:editmove', {layer: this._poly});
	},

	//
	// 移動マーカーの座標位置を得る
	//----------------------------------------------------------------------
	//

	_getMoveMarkerLatLng: function () {

		var latlngs = this.latlngs[0];

		var p1 = this._map.project(latlngs[0]);
		var p2 = this._map.project(latlngs[1]);

		return this._map.unproject(p1._multiplyBy(0.75)._add(p2._multiplyBy(0.25)));
	}
});

//
// L.Polyline に処理を追加する
//----------------------------------------------------------------------
// L.Polyline
// L.Polygon
//

L.Polyline.addInitHook(function () {
	if (MKR.Edit.Poly) {
		// Leaflet.draw 側で new L.Edit.Poly(this, this.options.poly); されている値を上書きする
		this.editing = new MKR.Edit.Poly(this, this.options.poly);
	}
});

//----------------------------------------------------------------------
// 円
//----------------------------------------------------------------------

// NOTE: touch

L.Edit.Circle.prototype._move = function (latlng) {
	var resizemarkerPoint = this._getResizeMarkerPoint(latlng);

	// Move the resize marker
	this._resizeMarkers[0].setLatLng(resizemarkerPoint);

	// Move the circle
	this._shape.setLatLng(latlng);

	// NOTE: touch: 移動マーカーの位置設定を追加する
	this._moveMarker.setLatLng(latlng);

	this._map.fire('draw:editmove', {layer: this._shape});
};

// NOTE: touch

L.Edit.Circle.prototype._resize = function (latlng) {
	var moveLatLng = this._moveMarker.getLatLng(),
		radius = moveLatLng.distanceTo(latlng);

	// NOTE: touch: リサイズマーカーの位置設定を追加する
	var resizemarkerPoint = this._getResizeMarkerPoint(this._shape.getLatLng());
	this._resizeMarkers[0].setLatLng(resizemarkerPoint);

	this._shape.setRadius(radius);

	this._map.fire('draw:editresize', {layer: this._shape});
};

MKR.Edit.Circle = L.Edit.Circle.extend({

	options: {
		moveIcon: new L.Icon({
			iconUrl: "images/icon_move.png",
			iconSize: [24, 24],
			iconAnchor: [12, 12],
			className: 'leaflet-edit-move'
		}),
		touchMoveIcon: new L.Icon({
			iconUrl: "images/icon_move.png",
			iconSize: [48, 48],
			iconAnchor: [24, 24],
			className: 'leaflet-edit-move'
		}),
		touchResizeIcon: new L.DivIcon({
			iconSize: new L.Point(40, 40),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize leaflet-touch-icon'
		}),
	}

});

//
// L.Circle に処理を追加する
//----------------------------------------------------------------------
//

L.Circle.addInitHook(function () {

	if (MKR.Edit.Circle) {
		// Leaflet.draw 側で new L.Edit.Circle(this); されている値を上書きする
		this.editing = new MKR.Edit.Circle(this);
	}
});

//----------------------------------------------------------------------
// マーカー(円)
//----------------------------------------------------------------------

MKR.Edit.CircleMarker = L.Edit.Circle.extend({

	options: {
		moveIcon: new L.Icon({
			iconUrl: "images/icon_move.png",
			iconSize: [24, 24],
			iconAnchor: [12, 12],
			className: 'leaflet-edit-move'
		}),
		touchMoveIcon: new L.Icon({
			iconUrl: "images/icon_move.png",
			iconSize: [48, 48],
			iconAnchor: [24, 24],
			className: 'leaflet-edit-move'
		}),
		touchResizeIcon: new L.DivIcon({
			iconSize: new L.Point(40, 40),
			className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize leaflet-touch-icon'
		}),
	},

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {
		L.Edit.Circle.prototype.addHooks.call(this);

		this._map.on("zoomend", this._onZoomEnd, this);
	},

	//
	// 無効化時の処理
	//----------------------------------------------------------------------
	//

	removeHooks: function () {

		this._map.off("zoomend", this._onZoomEnd, this);

		L.Edit.Circle.prototype.removeHooks.call(this);
	},

	//
	// リサイズ時の処理
	//----------------------------------------------------------------------
	//

	_resize: function (latlng) {

		var moveLatLng = this._moveMarker.getLatLng();

		// NOTE: touch: リサイズマーカーの位置設定を追加する
		var resizemarkerPoint = this._getResizeMarkerPoint( this._shape.getLatLng());
		this._resizeMarkers[0].setLatLng(resizemarkerPoint);

		var centerPoint = this._map.latLngToLayerPoint(moveLatLng);
		var resizeMarkerPoint = this._map.latLngToLayerPoint(latlng);

		var pixelRadius = Math.max(centerPoint.distanceTo(resizeMarkerPoint).toFixed(0), 1);

		this._shape.setRadius(pixelRadius);

		this._map.fire('draw:editresize', {layer: this._shape});
	},


	//
	// マップズーム完了時の処理
	//----------------------------------------------------------------------
	//

	_onZoomEnd: function (e) {
		this.updateMarkers();
	}
});

//
// L.CircleMarker に処理を追加する
//----------------------------------------------------------------------
//

L.CircleMarker.addInitHook(function () {

	if (MKR.Edit.CircleMarker) {
		// Leaflet.draw 側で L.Circle.addInitHook() で new L.Edit.Circle(this); されている値を上書きする
		this.editing = new MKR.Edit.CircleMarker(this);
	}
});

////////////////////////////////////////////////////////////////////////
// 図形セレクタ
////////////////////////////////////////////////////////////////////////

MKR.Edit.Selector = {};

//----------------------------------------------------------------------
// マーカー(アイコン)、マーカー(テキスト)
//----------------------------------------------------------------------

MKR.Edit.Selector.Marker = L.Handler.extend({

	// NOTE: 本クラスでは fire() しないので、実際は不要。
	//       本クラスを利用する側で他の MKR.Edit.Selector.* クラスと扱いを同じにするためだけに追加した。
	includes: L.Mixin.Events,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (marker, options) {
		this._marker = marker;
		L.setOptions(this, options);
	},

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {
		this.markerHighlight(true);
	},

	//
	// 無効化時の処理
	//----------------------------------------------------------------------
	//

	removeHooks: function () {
		this.markerHighlight(false);
	},

	//
	// 強調処理
	//----------------------------------------------------------------------
	//

	markerHighlight: function (highlight) {
		var icon = this._marker._icon;

		// Don't do anything if this layer is a marker but doesn't have an icon. Markers
		// should usually have icons. If using Leaflet.draw with Leaflet.markercluster there
		// is a chance that a marker doesn't.
		if (!icon) {
			return;
		}

		// This is quite naughty, but I don't see another way of doing it. (short of setting a new icon)
		icon.style.display = 'none';

		if (!highlight) {
			L.DomUtil.removeClass(icon, "leaflet-edit-marker-selected");
			// Offset as the border will make the icon move.
			this._offsetMarker(icon, -4);

		} else {
			L.DomUtil.addClass(icon, "leaflet-edit-marker-selected");
			// Offset as the border will make the icon move.
			this._offsetMarker(icon, 4);
		}

		icon.style.display = '';
	},

	//
	// マーカー位置をずらす
	//----------------------------------------------------------------------
	// leaflet-edit-marker-selected の border 分ずらし、元の位置と同じ表示にする
	//

	_offsetMarker: function (icon, offset) {
		var iconMarginTop = MKR.Number.parseInt(icon.style.marginTop, 10) - offset;
		var iconMarginLeft = MKR.Number.parseInt(icon.style.marginLeft, 10) - offset;

		icon.style.marginTop = String(iconMarginTop) + "px";
		icon.style.marginLeft = String(iconMarginLeft) + "px";
	}
});

//
// L.Marker に処理を追加する
//----------------------------------------------------------------------
// L.Marker
// MKR.DivIconMarker
//

L.Marker.addInitHook(function () {
	if (MKR.Edit.Selector.Marker) {
		this._MKR_selector = new MKR.Edit.Selector.Marker(this);
	}
});

//----------------------------------------------------------------------
// 線、ポリゴン、円
//----------------------------------------------------------------------

MKR.Edit.Selector.Path = L.Handler.extend({

	includes: L.Mixin.Events,

	options: {
		iconUrl: "images/icon_cog.png",
		iconSize: (L.Browser.touch) ? [48, 48] : [24, 24]
	},

	_map: null,

	_figureLayer: null,

	_markerGroup: null,

	_settingMarker: null,

	_typeHelper: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (figure) {
		// NOTE: _map は addHooks() 呼び出し時に初期化すること
		this._figureLayer = figure;
	},

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {

		this._map = this._figureLayer._map;
		this.options = $.extend(false, {}, this.options, this._figureLayer.options._MKR_selectedPathOptions);

		var figureType = MKR.LeafletUtil.getFigureType(this._figureLayer);
		this._typeHelper = new MKR.TypeHelper(figureType);

		var latlng = this._getMarkerLatLng();

		var zoom = this._map.getZoom();
		var iconAnchor = this._typeHelper.widget.getIconAnchor(this.options.iconSize, zoom);

		var marker = new L.Marker.Touch(latlng, {
			icon: new L.Icon({
				iconUrl: this.options.iconUrl,
				iconSize: this.options.iconSize,
				iconAnchor: iconAnchor
			})
		});

		marker.on("click", this._onClick, this);

		this._settingMarker = marker;
		this._markerGroup = new L.LayerGroup();
		this._markerGroup.addLayer(marker);
		this._map.addLayer(this._markerGroup);
	},

	//
	// 無効化時の処理
	//----------------------------------------------------------------------
	//

	removeHooks: function () {
		// NOTE: 削除の際のセレクタとして使う場合、removeLayer() された時と、_disableLayerDelete() の呼び出し時とで 2 度呼ばれるので注意

		if (this._settingMarker) {
			this._settingMarker.off("click", this._onClick, this);
			this._settingMarker = null;
		}

		if (this._map && this._markerGroup) {
			this._map.removeLayer(this._markerGroup);
			this._markerGroup = null;
		}
	},

	//
	// セレクタがクリックされた時の処理
	//----------------------------------------------------------------------
	//

	_onClick: function (event) {
		this.fire("click", { originalEvent: event, originalTarget: this._figureLayer });
	},

	//
	// 設定マーカーの座標位置を得る
	//----------------------------------------------------------------------
	//

	_getMarkerLatLng: function () {

		var latlng;

		if (this._figureLayer instanceof L.Polyline) {
			var latlngs = this._figureLayer._latlngs;

			var p1 = this._map.project(latlngs[0]);
			var p2 = this._map.project(latlngs[1]);

			latlng = this._map.unproject(p1._multiplyBy(0.75)._add(p2._multiplyBy(0.25)));
		} else {
			var bounds = this._figureLayer.getBounds();
			latlng = bounds.getCenter();
		}

		return latlng;
	}
});


//
// L.Polyline に処理を追加する
//----------------------------------------------------------------------
// L.Polyline
// L.Polygon
//

L.Polyline.addInitHook(function () {

	if (MKR.Edit.Selector.Path) {
		this._MKR_selector = new MKR.Edit.Selector.Path(this);
	}

	this.on('add', function () {
		if (this._MKR_selector && this._MKR_selector.enabled()) {
			this._MKR_selector.addHooks();
		}
	});

	this.on('remove', function () {
		if (this._MKR_selector && this._MKR_selector.enabled()) {
			this._MKR_selector.removeHooks();
		}
	});
});

//
// L.Circle に処理を追加する
//----------------------------------------------------------------------
// L.Circle
// L.CircleMarker
//

L.Circle.addInitHook(function () {

	if (MKR.Edit.Selector.Path) {
		this._MKR_selector = new MKR.Edit.Selector.Path(this);
	}

	this.on('add', function () {
		if (this._MKR_selector && this._MKR_selector.enabled()) {
			this._MKR_selector.addHooks();
		}
	});

	this.on('remove', function () {
		if (this._MKR_selector && this._MKR_selector.enabled()) {
			this._MKR_selector.removeHooks();
		}
	});
});

////////////////////////////////////////////////////////////////////////
// 作図設定
////////////////////////////////////////////////////////////////////////

MKR.EditToolbar = {};

MKR.EditToolbar.Setting = L.Handler.extend({

	statics: {
		TYPE: 'setting'
	},

	includes: L.Mixin.Events,

	type: null,

	_dialogManager: null,

	_featureGroup: null,

	_figureLayerProps: null,

	_tooltip: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (map, dialogManager, options) {
		L.Handler.prototype.initialize.call(this, map);

		L.setOptions(this, options);

		this._dialogManager = dialogManager;

		this._featureGroup = options.featureGroup;

		if (!(this._featureGroup instanceof L.FeatureGroup)) {
			throw new Error('options.featureGroup must be a L.FeatureGroup');
		}

		this._figureLayerProps = {};

		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = MKR.EditToolbar.Setting.TYPE;
	},

	//
	// 有効化の処理
	//----------------------------------------------------------------------
	//

	enable: function () {
		if (this._enabled || !this._hasAvailableLayers()) {
			return;
		}
		this.fire('enabled', { handler: this.type });

		this._map.fire('mkrDraw:settingStart', { handler: this.type });

		L.Handler.prototype.enable.call(this);
	},

	//
	// 無効化の処理
	//----------------------------------------------------------------------
	//

	disable: function () {
		if (!this._enabled) { return; }
		L.Handler.prototype.disable.call(this);
		this._map.fire('mkrDraw:settingStop', { handler: this.type });
		this.fire('disabled', { handler: this.type} );
	},

	//
	// 有効化時の処理
	//----------------------------------------------------------------------
	//

	addHooks: function () {
		var map = this._map;

		if (map) {
			map.getContainer().focus();

			this._featureGroup.eachLayer(this._enableFigureLayerSetting, this);

			this._tooltip = new L.Tooltip(this._map);
			this._tooltip.updateContent({
				text: MKR.drawLocal.edit.handlers.setting.tooltip.text
			});

			this._map
				.on('mousemove', this._onMouseMove, this)
				.on('touchmove', this._onMouseMove, this)
				.on('MSPointerMove', this._onMouseMove, this);
		}
	},

	//
	// 無効化時の処理
	//----------------------------------------------------------------------
	//

	removeHooks: function () {
		if (this._map) {

			this._featureGroup.eachLayer(this._disableFigureLayerSetting, this);

			this._figureLayerProps = {};

			this._tooltip.dispose();
			this._tooltip = null;

			this._map
				.off('mousemove', this._onMouseMove, this)
				.off('touchmove', this._onMouseMove, this)
				.off('MSPointerMove', this._onMouseMove, this);
		}
	},

	//
	// 変更を元に戻す
	//----------------------------------------------------------------------
	//

	revertLayers: function () {
		this._featureGroup.eachLayer(function (figureLayer) {
			this._revertLayer(figureLayer);
		}, this);
	},

	//
	// 変更を保存する
	//----------------------------------------------------------------------
	//

	save: function () {
		this._featureGroup.eachLayer(function (figureLayer) {
			if (figureLayer._MKR_set) {

				MKR.WidgetUtil.rebindPopup(
					figureLayer,
					MKR.LeafletUtil.getFigureInfo(figureLayer)
				);

				figureLayer._MKR_set = false;
			}
		});

		this._map.fire('mkrDraw:setting');
	},

	//
	// 図形レイヤの作図情報をバックアップする
	//----------------------------------------------------------------------
	//

	_backupLayer: function (figureLayer) {
		var id = L.Util.stamp(figureLayer);

		if (!this._figureLayerProps[id]) {
			this._figureLayerProps[id] = {
				figureOption: MKR.LeafletUtil.getFigureOption(figureLayer)
			};
		}
	},

	//
	// 図形レイヤの作図情報を元に戻す
	//----------------------------------------------------------------------
	//

	_revertLayer: function (figureLayer) {
		var id = L.Util.stamp(figureLayer);
		if (this._figureLayerProps.hasOwnProperty(id)) {
			MKR.LeafletUtil.setFigureOption(figureLayer, this._figureLayerProps[id].figureOption);

			if (figureLayer._MKR_set) {

				var figureType = MKR.LeafletUtil.getFigureType(figureLayer);
				var figureOption = MKR.LeafletUtil.getFigureOption(figureLayer);
				var typeHelper = new MKR.TypeHelper(figureType);

				typeHelper.widget.setFigureLayerFromFigureOption(figureLayer, figureOption);

				// NOTE: @figureTypeSwitch
				switch (figureType) {
				case MKR.FigureType.Marker:
				case MKR.FigureType.DivIconMarker:
					figureLayer._MKR_selector.markerHighlight(true);
					break;
				}

				MKR.WidgetUtil.rebindPopup(figureLayer, figureOption.figureInfo);
				figureLayer._MKR_set = false;
			}
		}
	},

	//
	// 図形レイヤを設定できる状態にする
	//----------------------------------------------------------------------
	//

	_enableFigureLayerSetting: function (figureLayer) {

		this._backupLayer(figureLayer);

		figureLayer.options._MKR_selectedPathOptions =  this.options.selectedPathOptions;
		figureLayer._MKR_set = false;

		figureLayer.on("click", this._onClickFigureLayer, this);

		figureLayer._MKR_selector.on("click", this._onClickSelector, this);
		figureLayer._MKR_selector.enable();
	},

	//
	// レイヤの状態を元に戻す
	//----------------------------------------------------------------------
	//

	_disableFigureLayerSetting: function (figureLayer) {

		figureLayer._MKR_selector.disable();
		figureLayer._MKR_selector.off("click", this._onClickSelector, this);

		figureLayer.off("click", this._onClickFigureLayer, this);

		delete figureLayer._MKR_set;
		delete figureLayer.options._MKR_selectedPathOptions;
	},

	//
	// マウス移動イベントハンドラ
	//----------------------------------------------------------------------
	//

	_onMouseMove: function (e) {
		this._tooltip.updatePosition(e.latlng);
	},

	//
	// セレクタクリック時
	//----------------------------------------------------------------------
	//

	_onClickSelector: function (event) {
		this._setting(event.originalTarget);
	},

	//
	// 図形レイヤクリック時
	//----------------------------------------------------------------------
	//

	_onClickFigureLayer: function (event) {
		this._setting(event.target);
	},

	//
	// 作図設定の処理
	//----------------------------------------------------------------------
	//

	_setting: function (figureLayer) {

		var figureType = MKR.LeafletUtil.getFigureType(figureLayer);
		var figureOption = MKR.LeafletUtil.getFigureOption(figureLayer);

		var typeHelper = new MKR.TypeHelper(figureType);

		var figureSettingsDialog = typeHelper.widget.createFigureSettingsSaveDialog(this._dialogManager, figureOption);
		if (figureSettingsDialog === null) {
			MKR.Debug.notImplemented();
			return;
		}

		// 保存
		figureSettingsDialog.on("mkrDialog:save", function (saveEvent) {

			var typeHelper = new MKR.TypeHelper(figureType);

			typeHelper.widget.setFigureLayerFromFigureOption(figureLayer, saveEvent.figureOption);

			// NOTE: @figureTypeSwitch
			switch (figureType) {
			case MKR.FigureType.Marker:
			case MKR.FigureType.DivIconMarker:
				figureLayer._MKR_selector.markerHighlight(true);
				break;
			}

			MKR.LeafletUtil.setFigureOption(figureLayer, saveEvent.figureOption);

			figureLayer._MKR_set = true;
		});

		figureSettingsDialog.showModal();
	},

	//
	// 有効な図形があるかどうかを返す
	//----------------------------------------------------------------------
	//

	_hasAvailableLayers: function () {
		return this._featureGroup.getLayers().length !== 0;
	}
});

////////////////////////////////////////////////////////////////////////
// 図形削除
////////////////////////////////////////////////////////////////////////

MKR.EditToolbar.Delete = L.EditToolbar.Delete.extend({

	//
	// レイヤを削除できる状態にする
	//----------------------------------------------------------------------
	//

	_enableLayerDelete: function (e) {
		var layer = e.layer || e.target || e;

		layer.options._MKR_selectedPathOptions = this.options.selectedPathOptions;
		layer._MKR_set = false;

		layer._MKR_selector.on("click", this._onClickSelector, this);
		layer._MKR_selector.enable();

		L.EditToolbar.Delete.prototype._enableLayerDelete.call(this, e);
	},

	//
	// レイヤの状態を元に戻す
	//----------------------------------------------------------------------
	//

	_disableLayerDelete: function (e) {
		var layer = e.layer || e.target || e;

		layer._MKR_selector.disable();
		layer._MKR_selector.off("click", this._onClickSelector, this);

		delete layer.options._MKR_selectedPathOptions;

		L.EditToolbar.Delete.prototype._disableLayerDelete.call(this, e);
	},

	//
	// セレクタクリック時
	//----------------------------------------------------------------------
	//

	_onClickSelector: function (event) {

		var layer = event.originalTarget;

		this._deletableLayers.removeLayer(layer);

		this._deletedLayers.addLayer(layer);

		layer.fire('deleted');
	}
});

////////////////////////////////////////////////////////////////////////
// 独自空間を追加
////////////////////////////////////////////////////////////////////////

//
// MKR.DivIconMarker
//----------------------------------------------------------------------
//

MKR.DivIconMarker.addInitHook(function () {
	MKR.LeafletUtil.initFigureLayer(this, MKR.FigureType.DivIconMarker);
});

