/*
 * Leaflet への変更・拡張
 */

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.LeafletUtil = {

	//
	// マップの独自空間を初期化する
	//----------------------------------------------------------------------
	//

	initMap: function (map) {
		map[MKR.NS] = { showPopup: true };
	},

	//
	// マップオブジェクトからポップアップの表示の有効・無効を取得する
	//----------------------------------------------------------------------
	//

	isShowPopup: function (map) {

		if (!map || !map[MKR.NS] || typeof map[MKR.NS].showPopup === "undefined") {
			return true;
		}

		return map[MKR.NS].showPopup;
	},

	//
	// マップオブジェクトからポップアップの表示の有効・無効を設定する
	//----------------------------------------------------------------------
	//
	setShowPopup: function (map, showPopup) {

		if (!map || !map[MKR.NS] || typeof map[MKR.NS].showPopup === "undefined") {
			return;
		}

		map[MKR.NS].showPopup = showPopup;
	},

	//
	// 図形オブジェクトの独自空間を初期化する
	//----------------------------------------------------------------------
	//

	initFigureLayer: function (figureLayer, figureType) {
		figureLayer[MKR.NS] = { figureType: figureType, figureOption: null  };
	},

	//
	// 図形オブジェクトから図形種別を取得する
	//----------------------------------------------------------------------
	//

	getFigureType: function (figureLayer) {
		return figureLayer[MKR.NS].figureType;
	},

	//
	// 図形オブジェクトに作図設定を設定する
	//----------------------------------------------------------------------
	//

	setFigureOption: function (figureLayer, figureOption) {
		figureLayer[MKR.NS].figureOption = figureOption;
	},

	//
	// 図形オブジェクトから作図設定を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function (figureLayer) {
		return figureLayer[MKR.NS].figureOption;
	},

	//
	// 図形オブジェクトから名称・内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureInfo: function (figureLayer) {
		return figureLayer[MKR.NS].figureOption.figureInfo;
	}
};

////////////////////////////////////////////////////////////////////////
// マーカーの z-index の初期値を 0 にする
////////////////////////////////////////////////////////////////////////

L.Marker.prototype._setPos = function (pos) {
	L.DomUtil.setPosition(this._icon, pos);

	if (this._shadow) {
		L.DomUtil.setPosition(this._shadow, pos);
	}

	this._zIndex = 0 + this.options.zIndexOffset;

	this._resetZIndex();
};


////////////////////////////////////////////////////////////////////////
// ポップアップ表示の有効・無効の制御処理を追加する
////////////////////////////////////////////////////////////////////////

L.Map.prototype._MKR_openPopup_original = L.Map.prototype.openPopup;

L.Map.prototype.openPopup = function (popup, latlng, options) {

	var showPopup = MKR.LeafletUtil.isShowPopup(this);

	if (showPopup) {
		L.Map.prototype._MKR_openPopup_original.call(this, popup, latlng, options);
	}
};

////////////////////////////////////////////////////////////////////////
// タッチデバイスの設定
////////////////////////////////////////////////////////////////////////

// NOTE: PC の Internet Explorer、Microsoft Edge でタッチデバイスの UI に
//       なってしまうのを防ぐ

L.Browser.edge = 'msLaunchUri' in navigator && !('documentMode' in document);

if (L.Browser.touch && (L.Browser.edge || L.Browser.ie)) {
	if (!("ontouchstart" in window)) {
		L.Browser.touch = false;
	}
}

////////////////////////////////////////////////////////////////////////
// 作図時に右クリックでブラウザのコンテキストメニューが表示されてしまうため、
// 表示の有効・無効の制御処理を追加する
//----------------------------------------------------------------------
// Leaflet.draw 側に処理を追加すると改変するコードの量が多くなるのであきらめた。
// マーカー作成時、および線、ポリゴンの作図時の点の位置が
// L.Marker を拡張して作成されているのを利用して、抑制する。
////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------
// マーカーおよび線・ポリゴン
//----------------------------------------------------------------------

L.Marker.prototype._MKR__fireMouseEvent_original = L.Marker.prototype._fireMouseEvent;

