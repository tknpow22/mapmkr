/*
 * ダイアログ
 */

MKR.Dialog = {};
MKR.Dialog.Pane = {};

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.DialogUtil = {

	// ダイアログテンプレート
	dialogTemplate:
		"<div class='mkr_dialog'>" +
			"<div class='mkr_dialog_header'>" +
				"<span class='mkr_dialog_title'></span>" +
			"</div>" +
			"<div class='mkr_dialog_body'>" +
			"</div>" +
		"</div>" +
		"",

	//
	// ダイアログを作成する
	//----------------------------------------------------------------------
	//

	create: function (dialogManager, clazz, title, dialogBody, resizableOptions) {

		var dialogWgt = $(this.dialogTemplate);

		dialogWgt.addClass(clazz);
		dialogWgt.find(".mkr_dialog_title").text(title);
		dialogWgt.find(".mkr_dialog_body").append(dialogBody);

		$(document.body).append(dialogWgt);

		dialogWgt.draggable({
			scroll: false,
			handle: ".mkr_dialog_header",
			stop: function (event, ui) {
				dialogManager.adjustOffset(dialogWgt);
			}
		});

		if (resizableOptions) {

			// NOTE: jQuery UI resizable により作られたリサイズハンドルの z-index の関係(だと思う)で、
			//       同じ大きさのモーダレスウィンドウがぴったり重なっている時に、
			//       前面側のウィンドウをリサイズしようとすると、背面側のウィンドウのハンドルをクリックできてしまい、
			//       背面側ウィンドウが、前面に表示されてしまう件の対策が必要。
			//       今のところモーダレスウィンドウはひとつ使っていないので、対策していない。
			dialogWgt.resizable({
				handles: "all",
				containment: "parent",
				minHeight: resizableOptions.minHeight,
				minWidth: resizableOptions.minWidth,
				maxHeight: resizableOptions.maxHeight,
				maxWidth: resizableOptions.maxWidth,
				stop: function (event, ui) {

					if (dialogWgt.outerHeight(true) < resizableOptions.minHeight) {
						dialogWgt.height(resizableOptions.minHeight);
					}

					if (dialogWgt.outerWidth(true) < resizableOptions.minWidth) {
						dialogWgt.width(resizableOptions.minWidth);
					}

					resizableOptions.adjustContents();
				}
			});

		}

		return dialogWgt;
	},

	//
	// リサイズ可能なウィジェットの高さを計算する
	//----------------------------------------------------------------------
	//

	calcResizableHeight: function (dialogWgt, resizableWgt, magicNumber) {

		var dialogFooterWgt = dialogWgt.find(".mkr_dialog_footer");

		var dialogHeight = dialogWgt.outerHeight(true);
		var footerHeight = (dialogFooterWgt[0]) ? dialogFooterWgt.outerHeight(true) : 0;

		var dialogTop = dialogWgt.offset().top;
		var resizableTop = resizableWgt.offset().top;

		var upperSideHeight = resizableTop - dialogTop;
		var underSideHeight = footerHeight + magicNumber;

		var resizableHeightNew = dialogHeight - upperSideHeight - underSideHeight;

		return resizableHeightNew;
	}
};

////////////////////////////////////////////////////////////////////////
// ダイアログ管理
////////////////////////////////////////////////////////////////////////

