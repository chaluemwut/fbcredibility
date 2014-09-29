// var base_url = "https://www.sdc.com/sdc/";
var base_url = "https://www.fbcredibility.com/sdc/";
var server_url = base_url+"fbgetcredit2";
var feedback_url = base_url+"fbfeedback";
// var server_url = "https://lab.socialdatacomputing.com/sdc/";

function createSourceButton(ref){
	ret = '<button id=pro_but_'+ref;
	ret += ' class="inline" style="position: relative; margin-left: 10px;height:19px;">';
	// ret +=' <span id=pro_span_'+ref+'></span>';
	ret += '</button>';
	return ret;
}

function createAssessmentButton(divId){
	ret = '<div id=assessment_div_'+divId+' class="right_div">';
	ret += ' <div class="inline" style="position: relative; margin-top: 3px;">Agree</div>';
	ret += ' <button id=feedback_yes_'+divId+' class="inline">Yes</button>';
	ret += ' <button id=feedback_no_'+divId+' class="inline">No</button>';
	ret += '</div>';
	return ret
}

function createFBCredibilityDiv(divId, message) {
	ret = '<div id=kku_'+divId+' style="position: relative; margin-top: 5px; width:100%; height:18px;">';
	ret += '<div class="inline" style="position: relative; margin-top: 3px; color:#FF8000;">FB Credibility</div>';
	// ret += '<img class="inline" id=img_'+divId+' src="https://dl.dropboxusercontent.com/u/7385478/waiting.gif"  width="20" height="20" alt="Loading"/>';
	// ret += createSourceButton(divId);
	// ret += '<div id=fb_result_'+divId+' class="inline" style="position: relative; margin-top: 4px; margin-left: 10px;">: '+message+'</div>';
	ret += '<div id=fb_result_'+divId+' class="inline" style="position: relative; margin-top: 4px; margin-left: 10px;">: </div>';
	// ret += '<img src="chrome-extension://kpdmecaibnbaihjbghbikjbmihelikeg/scal1.png"></img>';
	ret += createAssessmentButton(divId);
	ret += '</div>';
	return ret;
}

function templateDiv(divId, textContent) {
	ret = '<div id=kku_'+divId+' style="position: relative; margin-top: 5px; width:100%; height:18px;">';
	ret += '<div class="inline" style="position: relative; margin-top: 3px;">FB Credibility</div>';
	ret += textContent;
	// ret += createAssessmentButton();
	ret += '</div>';
	return ret;	
}

function getObjId(link){
	if(link == undefined){
		return;
	}
	var first = link.substring(0,1);
	if(first == '/'){ //is posts type
		var short_url = link.split('/');
		if(short_url[2] == 'posts'){
			return short_url[3];
		}
		if(short_url[2] == 'photos'){
			return short_url[4];
		}
	}
	var base_url = link.replace("https://www.facebook.com/","");
	// https://www.facebook.com/OpenSourceForU/photos/a.112258614432.84824.58079349432/10152716463189433/?type=1
	var photo_type = base_url.split('/');
	if(photo_type[1] == 'photos'){
		return photo_type[3];
	}

	// video
	// https://www.facebook.com/video.php?v=10152712805877450
	var video_type = base_url.substring(0,9);
	if(video_type == 'video.php'){
		return base_url.replace("video.php?v=","");
	}

	//permalink permalink.php?story_fbid=910840168926902&id=100000027825211
	var permalink_type = base_url.substring(1,14);
	if(permalink_type == 'permalink.php'){
		var permalink_data = base_url.replace("permalink.php?story_fbid=","");
		var permalink_list = permalink_data.split('&');
		return permalink_list[0].substring(1, permalink_list[0].length);
	}

	return 'none';
}

