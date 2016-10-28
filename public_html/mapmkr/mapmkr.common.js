/*
 * 定数、共通処理など
 */

////////////////////////////////////////////////////////////////////////
// 定数
////////////////////////////////////////////////////////////////////////

MKR.Const = {

	// NOTE: z-index: 10000 は Leaflet.contextmenu が使用
	// NOTE: z-index: 40000 は Bootstrap Colorpicker が使用
	//       ダイアログより大きい値とした。css を参照

	//
	// ダイアログの z-index の開始番号
	//----------------------------------------------------------------------
	//

	DialogZIndexBase: 20000,

	//
	// モーダルダイアログの z-index の開始番号
	//----------------------------------------------------------------------
	//

	ModalDialogZIndexBase: 30000,

	//
	// jQuery blockUI を使った UI ブロックの z-index の開始番号
	//----------------------------------------------------------------------
	//

	BlockUIZIndexBase: 50000,

	//
	// スクリプト制御する <a> タグの href に設定する値
	//----------------------------------------------------------------------
	//

	JSVoid: "javascript: void(0);"
};

////////////////////////////////////////////////////////////////////////
// デバッグ
////////////////////////////////////////////////////////////////////////

MKR.Debug = {

	//
	// 未実装アサーション表示
	//----------------------------------------------------------------------
	//

	notImplemented: function () {
		alert("実装されていません");
	}
};

////////////////////////////////////////////////////////////////////////
// 文字列
////////////////////////////////////////////////////////////////////////

MKR.String = {

	//
	// 文字列をエスケープ処理する
	//----------------------------------------------------------------------
	//

	escape: function (html) {
		var text = $("<div></div>").text(html).html();
		////text = text.replace(/'/g, "&apos;");
		////text = text.replace(/"/g, "&quot;");
		return text;
	}
};

////////////////////////////////////////////////////////////////////////
// 数値
////////////////////////////////////////////////////////////////////////

MKR.Number = {

	//
	// 整数を返す
	//----------------------------------------------------------------------
	//

	parseInt: function (val, radix) {
		radix = radix || 10;

		var number = parseInt(val, radix);
		number = (isNaN(number)) ? 0 : number;

		return number;
	},

	//
	// 浮動小数点数を返す
	//----------------------------------------------------------------------
	//

	parseFloat: function (val, fix) {
		fix = fix || 0;

		var number = parseFloat(val);
		number = (isNaN(number)) ? 0 : number;
		number = parseFloat(number.toFixed(fix));

		return number;
	}
};

////////////////////////////////////////////////////////////////////////
// カラー
////////////////////////////////////////////////////////////////////////

