/*
 * 実行時設定
 */

////////////////////////////////////////////////////////////////////////
// 名称・内容
////////////////////////////////////////////////////////////////////////

MKR.Option = {};

// キー・値(テーブル入力)かテキスト(自由文入力)かの列挙定義
MKR.Option.FigureInfoType = {
	KeyValue: 0,	// キー・値
	Text: 1	// テキスト
};

// 名称・内容を格納する
MKR.Option.FigureInfo = L.Class.extend({

	// 名称
	name: "",

	// キー・値の配列(テーブル入力)
	keyValues: null,	// [{ key: string, value: string }, ...]

	// テキスト(自由文入力)
	text: "",

	// 初期化処理
	//----------------------------------------------------------------------

	initialize: function () {
		this.keyValues = [];
	},

	// キー・値を追加する
	//----------------------------------------------------------------------

	addKeyValues: function (key, value) {
		this.keyValues.push({
			key: key,
			value: value
		});
	},

	// キー・値(テーブル入力)かテキスト(自由文入力)かを判定する
	//----------------------------------------------------------------------

	type: function () {
		if (this.keyValues.length !== 0 || this.text === "") {
			return MKR.Option.FigureInfoType.KeyValue;
		}

		return MKR.Option.FigureInfoType.Text;
	},

	// JSON 形式のオブジェクトを取得する
	//----------------------------------------------------------------------

	toJson: function () {
		var json = {};

		json.name = this.name;
		json.keyValues = this.keyValues;
		json.text = this.text;

		return json;
	},

	// JSON 形式のオブジェクトから設定する
	//----------------------------------------------------------------------

	fromJson: function (json) {
		this.name = json.name;
		this.keyValues = json.keyValues;
		this.text = json.text;
	}
});

////////////////////////////////////////////////////////////////////////
// 作図設定
////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------
// マーカー(アイコン)
//----------------------------------------------------------------------

MKR.Option.DrawMarker = function () {
	this.icon = new L.Icon({
		iconUrl: MKR.Configs.markerIconDefault,
		iconSize: MKR.Configs.markerIconSizeDefault,
		iconAnchor: MKR.Configs.markerIconAnchorDefault
	});
};

MKR.Option.Marker = function () {
	this.draw = new MKR.Option.DrawMarker();
	this.figureInfo = new MKR.Option.FigureInfo();

	// JSON 形式のオブジェクトを取得する
	//----------------------------------------------------------------------

	this.toJson = function () {
		var json = {};

		json.draw = {
			icon: {
				iconUrl: this.draw.icon.options.iconUrl,
				iconSize: this.draw.icon.options.iconSize,
				iconAnchor: this.draw.icon.options.iconAnchor
			}
		};
		json.figureInfo = this.figureInfo.toJson();

		return json;
	};


	// JSON 形式のオブジェクトから設定する
	//----------------------------------------------------------------------

	this.fromJson = function (json) {

		var options = {
			iconUrl: json.draw.icon.iconUrl,
			iconSize: json.draw.icon.iconSize,
			iconAnchor: json.draw.icon.iconAnchor
		};

		this.draw.icon = new L.Icon(options);
		this.figureInfo.fromJson(json.figureInfo);
	};
};

//----------------------------------------------------------------------
// 線
//----------------------------------------------------------------------

MKR.Option.DrawPolyline = function () {
	this.shapeOptions = $.extend(true, {}, {
		stroke: true,
		color: "#000000",
		weight: 3,
		opacity: 0.5,
		fill: false,
		clickable: true
	});
};

MKR.Option.Polyline = function () {
	this.draw = new MKR.Option.DrawPolyline();
	this.figureInfo = new MKR.Option.FigureInfo();

	this.toJson = function () {
		var json = {};

		json.draw = {
			shapeOptions: this.draw.shapeOptions
		};
		json.figureInfo = this.figureInfo.toJson();

		return json;
	};

	this.fromJson = function (json) {
		this.draw.shapeOptions = json.draw.shapeOptions;
		this.figureInfo.fromJson(json.figureInfo);
	};
};

