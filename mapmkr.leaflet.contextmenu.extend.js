/*
 * Leaflet.contextmenu への変更・拡張
 */

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.LeafletContextMenuUtil = {

	//
	// コンテキストメニューの独自空間を初期化する
	//----------------------------------------------------------------------
	//

	initContextMenu: function (mapsContextMenu) {
		mapsContextMenu[MKR.NS] = { show: true };
	},

	//
	// マップオブジェクトからコンテキストメニュー表示の有効・無効を取得する
	//----------------------------------------------------------------------
	//

	isShow: function(map) {

		if (!map || !map.contextmenu || !map.contextmenu[MKR.NS] || typeof map.contextmenu[MKR.NS].show === "undefined") {
			return true;
		}

		return map.contextmenu[MKR.NS].show;
	},

	//
	// マップオブジェクトにコンテキストメニュー表示の有効・無効を取得する
	//----------------------------------------------------------------------
	//

	setShow: function (map, show) {

		if (!map || !map.contextmenu || !map.contextmenu[MKR.NS] || typeof map.contextmenu[MKR.NS].show === "undefined") {
			return;
		}

		map.contextmenu[MKR.NS].show = show;
	}
};

////////////////////////////////////////////////////////////////////////
// 独自空間を追加
////////////////////////////////////////////////////////////////////////

L.Map.ContextMenu.addInitHook(function () {
	MKR.LeafletContextMenuUtil.initContextMenu(this);
});

////////////////////////////////////////////////////////////////////////
// 図形のコンテキストメニュー表示の有効・無効の制御処理を追加する
////////////////////////////////////////////////////////////////////////

L.Map.ContextMenu.prototype._MKR__showAtPoint_original = L.Map.ContextMenu.prototype._showAtPoint;

L.Map.ContextMenu.prototype._showAtPoint = function (pt, data) {

	var show = MKR.LeafletContextMenuUtil.isShow(this._map);

	if (show) {
		L.Map.ContextMenu.prototype._MKR__showAtPoint_original.call(this, pt, data);
	} else {
		// NOTE: 表示のたびに図形のコンテキストメニューのアイテムが作成(蓄積)されるため、
		//       非表示イベントを発生してクリアする
		this._map.fire('contextmenu.hide', {contextmenu: this});
	}
};
