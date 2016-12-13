/*
 * ウィンドウ関連
 */

MKR.Widget = {};

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.WidgetUtil = {

	//
	// マーカーに z-index を設定する
	//----------------------------------------------------------------------
	//

	setZIndexIfMarker: function (figureLayer, zIndexBase) {

		var markerZIndex = zIndexBase * 10;
		var divIconMarkerZIndex = zIndexBase * 10 + 5;

		if (figureLayer instanceof L.Marker) {

			var figureType = MKR.LeafletUtil.getFigureType(figureLayer);

			// _icon がなくても _zIndex だけは設定しておく
			// NOTE: _icon は非表示時は存在せず、_resetZIndex() を呼ぶとエラーになる。

			// NOTE: @figureTypeSwitch
			switch (figureType) {
			case MKR.FigureType.Marker:
				figureLayer._zIndex = markerZIndex;
				break;
			case MKR.FigureType.DivIconMarker:
				figureLayer._zIndex = divIconMarkerZIndex;
				break;
			}

			if (figureLayer._icon) {
				figureLayer._resetZIndex();
			}
		}
	},

	//
	// body のコンテキストメニューを表示しないようにする
	//----------------------------------------------------------------------
	// NOTE: map 側のコンテキストメニューは別途抑制が必要
	//

	stopBodyContextMenu: function () {
		$(document.body).on("contextmenu", function (event) {
			L.DomEvent.preventDefault(event);
		});
	},

	//
	// val() で値を取得し、trim() 後、再設定して返す
	//----------------------------------------------------------------------
	//

	trimVal: function (selector) {
		var target = $(selector);
		var value = $.trim(target.val());

		target.val(value);
		return value;
	},

	//
	// ポップアップ表示の内容を設定する
	//----------------------------------------------------------------------
	//

	bindPopup: function (figureLayer, figureInfo) {
		var popupContent = MKR.TaskUtil.createPopupContent(figureInfo);
		if (popupContent !== null) {
			figureLayer.bindPopup(popupContent, {
				maxWidth: 5000
			});
		}
	},

	//
	// ポップアップ表示の内容を再設定する
	//----------------------------------------------------------------------
	//

	rebindPopup: function (figureLayer, figureInfo) {
		figureLayer.closePopup();
		figureLayer.unbindPopup();
		MKR.WidgetUtil.bindPopup(figureLayer, figureInfo);
	}
};

////////////////////////////////////////////////////////////////////////
// ポップアップ表示の制御
////////////////////////////////////////////////////////////////////////

MKR.Widget.PopupWindow = L.Class.extend({

	_map: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (map) {
		this._map = map;
	},

	//
	// ポップアップを有効にする
	//----------------------------------------------------------------------
	//

	enable: function () {
		MKR.LeafletUtil.setShowPopup(this._map, true);
	},

	//
	// ポップアップを無効(表示させない)にする
	//----------------------------------------------------------------------
	//

	disable: function () {
		this.close();
		MKR.LeafletUtil.setShowPopup(this._map, false);
	},

	//
	// ポップアップを閉じる
	//----------------------------------------------------------------------
	//

	close: function () {
		this._map.closePopup();
	}
});

////////////////////////////////////////////////////////////////////////
// コンテキストメニューの制御
////////////////////////////////////////////////////////////////////////

MKR.Widget.ContextMenu = L.Class.extend({

	_map: null,

	_dialogManager: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (map, dialogManager) {
		this._map = map;
		this._dialogManager = dialogManager;
	},

	//
	// コンテキストメニューを設定する
	//----------------------------------------------------------------------
	//

	bind: function (figureLayer) {
		figureLayer.bindContextMenu({
			contextmenuItems: [
				{
					text: "<i class='fa fa-cog' aria-hidden='true'></i>" + MKR.Lang.Widget.ContextMenu.figureSetting,
					callback: L.Util.bind(this._setting, this)
				}
			]
		});
	},

	//
	// コンテキストメニューを有効にする
	//----------------------------------------------------------------------
	//

	enable: function () {
		MKR.LeafletContextMenuUtil.setShow(this._map, true);
	},

	//
	// コンテキストメニューを無効(表示させない)にする
	//----------------------------------------------------------------------
	//

	disable: function () {
		if (this._map.contextmenu) {
			this._map.contextmenu.hide();
		}
		MKR.LeafletContextMenuUtil.setShow(this._map, false);
	},

	//
	// 「設定」の処理
	//----------------------------------------------------------------------
	//

	_setting: function (event) {
		var figureLayer = event.relatedTarget;
		var figureType = MKR.LeafletUtil.getFigureType(figureLayer);
		var figureOption = MKR.LeafletUtil.getFigureOption(figureLayer);
		var typeHelper = new MKR.TypeHelper(figureType);

		var figureSettingsDialog = typeHelper.widget.createFigureSettingsSaveDialog(
				this._dialogManager,
				figureOption
			);

		if (figureSettingsDialog === null) {
			MKR.Debug.notImplemented();
			return;
		}

		// 保存
		figureSettingsDialog.on("mkrDialog:save", function (saveEvent) {

			typeHelper.widget.setFigureLayerFromFigureOption(figureLayer, saveEvent.figureOption);

			MKR.WidgetUtil.rebindPopup(figureLayer, saveEvent.figureOption.figureInfo);
			MKR.LeafletUtil.setFigureOption(figureLayer, saveEvent.figureOption);
		});

		figureSettingsDialog.showModal();
	}
});

