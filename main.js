document.addEventListener("DOMContentLoaded", ready);

const CacuType = {
	plusIn100: "plusIn100", // 100以内乘除法
	mudevG3: "mudevG3",  // 三年级乘除法
	mudevG4: "mudevG4",  // 四年级乘除法
	mu99: "mu99"   // 99乘法口诀
}

var cacluType = CacuType.plusIn100;
var lastVal = -1;
var allcount = 20;
var rightNum = 0;
var wrongNum = 0;
var leftNum = allcount;
var wrongAdd = 10;
var i = 0; // 总秒数
var timer = null; // 定时器返回值
var mutiRes = Array();

function ready() {
	showStart()
	$(".startButton").on("click", function(e) {
		$(".start").hide()
		cacluType = CacuType.plusIn100
		$(".computer").show()
		$(".end").show()
		$("#box").show()
		startFunc()
		next()
		showInfo()
	})

	$(".startSisButton").on("click", function(e) {
		$(".start").hide()
		cacluType = CacuType.mudevG3
		$(".computer").show()
		$(".end").show()
		$("#box").show()
		startFunc()
		next()
		showInfo()
	})
	
	$(".startSis4Button").on("click", function(e) {
		$(".start").hide()
		cacluType = CacuType.mudevG4
		$(".computer").show()
		$(".end").show()
		$("#box").show()
		startFunc()
		next()
		showInfo()
	})
	
	$(".startMutiButton").on("click", function(e) {
		$(".start").hide()
		cacluType = CacuType.mu99
		$(".computer").show()
		$(".end").show()
		$("#box").show()
		startFunc()
		next()
		showInfo()
	})
	
	function doubleNum(num) {
      // 时分秒数字成对显示
      // return num >= 10 ? num : ("0" + num);
      return ("00" + String(num)).substr(String(num).length);	// 觉得这个方法更高大上
    }
	
	function startFunc() {
		// 计数开始
		timer = setInterval(function() {
			i++;
			$("#sec").text(doubleNum(i % 60)); // 秒
			$("#min").text(doubleNum(parseInt(i / 60) % 60)); // 分
		}, 1000)
	}

	function pauseFunc() {
		// 计数暂停
		clearInterval(timer);
	}
	
	$(".endButton").on("click", function(e) {
		let val = $("#lastNumVal").val();
		if (val == "") {
			return
		}
		if (val == lastVal) {
			allcount = allcount - 1;
			rightNum = rightNum + 1;
		} else {
			wrongNum = wrongNum + 1;
			allcount = allcount + wrongAdd;
		}
		if (allcount == 0) {
			$(".computer").hide()
			$(".titleC").hide()
			$(".end").hide()
			pauseFunc()
			showEndInfo()
		} else {
			$("#lastNumVal").val("");
			showInfo()
			next()
		}
	})
}

function showStart() {
	var title = "每天" + allcount + "道计算题，做完通关，错一个，会新加" + wrongAdd + "个，小朋友，准备好了么？那咱们开始吧!"
	$(".titleC").text(title)
}

function showInfo() {
	var other = "";
	if (rightNum >= 1 && wrongNum < 1) {
		other = "，非常nice！";
	} else if (wrongNum > 2) {
		other = "，有点粗心哦，点下一个之前要记得检查！"
	}
	let text = "已对" + rightNum + "个，" + "已错" + wrongNum + "个，还剩" + allcount + "个" + other;
	$(".info").text(text);
}

function showEndInfo() {
	let text = "已对" + rightNum + "个，" + "已错" + wrongNum + "个，今日通关了，可以干别的了";
	$(".info").text(text);
}

