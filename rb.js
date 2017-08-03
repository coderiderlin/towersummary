//clean
$("#rbstyle").remove()
$(".rbcontext").remove()
//inject style
$("head").prepend('<style id="rbstyle" type="text/css">.rbtask-title {display:block;font-weight:blod;font-size: 18px}.rbtask-creator{}.rbtask-time{display:block;}.rbtask-due{display:block;}.rbtask-comment-author{display:block;}.rbtask-comment-text{display:block;}</style>')
$(".project-sections").prepend("<div class=rbcontext></div>")
//url=jQuery("a.todo-rest").eq(0).attr("href");
var res=1
function addLog(dataguid,msg){
	$(".rbresult."+dataguid).append(msg)
}
function clearLog(dataguid){
	$(".rbresult."+dataguid).html("")
}
function msg(msg)
{
	$(".rbresult").eq(0).prepend(msg);
}

function onUrlComplete(xhr,ts){

  
	//addLog(typeof(xhr));
	res=xhr
	//addLog(typeof(ts));
	//addLog("ts:"+ts);
	//msg("<br>status:"+res.status+"<br>");
	if(res.status==200)
	{
    //reponseText to jQuery object
		task=$(res.responseText)
    
    //read details and fill it to the corresponding container
		dataguid=task.find(".todo").attr("data-guid")
		
		clearLog(dataguid)
		taskTitle=task.find(".todo-content").find(".raw").text().trim()
		addLog(dataguid,"<div class=rbtask>")
		addLog(dataguid,"<span class='rbtask-title'><h3>"+taskTitle+"</h5></span>");
		taskCreator=task.find(".event-actor").eq(0).text()
		taskCreateTime=task.find(".event-created-at").eq(0).text()
		addLog(dataguid,"<span class='rbtask-creator'>发起人:"+taskCreator+"</span><span>发起时间:"+taskCreateTime+"</span>");
		//addLog(dataguid,"<span class='rbtask-time'>发起时间:"+taskCreateTime+"</span>");
		taskDue=task.find(".todo-assign-due").text().trim()
		addLog(dataguid,"<span class='rbtask-due'>当前负责人:"+taskDue+"</span>");
		commonId=0;
		
		task.find(".comment-main").each(function(){
			//console.log($(this).find(".author").text().trim());
			if($(this).find(".info").length<1)return;
			commonId++;
			commonAuthor=$(this).find(".author").text().trim();
			commonTime=$(this).find(".create-time").attr("title")
			commonText=$(this).find(".comment-content").text().trim()
			addLog(dataguid,"<span class='rbtask-comment-author'><b stype='font-size:15ps;font-weight:600;'>状态</b> "+commonAuthor+"  "+commonTime+"</span>")
			addLog(dataguid,"<span class='rbtask-comment-text'>"+commonText+"</span>")
			})
			
		addLog(dataguid,"</div>")
	}
	else
	{
  //retry on ajax fail,this frequently crops up on multiple ajax requesting
		$.ajax(this);
	}
}
taskId=0;
jQuery("a.todo-rest").each(function(){
	
	url=$(this).attr("href")
	dataguid=url.split("/").pop()
	if(dataguid.lastIndexOf("?")>0)
	{
		dataguid=dataguid.substring(0,dataguid.lastIndexOf("?"))
	}
	taskId++;
  //setup the container
	$(".rbcontext").prepend("<div class='rbresult "+dataguid+"'>正在解析项目 #"+taskId+" "+dataguid+" ...<br></div>");
  //querying each task details
	$.ajax({
			url: url,
			type: 'GET',
			timeout: 1000,
			cache: false,
			complete: onUrlComplete
	})
})

