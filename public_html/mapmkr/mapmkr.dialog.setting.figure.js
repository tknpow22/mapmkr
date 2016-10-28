/*
 * 設定関係の個別のダイアログ
 */

////////////////////////////////////////////////////////////////////////
// 作図設定ダイアログのベースクラス
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalSettingsBase = MKR.Dialog.ModalBase.extend({

	// 保存: mkrDialog:save
	// 既定に設定: mkrDialog:saveDefault
	// 名前を付けて保存: mkrDialog:saveAs
	// キャンセル: mkrDialog:cancel
	includes: L.Mixin.Events,

	options: {
		buttons: ["save", "saveDefault", "saveAs"],
		nameCheckCallback: function (srcName, destName, nameAsDialog) { nameAsDialog.nameOk(destName); }
	},

	figureType: null,

	// 名称・内容
	figureInfoPane: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, clazz, title, dialogBodyWgt, figureType, figureOption, options) {

		var self = this;

		this.figureType = figureType;

		this.options = $.extend(true, {}, this.options, options);
		this.options.buttons = options.buttons;

		var dialogFooterWgt = dialogBodyWgt.find(".mkr_dialog_footer");

		//
		// 画面
		//

		// 名称・内容
		this.figureInfoPane = new MKR.Dialog.Pane.FigureInfo(dialogManager, dialogBodyWgt.find(".mkr_figure_info_pane"), figureType, figureOption.figureInfo);

		// ボタン
		$.each(this.options.buttons, function (index, buttonType) {
			switch (buttonType) {
			case "save":
				dialogFooterWgt.append("<button type='button' class='btn btn-success mkr_save'>保存</button>");
				break;
			case "saveDefault":
				dialogFooterWgt.append("<button type='button' class='btn btn-success mkr_save_default'>既定に設定</button>");
				break;
			case "saveAs":
				dialogFooterWgt.append("<button type='button' class='btn btn-default mkr_save_as'>名前を付けて保存</button>");
				break;
			}
		});
		dialogFooterWgt.append("<button type='button' class='btn btn-default mkr_cancel'>キャンセル</button>");

		//
		// イベント
		//

		// 保存
		dialogBodyWgt.find(".mkr_save").on("click", function (event) {
			self.fire("mkrDialog:save", { figureType: figureType, figureOption: self.getFigureOption() });
			self.close();
		});

		// 既定に設定
		dialogBodyWgt.find(".mkr_save_default").on("click", function (event) {
			self.fire("mkrDialog:saveDefault", { figureType: figureType, figureOption: self.getFigureOption() });
			self.close();
		});

		// 名前を付けて保存
		dialogBodyWgt.find(".mkr_save_as").on("click", function (event) {

			var nameAsDialogOptions = {
				dialogTitle: "名前を付けて保存",
				okWidgetCaption: "保存",
				nameCheckCallback: self.options.nameCheckCallback
			};

			var nameAsDialog = new MKR.Dialog.ModalNameAs(dialogManager, nameAsDialogOptions);
			nameAsDialog.on("mkrDialog:nameAs", function (event) {
				self.fire("mkrDialog:saveAs", { figureType: figureType, saveName: event.name, figureOption: self.getFigureOption() });
				self.close();
			});
			nameAsDialog.showModal();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:cancel");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, clazz, title, dialogBodyWgt, options.dialogOptions);
	},


	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {
		// 継承したクラスで実装のこと
	},

	//
	// 表示内容をダイアログサイズに合わせる
	//----------------------------------------------------------------------
	//

	adjustContents: function () {
		var resizableWgt = this.figureInfoPane.getResizableWidget();
		var resizableHeightNew = MKR.DialogUtil.calcResizableHeight(this.dialogWgt, resizableWgt, 45);
		resizableWgt.height(resizableHeightNew);
	}
});


////////////////////////////////////////////////////////////////////////
// マーカー(アイコン)の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalMarkerSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 460,

	initialWidth: 440,

	_markerSizeWgt: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 500),
					maxWidth: Math.min(this.initialWidth + 200, 500)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-3 control-label mkr_required'>アイコン</label>" +
						"<div class='col-xs-9'>" +

							"<div class='btn-group mkr_marker_icon_pane'>" +
								"<span class='btn mkr_marker_icon_column' title='選択されているアイコン'><img src='' class='mkr_marker_icon mkr_marker_icon_current' /></span>" +

								"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='アイコンを選択'>" +
									"<span class='caret'></span>" +
								"</button>" +
								"<div class='dropdown-menu mkr_scrollable_menu mkr_marker_icon_list'>" +
								"</div>" +
							"</div>" +

						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-3 control-label mkr_required'>拡大率</label>" +
						"<div class='col-xs-9'>" +
							"<select class='form-control mkr_marker_size' title='拡大率を選択'>" +
								"<option value='10'>0.5</option>" +
								"<option value='20'>1.0</option>" +
								"<option value='30'>1.5</option>" +
								"<option value='40'>2.0</option>" +
							"</select>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var iconLinkTemplate =
			"<a href='" + MKR.Const.JSVoid + "' class='mkr_marker_icon_selector'><img src='' class='mkr_marker_select_icon' /></a>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var markerIconListWgt = dialogBodyWgt.find(".mkr_marker_icon_list");
		this._markerSizeWgt = dialogBodyWgt.find(".mkr_marker_size");

		//
		// 画面
		//

		// アイコン
		dialogBodyWgt.find(".mkr_marker_icon_current").attr({"src": figureOption.draw.icon.options.iconUrl});

		// 拡大率
		var markerSize = String(figureOption.draw.icon.options.iconSize[0]);
		this._markerSizeWgt.find("option").each(function (index, element) {
			if (markerSize === $(this).val()) {
				self._markerSizeWgt.val(markerSize);
				return false;
			}
		});

		// マーカーアイコン一覧
		for (var i = 0; i < MKR.Configs.markerIcons.length; ++i) {
			var iconLinkWgt = $(iconLinkTemplate);
			iconLinkWgt.find(".mkr_marker_select_icon").attr("src", MKR.Configs.markerIcons[i]);
			markerIconListWgt.append(iconLinkWgt);
		}

		//
		// イベント
		//

		// マーカーアイコン一覧から選択した時
		markerIconListWgt.on("click", ".mkr_marker_icon_selector", function (event) {
			var src = $(this).find(".mkr_marker_select_icon").attr("src");
			dialogBodyWgt.find(".mkr_marker_icon_current").attr("src", src);
		});

		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_marker_settings_dialog", "マーカー（アイコン）の設定", dialogBodyWgt, MKR.FigureType.Marker, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		var size = MKR.Number.parseInt(this._markerSizeWgt.val());
		var anchor = Math.floor(size / 2);

		figureOptionNew.draw.icon = new L.Icon({
			iconUrl: dialogWgt.find(".mkr_marker_icon_current").attr("src"),
			iconSize: [size, size],
			iconAnchor: [anchor, anchor]
		});

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// 線の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalPolylineSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 500,

	initialWidth: 440,

	_polylineWeightWgt: null,
	_polylineColorPicker: null,
	_polylineOpacitySlider: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 550),
					maxWidth: Math.min(this.initialWidth + 200, 500)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>線幅</label>" +
						"<div class='col-xs-8'>" +
							"<select class='form-control mkr_polyline_weight' title='線幅を選択'>" +
								"<option value='1'>1px</option>" +
								"<option value='3'>3px</option>" +
								"<option value='5'>5px</option>" +
								"<option value='10'>10px</option>" +
								"<option value='15'>15px</option>" +
								"<option value='25'>25px</option>" +
							"</select>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>線色</label>" +
						"<div class='col-xs-8'>" +
							"<div class='input-group colorpicker-component mkr_polyline_color_pane'>" +
								"<input type='text' class='form-control mkr_polyline_color' placeholder='例:red' title='線の色を入力'  />" +
								"<span class='input-group-addon' title='線の色を選択'><i></i></span>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>線の透過率</label>" +
						"<div class='col-xs-2'>" +
							"<div class='form-control-static'>" +
								"<span class='mkr_polyline_opacity_value'></span><span>%</span>" +
							"</div>" +
						"</div>" +
						"<div class='col-xs-6'>" +
							"<div class='form-control-static mkr_polyline_opacity_pane' title='線の透過率を選択'>" +
								"<div class='mkr_polyline_opacity'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var polylineColorPaneWgt = dialogBodyWgt.find(".mkr_polyline_color_pane");

		this._polylineWeightWgt = dialogBodyWgt.find(".mkr_polyline_weight");
		var polylineColorWgt = dialogBodyWgt.find(".mkr_polyline_color");

		//
		// 画面
		//

		// 線幅
		var polylineWeight = String(figureOption.draw.shapeOptions.weight);
		this._polylineWeightWgt.find("option").each(function (index, element) {
			if (polylineWeight === $(this).val()) {
				self._polylineWeightWgt.val(polylineWeight);
				return false;
			}
		});

		// 線色
		this._polylineColorPicker = new MKR.Widget.ColorPicker(polylineColorPaneWgt, polylineColorWgt, MKR.Color.getColor(MKR.Color.getRgba(figureOption.draw.shapeOptions.color)));

		// 線の透過率
		this._polylineOpacitySlider = new MKR.Widget.OpacitySlider(dialogBodyWgt.find(".mkr_polyline_opacity"), dialogBodyWgt.find(".mkr_polyline_opacity_value"), figureOption.draw.shapeOptions.opacity);

		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_polyline_settings_dialog", "線の設定", dialogBodyWgt, MKR.FigureType.Polyline, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		figureOptionNew.draw.shapeOptions.weight = MKR.Number.parseInt(this._polylineWeightWgt.val());
		figureOptionNew.draw.shapeOptions.color = this._polylineColorPicker.getColor();
		figureOptionNew.draw.shapeOptions.opacity = this._polylineOpacitySlider.getOpacity();

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// ポリゴンの作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalPolygonSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 600,

	initialWidth: 440,

	_polylineWeightWgt: null,
	_polylineColorPicker: null,
	_polylineOpacitySlider: null,

	_polyfillColorPicker: null,
	_polyfillOpacitySlider: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 650),
					maxWidth: Math.min(this.initialWidth + 200, 500)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>線幅</label>" +
						"<div class='col-xs-8'>" +
							"<select class='form-control mkr_polyline_weight' title='線幅を選択'>" +
								"<option value='1'>1px</option>" +
								"<option value='3'>3px</option>" +
								"<option value='5'>5px</option>" +
								"<option value='10'>10px</option>" +
								"<option value='15'>15px</option>" +
								"<option value='25'>25px</option>" +
							"</select>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>線色</label>" +
						"<div class='col-xs-8'>" +
							"<div class='input-group colorpicker-component mkr_polyline_color_pane'>" +
								"<input type='text' class='form-control mkr_polyline_color' placeholder='例:red' title='線の色を入力' />" +
								"<span class='input-group-addon' title='線の色を選択'><i></i></span>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>線の透過率</label>" +
						"<div class='col-xs-2'>" +
							"<div class='form-control-static'>" +
								"<span class='mkr_polyline_opacity_value'></span><span>%</span>" +
							"</div>" +
						"</div>" +
						"<div class='col-xs-6'>" +
							"<div class='form-control-static mkr_polyline_opacity_pane' title='線の透過率を選択'>" +
								"<div class='mkr_polyline_opacity'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>塗潰し色</label>" +
						"<div class='col-xs-8'>" +
							"<div class='input-group colorpicker-component mkr_polyfill_color_pane'>" +
								"<input type='text' class='form-control mkr_polyfill_color' placeholder='例:blue' title='塗潰し色を入力' />" +
								"<span class='input-group-addon' title='塗潰し色を選択'><i></i></span>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>塗潰し透過率</label>" +
						"<div class='col-xs-2'>" +
							"<div class='form-control-static'>" +
								"<span class='mkr_polyfill_opacity_value'></span><span>%</span>" +
							"</div>" +
						"</div>" +
						"<div class='col-xs-6'>" +
							"<div class='form-control-static mkr_polyline_opacity_pane' title='塗潰しの透過率を選択'>" +
								"<div class='mkr_polyfill_opacity'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var polylineColorPaneWgt = dialogBodyWgt.find(".mkr_polyline_color_pane");
		var polyfillColorPaneWgt = dialogBodyWgt.find(".mkr_polyfill_color_pane");

		this._polylineWeightWgt = dialogBodyWgt.find(".mkr_polyline_weight");
		var polylineColorWgt = dialogBodyWgt.find(".mkr_polyline_color");

		var polyfillColorWgt = dialogBodyWgt.find(".mkr_polyfill_color");

		//
		// 画面
		//

		// 線幅
		var polylineWeight = String(figureOption.draw.shapeOptions.weight);
		this._polylineWeightWgt.find("option").each(function (index, element) {
			if (polylineWeight === $(this).val()) {
				self._polylineWeightWgt.val(polylineWeight);
				return false;
			}
		});


		// 線色
		this._polylineColorPicker = new MKR.Widget.ColorPicker(polylineColorPaneWgt, polylineColorWgt, MKR.Color.getColor(MKR.Color.getRgba(figureOption.draw.shapeOptions.color)));

		// 線の透過率
		this._polylineOpacitySlider = new MKR.Widget.OpacitySlider(dialogBodyWgt.find(".mkr_polyline_opacity"), dialogBodyWgt.find(".mkr_polyline_opacity_value"), figureOption.draw.shapeOptions.opacity);

		// 塗潰し色
		this._polyfillColorPicker = new MKR.Widget.ColorPicker(polyfillColorPaneWgt, polyfillColorWgt, MKR.Color.getColor(MKR.Color.getRgba(figureOption.draw.shapeOptions.fillColor)));

		// 塗潰し透過率
		this._polyfillOpacitySlider = new MKR.Widget.OpacitySlider(dialogBodyWgt.find(".mkr_polyfill_opacity"), dialogBodyWgt.find(".mkr_polyfill_opacity_value"), figureOption.draw.shapeOptions.fillOpacity);

		this.callBaseInitialize(dialogManager, dialogBodyWgt, figureOption);
	},

	//
	// ベースの初期化処理を呼ぶ
	//----------------------------------------------------------------------
	//

	callBaseInitialize: function (dialogManager, dialogBodyWgt, figureOption) {
		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_polygon_settings_dialog", "ポリゴンの設定", dialogBodyWgt, MKR.FigureType.Polygon, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		figureOptionNew.draw.shapeOptions.weight = MKR.Number.parseInt(this._polylineWeightWgt.val());
		figureOptionNew.draw.shapeOptions.color = this._polylineColorPicker.getColor();
		figureOptionNew.draw.shapeOptions.opacity = this._polylineOpacitySlider.getOpacity();

		figureOptionNew.draw.shapeOptions.fillColor = this._polyfillColorPicker.getColor();
		figureOptionNew.draw.shapeOptions.fillOpacity = this._polyfillOpacitySlider.getOpacity();

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// 円の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalCircleSettings = MKR.Dialog.ModalPolygonSettings.extend({

	//
	// ベースの初期化処理を呼ぶ
	//----------------------------------------------------------------------
	//

	callBaseInitialize: function (dialogManager, dialogBodyWgt, figureOption) {
		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_circle_settings_dialog", "円の設定", dialogBodyWgt, MKR.FigureType.Circle, figureOption, this.options);
	}

});

