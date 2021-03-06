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
* Function will return the subfolder name for the DHIS installation on the server
* which is varies from DHIS installation to installation.
* ie, this function will return "dhis" in this url: http://localhost:8080/dhis/api/apps/takecourse/index.html
*/
function getDHISInstallFolder(){
  var pathArray = window.location.pathname.split( '/' );
  //console.log(pathArray[1]);
  var pathName = pathArray[1];
  //console.log(pathName);
  if(pathName == 'apps'){
    pathName = '';
  }
  return pathName
}

/**
* Function will retrieve the root URL for where the APP resides.
*
* @returns {string} : the currently root url for the app
*/
function getAppRoot() {
   var DHISFolder = getDHISInstallFolder();
	return getHostRoot() + '/' + DHISFolder + '/apps/coursetaker';
}

/**
 * Function will check if the user currently trying to access app
 * has the right privilege level (admin or if groups can be created: customizer)
 *
 * If user is admin, then handler function is called
 */

function navBarElements(){
	//document.getElementById("showcourse").style.display = "none";
}


//This method is used for opening up the QUIZ - window and the WORKING-window into two separate halves of the window
var mainWindow, quizWindow;

function openWin() {
  var DHISFolder = getDHISInstallFolder();
  if(DHISFolder == ''){
    mainWindow = window.open("/"+ DHISFolder + "/", "mainNavigationWindow", "width=250, height=250, location=yes, scrollbars=yes");
  }
  mainWindow = window.open("/"+ DHISFolder + "/", "mainNavigationWindow", "width=250, height=250, location=yes, scrollbars=yes");
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

function getUserLevel(handler) {
  getMyUserName(function(user){

    var username = user.userCredentials.code;
    // Get URL from where to fetch quiz's json
     var DHISFolder = getDHISInstallFolder();
    var url = getHostRoot() + '/'+ DHISFolder +'/api/systemSettings/VJFS_'+username+'_level';

    // Get quiz's as json object and on success use handler function
    $.ajax({
      url: url,
      localCache : true,
      cacheTTL : 0.1,
      isCacheValid : function(){  
        return true;
      },
      
      dataType: 'json'
    }).success(function(level) {
      handler(level.level);
    }).error(function(level) {
      handler(1);
    });

  });
}


