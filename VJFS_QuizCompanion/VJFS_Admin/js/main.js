/**
 * Adding an isEmpty prototype for String
 */
String.prototype.isEmpty = function() {
	return (this.length === 0 || !this.trim());
};

/**
 * Function will retrieve the root URL for domain it's running on.
 *
 * @returns {string} : the currently root hostname
 */
function getHostRoot() {
	return location.protocol + '//' + location.hostname;
	//use the following when DHIS is using portnumber in URL scheme:
	//return location.protocol + '//' + location.hostname + ':' + location.port;
}

/**
 * Function will retrieve the root URL for where the APP resides.
 *
 * @returns {string} : the currently root url for the app
 */
function getAppRoot() {
	var DHISFolder = getDHISInstallFolder();
	return getHostRoot() + '/' + DHISFolder + '/apps/coursewriter';
}

/**
* Function will return the subfolder name for the DHIS installation on the server
* which is varies from DHIS installation to installation.
* ie, this function will return "dhis" in this url: http://localhost:8080/dhis/api/apps/takecourse/index.html
*/
function getDHISInstallFolder(){
  var pathArray = window.location.pathname.split( '/' );
  //console.log(pathArray[1]);
  return pathArray[1]
}

/**
 * Function will take an URL and a key parameter to search for,
 * then for the given key return its value.
 */
function getURLParameter(url, parameter_key)
{
	var url_query_string = url.search.substring(1);
	var url_variables = url_query_string.split('&');

	for (var i = 0; i < url_variables.length; i++)
	{
		var pair = url_variables[i].split('=');
		if (pair[0] == parameter_key)
		{
			return pair[1];
		}
	}
}

/**
 * Function will return an unique ID
 */
function getUniqueID() {
	var time = new Date().getTime();
	while (time == new Date().getTime());
	return new Date().getTime();
}

/**
 * Function will setup an instance of the "bloodhound" suggstioner and return it.
 *
 * @param div_id is the id of the div to add on bloodhound
 * @param name is the name used for this instance
 * @param data is the array of objects to use for suggestion
 * @param display_key_function is a function that will return what to display from an object from the data array
 * @param suggestion_function is a function that will return what to display in suggestion box from an object from the data array
 */
function setupBloodHound(div_id, name, data, display_key_function, suggestion_function) {
	var bh = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: data
	});

	// kicks off the loading/processing of `local` and `prefetch`
	bh.initialize();

	$('#' + div_id + ' .typeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: name,
			displayKey: display_key_function,
			// `ttAdapter` wraps the suggestion engine in an adapter that
			// is compatible with the typeahead jQuery plugin
			source: bh.ttAdapter(),
			templates :

			{
				suggestion: suggestion_function
			}
		});

	return bh;
}

/**
 * Function will check if the user currently trying to access app
 * has the right privilege level (admin or if groups can be created: customizer)
 *
 * If user is admin, then handler function is called
 */
function isCustomizer(handler) {
	// Create URL to fetch user data from (was not possible to use "fields" and "filters" here?)
	// If so then last part of URL would be: /api/me.json?fields=userCredentials[userAuthorityGroups]
	var DHISFolder = getDHISInstallFolder();
	var url = getHostRoot() + '/' + DHISFolder + '/api/me';

	// Get information as json object
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(user) {

		var isSuperUser = false;

		if(user.hasOwnProperty('userCredentials')) {
			// Someone logged in,
			// Need to check if user is "Superuser"
			var authority_groups = user['userCredentials']['userAuthorityGroups'];

			for(key in authority_groups) {
				if(authority_groups[key]['name'] === 'Superuser') {
					// This is a super user!
					isSuperUser = true;
					break;
				}
			}
		}


		if(isSuperUser) {
			// Here we have a super user, call handler function
			handler(true);
		} else {
			handler(false);
		}
	});
}

/**
 * Function will check if user is on mobile device and if so remove all classes that causes padding.
 */
function mobileCheck() {
	var check = false;
	//Script from http://detectmobilebrowsers.com/ - Unlicensed open source
	(function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);

//	if(check) {
		// If mobile need to remove all classes starting with col-xs-[0-99]
		$("[class^='col-xs-']").removeClass( function() {
			var to_remove = '', classes = this.className.split(' ');

			for(var i = 0; i < classes.length; i++ ) {
				// Filter out classes starting with col-xs-[0-99]
				if( /col-xs-\d{1,2}/.test( classes[i] ) ) {
					to_remove += classes[i] +' ';
				}
			}

			// Return all classes to be removed
			return to_remove;
		});
//	}
}

function navBarElements(){

}

function isCourseAttendant(handler){
	var DHISFolder = getDHISInstallFolder();
	var meurl = getHostRoot() + '/' + DHISFolder + '/api/me';
	var courseurl = getHostRoot() + '/' + DHISFolder +'/api/systemSettings/VJFS_courses';
	$.ajax({
		url: meurl,
		dataType: 'json'
	}).success(function(userinfo) {
		$.ajax({
			url: courseurl,
			dataType: 'json'
		}).success(function(courses) {
			var isAttendant = false;
			var userid = userinfo['id'];
			//console.log(userid);
			for(key in courses['courses']){
				for(keys in courses['courses'][key]['courseAttendants']){
					if(courses['courses'][key]['courseAttendants'][keys].attendantID === userid){
						isAttendant = true;
						break;
					}
				}
			}
			if(isAttendant){
				handler(true);
			} else {
				handler(false);
			}
		});

	});
}
function isCourseMentor(handler){
	var DHISFolder = getDHISInstallFolder();
	var meurl = getHostRoot() + '/' + DHISFolder + '/api/me';
	var courseurl = getHostRoot() + '/'+ DHISFolder +'/api/systemSettings/VJFS_courses';
	$.ajax({
		url: meurl,
		dataType: 'json'
	}).success(function(userinfo) {
		$.ajax({
			url: courseurl,
			dataType: 'json'
		}).success(function(courses) {
			var isMentor = false;
			var userid = userinfo['id'];
			//console.log(userid);
			for(key in courses['courses']){
				for(keys in courses['courses'][key]['courseMentors']){
					if(courses['courses'][key]['courseMentors'][keys].mentorID === userid){
						isMentor = true;
						break;
					}
				}
			}
			if(isMentor){
				handler(true);
			} else {
				handler(false);
			}
		});

	});
}