////////////////////////////////////////////////////////////////////////
// マーカー(円)の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalCircleMarkerSettings = MKR.Dialog.ModalPolygonSettings.extend({

	//
	// ベースの初期化処理を呼ぶ
	//----------------------------------------------------------------------
	//

	callBaseInitialize: function (dialogManager, dialogBodyWgt, figureOption) {
		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_circle_marker_settings_dialog", "マーカー（円）の設定", dialogBodyWgt, MKR.FigureType.CircleMarker, figureOption, this.options);
	}

});

////////////////////////////////////////////////////////////////////////
// マーカー(テキスト)の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalDivIconMarkerSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 480,

	initialWidth: 440,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 500),
					maxWidth: Math.min(this.initialWidth + 200, 500)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-group'>" +
					"<label class='control-label mkr_required'>表示するHTMLを入力してください</label>" +
					"<textarea class='form-control mkr_html' placeholder='例1:動物園　\n例2:&lt;span style=&quot;background-color:#00ffff; color:red; font-size:20px;&quot;&gt;図書館&lt;/span&gt;' title='表示するHTML'></textarea>" +
				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);

		//
		// 画面
		//

		// HTML
		dialogBodyWgt.find(".mkr_html").val(figureOption.draw.icon.getHtml());

		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_div_icon_marker_settings_dialog", "テキストの設定", dialogBodyWgt, MKR.FigureType.DivIconMarker, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		figureOptionNew.draw.icon = new MKR.DivIcon({
			htmlValue: $.trim(dialogWgt.find(".mkr_html").val())
		});

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// 名称・内容ペイン
////////////////////////////////////////////////////////////////////////

