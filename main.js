document.addEventListener("DOMContentLoaded", ready);

var isPlus = true;
var lastVal = -1;
var allcount = 10;
var rightNum = 0;
var wrongNum = 0;
var leftNum = allcount;
var wrongAdd = 5;

function ready(){
	showStart()
	$(".startButton").on("click",function(e){
		$(".startButton").hide()
		$(".startSisButton").hide()
		isPlus = true
		$(".computer").show()
		$(".end").show()
		next()
		showInfo()
	})
	
	$(".startSisButton").on("click",function(e){
		$(".startButton").hide()
		$(".startSisButton").hide()
		isPlus = false
		$(".computer").show()
		$(".end").show()
		next()
		showInfo()
	})
	
	$(".endButton").on("click",function(e){
		let val = $("#lastNumVal").val();
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
			showEndInfo()
		}else {
			$("#lastNumVal").val("");
			showInfo()
			next()
		}
	})
}

function showStart() {
	var title = "每天"+ allcount + "道计算题，做完通关，错一个，会新加"+ wrongAdd +"个，小朋友，准备好了么？那咱们开始吧!"
	$(".titleC").text(title)
}

function showInfo() {
	var other = "";
	if (rightNum >= 1 && wrongNum < 1){
		other = "，非常nice！";
	} else if(wrongNum > 2) {
		other = "，有点粗心哦，点下一个之前要记得检查！"
	}
	let text = "已对" + rightNum + "个，" + "已错" + wrongNum + "个，还剩" + allcount + "个" + other;
	$(".info").text(text); 
}

function showEndInfo() {
	let text = "已对" + rightNum + "个，" + "已错" + wrongNum + "个，今日通关了，可以干别的了";
	$(".info").text(text); 
}

function next() {
	let val1 = parseInt(randomNum(1,100));
	let val2 = parseInt(randomNum(1,100));
	$(".equalVal").text("=");
	if (isPlus) {
		if (val1 > val2) {
			// 数1 > 数2
			$(".leftVal").text(val1);
			$(".rightVal").text(val2);
			let seed = parseInt(randomNum(1,10));
			if ((val1 + val2) > 100){
				$(".middleVal").text("-");
				lastVal = val1 - val2;
			} else {
				if (seed > 5) {
					$(".middleVal").text("-");;
					lastVal = val1 - val2;
				} else {
					$(".middleVal").text("+");;
					lastVal = val1 + val2;
				}
			}
		} else if (val1 < val2) {
			// 数2 > 数1
			$(".leftVal").text(val2);
			$(".rightVal").text(val1);
			if ((val1 + val2) > 100) {
				$(".middleVal").text("-");
				lastVal = val2 - val1;
			} else {
				$(".middleVal").text("+");
				lastVal = val1 + val2;
			}
		} else {
			next()
		}
	} else {
		let seed = parseInt(randomNum(1,10));
		$(".leftVal").text(val1);
		$(".rightVal").text(val2);
		if (seed > 5) {
			$(".middleVal").text("x");
			lastVal = val1 * val2;
		} else {
			let all = val1 * val2;
			if (all < 1000 && val2 < 10){
				$(".leftVal").text(all);
				$(".middleVal").text("÷");
				$(".rightVal").text(val2);
				lastVal = val1;
			} else {
				next()
			}
		}
	}
}

//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