function get_like_manual(sub_stream){
	// console.log('start like manual');
	var like_div = $(sub_stream).find("li[class='UFIRow UFILikeSentence UFIFirstComponent']");
	var inner_like_div = $(like_div).find("div[class='UFILikeSentenceText'] > span");
	var inner_like_dialog = $(inner_like_div).find("a[rel='dialog']");
	var all_like = 0;
	var you_like = inner_like_div.text();
	// console.log(inner_like_div.text());
	if (you_like.substring(0,3) == "You"){
		all_like += 1;
	}
	var profile_link_obj = inner_like_div.find("a[class='profileLink']");
	var profile_link_num = 0;
	profile_link_num = profile_link_obj.length;
	// console.log('no data '+profile_link_num);
	all_like += profile_link_num;
	// console.log('all like '+all_like);

	var like2_people = inner_like_dialog.text();
	var other_like = like2_people.replace(' others','').replace(' people','').replace(/,/g,'');
	var other_like_num = 0;
	// console.log('other like '+other_like);
	other_like_num = parseInt(other_like)||0;;
	// console.log('other like num '+other_like_num);
	all_like += other_like_num;
	return all_like;
}

function get_share_manual(sub_stream){
	var share_obj = $(sub_stream).find("div[class='uiUfi UFIContainer _5pc9 _5vsj _5v9k'] > ul");
	var share_link = $(share_obj).find("li[class='UFIRow UFIShareRow']");
	var a_link = $(share_link).find("a[class='UFIShareLink']");
	var share_text = a_link.text();
	try {
		var num = parseInt(share_text.match(/\d+/)[0]);
		return num;
	} catch(err){

	}
	return 0;
}

function get_comment_manual(sub_stream){
	// console.log('comment manual');
	var share_container = $(sub_stream).find("div[class='uiUfi UFIContainer _5pc9 _5vsj _5v9k'] > ul");
	var summary_div = $(share_container).find("li[class='UFIRow UFIPagerRow UFIComponent UFIFirstCommentComponent']");
	var share_text = summary_div.text();
	var share_num = 0;
	try {
		var summary_num = parseInt(share_text.match(/\d+/)[0]);
		share_num += summary_num;
	} catch (err) {

	}
	// UFIRow UFIFirstComment UFILastComment UFIFirstCommentComponent UFILastCommentComponent UFIComment display UFIComponent
	// UFIRow UFIFirstComment UFILastComment UFIFirstCommentComponent UFILastCommentComponent UFIComment display UFIComponent
	var one_comment_div = $(share_container).find("li[class='UFIRow UFIFirstComment UFILastComment UFIFirstCommentComponent UFILastCommentComponent UFIComment display UFIComponent']");
	share_num += one_comment_div.length;
	
	// var last_comment_div = $(share_container).find("li[class='UFIRow  UFILastComment UFILastCommentComponent UFIComment display UFIComponent']");
	// share_num += last_comment_div.length;

	var first_div = $(share_container).find("li[class='UFIRow UFIFirstComment UFIComment display UFIComponent']");
	share_num += first_div.length;

	var other_div = $(share_container).find("li[class='UFIRow UFIComment display UFIComponent']");
	share_num += other_div.length;
	// console.log('first comment '+other_div.length);

	var last_div = $(share_container).find("li[class='UFIRow  UFILastComment UFILastCommentComponent UFIComment display UFIComponent']");
	share_num += last_div.length;
	return share_num;
}

function get_like_comment_share(sub_stream){
	var message = $(sub_stream).find("a[class='UFIBlingBox uiBlingBox feedbackBling']").attr('aria-label');
	var ret_obj = [];
	var like_num = 0;
	if (typeof message == "undefined"){
		ret_obj[0] = get_like_manual(sub_stream);
		ret_obj[1] = get_comment_manual(sub_stream);
		ret_obj[2] = get_share_manual(sub_stream);
		ret_obj[4] = 'man';
	} else {
		// 1175 likes 18 comments 1 share
		var replace = '';
		if(message.indexOf('likes') != -1){
			ret_obj[0] = parseInt(message.substring(0, message.indexOf(' likes')));
			message = message.substring(message.indexOf('likes')+6, message.length);
		} else {
			ret_obj[0] = 0;
		}

		if(message.indexOf('comments') != -1){
			ret_obj[1] = parseInt(message.substring(0, message.indexOf(' comments')));
			message = message.substring(message.indexOf('comments')+9, message.length);
		} else {
			ret_obj[1] = 0;
		}

		if(message.indexOf('share') != -1){
			ret_obj[2] = parseInt(message.substring(0, message.indexOf(' share')));
		} else {
			ret_obj[2] = 0;
		}

		ret_obj[4] = 'auto';
	}
	return ret_obj;
}