L.Marker.prototype._fireMouseEvent = function (e) {

	var show = true;

	switch (e.type) {
	case "contextmenu":
		// Leaflet.contextmenu の表示の有効・無効に準じる
		show = MKR.LeafletContextMenuUtil.isShow(this._map);
		break;
	}

	if (show) {
		L.Marker.prototype._MKR__fireMouseEvent_original.call(this, e);
	} else {
		L.DomEvent.preventDefault(e);
	}
};


////////////////////////////////////////////////////////////////////////
// マーカーが完全に重なってしまったとき、
// 編集時などに動かせないことがあることへの対応
////////////////////////////////////////////////////////////////////////

L.Marker.addInitHook(function () {
	this.options.riseOnHover = true;
});

////////////////////////////////////////////////////////////////////////
// L.CircleMarker で setStyle() された時に半径まで更新させない
////////////////////////////////////////////////////////////////////////

// NOTE: 図形編集確定時、L.Edit.Circle のベースクラスの L.Edit.SimpleShape#removeHooks では、
//       L.EditToolbar.Edit が退避しておいた options.original を図形に対し setStyle() することで、
//       図形の見た目を通常状態に戻している。
//       L.CircleMarker では options.original 内に半径の値まで保持しており、
//       setStyle() されると、見た目だけでなく、半径まで戻ってしまうため、
//       半径を戻さないようにする。

L.CircleMarker.prototype._updateStyle = function (latlng) {
	L.Circle.prototype._updateStyle.call(this);
};

////////////////////////////////////////////////////////////////////////
// 図形
////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------
// マーカー(テキスト)のアイコン
//----------------------------------------------------------------------

MKR.DivIcon = L.DivIcon.extend({

	options: {
		htmlValue: ""
	},

	//
	// アイコンの作成
	//----------------------------------------------------------------------
	//

	createIcon: function (oldIcon) {

		this._applyOptions();

		var html = "";

		html = $.trim(this.options.htmlValue);

		if (html === "") {
			this.options.html = "<span class='mkr_notext'>" + MKR.Lang.DivIcon.notSet + "</span>";
		} else {
			this.options.html = html;
		}

		this.options.htmlValue = html;

		return L.DivIcon.prototype.createIcon.call(this, oldIcon);
	},

	//
	// HTML を取得する
	//----------------------------------------------------------------------
	//
	getHtml: function () {
		return this.options.htmlValue;
	},

	//
	// 必須のオプションを設定する
	//----------------------------------------------------------------------
	//

	_applyOptions: function () {
		this.options.iconAnchor = [0, 0];	// NOTE: これがないと編集時などにアイコンがずれる
		this.options.iconSize = null;
		this.options.className = "gsi-div-icon";
	}
});

////////////////////////////////////////////////////////////////////////
// 独自空間を追加
////////////////////////////////////////////////////////////////////////

//
// L.Map
//

L.Map.addInitHook(function () {
	MKR.LeafletUtil.initMap(this);
});

//
// L.Marker
//----------------------------------------------------------------------
//

L.Marker.addInitHook(function () {
	MKR.LeafletUtil.initFigureLayer(this, MKR.FigureType.Marker);
});

//
// L.Polyline
//----------------------------------------------------------------------
//

L.Polyline.addInitHook(function () {
	if (this instanceof L.Polygon) {
		MKR.LeafletUtil.initFigureLayer(this, MKR.FigureType.Polygon);
	} else {
		MKR.LeafletUtil.initFigureLayer(this, MKR.FigureType.Polyline);
	}
});

//
// L.Circle
//----------------------------------------------------------------------
//

L.Circle.addInitHook(function () {
	MKR.LeafletUtil.initFigureLayer(this, MKR.FigureType.Circle);
});

//
// L.CircleMarker
//----------------------------------------------------------------------
//

L.CircleMarker.addInitHook(function () {
	MKR.LeafletUtil.initFigureLayer(this, MKR.FigureType.CircleMarker);
});

// NOTE: MKR.DivIconMarker の定義および独自空間の追加は Leaflet.draw の変更・拡張に記載