MKR.DialogManager = L.Class.extend({

	_dialogWgts: [],

	_modalCount: 0,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function () {
		var self = this;

		$(window).on("resize", function(event) {
			self._adjustAllOffset();
		});
	},

	//
	// ダイアログを管理対象にする
	//----------------------------------------------------------------------
	//

	attach: function (dialogWgt) {
		this._dialogWgts.push(dialogWgt);
	},

	//
	// ダイアログを管理対象から外す
	//----------------------------------------------------------------------
	//

	detach: function (dialogWgt) {
		for (var i = 0; i < this._dialogWgts.length; ++i) {
			if (this._dialogWgts[i] === dialogWgt) {
				this._dialogWgts.splice(i, 1);
				break;
			}
		}
	},

	//
	// 重なりを調整する
	//----------------------------------------------------------------------
	//

	refreshZIndex: function (dialogWgt) {

		var zIndex = MKR.Const.DialogZIndexBase;

		if (dialogWgt === null && 0 < this._dialogWgts.length) {
			dialogWgt = this._dialogWgts[this._dialogWgts.length - 1];
		}

		for (var i = 0; i < this._dialogWgts.length; ++i) {
			if (this._dialogWgts[i] === dialogWgt) {
				continue;
			}

			this._dialogWgts[i].css({"z-index": zIndex});
			this._dialogWgts[i].removeClass("active");

			++zIndex;
		}

		if (dialogWgt !== null) {
			dialogWgt.css({"z-index": zIndex});
			dialogWgt.addClass("active");
		}
	},

	//
	// ダイアログの位置を調整する
	//----------------------------------------------------------------------
	//

	adjustOffset: function (dialogWgt) {
		var win = $(window);
		var winWidth = win.width();
		var winHeight = win.height();

		this._adjustOffset(dialogWgt, winWidth, winHeight);
	},

	//
	// モーダルカウンタ値を加算する
	//----------------------------------------------------------------------
	//

	addModalCount: function () {
		++this._modalCount;
	},

	//
	// モーダルカウンタ値を減算する
	//----------------------------------------------------------------------
	//

	subModalCount: function () {
		--this._modalCount;
	},

	//
	// モーダルカウンタ値を返す
	//----------------------------------------------------------------------
	//

	modalCount: function () {
		return this._modalCount;
	},

	//
	// すべてのダイアログの位置を調整する
	//----------------------------------------------------------------------
	//

	_adjustAllOffset: function () {
		var win = $(window);
		var winWidth = win.width();
		var winHeight = win.height();

		for (var i = 0; i < this._dialogWgts.length; ++i) {
			this._adjustOffset(this._dialogWgts[i], winWidth, winHeight);
		}
	},

	//
	// ダイアログの位置を調整する
	//----------------------------------------------------------------------
	//

	_adjustOffset: function (dialogWgt, winWidth, winHeight) {

		var dialogOffset = dialogWgt.offset();
		var dialogHeight = dialogWgt.outerHeight(true);
		var dialogWidth = dialogWgt.outerWidth(true);
		var dialogHalfHeight = Math.floor(dialogHeight / 2);
		var dialogHalfWidth = Math.floor(dialogWidth / 2);

		var top = Math.min(winHeight - dialogHalfHeight, dialogOffset.top);
		top = Math.max(top, 0);

		var left = Math.min(winWidth - dialogHalfWidth, dialogOffset.left);
		left = Math.max(left, -dialogHalfWidth);

		var css = {
			top: top,
			left: left,
			right: "auto",
			bottom: "auto"
		};

		dialogWgt.css(css);
	}
});

////////////////////////////////////////////////////////////////////////
// ダイアログ(ベースクラス)
////////////////////////////////////////////////////////////////////////

MKR.Dialog.Base = L.Class.extend({

	options: {
		top: 0,
		left: 0,
		minHeight: 250,
		minWidth: 250,
		maxHeight: 500,
		maxWidth: 500
	},

	dialogWgt: null,

	_dialogManager: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, clazz, title, dialogBody, options) {
		var self = this;

		this.options = $.extend(true, {}, this.options, options);
		this._dialogManager = dialogManager;

		var dialogWgt = MKR.DialogUtil.create(
			dialogManager,
			clazz,
			title,
			dialogBody,
			{
				minHeight: options.minHeight,
				minWidth: options.minWidth,
				maxHeight: options.maxHeight,
				maxWidth: options.maxWidth,
				adjustContents: function () {
					self.adjustContents();
				}
			}
		);

		//
		// スタイル
		//

		dialogWgt.css({
			top: this.options.top,
			left: this.options.left,
			height: this.options.minHeight,
			width: this.options.minWidth
		});

		//
		// イベント
		//

		dialogWgt.on("resize", function (event) {
			self.adjustContents();
			L.DomEvent.stopPropagation(event);
		});

		dialogWgt.on("mousedown", function (event) {
			dialogManager.refreshZIndex(dialogWgt);
		});

		this.dialogWgt = dialogWgt;
	},

	//
	// 表示する
	//----------------------------------------------------------------------
	//

	show: function () {
		this.dialogWgt.show();

		this._dialogManager.attach(this.dialogWgt);
		this._dialogManager.refreshZIndex(this.dialogWgt);

		this.adjustContents();
	},

	//
	// 非表示にする
	//----------------------------------------------------------------------
	//

	hide: function () {
		this.dialogWgt.hide();

		this._dialogManager.detach(this.dialogWgt);
		this._dialogManager.refreshZIndex(null);
	},

	//
	// 表示内容をダイアログサイズに合わせる
	//----------------------------------------------------------------------
	//

	adjustContents: function () {
		// 継承したクラスで必要により実装のこと
	},

	//
	// ダイアログ管理オブジェクトを返す
	//----------------------------------------------------------------------
	//

	getDialogManager: function () {
		return this._dialogManager;
	}
});