// 100以内加减法
function createPlus100() {
	let val1 = parseInt(randomNum(1, 100));
	let val2 = parseInt(randomNum(1, 100));
	$(".equalVal").text("=");
	if (val1 > val2) {
		// 数1 > 数2
		$(".leftVal").text(val1);
		$(".rightVal").text(val2);
		let seed = parseInt(randomNum(1, 10));
		if ((val1 + val2) > 100) {
			$(".middleVal").text("-");
			// 如果val1个位数 > val2个位数，这有点简单，要复杂点
			if ((val1 % 10) >= (val2 % 10)) {
				createPlus100()
			} else {
				lastVal = val1 - val2;
			}
		} else {
			if (seed > 5) {
				$(".middleVal").text("-");
				// 如果val1个位数 > val2个位数，这有点简单，要复杂点
				if ((val1 % 10) >= (val2 % 10)) {
					createPlus100()
				} else {
					lastVal = val1 - val2;
				}
			} else {
				$(".middleVal").text("+");
				// 如果val1个位数 + val2个位数 <= 10，这有点简单，要复杂点
				if ((val1 % 10) + (val2 % 10) <= 10) {
					createPlus100()
				} else {
					lastVal = val1 + val2;
				}
			}
		}
	} else if (val1 < val2) {
		// 数2 > 数1
		$(".leftVal").text(val2);
		$(".rightVal").text(val1);
		if ((val1 + val2) > 100) {
			$(".middleVal").text("-");
			// 如果val2个位数 > val1个位数，这有点简单，要复杂点
			if ((val2 % 10) >= (val1 % 10)) {
				createPlus100()
			} else {
				lastVal = val2 - val1;
			}
		} else {
			$(".middleVal").text("+");
			// 如果val1个位数 + val2个位数 <= 10，这有点简单，要复杂点
			if ((val1 % 10) + (val2 % 10) <= 10) {
				createPlus100()
			} else {
				lastVal = val1 + val2;
			}
		}
	} else {
		createPlus100()
	}
}

// 三年级乘除法
function createMudevG3() {
	let val1 = parseInt(randomNum(1, 100));
	let val2 = parseInt(randomNum(1, 100));
	$(".equalVal").text("=");
	let seed = parseInt(randomNum(1, 10));
	$(".leftVal").text(val1);
	$(".rightVal").text(val2);
	if (seed > 5) {
		$(".middleVal").text("x");
		lastVal = val1 * val2;
	} else {
		let all = val1 * val2;
		if (all < 1000 && val2 < 10) {
			$(".leftVal").text(all);
			$(".middleVal").text("÷");
			$(".rightVal").text(val2);
			lastVal = val1;
		} else {
			createMudevG3()
		}
	}
}

// 四年级乘除法
function createMudevG4() {
	var val1 = parseInt(randomNum(10, 1000));
	var val2 = parseInt(randomNum(10, 100));
	$(".equalVal").text("=");
	let seed = parseInt(randomNum(1, 10));
	$(".leftVal").text(val1);
	$(".rightVal").text(val2);
	if (seed > 5) {
		let a = val1 * val2;
		if (a < 100000) {
			$(".middleVal").text("x");
			lastVal = val1 * val2;
		} else {
			createMudevG4()
		}
		
	} else {
		// 除法
		val1 = parseInt(randomNum(100, 1000));
		val2 = parseInt(randomNum(2, 10));
		let all = val1 * val2;
		if (all < 1000) {
			$(".leftVal").text(all);
			$(".middleVal").text("÷");
			$(".rightVal").text(val2);
			lastVal = val1;
		} else {
			createMudevG4()
		}
	}
}

// 99乘法口诀
function createMuti99() {
	let val1 = parseInt(randomNum(2, 9));
	let val2 = parseInt(randomNum(2, 9));
	$(".equalVal").text("=");
	$(".leftVal").text(val1);
	$(".rightVal").text(val2);
	$(".middleVal").text("x");
	lastVal = val1 * val2;
	if(mutiRes.length >= 10){
		mutiRes = [];
	}
	var needBack = false;
	for (i = 0; i < mutiRes.length; i++) {
		if(lastVal == mutiRes[i]){
			needBack = true;
			break;
		}
	}
	if(needBack) {
		createMuti99();
		return;
	}
	mutiRes.push(lastVal)
	
}


function next() {
	if (cacluType == CacuType.plusIn100) {
		createPlus100()
	}else if (cacluType == CacuType.mudevG3){
		createMudevG3()
	}else if (cacluType == CacuType.mudevG4){
		createMudevG4()
	}else if (cacluType == CacuType.mu99){
		createMuti99()
	}
}


//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			break;
		default:
			return 0;
			break;
	}
}