MKR.Color = {

	//
	// 色(#rrggbb)などのカラー文字列から RGBA の配列を取得する
	//----------------------------------------------------------------------
	//

	getRgba: function (color) {

		// jQuery でカラー値を設定・取得すると "rgb(r,g,b)" あるいは "rgba(r,g,b,a)" 形式で返ってくるのを利用する。
		var rgbColor = $("<div></div>").css({"color": color}).css("color");

		if (rgbColor.match(/rgb\(/i) || rgbColor.match(/rgba\(/i)) {
			var mr = rgbColor.match(/[\d.]+/g);
			if (3 <= mr.length) {

				var rgba = [];
				for (var i = 0; i < 3; ++i) {
					rgba.push(MKR.Number.parseInt(mr[i]));
				}

				// アルファ値
				if (3 < mr.length) {
					rgba.push(MKR.Number.parseFloat(mr[3], 2));
				} else {
					rgba.push(1.0);
				}

				return rgba;
			}
		}

		return [0, 0, 0, 1];
	},

	//
	// getRgba() で取得した配列から #rrggbb 形式の文字列を返す
	//----------------------------------------------------------------------
	//

	getColor: function (rgba) {

		var color = "#";

		if (3 <= rgba.length) {
			for (var i = 0; i < 3; ++i) {
				color += ("0" + rgba[i].toString(16)).slice(-2);
			}
			return color;
		}

		return "#000000";
	},

	//
	// getRgba() で取得した RGBA 配列から rgba(r,g,b,a) 形式の文字列を返す
	//----------------------------------------------------------------------
	//

	getColorRgba: function (rgba) {
		var color = "rgba(";

		if (3 <= rgba.length) {

			for (var i = 0; i < 3; ++i) {
				color += rgba[i].toString(10) + ","
			}

			if (3 < rgba.length) {
				color += rgba[3].toString(10);
			} else {
				color += "1.0";
			}

			color += ")";

			return color;
		}

		return "rgba(0, 0, 0, 1)";
	}
};

////////////////////////////////////////////////////////////////////////
// 配列
////////////////////////////////////////////////////////////////////////

MKR.Array = {

	//
	// 配列を空にする
	//----------------------------------------------------------------------
	//

	clear: function (arr) {
		arr.splice(0, arr.length);
	},

	//
	// 配列をコピーする
	//----------------------------------------------------------------------
	//

	copy: function (arr) {
		return arr.concat([]);
	},

	//
	// [a, b] 形式の値を得る
	//----------------------------------------------------------------------
	//

	getPairInt: function (x, y) {

		if (L.Util.isArray(x)) {
			switch (x.length) {
			case 0:
				return [0, 0];
			case 1:
				return [MKR.Number.parseInt(x[0]), 0];
			default:
				return [MKR.Number.parseInt(x[0]), MKR.Number.parseInt(x[1])];
			}
		}

		return [MKR.Number.parseInt(x), MKR.Number.parseInt(y)];
	},

	//
	// 配列中に値があるかを確認する
	//----------------------------------------------------------------------
	//
	//

	inArray: function (value, objArray, compareFunc) {
		var resultIndex = -1;
		var rc;

		$.each(objArray, function (index, obj) {
			rc = compareFunc(index, value, obj);
			if (rc) { resultIndex = index; }
			return !rc;
		});

		return resultIndex;
	}
};

////////////////////////////////////////////////////////////////////////
// 日付
////////////////////////////////////////////////////////////////////////

MKR.Date = {

	//
	// JSZip 内ファイル用のタイムスタンプを取得する
	//----------------------------------------------------------------------
	// @param dt Date オブジェクト

	getJSZipTimestamp: function (dt) {
		dt = dt || new Date();

		// NOTE: JSZip は date の内部保持した UTC 時刻を利用してファイルの日付を設定している。
		//       ZIP 内のファイルのタイムスタンプにはローカル時刻を設定したいため、
		//       date の内部保持した UTC 時刻がローカル時刻になるよう、UTC との時差分ローカル時刻を進める。
		var momt = moment(dt);
		momt.add(momt.utcOffset(), "m");

		return momt.toDate();
	}

};

////////////////////////////////////////////////////////////////////////
// ローカルストレージ
////////////////////////////////////////////////////////////////////////

MKR.LocalStorage = L.Class.extend({

	_storage: function () {
		_values = {};

		this.setItem = function(key, value) {
			_values[key] = value;
		};

		this.getItem = function(key) {
			return (_values[key]) ? _values[key] : null;
		};

		this.removeItem = function(key) {
			delete _values[key];
		};
	},

	_prefix: "",

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (prefix) {
		this._prefix = "MKR" + ((prefix) ? "." + prefix : "") + ".";

		if (typeof localStorage !== "undefined") {
			this._storage = localStorage;
		}
	},

	//
	// 値を設定する
	//----------------------------------------------------------------------
	//

	set: function (key, value) {
		try {
			this._storage.setItem(this._prefix + key, value);
		} catch (ex) {
			console.log(ex);	// NOTE: @required
		}
	},

	//
	// 存在しなければ値を設定する
	//----------------------------------------------------------------------
	//

	setIfNotExist: function (key, value) {
		try {
			if (this.get(key) === null) {
				this.set(key, value);
			}
		} catch (ex) {
			console.log(ex);	// NOTE: @required
		}
	},

	//
	// 存在すれば値を設定する
	//----------------------------------------------------------------------
	//

	setIfExist: function (key, value) {
		try {
			if (this.get(key) !== null) {
				this.set(key, value);
			}
		} catch (ex) {
			console.log(ex);	// NOTE: @required
		}
	},

	//
	// 値を取得する
	//----------------------------------------------------------------------
	//

	get: function (key) {
		try {
			return this._storage.getItem(this._prefix + key);
		} catch (ex) {
			console.log(ex);	// NOTE: @required
			return null;
		}
	},

	//
	// 存在すれば値を取得し、なければデフォルト値を返す
	//----------------------------------------------------------------------
	//

	getIfExist: function (key, valueDefault) {
		try {
			var value = this.get(key);
			if (value !== null) {
				return value;
			} else {
				return valueDefault;
			}
		} catch (ex) {
			console.log(ex);	// NOTE: @required
			return null;
		}
	},

	//
	// 値を削除する
	//----------------------------------------------------------------------
	//

	remove: function (key) {
		try {
			this._storage.removeItem(this._prefix + key);
		} catch (ex) {
			console.log(ex);	// NOTE: @required
		}
	}
});

////////////////////////////////////////////////////////////////////////
// AJAX
////////////////////////////////////////////////////////////////////////

MKR.Ajax = {

	//
	// ファイルを取得する
	//----------------------------------------------------------------------
	//

	fetchFile: function (url) {

		var defer = new $.Deferred;

		$.ajax({url: url, dataType: "text"}).done(function () {
			defer.resolve(arguments);
		}).fail(function () {
			// NOTE: ファイルが取得できない場合でも正常終了扱いとする
			//       利用する側は結果をチェックすること。
			////defer.reject(arguments);
			defer.resolve(arguments);
		});

		return defer.promise();
	}

};

////////////////////////////////////////////////////////////////////////
// URL フラグメント
////////////////////////////////////////////////////////////////////////

MKR.LocationHash = {

	//
	// URL フラグメントから値を得る
	//----------------------------------------------------------------------
	//

	getValue: function (hashName) {

		var hashArr = this._splitHash();

		for (var i = 0; i < hashArr.length; ++i) {
			if (hashArr[i].name === hashName) {
				return hashArr[i].value;
			}
		}

		return null;
	},

	//
	// URL フラグメントに値を設定する
	//----------------------------------------------------------------------
	//

	setValue: function (hashName, hashValue) {

		var hashArr = this._splitHash();
		var exists = false;

		for (var i = 0; i < hashArr.length; ++i) {
			if (hashArr[i].name === hashName) {
				hashArr[i].value = hashValue;
				exists = true;
				break;
			}
		}

		if (!exists) {
			hashArr.push({
					"name": hashName,
					"value": hashValue
				});
		}

		this._joinHash(hashArr);
	},

	setValues: function (hashNameValue) {

		var hashArr = this._splitHash();

		$.each(hashNameValue, function (hashName, hashValue) {
			var exists = false;
			for (var i = 0; i < hashArr.length; ++i) {
				if (hashArr[i].name === hashName) {
					hashArr[i].value = hashValue;
					exists = true;
					break;
				}
			}
			if (!exists) {
				hashArr.push({
						"name": hashName,
						"value": hashValue
					});
			}
		});

		this._joinHash(hashArr);
	},

	//
	// URL フラグメントに指定の名前のものが存在するかを返す
	//----------------------------------------------------------------------
	//

	isExists: function (hashName) {

		var hashArr = this._splitHash();
		for (var i = 0; i < hashArr.length; ++i) {
			if (hashArr[i].name === hashName) {
				return true;
			}
		}

		return false;
	},

	//
	// URL フラグメントから削除する
	//----------------------------------------------------------------------
	//

	remove: function (hashName) {

		var hashArr = this._splitHash();
		var result = [];

		for (var i = 0; i < hashArr.length; ++i) {
			if (hashArr[i].name === hashName) {
				// 追加しない
			} else {
				result.push(hashArr[i]);
			}
		}

		this._joinHash(result);
	},

	//
	// location.hash を分解する
	//----------------------------------------------------------------------
	//

	_splitHash: function () {

		var result = [];

		var hash = window.location.hash;
		if (hash === null) {	// 念のため
			return [];
		}

		var hashArr = hash.split(/[#&]/);
		for (var i = 0; i < hashArr.length; ++i) {
			var aHash = $.trim(hashArr[i]);
			var nvArr = aHash.split(/[=]/);
			if (nvArr.length === 0) {
				continue;
			}
			var name = $.trim(nvArr[0]);
			var value = "";
			if (1 < nvArr.length) {
				value = $.trim(nvArr[1]);
			} else {
				value = null;
			}

			if (name.length !== 0) {
				result.push({
						"name": name,
						"value": value
					});
			}
		}

		return result;
	},

	//
	// location.hash を組み立てる
	//----------------------------------------------------------------------
	//

	_joinHash: function (hashArr) {

		var hashNew = "";

		for (var i = 0; i < hashArr.length; ++i) {
			if (hashNew !== "") {
				hashNew += "&";
			}
			hashNew += hashArr[i].name;
			if (hashArr[i].value != null) {
				hashNew += "=" + hashArr[i].value;
			}
		}

		window.location.hash = hashNew;
	}
};
