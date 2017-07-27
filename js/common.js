//弹出框
//dialog-fixed
function showDialog(container,callback){
	container.fadeIn('fast',callback);
	dialogFixed(container.find('.dialog-wrap'));
}
function hideDialog(container,callback){
	container.fadeOut('fast',callback);
}
$('body').on('click','.dialog-wrap',function (event) {
	event.preventDefault();
	return false;
});
$('body').on('click','.dialog-cover',function () {
	$(this).hide();
});
//提示框
function showTipDiialog(container,text,callfun){
	if(text){
		container.html(text);
	}	
	container.fadeIn();
	dialogFixed(container);
	setTimeout(function(){
		container.fadeOut();
		if(typeof(callfun)=='function'){
			callfun();
		}
	},1500);
}
//弹出框位置调整，垂直、水平居中
function dialogFixed(container){
	var width = container.outerWidth();
	var height = container.outerHeight();
	container.css({'margin-left':-width/2,'margin-top':-height/2});
}
//关闭弹出框
$('body').on('click','.btn-dialog',function(){
	$('.dialog-cover').fadeOut();
});
//弹出框x按钮关闭
$('body').on('click','.icon-close',function(){
	$(this).parents('.dialog-cover').fadeOut();
});

//日历
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}; 

function GetDateStr(currDate,AddMonthCount) {
	var dd = new Date(currDate);
	var currMonth = parseInt(dd.getMonth(),10);
	var year =  parseInt(dd.getFullYear(),10);
	if(AddMonthCount==-1){
		if(currMonth==0){
			currMonth = 12;
			year-=1;
		}else{
			currMonth=currMonth+AddMonthCount+1;
		}		
	}else if(AddMonthCount==1){
		if(currMonth==11){
			currMonth = 1;
			year+=1;
		}else{
			currMonth=currMonth+AddMonthCount+1;
		}	
	}else if(AddMonthCount ==0){
		currMonth=currMonth+AddMonthCount+1;
	}
	if(currMonth<10){
		currMonth='0'+currMonth;
	}
	return year+'-'+currMonth;
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

//密码检测
function checkPassword(text) {
	if(text.length>=6){
		var re = new RegExp("[0-9a-zA-Z]+$");
		if (!re.test(text)) {
			showTipDiialog($('.tip-dialog'), '请设置6-8位数字或字母交易密码');
			return false;
		}
		return true;
	}else{
		showTipDiialog($('.tip-dialog'), '请设置6-8位数字或字母交易密码');
		return false;
	}
}

//手机验证和验证码发送功能
var sending=false;
//输入框判断
$('body').on('input','.mobile', function () {
	var number = $(this).val();
	checkNumber(number);
});

function checkNumber(number) {
	if(number.length>0){
		var re = new RegExp("^1[0-9]*$");
		if (!re.test(number)) {
			showTipDiialog($('.tip-dialog'), '请输入正确的手机号码');
			return false;
		}
		return true;
	}else{
		return false;
	}
}

$('body').on('input','.checkCode', function () {
	var number = $(this).val();
	var re = new RegExp("^[0-9]*$");
	if (!re.test(number)) {
		showTipDiialog($('.tip-dialog'), '请输入4位数字验证码');
		return false;
	}
	if(codeNumber==number){
		$('.icon-check-pass').show();
	}else{
		$('.icon-check-pass').hide();
	}
});


//发送验证码
var time = 60;
var clearOut = null;
var codeNumber = -1;
$('body').on('click','.sendCode',function () {
	if (sending) {
		return false;
	}
	else {
		var value = $('.mobile').val();
		var flag = checkNumber(value);
		if(flag){
			if(value.length==11){
				//验证码发送成功
				$(this).addClass('disabled');
				$(".checkCode")[0].removeAttribute('disabled');
				sending = true;
				djs();
				codeNumber = '1111';
			}else{
				showTipDiialog($('.tip-dialog'), '请输入正确的手机号码');
			}
		}else{
			showTipDiialog($('.tip-dialog'), '请输入正确的手机号码');
		}
	}
})
function djs() {
	clearOut = setTimeout(function () {
		if (time < 0) {
			time = 60;
			sending = false;
			$('.sendCode').removeClass('disabled');
			$('.sendCode').val('重新发送');
			clearTimeout(clearOut);
			return false;
		}
		$('.sendCode').val('重新发送('+time + ')');
		time--;
		djs();
	}, 1000);
}

//数组克隆
Array.prototype.clone=function(){ return this.slice(0); }