function get_location_number(sub_stream){
	var location_div = $(sub_stream).find("div[class='clearfix _5x46'] > div[class='_3dp _29k'] > div >");
	var location_span = $(sub_stream).find("span[class='fsm fwn fcg'] > a[class='_5pcq']");
	if (location_span.length ==2){
		return 1;
	} else {
		return 0;
	}
}

function get_hash_tag(user_content){
	var url_list = $(user_content).find("[class='_58cn']");
	return url_list.length;
}
function get_content_url(user_content, user_content_img){
	var url_list = $(user_content).find("a").not("[class='_58cn'],[class='see_more_link']");
	return url_list.length;
}

function get_content_vdo(user_content, user_content_img){
	var vdo_list = $(user_content_img).find("i[class='_6o1']");
	return vdo_list.length;	
}

function get_content_image(user_content, user_content_img){
	var img_num = $(user_content_img).find("img[class='scaledImageFitWidth img'],img[class='scaledImageFitHeight img'],img[class='_46-i img']");
	// var img_type2 = $(user_content_img).find("img[class='_46-i img']");
	var is_vdo = $(user_content_img).find("i[class='_6o1']");
	return img_num.length-is_vdo.length;
}


$(document).ready(function () {

	setInterval(function(){
		$("[class*='userContentWrapper']").each(function(i){
			var sub_stream = $(this);
			var clearfix = $(sub_stream).find("[class='clearfix _5x46']");
			var user_content = $(sub_stream).find("div[class='_5pbx userContent']");
			var user_content_img = $(sub_stream).find("div[class='mtm']");

			var url_count = get_content_url(user_content, user_content_img);
			var hash_tag = get_hash_tag(user_content);
			var img_count = get_content_image(user_content, user_content_img);
			var vdo_count = get_content_vdo(user_content, user_content_img);
			var location = get_location_number(sub_stream);

			var common = get_like_comment_share(sub_stream);
			var out_data = 't:'+common[4]+' l:'+common[0]+
			               ' c:'+common[1]+' s:'+common[2]+
			               ' url:'+url_count+' has:'+hash_tag+' img:'+img_count+
			               ' vdo:'+vdo_count;

			if($(clearfix).find("[id^='kku_']").length){
				// console.log('found');
			} else {
				// console.log('link id '+link_id.attr('href'));
				// var post_id = getObjId(link_id.attr('href'));
				
				clearfix.append(createFBCredibilityDiv(i, out_data));

				$("#feedback_yes_"+i).click(function(){
					console.log('click feed back yes');
					var urlCall = feedback_url+"?feedback=yes";
					console.log('url '+urlCall);
					$.ajax({
						type: "GET",
						async: true,
						url: urlCall,
						withCredentials: true,
						success: function(result){
							console.log(result);
						}
					});
				});

				$("#feedback_no_"+i).click(function(){
					// console.log('click feed back no');
					var urlCall = feedback_url+"?feedback=no";
					console.log('url '+urlCall);
					$.ajax({
						type: "GET",
						async: true,
						url: urlCall,
						withCredentials: true,
						success: function(result){
							console.log(result);
						}
					});
				});	

				var urlCall = server_url+"?likes="+common[0]+"&comments="+common[1]+
							  "&shares="+common[2]+"&url="+url_count+
							  "&hashtag="+hash_tag+"&images="+img_count+
							  "&vdo="+vdo_count+
							  "&location="+location+
							  "&return_id="+i;	
				$.ajax({
					type: "GET",
					async: true,
					url: urlCall,
					withCredentials: true,
					success: function(result){
						// console.log(result);
						var ret_id = result['return_id'];
						var divObj = $('#fb_result_'+ret_id);
						divObj.attr('class', 'rating'+result['rating']);
					}
				});				
			}
		});
	}, 3000);
 
});
console.log('end script');