MKR.Dialog.Pane.FigureInfo = L.Class.extend({

	_figureType: null,

	_figureInfoWgt: null,

	_figureTypeToText: "自由文入力に切替",

	_figureTypeToTable: "テーブル入力に切替",

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, parentWgt, figureType, figureInfo) {

		var self = this;

		this._figureType = figureType;

		var figureInfoTemplate =
			"<div class='well well-sm'>" +
				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-2 control-label'>名称</label>" +
						"<div class='col-xs-10'>" +
							"<input type='text' class='form-control mkr_figure_info_name' placeholder='例:A図書館' title='ポップアップ表示のタイトル' />" +
						"</div>" +
					"</div>" +

					"<div class='mkr_switch_figure_info_type_pane'>" +
						"<a href='" + MKR.Const.JSVoid + "' class='pull-left mkr_switch_figure_info_type' title='内容の入力方法を切り替え'></a>" +
						"<a href='" + MKR.Const.JSVoid + "' class='pull-right mkr_open_info_text_editor' title='自由文入力のエディタを開く'>エディタを開く</a>" +
					"</div>" +

					"<div class='mkr_figure_info_data'>" +

						"<div class='mkr_figure_info_table_pane'>" +
							"<p class='text-warning mkr_figure_info_table_warn'><i class='fa fa-info-circle' aria-hidden='true'></i>値のみ入力した列は保存されません。</p>" +
							"<p class='text-warning mkr_figure_info_table_warn'><i class='fa fa-info-circle' aria-hidden='true'></i>項目名に「name」や「description」などの GeoJSON 形式のキー値を入力した場合、ダブルクォート（\"）で囲んで保存されます。</p>" +
							"<table class='mkr_figure_info_table'>" +
								"<tr class='form-group'>" +
									"<td class='mkr_figure_info_key_column'>" +
										"<label class='control-label'>項目名</label>" +
									"</td>" +
									"<td>" +
										"<label class='control-label'>値</label>" +
									"</td>" +
									"<td>" +
									"</td>" +
									"<td>" +
									"</td>" +
								"</tr>" +
							"</table>" +
						"</div>" +

						"<textarea class='form-control mkr_figure_info_text' placeholder='例1:博物館　\n例2:&lt;span style=&quot;background-color:#00ffff; color:red; font-size:20px;&quot;&gt;公園&lt;/span&gt;' title='ポップアップ表示の内容'></textarea>" +

					"</div>" +

				"</div>" +
			"</div>" +
			"";

		var rowTemplate =
			"<tr class='form-group mkr_figure_info_key_value'>" +
				"<td class='mkr_figure_info_key_column'>" +
					"<input type='text' class='form-control mkr_figure_info_key' placeholder='例:営業時間' title='ポップアップ表示の項目名' />" +
				"</td>" +
				"<td>" +
					"<input type='text' class='form-control mkr_figure_info_value' placeholder='例:10時～18時' title='ポップアップ表示の項目値' />" +
				"</td>" +
				"<td>" +
					"<button type='button' class='btn btn-default mkr_figure_info_del_row' title='この行を削除'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
				"</td>" +
				"<td>" +
					"<button type='button' class='btn btn-default mkr_figure_info_add_row' title='この下に行を追加'><img src='images/icon_enter.png' /></button>" +
				"</td>" +
			"</tr>" +
			"";

		var figureInfoWgt = $(figureInfoTemplate);
		var figureInfoDataWgt = figureInfoWgt.find(".mkr_figure_info_data");
		var figureTypeSwWgt = figureInfoWgt.find(".mkr_switch_figure_info_type");
		var infoTablePaneWgt = figureInfoWgt.find(".mkr_figure_info_table_pane");
		var infoTableWgt = figureInfoWgt.find(".mkr_figure_info_table");
		var infoTextWgt = figureInfoWgt.find(".mkr_figure_info_text");
		var openInfoTextEditorWgt = figureInfoWgt.find(".mkr_open_info_text_editor");

		//
		// 画面
		//

		infoTablePaneWgt.hide();
		infoTextWgt.hide();
		openInfoTextEditorWgt.hide();

		if (figureInfo.keyValues.length === 0) {
			infoTableWgt.append(rowTemplate);
		}

		// 名称
		figureInfoWgt.find(".mkr_figure_info_name").val(figureInfo.name);

		// 内容
		if (figureInfo.type() === MKR.Option.FigureInfoType.KeyValue) {

			figureTypeSwWgt.text(this._figureTypeToText);

			for (var i = 0; i < figureInfo.keyValues.length; ++i) {
				var row = $(rowTemplate);

				var keyValue = figureInfo.keyValues[i];

				row.find(".mkr_figure_info_key").val(keyValue.key);
				row.find(".mkr_figure_info_value").val(keyValue.value);

				infoTableWgt.append(row);
			}

			figureInfoDataWgt.css({"overflow-y": "scroll"});
			infoTablePaneWgt.show();	// テーブルの外側のエレメント

		} else {

			figureTypeSwWgt.text(this._figureTypeToTable);

			infoTextWgt.val(figureInfo.text);

			figureInfoDataWgt.css({"overflow-y": "visible"});
			infoTextWgt.show();
			openInfoTextEditorWgt.show();
		}

		//
		// イベント
		//

		// 自由文入力とテーブル入力の切替え
		figureInfoWgt.find(".mkr_switch_figure_info_type").on("click", function (event) {

			if (infoTablePaneWgt.css("display") === "none") {

				figureTypeSwWgt.text(self._figureTypeToText);

				figureInfoDataWgt.css({"overflow-y": "scroll"});
				infoTextWgt.hide();
				openInfoTextEditorWgt.hide();
				infoTablePaneWgt.show();

			} else {

				figureTypeSwWgt.text(self._figureTypeToTable);

				var figureInfo = self.getFigureInfo();

				var rows = [];

				for (var i = 0; i < figureInfo.keyValues.length; ++i) {
					var key = figureInfo.keyValues[i].key;
					var value = figureInfo.keyValues[i].value;

					if (key !== "" && value !== "") {
						// テーブル入力にキー・値の両方があるときのみ設定する
						rows.push(
							$("<tr></tr>")
								.append($("<td></td>").text(key))
								.append($("<td></td>").text(value))
						);
					}
				}

				if (0 < rows.length) {
					var table = $("<table></table>");
					$.each(rows, function (index, row) {
						table.append(row);
					});

					var html = $.trim($("<div></div>").append(table).html());
					html = html.replace(/<tr>/g, "\n<tr>");
					html = html.replace(/<\/table>/g, "\n</table>");

					infoTextWgt.val(html);
				}

				figureInfoDataWgt.css({"overflow-y": "visible"});
				infoTablePaneWgt.hide();
				infoTextWgt.show();
				openInfoTextEditorWgt.show();
			}
		});

		// 自由文入力エディタを開く
		figureInfoWgt.find(".mkr_open_info_text_editor").on("click", function (event) {
			var infoTextEditorDialog = new MKR.Dialog.ModalInfoTextEditor(dialogManager, infoTextWgt.val());
			infoTextEditorDialog.on("mkrDialog:save", function (event) {
				infoTextWgt.val(event.infoText);
			});
			infoTextEditorDialog.showModal();
		});

		// テーブル項目削除
		figureInfoWgt.find(".mkr_figure_info_table").on("click", ".mkr_figure_info_del_row", function (event) {

			$(this).parents(".mkr_figure_info_key_value").remove();

			if (infoTableWgt.find(".mkr_figure_info_key_value").length <= 0) {
				infoTableWgt.append(rowTemplate);
			}
		});

		// テーブル項目追加
		figureInfoWgt.find(".mkr_figure_info_table").on("click", ".mkr_figure_info_add_row", function (event) {
			var rowWgt = $(rowTemplate);
			$(this).parents(".mkr_figure_info_key_value").after(rowWgt);
			rowWgt.find(".mkr_figure_info_key").focus();
		});

		parentWgt.append(figureInfoWgt);

		this._figureInfoWgt = figureInfoWgt;
	},

	//
	// 名称・内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureInfo: function () {

		var typeHelper = new MKR.TypeHelper(this._figureType);

		var geoJSONKeys = {};
		typeHelper.geojson.setGeoJSONKeys(geoJSONKeys);

		var figureInfo = new MKR.Option.FigureInfo();

		var infoTablePaneWgt = this._figureInfoWgt.find(".mkr_figure_info_table_pane");
		var infoTableWgt = this._figureInfoWgt.find(".mkr_figure_info_table");
		var infoTextWgt = this._figureInfoWgt.find(".mkr_figure_info_text");

		figureInfo.name = $.trim(this._figureInfoWgt.find(".mkr_figure_info_name").val());

		if (infoTablePaneWgt.css("display") === "none") {

			figureInfo.text = $.trim(infoTextWgt.val());

		} else {

			infoTableWgt.find(".mkr_figure_info_key_value").each(function (index, rowElem) {
				var rowWgt = $(rowElem);

				var key = $.trim(rowWgt.find(".mkr_figure_info_key").val());

				if (key !== "") {
					// キーがある項目のみ保存する

					// GeoJSON で使用するキー値の場合はダブルクォートで囲んで保存する
					if (key === "name" || key === "description" || geoJSONKeys[key]) {
						key = "\"" + key + "\"";
					}

					figureInfo.addKeyValues(key, $.trim(rowWgt.find(".mkr_figure_info_value").val()));
				}
			});
		}

		return figureInfo;
	},

	//
	// リサイズする箇所のウィジェットを得る
	//----------------------------------------------------------------------
	//

	getResizableWidget: function() {
		return this._figureInfoWgt.find(".mkr_figure_info_data");
	}
});

