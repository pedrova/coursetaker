
function getUserQuizes(handler) {

    getMyUserName(function(user){

        var username = user.userCredentials.code;
        // Get URL from where to fetch quiz's json
        var DHISFolder = getDHISInstallFolder();
        var url = getHostRoot() + '/' + DHISFolder + '/api/dataStore/coursetaker/VJFS_'+username+'_quizes';

        // Get quiz's as json object and on success use handler function
        $.ajax({
            url: url,
            dataType: 'json'
        }).success(function(quizes) {
			handler(quizes);
        }).error(function(error) {
            handler(null);
        });


    });
}
function setUserQuizes(exists, quizes, handler) {
    var sendType = "";
    if(exists == false){
      sendType = "POST"

    } else {
      sendType = "PUT"
    }

    getMyUserName(function(user){

        var username = user.userCredentials.code;
        var DHISFolder = getDHISInstallFolder();
        var url = getHostRoot() + '/' + DHISFolder + '/api/dataStore/coursetaker/VJFS_'+username+'_quizes';

      // Update courses on server
      $.ajax({
        type: sendType,
        url: url,
        data: quizes,
        contentType: 'application/json'
      }).success(function(data) {
        handler(data);
      }).error(function() {
        handler(null);
      });

    });
}
function getImages(handler) {
    // Get URL from where to fetch quiz's json
    var url = getImageResourceURL();

    // Get quiz's as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(images) {
        handler(images);
    }).error(function(error) {
        handler(null);
    });
}
function getImageResourceURL(){
    var quiz_id = getURLParameter(window.location, 'quiz_id');
    var DHISFolder = getDHISInstallFolder();
    var url = getHostRoot() + '/' + DHISFolder + '/api/systemSettings/VJFS_Images_' + quiz_id;
    //console.log(url);
    return url;
}
function saveUserQuiz(quiz_id) {
    // Create URL to POST new quiz to

    getUserQuizes(function(quizes) {

    var userQuizesExist = true;
     var url = window.location;
     var course_id = getURLParameter(url, 'course_id');
          // Check if this is the first quiz
        if(quizes == null) {
          userQuizesExist = false;


            var text = '{ "quizes" : [' +
            '{ "quizID":"'+quiz_id+'" , "courseID":"'+course_id+'" } ]}';


             quizes = JSON.parse(text);
        } else {

          //  console.log(quizes['quizes'].length)
             var isUpdated = false;
            for(var i = 0; i < quizes['quizes'].length; i++) {


                if(quizes['quizes'][i].quizID === quiz_id){
                    isUpdated = true;
                    break;
                }

            }

            if(!isUpdated){
                quizes['quizes'].push( {"quizID" : quiz_id, "courseID": course_id} );
            }

        }

        // Update quizes on server and go to menu over quizes
        setUserQuizes(userQuizesExist,JSON.stringify(quizes), function() {
          showFeedback([]);
          if ($('#nextQuizId').val() == 0) {
            //setUserLevel();
          }
            //window.location.href = getAppRoot();
        });
     });
}

function getUserQuestions(handler) {


    getMyUserName(function(user){

		if(user != null){

			var username = user.userCredentials.code;
		// Get URL from where to fetch quiz's json
    var DHISFolder = getDHISInstallFolder();
			var url = getHostRoot() + '/' + DHISFolder + '/api/systemSettings/VJFS_'+username+'_questions';

			// Get question's as json object and on success use handler function
			$.ajax({
				url: url,
				dataType: 'json'
			}).success(function(questions) {
				handler(questions);
			}).error(function(error) {
				handler(null);
			});
		}
    });
}


function setUserQuestions(exists, questions, handler) {
    var sendType = "";
    if(exists == false){
      sendType = "POST"

    } else {
      sendType = "PUT"
    }

     getMyUserName(function(user){

        var username = user.userCredentials.code;
    // Get URL from where to fetch courses json
    var DHISFolder = getDHISInstallFolder();
        var url = getHostRoot() + '/'+ DHISFolder +'/api/dataStore/coursetaker/VJFS_'+username+'_questions';

    // Update courses on server
        $.ajax({
            type: sendType,
            url: url,
            data: questions,
            contentType: 'application/json'
        }).success(function(data) {
            handler(data);
        }).error(function() {
            handler(null);
        });

    });
}


function saveUserAnswers(answers){

    getUserQuestions(function(questions) {

        // Check if this is the first quiz
        if(questions == null) {
           questions = { "questions" : answers };

        }else if(questions.length == 0){
          questions = { "questions" : answers };
        }
         else {
            //questions['questions'] = questions['questions'].concat( answers );

          	// Update questions if they've been answered before
          	for(var i = 0; i < answers.length; i++) {
          		var isUpdated = false;

          		for(var j = 0; j < questions['questions'].length; j++) {
          			if(answers[i]['questionID'] == questions['questions'][j]['questionID']) {
          				questions['questions'][j] = answers[i];
          				isUpdated = true;
          				break;
          			}
          		}

          		if(!isUpdated) {
          			questions['questions'].push( answers[i] );
          		}
          	}

        }
        // Update quizes on server and go to menu over quizes

        setUserQuestions(JSON.stringify(questions), function() {
 			window.location.href = getAppRoot();
        });

    });
}


function getMyUserName(handler) {
    // Get URL from where to fetch quiz's json
    var DHISFolder = getDHISInstallFolder();
    var url = getHostRoot() + '/' + DHISFolder +'/api/me';

    // Get the users information
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(questions) {
        handler(questions);
    }).error(function(error) {
        handler(null);
    });
}