//----------------------------------------------------------------------
// ポリゴン
//----------------------------------------------------------------------

MKR.Option.DrawPolygon = function () {
	this.shapeOptions = $.extend(true, {}, {
		stroke: true,
		color: "#000000",
		weight: 3,
		opacity: 0.5,
		fill: true,
		fillColor: "#008000",
		fillOpacity: 0.4,
		clickable: true
	});
};

MKR.Option.Polygon = function () {
	this.draw = new MKR.Option.DrawPolygon();
	this.figureInfo = new MKR.Option.FigureInfo();

	this.toJson = function () {
		var json = {};

		json.draw = {
			shapeOptions: this.draw.shapeOptions
		};
		json.figureInfo = this.figureInfo.toJson();

		return json;
	};

	this.fromJson = function (json) {
		this.draw.shapeOptions = json.draw.shapeOptions;
		this.figureInfo.fromJson(json.figureInfo);
	};
};

//----------------------------------------------------------------------
// 円
//----------------------------------------------------------------------

MKR.Option.DrawCircle = function () {
	this.shapeOptions = $.extend(true, {}, {
		stroke: true,
		color: "#000000",
		weight: 3,
		opacity: 0.5,
		fill: true,
		fillColor: "#ffff00",
		fillOpacity: 0.4,
		clickable: true
	});
};

MKR.Option.Circle = function () {
	this.draw = new MKR.Option.DrawCircle();
	this.figureInfo = new MKR.Option.FigureInfo();

	this.toJson = function () {
		var json = {};

		json.draw = {
			shapeOptions: this.draw.shapeOptions
		};
		json.figureInfo = this.figureInfo.toJson();

		return json;
	};

	this.fromJson = function (json) {
		this.draw.shapeOptions = json.draw.shapeOptions;
		this.figureInfo.fromJson(json.figureInfo);
	};
};

//----------------------------------------------------------------------
// マーカー(円)
//----------------------------------------------------------------------

MKR.Option.DrawCircleMarker = function () {
	this.shapeOptions = $.extend(true, {}, {
		stroke: true,
		color: "#000000",
		weight: 3,
		opacity: 0.5,
		fill: true,
		fillColor: "#ffc0cb",
		fillOpacity: 0.4,
		clickable: true
	});
};

MKR.Option.CircleMarker = function () {
	this.draw = new MKR.Option.DrawCircleMarker();
	this.figureInfo = new MKR.Option.FigureInfo();

	this.toJson = function () {
		var json = {};

		json.draw = {
			shapeOptions: this.draw.shapeOptions
		};
		json.figureInfo = this.figureInfo.toJson();

		return json;
	};

	this.fromJson = function (json) {
		this.draw.shapeOptions = json.draw.shapeOptions;
		this.figureInfo.fromJson(json.figureInfo);
	};
};

//----------------------------------------------------------------------
// マーカー(テキスト)
//----------------------------------------------------------------------

MKR.Option.DrawDivIconMarker = function () {
	this.icon = new MKR.DivIcon();
};

MKR.Option.DivIconMarker = function () {
	this.draw = new MKR.Option.DrawDivIconMarker();
	this.figureInfo = new MKR.Option.FigureInfo();

	this.toJson = function () {
		var json = {};

		json.draw = {
			icon: {
				htmlValue: this.draw.icon.options.htmlValue
			}
		};
		json.figureInfo = this.figureInfo.toJson();

		return json;
	};

	this.fromJson = function (json) {

		var options = {
			htmlValue: json.draw.icon.htmlValue
		};

		this.draw.icon = new MKR.DivIcon(options);
		this.figureInfo.fromJson(json.figureInfo);
	};
};

//----------------------------------------------------------------------
// 名前付きの作図設定を格納する
//----------------------------------------------------------------------


MKR.NamedFigureOption = function (name, figureOption) {
	this.name = name;
	this.figureOption = figureOption;
};

////////////////////////////////////////////////////////////////////////
// 各種設定を保持する
////////////////////////////////////////////////////////////////////////