////////////////////////////////////////////////////////////////////////
// モーダルダイアログ(ベースクラス)
//----------------------------------------------------------------------
// NOTE: close() 時にダイアログを remove() するため、
//       クラスから生成するインスタンスは、
//       メンバなどに持たせず、スタック上で作成・破棄すること。
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalBase = L.Class.extend({

	options: {
		resizable: true,
		minHeight: 250,
		minWidth: 250,
		maxHeight: 500,
		maxWidth: 500
	},

	dialogWgt: null,

	_dialogManager: null,

	// モーダル時の背景
	_backdropWgt: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, clazz, title, dialogBody, options) {
		var self = this;

		this.options = $.extend(true, {}, this.options, options);
		this._dialogManager = dialogManager;

		var resizableOptions = null;
		var height = "auto";
		var width = "auto";

		if (this.options.resizable) {
			resizableOptions = {
				minHeight: this.options.minHeight,
				minWidth: this.options.minWidth,
				maxHeight: this.options.maxHeight,
				maxWidth: this.options.maxWidth,
				adjustContents: function () {
					self.adjustContents();
				}
			};

			height = this.options.minHeight;
			width = this.options.minWidth;
		}

		var dialogWgt = MKR.DialogUtil.create(
			dialogManager,
			clazz,
			title,
			dialogBody,
			resizableOptions
		);

		//
		// スタイル
		//
		dialogWgt.css({
			height: height,
			width: width
		});

		if (!this.options.resizable) {
			// リサイズしない場合、"auto" のままだとドラッグして表示画面外へ出たときにウィンドウサイズが崩れるので、幅だけ設定しなおす
			dialogWgt.css({
				width: dialogWgt.width(),
				"min-width": this.options.minWidth,
				"max-width": this.options.maxWidth
			});
		}

		dialogWgt.addClass("active");

		//
		// イベント
		//

		$(window).on("resize", function (event) {
			self._dialogManager.adjustOffset(dialogWgt);
		});

		dialogWgt.on("resize", function (event) {
			self.adjustContents();
			L.DomEvent.stopPropagation(event);
		});

		this.dialogWgt = dialogWgt;
	},

	//
	// 表示する
	//----------------------------------------------------------------------
	//

	showModal: function () {

		var backdropZIndex = MKR.Const.ModalDialogZIndexBase + (this._dialogManager.modalCount() * 10);
		var dialogZIndex = backdropZIndex + 5;

		this._dialogManager.addModalCount();

		this._backdropWgt = $("<div class='mkr_modal_backdrop'></div>");
		this._backdropWgt.css({"z-index": backdropZIndex});
		$(document.body).append(this._backdropWgt);

		// 中央に表示する
		var win = $(window);
		var winWidth = win.width();
		var winHeight = win.height();

		var dialogWidth = this.dialogWgt.outerWidth(true);
		var dialogHeight = this.dialogWgt.outerHeight(true);

		var left = 0;
		var top = 0;

		if (dialogWidth < winWidth) {
			left = (winWidth - dialogWidth) / 2;
		}

		if (dialogHeight < winHeight) {
			top = (winHeight - dialogHeight) / 2;
		}

		this.dialogWgt.css({
			top: top,
			left: left,
			bottom: "auto",
			right: "auto",
			"z-index": dialogZIndex
		});

		this.dialogWgt.show();
		this.onShown();
		this.adjustContents();
	},

	//
	// 閉じる
	//----------------------------------------------------------------------
	//

	close: function () {

		this._backdropWgt.remove();
		this._backdropWgt = null;

		this._dialogManager.subModalCount();
		this.dialogWgt.hide();

		this.dialogWgt.remove();
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		// 継承したクラスで必要により実装のこと
	},

	//
	// 表示内容をダイアログサイズに合わせる
	//----------------------------------------------------------------------
	//

	adjustContents: function() {
		// 継承したクラスで必要により実装のこと
	},

	//
	// ダイアログ管理オブジェクトを返す
	//----------------------------------------------------------------------
	//

	getDialogManager: function () {
		return this._dialogManager;
	}
});