////////////////////////////////////////////////////////////////////////
// Bootstrap popover を使った入力警告
////////////////////////////////////////////////////////////////////////

MKR.Widget.InputPopover = L.Class.extend({

	options: {
		placement: "top",
		trigger: "manual"
	},

	_formGroup: null,

	_selector: null,

	_show: false,

	_showCounter: 0,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (formGroup, selector, options) {

		this.options = $.extend(true, {}, this.options, options);

		this._formGroup = $(formGroup);
		this._selector = $(selector);

		this._selector.popover(this.options);
	},

	//
	// エラー表示する
	//----------------------------------------------------------------------
	//

	showError: function (content) {
		var self = this;

		this._formGroup.addClass("has-error");

		++this._showCounter;

		this._selector.data('bs.popover').options.content = content;
		this._selector.popover("show");
		this._selector.focus();
		this._show = true;

		var showCounter = this._showCounter;

		setTimeout(function () {
			if (showCounter === self._showCounter && self._show) {
				self.hide();
			}
		}, 5000);
	},

	//
	// 非表示にする
	//----------------------------------------------------------------------
	//

	hide: function () {
		this._selector.popover("hide");
		this._formGroup.removeClass("has-error");
		this._show = false;
	}
});

////////////////////////////////////////////////////////////////////////
// jQuery UI Slider を使った透過率用のスライダー
////////////////////////////////////////////////////////////////////////

MKR.Widget.OpacitySlider = L.Class.extend({

	_widget: null,

	_valueWidget: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (widget, valueWidget, opacity) {

		this._widget = widget;
		this._valueWidget = valueWidget;

		var value = this._valueFromOpacity(opacity);

		widget.slider({
			range: "min",
			min: 0,
			max: 100,
			value: value,
			slide: L.bind(this._onSliderChange, this),
			change: L.bind(this._onSliderChange, this),
			stop: L.bind(this._onSliderChange, this)
		});

		valueWidget.text(String(value));
	},

	//
	// opacity を得る
	//----------------------------------------------------------------------
	//

	getOpacity: function () {
		var value = this._widget.slider("value");
		return this._opacityFromValue(value);
	},

	//
	// スライダが変更されたときのハンドラ
	//----------------------------------------------------------------------
	//

	_onSliderChange: function (event, ui) {
		this._valueWidget.text(String(ui.value));
	},

	//
	// opacity からスライダの入力値を得る
	//----------------------------------------------------------------------
	//

	_valueFromOpacity: function (opacity) {
		// スライダの入力値は透過率(0 で完全に不透明、100 で完全に透明)を表し、
		// opacity は透明度(0 で完全に透明、1 で完全に不透明)を表すため、逆にする。
		var value = MKR.Number.parseInt((100 - (opacity * 100)).toFixed(0), 10);
		return value;
	},

	//
	// スライダの入力値から opacity を得る
	//----------------------------------------------------------------------
	//

	_opacityFromValue: function (value) {
		var opacity = MKR.Number.parseFloat((100 - value) / 100, 2);
		return opacity;
	}
});

////////////////////////////////////////////////////////////////////////
// Bootstrap Colorpicker を使った色入力
////////////////////////////////////////////////////////////////////////

MKR.Widget.ColorPicker = L.Class.extend({

	_color: null,	// #rrggbb

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (colorPaneWidget, colorWidget, color) {
		var self = this;

		this._color = color;

		colorWidget.val(color);

		colorPaneWidget.colorpicker({
			customClass: "mkr_dialog_colorpicker",
			template: "<div class='colorpicker dropdown-menu'>" +
			          "<div class='colorpicker-saturation'><i><b></b></i></div>" +
			          "<div class='colorpicker-hue'><i></i></div>" +
			          ////"<div class='colorpicker-alpha'><i></i></div>" +
			          "<div class='colorpicker-color'><div /></div>" +
			          "<div class='colorpicker-selectors'></div>" +
			          "</div>"
		});

		colorPaneWidget.on("changeColor", function (event) {
			self._color = event.color.toHex();
		});
	},

	//
	// #rrggbb 形式の色を返す
	//----------------------------------------------------------------------
	//

	getColor: function () {
		return this._color;
	}
});

////////////////////////////////////////////////////////////////////////
// jQuery blockUI を使った UI ブロック
////////////////////////////////////////////////////////////////////////

MKR.Widget.BlockUI = {


	//
	// ブロックを開始する
	//----------------------------------------------------------------------
	//

	block: function () {

		$.blockUI({
			"message": null,
			"overlayCSS": {
				"background-color": "#000000",
				"opacity": 0.2,
				"filter": "alpha(opacity=20)",
				"background-image": "url('images/loading.gif')",
				"background-repeat": "no-repeat",
				"background-position": "center center"
			}
		});
	},

	//
	// ブロックを終了する
	//----------------------------------------------------------------------
	//

	unblock: function () {
		$.unblockUI();
	},

	//
	// ブロック中かを得る
	//----------------------------------------------------------------------
	//

	isBlocked: function () {
		if ($(window).data("blockUI.isBlocked")) {
			return true;
		}
		return false;
	}
};

