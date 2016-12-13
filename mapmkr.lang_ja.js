/*
 * 言語設定(ja)
 */

MKR.Lang = {

	lang: "ja",

	Configs: {
		mapTiles: {
			displayName_std: "標準地図",
			displayName_pale: "淡色地図",
			displayName_blank: "白地図",
			displayName_ort: "写真",
			displayName_airphoto: "簡易空中写真",

			errorTileUrl_std: "images/no-data-blank.png",
			errorTileUrl_pale: "images/no-data-blank.png",
			errorTileUrl_blank: "images/no-data-blank.png",
			errorTileUrl_ort: "images/no-data-blank.png",
			errorTileUrl_airphoto: "images/no-data-blank.png",
		}
	},

	Const: {
		DataImageWarning:
			"ファイルから取込みを行うと、画像を図形データ中に文字列として埋め込むため、処理に時間がかかり、予期せぬタイミングで、画面が反応しなくなることがあります。" +
			"そのままお待ちいただければ、いずれ復帰しますが、画像サイズによっては復帰までにかなりお待ちいただく場合があります。申し訳ありませんが、ご留意ください。" +
			""
	},

	Debug: {
		notImplemented: "実装されていません"
	},

	Widget: {
		ContextMenu: {
			figureSetting: "作図設定"
		}
	},

	DivIcon: {
		notSet: "[未設定]"
	},

	LayerManager: {
		layerNamePrefix: "新規レイヤ"
	},

	Dialog: {
		ModalNameAs: {
			dialogTitle: "名前を入力",
			okWidgetCaption: "OK",
			nameAsLabel: "名前",
			cancelButtonCaption: "キャンセル",
			nameIsEmptyMessage: "名前を入力してください"
		},

		ModalYesNo: {
			dialogTitle: "確認",
			yesButtonCaption: "はい",
			cancelButtonCaption: "いいえ"
		},

		ModalAlert: {
			dialogTitle: "確認"
		},

		ModalFigureSettingsMaintenance: {
			dialogTitle: "作図設定の管理",
			saveButtonCaption: "保存",
			cancelButtonCaption: "キャンセル",
			renameButtonTitle: "名前を変更",
			settingFigureButtonTitle: "作図設定",
			copyButtonTitle: "コピー",
			deleteButtonTitle: "削除",

			renameAsDialog: {
				dialogTitle: "名前を変更",
				okWidgetCaption: "変更",
				sameNameExistsMessage: "同名の作図設定があります。別の名前を付けてください。"
			},

			copyAsDialog: {
				dialogTitle: "コピー",
				okWidgetCaption: "保存",
				sameNameExistsMessage: "同名の作図設定があります。別の名前を付けてください。"
			}
		},

		ModalSettingsBase: {
			saveButtonCaption: "保存",
			saveDefaultButtonCaption: "既定に設定",
			saveAsButtonCaption: "名前を付けて保存",
			cancelButtonCaption: "キャンセル",

			saveAsDialog: {
				dialogTitle: "名前を付けて保存",
				okWidgetCaption: "保存"
			}
		},

		ModalMarkerSettings: {
			dialogTitle: "マーカー（アイコン）の設定",

			iconLabel: "アイコン",
			selectedIconTitle: "選択されているアイコン",
			selectIconButtonTitle: "アイコンを選択",
			setIconButtonTitle: "アイコンを設定",

			markerSizeLabel: "拡大率",
			selectSizeTitle: "拡大率を選択"
		},

		ModalImportIconImage: {
			dialogTitle: "アイコンの設定",

			iconSizeDescription: "大きさが 20 × 20 の画像を指定してください。",

			loadImageFileLabel: "ファイルから取込み",

			cancelButtonCaption: "キャンセル",

			fileinput: {
				removeTitle: "ファイル選択を取り消します"
			},

			loadFileErrorMessage: "ファイルを取得できません",
			fileFormatErrorMessage: "ファイルの形式が違います",
			readFileErrorMessage: "読み込みに失敗しました",

			urlIsEmptyMessage: "URL を入力してください"
		},

		ModalPolylineSettings: {
			initialWidth: 440,
			maxWidth: 540,

			dialogTitle: "線の設定",

			lineWidthLabel: "線幅",
			selectLineWidthTitle: "線幅を選択",

			lineColorLabel: "線色",
			lineColorExample: "例:red",
			inputLineColorTitle: "線の色を入力",
			selectLineColorTitle: "線の色を選択",

			lineOpacityLabel: "線の透過率",
			selectLineOpacityTitle: "線の透過率を選択"
		},

		ModalPolygonSettings: {
			initialWidth: 440,
			maxWidth: 540,

			dialogTitle: "ポリゴンの設定",

			lineWidthLabel: "線幅",
			selectLineWidthTitle: "線幅を選択",

			lineColorLabel: "線色",
			lineColorExample: "例:red",
			inputLineColorTitle: "線の色を入力",
			selectLineColorTitle: "線の色を選択",

			lineOpacityLabel: "線の透過率",
			selectLineOpacityTitle: "線の透過率を選択",

			fillColorLabel: "塗潰し色",
			fillColorExample: "例:blue",
			inputFillColorTitle: "塗潰し色を入力",
			selectFillColorTitle: "塗潰し色を選択",

			fillOpacityLabel: "塗潰し透過率",
			selectFillOpacityTitle: "塗潰しの透過率を選択"
		},

		ModalCircleSettings: {
			dialogTitle: "円の設定"
		},

		ModalCircleMarkerSettings: {
			dialogTitle: "マーカー（円）の設定"
		},

		ModalDivIconMarkerSettings: {
			dialogTitle: "テキストの設定",

			htmlLabel: "表示するHTMLを入力してください",
			htmlExample: "例1:動物園&nbsp;\n例2:&lt;span style=&quot;background-color:#00ffff; color:red; font-size:20px;&quot;&gt;図書館&lt;/span&gt;",
			htmlTitle: "表示するHTML"
		},

		Pane: {
			FigureInfo: {
				figureTypeToText: "自由文入力に切替",
				figureTypeToTable: "テーブル入力に切替",

				nameLabel: "名称",
				nameExample: "例:A図書館",
				inputNameTitle: "ポップアップ表示のタイトル",

				toggleInputMethodTitle: "内容の入力方法を切り替え",
				openHtmlEditorTitle: "自由文入力のエディタを開く",
				openHtmlEditorCaption: "エディタを開く",

				tablePaneWarn1Label: "値のみ入力した列は保存されません。",
				tablePaneWarn2Label: "項目名に「name」や「description」などの GeoJSON 形式のキー値を入力した場合、ダブルクォート（\"）で囲んで保存されます。",

				itemNameLabel: "項目名",
				valueLabel: "値",

				textExample: "例1:博物館&nbsp;\n例2:&lt;span style=&quot;background-color:#00ffff; color:red; font-size:20px;&quot;&gt;公園&lt;/span&gt;",
				textTitle: "ポップアップ表示の内容",

				itemNameExample: "例:営業時間",
				itemNameTitle: "ポップアップ表示の項目名",
				valueExample: "例:10時～18時",
				valueTitle: "ポップアップ表示の項目値",

				deleteRowTitle: "この行を削除",

				addRowTitle: "この下に行を追加"
			}
		},

		ModalInfoTextEditor: {
			dialogTitle: "自由文入力エディタ",

			editorWarnMessage: "編集時とポップアップ表示では見た目が一致しないことがあります。",

			saveButtonCaption: "設定",
			cancelButtonCaption: "キャンセル",

			insertTemplateTitle: "テンプレートの挿入",

			insertUnorderedListCaption: "順序なしリスト",
			unorderedListHtml: "<div style='width: 300px; word-break: break-all;'><ul><li>リスト１</li><li>リスト２</li><li>リスト３</li></ul></div>",

			insertOrderedListCaption: "順序ありリスト",
			orderedListHtml: "<div style='width: 300px; word-break: break-all;'><ol><li>リスト１</li><li>リスト２</li><li>リスト３</li></ol></div>",

			insertTitlePlusDesctiptionCaption: "タイトル+説明",
			insertTitlePlusDesctiptionHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><p style='font-size: 12px; margin: 0;'>説明</p></div>",

			insertTitlePlusDesctiptionPlusImageCaption: "タイトル+説明+画像",
			insertTitlePlusDesctiptionPlusImageHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><p style='font-size: 12px; margin: 0.2em 0;'>説明</p><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div></div>",

			insertTitlePlusImageCaption: "タイトル+画像",
			insertTitlePlusImageHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div></div>",

			insertTitlePlusImagePlusDesctiptionCaption: "タイトル+画像+説明",
			insertTitlePlusImagePlusDesctiptionHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div><p style='font-size: 12px; margin: 0.2em 0;'>説明</p></div>",

			insertTitlePlusImageAndDesctiptionCaption: "タイトル+画像&amp;説明",
			insertTitlePlusImageAndDesctiptionHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>タイトル</h3><div><img src='images/template_no_image.png?v=" + MKR.version + "' style='width: 50%; height: auto; float: left; margin-right: 0.5em;'/><div style='font-size: 12px; margin: 0;'>説明</div></div><div style='clear: both;'></div></div>"
		},

		Construction: {
			dialogTitle: "お絵かきマップ",

			beginEditFigureTitle: "現在のレイヤ上の図形を編集",
			beginSettingFigureTitle: "現在のレイヤ上の図形の作図設定を編集",
			beginDeleteFigureTitle: "現在のレイヤ上の図形を削除",

			showLayerOperationTitle: "レイヤ操作部を表示",
			hideLayerOperationTitle: "レイヤ操作部を非表示",

			selectOperationTitle: "処理を選択",

			loadLayerFromFileTitle: "ファイルから読み込み",
			clearAllLayersTitle: "すべての図形を削除",

			saveToBrowserTitle: "ブラウザへ保存",
			saveToFileTitle: "ファイルへ保存",

			finishDrawTitle: "確定",
			deleteLastPointTitle: "最終点を削除",
			cancelDrawTitle: "キャンセル",

			saveEditTitle: "確定",
			cancelEditTitle: "キャンセル",

			addNewLayerTitle: "新しいレイヤを作成",

			figureSettingCaption: "作図設定",
			maintenanceFigureSettingCaption: "作図設定の管理",
			repeatDrawingCaption: "作図の繰り返し",

			addMarkerTitle: "現在のレイヤにマーカー（アイコン）を追加",
			addCircleMarkerTitle: "現在のレイヤにマーカー（円）を追加",
			addPolylineTitle: "現在のレイヤに線を追加",
			addPolygonTitle: "現在のレイヤにポリゴンを追加",
			addCircleTitle: "現在のレイヤに円を追加",
			addDivIconMarkerTitle: "現在のレイヤにテキストを追加",

			selectLayerTitle: "このレイヤを選択",
			moveLayerForwardTitle: "レイヤを前面に移動",
			moveLayerBackwardTitle: "レイヤを背面に移動",
			renameLayerTitle: "レイヤの名前を変更",
			deleteLayerTitle: "レイヤを削除",

			figureDefaultTitle: "既定",

			sameNameExistsCaption: "同名の作図設定があります。上書き保存しますか？",

			showLayerCaption: "レイヤを表示します",
			hideLayerCaption: "レイヤを非表示にします",

			sameFilenameExistsMessage: "同じファイル名があります。別の名前を付けてください。",

			deleteAllLayersMessage: "すべての図形・レイヤを削除します。実行しますか？",

			noLayersMessage: "保存できる図形がありません。<div class='mkr_sub_message'>表示中の図形のみ保存します。</div>",

			failedSaveToBrowserMessage: "ブラウザへの保存に失敗しました。",

			layersCannotBeHiddenMessage: "選択中のレイヤは非表示にできません。",

			layerDeleteConfirmationMessageFunction: function (name) {
				return name + " を削除してよろしいですか？"
			},

			failedToReadFileMessage: "ファイルの読み込みに失敗しました。",

			someDataCouldNotLoadedMessage: "一部のデータが読み込めませんでした。",

			failedToSaveFileMessage: "ファイルの保存に失敗しました。"
		},

		ModalLayerNameAs: {
			initialWidth: 440,

			dialogTitle: "レイヤの名前を変更",

			displayNameLabel: "表示名",
			filenameLabel: "ファイル名",

			renameButtonCaption: "変更",
			cancelButtonCaption: "キャンセル",

			displayNameIsEmptyMessage: "表示名を入力してください",
			filenameIsEmptyMessage: "ファイル名を入力してください",
			invalidFilenameMessage: "ファイル名には半角の英数文字とアンダースコア（_）のみ入力できます"
		},

		ModalSaveLayer: {
			dialogTitle: "保存",

			saveDescription: "表示中の図形のみ保存します。",

			filenameLabel: "ZIP ファイル名",

			includePublishFilesTitle: "ZIP ファイルに Web サーバで公開するために必要なファイルを含める場合はチェック",
			includePublishFilesLabel: "公開に必要なファイルを含める",

			saveButtonCaption: "保存",
			cancelButtonCaption: "キャンセル",

			filenameIsEmptyMessage: "ZIP ファイル名を入力してください",
			invalidFilenameMessage: "ZIP ファイル名には半角の英数文字とアンダースコア（_）のみ入力できます"
		},

		ModalPublishInfo: {
			dialogTitle: "公開に必要な情報の設定",

			mapNameLabel: "マップ名",

			initialMapLabel: "初期表示地図",
			selectInitialMapTitle: "初期表示する地図を選択",

			displayMapsLabel: "表示地図",
			selectDisplayMapsTitle: "表示する地図をチェック",

			saveButtonCaption: "保存",
			cancelButtonCaption: "キャンセル",

			mapNameIsEmptyMessage: "マップ名を入力してください"
		},

		ModalLoadLayer: {
			dialogTitle: "読み込み",

			loadDescription: "以前に保存した ZIP ファイルまたは geojson ファイルを指定してください。",

			filenameLabel: "ファイル名",

			removeExistsLayersTitle: "既存のレイヤをすべて削除し、新たに読み込みを行う場合はチェック",
			removeExistsLayersLabel: "既存のレイヤをすべて削除してから読み込む",

			loadButtonCaption: "読込",
			cancelButtonCaption: "キャンセル",

			fileinput: {
				msgNoFilesSelected: "zip又はgeojsonファイルを指定下さい",
				removeTitle: "ファイル選択を取り消します"
			},

			filenameIsEmptyMessage: "ファイルを選択してください",
			loadFileErrorMessage: "ファイルを取得できません",

			allLayersDeleteMessage: "既存のレイヤはすべて削除されます。読み込みますか？"
		}
	},

	Trumbowyg: {
		Dialog: {
			ModalInsertImage: {
				dialogTitle: "画像の挿入",

				urlExample: "例:http://www.koutou-software.net/images/kswsLogo.png",

				loadFromFileLabel: "ファイルから取込み",

				altLabel: "説明（alt）",
				altExample: "例:ロゴ画像",
				altTitle: "画像の説明（alt属性）を指定",

				widthLabel: "幅（width）",
				widthExample: "例:200px",
				widthTitle: "画像の幅（widthスタイル）を指定",

				cancelButtonCaption: "キャンセル",

				fileinput: {
					removeTitle: "ファイル選択を取り消します"
				},

				loadFileErrorMessage: "ファイルを取得できません",
				invalidFileTypeMessage: "ファイルの形式が違います",
				readFileErrorMessage: "読み込みに失敗しました",

				urlIsEmptyMessage: "URL を入力してください"
			},

			ModalCreateLink: {
				dialogTitle: "リンクの作成",

				urlExample: "例:http://www.koutou-software.net/main/index.php",

				linkTextLabel: "テキスト",
				linkTextExample: "例:団体のホームページ",

				linkTitleLabel: "タイトル（title）",
				linkTitleExample: "例:ホームページへのリンク",
				linkTitleTitle: "リンクの説明（title属性）を指定",

				linkTargetLabel: "ターゲット指定（target）",
				linkTargetExample: "例:_blank",
				linkTargetTitle: "リンク表示時のウィンドウを指定",
				selectLinkTargetCaption: "選択",

				cancelButtonCaption: "キャンセル",

				urlIsEmptyMessage: "URL を入力してください",

				textIsEmptyMessage: "テキストを入力してください"
			}
		}
	},

	Task: {
		UseLH: {
			latDefalut: 35.362222,
			lngDefalut: 138.731389
		},

		MapManager: {
			tileCopyright: "国土地理院"
		}
	}
};

////////////////////////////////////////////////////////////////////////
// Leaflet.draw メッセージ
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