////////////////////////////////////////////////////////////////////////
// 名前入力ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalNameAs = MKR.Dialog.ModalBase.extend({

	// 名前確定: mkrDialog:nameAs
	includes: L.Mixin.Events,

	options: {
		dialogTitle: "名前を入力",
		srcName: "",
		okWidgetCaption: "OK",
		nameCheckCallback: function (srcName, destName, nameAsDialog) { nameAsDialog.nameOk(destName); }
	},

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, options) {

		var self = this;

		this.options = $.extend(true, {}, this.options, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-3 control-label mkr_required'>名前</label>" +
						"<div class='col-xs-9'>" +
							"<input type='text' class='form-control mkr_name_as' placeholder='' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_ok'></button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>キャンセル</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var nameAsWgt = dialogBodyWgt.find(".mkr_name_as");
		var okWgt = dialogBodyWgt.find(".mkr_ok");

		var nameAsPopover = new MKR.Widget.InputPopover(nameAsWgt.parents(".form-group"), nameAsWgt);

		//
		// 画面
		//

		nameAsWgt.val(this.options.srcName);
		okWgt.text(this.options.okWidgetCaption);

		//
		// イベント
		//

		// OK
		okWgt.on("click", function (event) {

			var nameAs = MKR.WidgetUtil.trimVal(nameAsWgt);
			if (nameAs === "") {
				nameAsPopover.showError("名前を入力してください");
				return;
			}

			nameAsPopover.hide();

			self.options.nameCheckCallback(self.options.srcName, nameAs, self);
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_name_as_dialog", this.options.dialogTitle, dialogBodyWgt, {
			resizable: false
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_name_as").focus();
	},

	//
	// 名前が OK の時、nameCheckCallback から確定した名前を引数にして呼び出すこと
	//----------------------------------------------------------------------
	//

	nameOk: function (name) {
		this.fire("mkrDialog:nameAs", { name: name });
		this.close();
	}
});

////////////////////////////////////////////////////////////////////////
// はい・いいえダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalYesNo = MKR.Dialog.ModalBase.extend({

	// はい: mkrDialog:yes
	// いいえ: mkrDialog:no
	includes: L.Mixin.Events,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, message) {

		var self = this;

		var dialogBodyTemplate =
			"<div>" +

				"<p class='mkr_message'></p>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_yes'>はい</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>いいえ</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);

		//
		// 画面
		//

		dialogBodyWgt.find(".mkr_message").text(message);

		//
		// イベント
		//

		// はい
		dialogBodyWgt.find(".mkr_yes").on("click", function (event) {
			self.fire("mkrDialog:yes");
			self.close();
		});

		// いいえ
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:no");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_yes_no_dialog", "確認", dialogBodyWgt, {
			resizable: false
		});
	}
});

////////////////////////////////////////////////////////////////////////
// 警告ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalAlert = MKR.Dialog.ModalBase.extend({

	// OK: mkrDialog:ok
	includes: L.Mixin.Events,

	options: {
		minWidth: 300,
		maxWidth: 500
	},

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, message, options) {

		var self = this;

		this.options = $.extend(true, {}, this.options, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='mkr_message'></div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_ok'>OK</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);

		//
		// 画面
		//
		dialogBodyWgt.find(".mkr_message").html(message);

		//
		// イベント
		//

		// OK
		dialogBodyWgt.find(".mkr_ok").on("click", function (event) {
			self.fire("mkrDialog:ok");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_alert_dialog", "確認", dialogBodyWgt, {
			resizable: false,
			minWidth: this.options.minWidth,
			maxWidth: this.options.maxWidth
		});
	}
});

