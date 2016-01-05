/**
* Function will retrieve the root URL for domain it's running on.
*
* @returns {string} : the currently root hostname
*/
function getHostRoot() {
	return location.protocol + '//' + location.hostname + ':' + location.port;
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
* Function will retrieve the root URL for where the APP resides.
*
* @returns {string} : the currently root url for the app
*/
function getAppRoot() {
	return getHostRoot() + '/dhis/api/apps/VJFS_QuizCompanion/VJFS_User';
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
	var url = getHostRoot() + '/dhis/api/me';

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
function navBarElements(){
	isCourseAttendant(function(isCourseAttendant) {
		if(!isCourseAttendant){
			document.getElementById("showcourse").style.display = "none";
			console.log();
		}
	});
	isCourseMentor(function(isCourseMentor) {
		if(!isCourseMentor){
			document.getElementById("showmentor").style.display = "none";
		}
	});
	isCustomizer(function(isCustomizer) {
		if(!isCustomizer) {
			document.getElementById("showadmin").style.display = "none";
			document.getElementById("showstat").style.display = "none";
		}
	});
}

function isCourseAttendant(handler){
	var meurl = getHostRoot() + '/dhis/api/me';
	var courseurl = getHostRoot() + '/dhis/api/systemSettings/VJFS_courses';
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
	var meurl = getHostRoot() + '/dhis/api/me';
	var courseurl = getHostRoot() + '/dhis/api/systemSettings/VJFS_courses';
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