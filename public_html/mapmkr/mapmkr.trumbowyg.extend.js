/*
 * Trumbowyg への変更・拡張
 */

MKR.Trumbowyg = {};

MKR.Trumbowyg.Dialog = {};

////////////////////////////////////////////////////////////////////////
// 画像の挿入ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Trumbowyg.Dialog.ModalInsertImage = MKR.Dialog.ModalBase.extend({

	// OK: mkrDialog:ok
	// キャンセル: mkrDialog:cancel
	includes: L.Mixin.Events,

	minWidth: 500,
	maxWidth: 500,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, origUrl, origAlt, origWidth) {

		var self = this;

		origUrl = origUrl || "";
		origAlt = origAlt || "";
		origWidth = origWidth || "";

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>URL</label>" +
						"<div class='col-xs-8'>" +
							"<textarea class='form-control mkr_url' placeholder='例:http://www.koutou-software.net/images/kswsLogo.png'></textarea>" +
						"</div>" +
					"</div>" +

					"<div class='form-group mkr_img_file_pane'>" +
						"<label class='col-xs-4 control-label'>ファイルから取込み</label>" +
						"<div class='col-xs-8'>" +
							"<input type='file' class='mkr_img_file_name' />" +
						"</div>" +
						"<div class='col-xs-offset-4 col-xs-8'>" +
							"<div class='mkr_img_file_name_description'>" +
								"ファイルから取込みを行うと、画像を図形データ中に文字列として埋め込むため、処理に時間がかかり、予期せぬタイミングで、画面が反応しなくなることがあります。" +
								"そのままお待ちいただければ、いずれ復帰しますが、画像サイズによっては復帰までにかなりお待ちいただく場合があります。申し訳ありませんが、ご留意ください。" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<hr class='mkr_img_file_name_separator' />" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label'>説明（alt）</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_alt_text' placeholder='例:ロゴ画像' title='画像の説明（alt属性）を指定' />" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label'>幅（width）</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_width' placeholder='例:200px' title='画像の幅（widthスタイル）を指定' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_ok'>OK</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>キャンセル</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var urlWgt = dialogBodyWgt.find(".mkr_url");
		var imgFilenameWgt = dialogBodyWgt.find(".mkr_img_file_name");
		var altTextWgt = dialogBodyWgt.find(".mkr_alt_text");
		var widthWgt = dialogBodyWgt.find(".mkr_width");

		imgFilenameWgt.fileinput({
			language: "ja",

			browseClass: "btn btn-default",
			browseLabel: "",

			removeLabel: "",
			removeIcon: "<i class='glyphicon glyphicon-remove'></i>",
			removeTitle: "ファイル選択を取り消します",

			showPreview: false,
			showUpload: false,
			showRemove: true
		});

		var urlPopover = new MKR.Widget.InputPopover(urlWgt.parents(".form-group"), urlWgt);

		// fileinput により生成されたエレメントを popover の対象とする
		var imgFilenamePopover = new MKR.Widget.InputPopover(imgFilenameWgt.parents(".form-group"), dialogBodyWgt.find(".mkr_img_file_pane .file-input .file-caption"));

		//
		// 画面
		//

		urlWgt.val(origUrl);
		altTextWgt.val(origAlt);
		widthWgt.val(origWidth);

		//
		// イベント
		//

		imgFilenameWgt.on("change", function (event) {

			var imgFilename = $.trim(imgFilenameWgt.val());
			if (imgFilename === "") {
				return;
			}

			var files = imgFilenameWgt.prop("files");
			if (!files || files.length <= 0) {
				imgFilenamePopover.showError("ファイルを取得できません");
				return;
			}

			var fileReader = new FileReader();
			fileReader.onload = function (event) {
				var dataUrl = event.target.result;

				if (dataUrl.indexOf("data:image") === 0) {
					urlWgt.val(dataUrl);
					imgFilenamePopover.hide();
				} else {
					imgFilenamePopover.showError("ファイルの形式が違います");
				}
			};
			fileReader.onerror = function(event) {
				imgFilenamePopover.showError("読み込みに失敗しました");
			};
			fileReader.readAsDataURL(files[0]);
		});

		// OK
		dialogBodyWgt.find(".mkr_ok").on("click", function (event) {

			var url = MKR.WidgetUtil.trimVal(urlWgt);
			var alt = MKR.WidgetUtil.trimVal(altTextWgt);
			var width = MKR.WidgetUtil.trimVal(widthWgt);

			if (url === "") {
				urlPopover.showError("URL を入力してください");
				return;
			}
			if (url.indexOf("data:image") === 0 || url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
				// OK
			} else {
				urlPopover.showError("URL を入力してください");
				return;
			}
			urlPopover.hide();

			self.fire("mkrDialog:ok", { url: url, alt: alt, width: width });
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:cancel");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_trumbowyg_insert_image_dialog", "画像の挿入", dialogBodyWgt, {
			resizable: false,
			minWidth: this.minWidth,
			maxWidth: this.maxWidth
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_url").focus();
	}
});

////////////////////////////////////////////////////////////////////////
// リンクの作成ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Trumbowyg.Dialog.ModalCreateLink = MKR.Dialog.ModalBase.extend({

	// OK: mkrDialog:ok
	// キャンセル: mkrDialog:cancel
	includes: L.Mixin.Events,

	minWidth: 500,
	maxWidth: 500,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, origUrl, origText, origTitle, origTarget) {

		var self = this;

		origUrl = origUrl || "";
		origText = origText || "";
		origTitle = origTitle || "";
		origTarget = (typeof origTarget === "undefined") ? "_blank" : origTarget;

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>URL</label>" +
						"<div class='col-xs-8'>" +
							"<textarea class='form-control mkr_url' placeholder='例:http://www.koutou-software.net/main/index.php'></textarea>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>テキスト</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_text' placeholder='例:団体のホームページ' />" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label'>タイトル（title）</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_title' placeholder='例:ホームページへのリンク' title='リンクの説明（title属性）を指定' />" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-5 control-label'>ターゲット指定（target）</label>" +
						"<div class='col-xs-7'>" +
							"<div class='input-group'>" +
								"<input type='text' class='form-control mkr_target' placeholder='例:_blank' title='リンク表示時のウィンドウを指定' />" +
								"<div class='input-group-btn mkr_target_selector'>" +
									"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>選択 <span class='caret'></span></button>" +
									"<ul class='dropdown-menu dropdown-menu-right'>" +
										"<li><a href='" + MKR.Const.JSVoid + "'>_blank</a></li>" +
										"<li><a href='" + MKR.Const.JSVoid + "'>_self</a></li>" +
										"<li><a href='" + MKR.Const.JSVoid + "'>_top</a></li>" +
										"<li><a href='" + MKR.Const.JSVoid + "'>_parent</a></li>" +
									"</ul>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_ok'>OK</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>キャンセル</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var urlWgt = dialogBodyWgt.find(".mkr_url");
		var textWgt = dialogBodyWgt.find(".mkr_text");
		var titleWgt = dialogBodyWgt.find(".mkr_title");
		var targetWgt = dialogBodyWgt.find(".mkr_target");

		var urlPopover = new MKR.Widget.InputPopover(urlWgt.parents(".form-group"), urlWgt);
		var textPopover = new MKR.Widget.InputPopover(textWgt.parents(".form-group"), textWgt);

		//
		// 画面
		//

		urlWgt.val(origUrl);
		textWgt.val(origText);
		titleWgt.val(origTitle);
		targetWgt.val(origTarget);

		//
		// イベント
		//

		// target の選択
		dialogBodyWgt.find(".mkr_target_selector ul li a").on("click", function (event) {
			targetWgt.val($(this).text());
		});

		// OK
		dialogBodyWgt.find(".mkr_ok").on("click", function (event) {

			var url = MKR.WidgetUtil.trimVal(urlWgt);
			var text = MKR.WidgetUtil.trimVal(textWgt);
			var title = MKR.WidgetUtil.trimVal(titleWgt);
			var target = MKR.WidgetUtil.trimVal(targetWgt);

			if (url === "") {
				urlPopover.showError("URL を入力してください");
				return;
			}
			if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
				// OK
			} else {
				urlPopover.showError("URL を入力してください");
				return;
			}
			urlPopover.hide();

			if (text === "") {
				textPopover.showError("テキストを入力してください");
				return;
			}
			textPopover.hide();

			// NOTE: 名称 target はイベント伝達の仕組み側で使うので、aTarget としている
			self.fire("mkrDialog:ok", { url: url, text: text, title: title, aTarget: target });
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:cancel");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_trumbowyg_create_link_dialog", "リンクの作成", dialogBodyWgt, {
			resizable: false,
			minWidth: this.minWidth,
			maxWidth: this.maxWidth
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_url").focus();
	}
});