MKR.Settings = L.Class.extend({

	// 既定の作図設定
	_figureOptionHash: {},

	// 名前付きの作図設定の一覧
	_namedFigureOptionListHash: {},

	_storage: null,

	_jsonVersion: "1.0",

	_settingsStorageKey: "settings",

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (storage) {

		var self = this;

		this._storage = storage;

		this._figureOptionHash[MKR.FigureType.Marker] = new MKR.Option.Marker();
		this._figureOptionHash[MKR.FigureType.Polyline] = new MKR.Option.Polyline();
		this._figureOptionHash[MKR.FigureType.Polygon] = new MKR.Option.Polygon();
		this._figureOptionHash[MKR.FigureType.Circle] = new MKR.Option.Circle();
		this._figureOptionHash[MKR.FigureType.CircleMarker] = new MKR.Option.CircleMarker();
		this._figureOptionHash[MKR.FigureType.DivIconMarker] = new MKR.Option.DivIconMarker();

		$.each([
				MKR.FigureType.Marker,
				MKR.FigureType.Polyline,
				MKR.FigureType.Polygon,
				MKR.FigureType.Circle,
				MKR.FigureType.CircleMarker,
				MKR.FigureType.DivIconMarker
			], function (index, figureType) {
				// [MKR.NamedFigureOption: { name: string, figureOption: MKR.Option.Marker or MKR.Option.Polyline or ... }]
				self._namedFigureOptionListHash[figureType] = [];
			});
	},

	//
	// 図形種別に一致する既定の作図設定を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function (figureType) {

		var figureOption = {};

		if (this._figureOptionHash[figureType]) {
			figureOption = this._figureOptionHash[figureType];
		}

		return figureOption;
	},

	//
	// 図形種別に一致する既定の作図設定を設定する
	//----------------------------------------------------------------------
	//

	setFigureOption: function (figureType, figureOption) {
		if (this._figureOptionHash[figureType]) {
			this._figureOptionHash[figureType] = figureOption;
			this.save();
		}
	},

	//
	// 図形種別に一致する名前付きの作図設定一覧を取得する
	//----------------------------------------------------------------------
	//

	getNamedFigureOptionList: function (figureType) {

		var namedFigureOptionList = [];

		if (this._namedFigureOptionListHash[figureType]) {
			namedFigureOptionList = this._namedFigureOptionListHash[figureType];
		}

		return namedFigureOptionList;
	},

	//
	// 図形種別に一致する名前付きの作図設定一覧を設定する
	//----------------------------------------------------------------------
	//

	setNamedFigureOptionList: function (figureType, namedFigureOptionList) {
		if (this._namedFigureOptionListHash[figureType]) {
			this._namedFigureOptionListHash[figureType] = namedFigureOptionList;
			this.save();
		}
	},

	//
	// 図形種別に一致する名前付きの作図設定一覧から名前に一致する設定を返す
	//----------------------------------------------------------------------
	//

	findNamedFigureOptionByName: function (figureType, name) {

		if (this._namedFigureOptionListHash[figureType]) {
			return MKR.SettingUtil.findNamedFigureOptionByName(this._namedFigureOptionListHash[figureType], name);
		}

		return null;
	},

	//
	// 図形種別に一致する名前付きの作図設定一覧に追加または更新する
	//----------------------------------------------------------------------
	//

	addOrUpdateNamedFigureOption: function (figureType, name, figureOption) {

		if (this._namedFigureOptionListHash[figureType]) {
			var namedFigureOptionList = this._namedFigureOptionListHash[figureType];
			var add = MKR.SettingUtil.addOrUpdateNamedFigureOption(namedFigureOptionList, name, figureOption);
			this.save();

			return add;
		}

		return false;
	},

	//
	// 図形種別に一致する名前付きの作図設定一覧の件数を返す
	//----------------------------------------------------------------------
	//

	countNamedFigureOptionList: function (figureType) {

		var count = 0;

		if (this._namedFigureOptionListHash[figureType]) {
			count = this._namedFigureOptionListHash[figureType].length;
		}

		return count;
	},

	//
	// JSON 形式のオブジェクトを取得する
	//----------------------------------------------------------------------
	//

	toJson: function () {
		var json = {
			version: this._jsonVersion
		};

		json.figureOptions = {};
		$.each(this._figureOptionHash, function (figureType, figureOption) {
			json.figureOptions[figureType] = figureOption.toJson();
		});

		json.namedFigureOptionList = {};
		$.each(this._namedFigureOptionListHash, function (figureType, figureOptionList) {

			var figureOptions = [];

			$.each(figureOptionList, function (index, namedFigureOption) {
				figureOptions.push({
					name: namedFigureOption.name,
					figureOption: namedFigureOption.figureOption.toJson()
				});
			});

			json.namedFigureOptionList[figureType] = figureOptions;
		});

		return json;
	},

	//
	// JSON 形式のオブジェクトから設定する
	//----------------------------------------------------------------------
	//

	fromJson: function (json) {

		var self = this;

		if (json.version !== this._jsonVersion) {
			return;
		}

		$.each(json.figureOptions, function (figureType, figureOption) {
			if (self._figureOptionHash[figureType]) {
				self._figureOptionHash[figureType].fromJson(figureOption);
			}
		});

		$.each(json.namedFigureOptionList, function (figureType, figureOptionList) {

			if (self._namedFigureOptionListHash[figureType]) {
				var figureOptions = [];

				$.each(figureOptionList, function (index, namedFigureOption) {
					var figureOption = MKR.SettingUtil.getNewFigureOption(figureType);
					figureOption.fromJson(namedFigureOption.figureOption);

					MKR.SettingUtil.addOrUpdateNamedFigureOption(figureOptions, namedFigureOption.name, figureOption);
				});

				self._namedFigureOptionListHash[figureType] = figureOptions;
			}
		});
	},

	//
	// 設定をロードする
	//----------------------------------------------------------------------
	//

	load: function () {
		var settingsJsonStr = this._storage.get(this._settingsStorageKey);
		if (settingsJsonStr !== null) {
			try {
				var settingsJson = JSON.parse(settingsJsonStr);
				this.fromJson(settingsJson);
			} catch (ex) {
				console.log(ex);	// NOTE: @required
			}
		}
	},

	//
	// 設定をセーブする
	//----------------------------------------------------------------------
	//

	save: function () {
		var settingsJson = this.toJson();
		this._storage.set(this._settingsStorageKey, JSON.stringify(settingsJson));
	}
});

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.SettingUtil = {

	//
	// 新しい作図設定のオブジェクトを取得する
	//----------------------------------------------------------------------
	//

	getNewFigureOption: function (figureType) {
		return MKR.TypeHelper.Setting.getNewFigureOption(figureType);
	},

	//
	// 名前付きの作図設定一覧から名前に一致する設定を返す
	//----------------------------------------------------------------------
	//

	findNamedFigureOptionByName: function (namedFigureOptionList, name) {
		for (var i = 0; i < namedFigureOptionList.length; ++i) {
			if (namedFigureOptionList[i].name === name) {
				return namedFigureOptionList[i];
			}
		}
		return null;
	},

	//
	// 名前付きの作図設定一覧から名前に一致する配列のインデックスを返す
	//----------------------------------------------------------------------
	//

	indexOfNamedFigureOptionByName: function (namedFigureOptionList, name) {
		for (var i = 0; i < namedFigureOptionList.length; ++i) {
			if (namedFigureOptionList[i].name === name) {
				return i;
			}
		}
		return -1;
	},

	//
	// 名前付きの作図設定一覧に追加または更新する
	//----------------------------------------------------------------------
	//

	addOrUpdateNamedFigureOption: function (namedFigureOptionList, name, figureOption) {
		var index = MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionList, name);
		if (index < 0) {
			namedFigureOptionList.push(new MKR.NamedFigureOption(name, figureOption));
			return true;
		} else {
			namedFigureOptionList[index].figureOption = figureOption;
			return false;
		}
	}
};