////////////////////////////////////////////////////////////////////////
// 自由文入力ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalInfoTextEditor = MKR.Dialog.ModalBase.extend({

	// 設定: mkrDialog:save
	includes: L.Mixin.Events,

	options: {
		minWidth: 600,
		maxWidth: 600
	},

	_infoTextWgt: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, infoText) {

		var self = this;

		var dialogBodyTemplate =
			"<div>" +

				"<textarea class='mkr_info_text'></textarea>" +

				"<p class='mkr_description'>編集時とポップアップ表示では見た目が一致しないことがあります。</p>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_save'>設定</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>キャンセル</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		this._infoTextWgt = dialogBodyWgt.find(".mkr_info_text");
		var saveWgt = dialogBodyWgt.find(".mkr_save");

		//
		// 画面
		//

		this._infoTextWgt.val(infoText);

		this._infoTextWgt.trumbowyg({
			lang: "ja",
			semantic: false,
			resetCss: true,

			btns: [
				["viewHTML"],
				["undo", "redo"],
				["formatting"],
				"btnGrp-design",	//// "btnGrp-semantic",
				["superscript", "subscript"],
				["link"],
				["insertImage"],
				"btnGrp-justify",
				"btnGrp-lists",
				["horizontalRule"],
				["removeformat"],
				["insertTemplte"],
				["fullscreen"]
			],

			btnsDef: {
				insertTemplte: {
					dropdown: [
						"insertTemplteUnorderedList",
						"insertTemplteOrderedList",
						"insertTemplteTitlePlusDesctiption",
						"insertTemplteTitlePlusDesctiptionPlusImage",
						"insertTemplteTitlePlusImage",
						"insertTemplteTitlePlusImagePlusDesctiption",
						"insertTemplteTitlePlusImageAndDesctiption"
					],
					hasIcon: false,
					text: "<i class='fa fa-file-code-o'></i>",
					title: "テンプレートの挿入",
				},
				insertTemplteUnorderedList: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-list-ul' style='margin-right: 14px;'></i>順序なしリスト",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><ul><li>リスト１</li><li>リスト２</li><li>リスト３</li></ul></div>"
					}
				},
				insertTemplteOrderedList: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-list-ol' style='margin-right: 14px;'></i>順序ありリスト",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><ol><li>リスト１</li><li>リスト２</li><li>リスト３</li></ol></div>"
					}
				},
				insertTemplteTitlePlusDesctiption: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-text-o' style='margin-right: 14px;'></i>タイトル+説明",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><p style='font-size: 12px; margin: 0;'>説明</p></div>"
					}
				},
				insertTemplteTitlePlusDesctiptionPlusImage: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>タイトル+説明+画像",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><p style='font-size: 12px; margin: 0.2em 0;'>説明</p><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div></div>"
					}
				},
				insertTemplteTitlePlusImage: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>タイトル+画像",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div></div>"
					}
				},
				insertTemplteTitlePlusImagePlusDesctiption: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>タイトル+画像+説明",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div><p style='font-size: 12px; margin: 0.2em 0;'>説明</p></div>"
					}
				},
				insertTemplteTitlePlusImageAndDesctiption: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>タイトル+画像&amp;説明",
					param: {
						html: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 50%; height: auto; float: left; margin-right: 0.5em;'/><div style='font-size: 12px; margin: 0;'>説明</div></div><div style='clear: both;'></div></div>"
					}
				}
			},
			dialogManager: dialogManager,
			viewHTMLCallback: function (htmlVisiblity) {
				saveWgt.prop("disabled", htmlVisiblity);
			}
    	});

		//
		// イベント
		//

		// 設定
		saveWgt.on("click", function (event) {
			self.fire("mkrDialog:save", { infoText: self._infoTextWgt.trumbowyg("html") });
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});


		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_info_text_editor_dialog", "自由文入力エディタ", dialogBodyWgt, {
			resizable: false,
			minWidth: this.options.minWidth,
			maxWidth: this.options.maxWidth
		});
	}
});
