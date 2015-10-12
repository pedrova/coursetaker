/**
* Function will retrieve the root URL for domain it's running on.
*
* @returns {string} : the currently root hostname
*/
function getHostRoot() {
	return location.protocol + '//' + location.hostname;
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
	return getHostRoot() + '/apps/VJFS_QuizCompanion/VJFS_User';
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
	var url = getHostRoot() + '/api/me';

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
	var meurl = getHostRoot() + '/api/me';
	var courseurl = getHostRoot() + '/api/systemSettings/VJFS_courses';
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
	var meurl = getHostRoot() + '/api/me';
	var courseurl = getHostRoot() + '/api/systemSettings/VJFS_courses';
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

//This method is used for opening up the QUIZ - window and the WORKING-window into two separate halves of the window
var mainWindow, quizWindow;

function openWin() {
  mainWindow = window.open("/", "mainNavigationWindow", "width=250, height=250, location=yes, scrollbars=yes");
  quizWindow = window.open("takecourse.html", "quizPanel", "width=250, height=250, location=yes, scrollbars=yes");
  if (!quizWindow || quizWindow.closed
    || typeof quizWindow.closed == 'undefined') {
    // First Checking Condition Works For IE & Firefox
    // Second Checking Condition Works For Chrome
    alert("Popup Blocker is enabled! Please add this site to your exception list.");
  } else {
    quizWindow.resizeTo(400, screen.height);
    mainWindow.resizeTo(screen.width - 400, screen.height);
    quizWindow.moveTo(screen.width - 400, 100);
    mainWindow.moveTo(0, 100);
    mainWindow.focus();
    quizWindow.focus();
  }

}

// temp function (will eventually be removed) in case we need to reset user1's quiz data
function resetData() {
  getMyUserName(function(user){
    var username = user.userCredentials.code;
    var url = getHostRoot() + '/api/systemSettings/VJFS_'+username+'_quizes';
    var data = JSON.stringify({"quizes": []});

    $.ajax({
      type: "POST",
      url: url,
      data: data,
      contentType: 'text/plain'
    }).success(function(data) {
      console.log("data reset");
    }).error(function() {
      console.log("error resetting data");
    });

    var levelUrl = getHostRoot() + '/api/systemSettings/VJFS_'+username+'_level';
    var levelData = JSON.stringify({"level": 1});

    // Update level on server
    $.ajax({
      type: 'POST',
      url: levelUrl,
      data: levelData,
      contentType: 'text/plain'
    }).success(function(data) {
      console.log('user level reset');
    }).error(function() {
      console.log('error resetting user level');
    });
  });
}

function setInitialData() {
  var urlCourses = getHostRoot() + '/api/apps/coursetaker/courses.txt';
  var urlQuizes = getHostRoot() + '/api/apps/coursetaker/quizes.txt';
  var urlQuestions = getHostRoot() + '/api/apps/coursetaker/questions.txt';

  var urlPostCourses = getHostRoot() + '/api/systemSettings/VJFS_courses';
  var urlPostQuizes = getHostRoot() + '/api/systemSettings/VJFS_quizes';
  var urlPostQuestions = getHostRoot() + '/api/systemSettings/VJFS_questions';

  $.ajax({
    url: urlCourses,
    dataType: 'json'
  }).success(function(courses) {
    var courses = JSON.stringify(courses);
    $.ajax({
      type: "POST",
      url: urlPostCourses,
      data: courses,
      contentType: 'text/plain'
    }).success(function(data) {
      console.log("courses posted!");
    }).error(function() {
      console.log("error posting courses");
    });
  }).error(function(error) {
    console.log("error getting courses");
  });

  $.ajax({
    url: urlQuizes,
    dataType: 'json'
  }).success(function(quizes) {
    var quizes = JSON.stringify(quizes);
    $.ajax({
      type: "POST",
      url: urlPostQuizes,
      data: quizes,
      contentType: 'text/plain'
    }).success(function(data) {
      console.log("quizes posted!");
    }).error(function() {
      console.log("error posting quizes");
    });
  }).error(function(error) {
    console.log("error getting quizes");
  });

  $.ajax({
    url: urlQuestions,
    dataType: 'json'
  }).success(function(questions) {
    var questions = JSON.stringify(questions);
    $.ajax({
      type: "POST",
      url: urlPostQuestions,
      data: questions,
      contentType: 'text/plain'
    }).success(function(data) {
      console.log("questions posted!");
    }).error(function() {
      console.log("error posting questions");
    });
  }).error(function(error) {
    console.log("error getting questions");
  });
}

function getUserLevel(handler) {
  getMyUserName(function(user){

    var username = user.userCredentials.code;
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/api/systemSettings/VJFS_'+username+'_level';

    // Get quiz's as json object and on success use handler function
    $.ajax({
      url: url,
      dataType: 'json'
    }).success(function(level) {
      handler(level.level);
    }).error(function(level) {
      handler(1);
    });

  });
}

function setUserLevel() {
  getUserLevel(function(level){

    getMyUserName(function(user){

      var username = user.userCredentials.code;

      var url = getHostRoot() + '/api/systemSettings/VJFS_'+username+'_level';

      var data = JSON.stringify({"level": level+1});

      // Update level on server
      $.ajax({
        type: 'POST',
        url: url,
        data: data,
        contentType: 'text/plain'
      }).success(function(data) {
        console.log('User level set!');
      }).error(function() {
        console.log('Error setting user level');
      });

    });

  });
}
