

function displayCourses() {

	// Get URL to retrieve json object from
	var url = getHostRoot() + '/dhis/api/systemSettings/courses';

  getUserLevel(function(level){
    console.log('level: '+level);

 	getMyUserName(function(user){

		var userr = user.userCredentials.code;

		// Get courses as json object
		getCourses(function(courses) {

			if(courses != null) {

				// Display courses
				for(key in courses['courses']) {

					if($("#courses:contains('"+courses['courses'][key].courseTitle+"')").length == 0) {

						var attendants =  courses['courses'][key].courseAttendants;
								var l = '<ul class="list-group-item" id='+courses['courses'][key].courseID+'_list>'
								l +=  '<div class="panel-heading"><h4>'+ courses['courses'][key].courseTitle +'</h4></div>'
								l += '<ul class="list-group-item-clearfix" id='+courses['courses'][key].courseID+'></ul>'
								l += '</ul>'

								$('#courses').append(l);
					}

					var attendants =  courses['courses'][key].courseAttendants;
					displayQuizesHelper(courses['courses'][key], level);

				}
				//TEST

				var div = document.getElementById('courses')
				// get an array of child nodes
				divChildren = div.childNodes;

				//loop all courses added to the list
				for (var i=0; i<divChildren.length; i++) {

					var found = 0;
					for(key2 in courses['courses']) {


						if(courses['courses'][key2].courseID+'_list' === divChildren[i].id){
							found = 1;
							break;
						}

					}
					if(found == 0){
						divChildren[i].remove();
					}
					found = 0;

				}
			}
		});

	});

  });

}


function getMyUserName(handler) {
    // Get URL from where to fetch quiz's json
    var url = getHostRoot() + '/dhis/api/me';

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


function displayQuizesHelper(course, level){

	getQuizes(function(quizes) {

		if(quizes != null) {

			var course_quizes = $.grep(quizes['quizes'], function(e){ return e.courseID == course['courseID']; });

			course_quizes.sort(function(a, b) {
				if(a.quizLevel < b.quizLevel) return -1;
				if(a.quizLevel > b.quizLevel) return 1;
				return 0;
			});


			//counter for labeling quizes with numberation instead ot quizlevel
			var counter = 0;
			for(quiz_key in course_quizes) {
				counter++;

				if($("#"+course['courseID']+":contains('"+course_quizes[quiz_key].quizTitle+"')").length == 0) {

						if(('#'+course['courseID']).length){

							var t ='';

							if(course_quizes[quiz_key].quizLevel == 1 && course['courseLevel'] <= level){
								t += '<a href="pages/questions.html?quiz_id='+ course_quizes[quiz_key].quizID + '&course_id=';
								t += course['courseID']+'" id="'+course_quizes[quiz_key].quizID+'_list" class="list-group-item">';
							}else{
								t += '<a href="pages/questions.html?quiz_id='+ course_quizes[quiz_key].quizID + '&course_id=';
								t += course['courseID']+'" id="'+course_quizes[quiz_key].quizID+'_list" class="list-group-item">';
								//t += '<a href="#';
								//trying to fix next course activation
								//t += '" id="'+course_quizes[quiz_key].quizID+'_list" class="list-group-item enabled">';
								//doing it like this makes you able to take all courses
								//t += '" id="'+course_quizes[quiz_key].quizID+'_list" class="list-group-item enabled">';
							}

							//this line makes the quizes look like: ex 1(Quizlevel)- QuizTitle
							//t += course_quizes[quiz_key].quizLevel+' - '+course_quizes[quiz_key].quizTitle;
							//this line makes the quiztitle to look like numeration + QuizTitle ie: second quiz in course: "2 - QuizTitle"
							t += counter+'- '+course_quizes[quiz_key].quizTitle;
							t += '<div id='+course_quizes[quiz_key].quizID+'></div>'
							t +='</a>';


							$('#'+course['courseID']).append(t)

						}

				}

			}


			//TEST


			if(('#'+course['courseID']).length){

				var div = document.getElementById(course['courseID'])
				// get an array of child nodes

				if(div !== null){

					if(div.childNodes.length){

						divChildren = div.childNodes;

						//loop all courses added to the list
						for (var i=0; i<divChildren.length; i++) {


							var found = 0;
								for(quiz_key2 in course_quizes) {

									if(course_quizes[quiz_key2].quizID+'_list' === divChildren[i].id){
										found = 1;
										break;
									}

								}
								if(found == 0){
									divChildren[i].remove();
								}
								found = 0;
						}
					}
				}
			}
  		}

		//Add green label for finished quiz
   		getUserQuizes(function(user_quizes) {

			if(user_quizes != null){

				for(key in user_quizes['quizes']){

					if(('#'+user_quizes['quizes'][key].quizID).length){

						if(user_quizes['quizes'][key].quizID){
							document.getElementById(user_quizes['quizes'][key].quizID).innerHTML = '<div class="label label-success">Completed</div>';
						}
					}

				}

			}

			for(i=2; i<20+1; i++){

				getAmountQuizesOnLevel(course,course_quizes,i-1,function(t,amount){

					var approved = 0;

					for(quiz_key in course_quizes) {

						if(course_quizes[quiz_key].quizLevel == t){

							if(document.getElementById(course_quizes[quiz_key].quizID)){
								if((document.getElementById(course_quizes[quiz_key].quizID).innerHTML) == '<div class="label label-success">Completed</div>'){
									approved = approved +1;
								}
							}

						}

					}

					if(amount === approved){

						for(quiz_key in course_quizes) {

							if(course_quizes[quiz_key].quizLevel ==i ){
								//'<a href="pages/questions.html?quiz_id='+ course_quizes[quiz_key].quizID + '&course_id=';
								//t += course['courseID']+'

								$('#'+course_quizes[quiz_key].quizID+"_list").removeClass('list-group-item disabled').addClass('list-group-item');
								document.getElementById(course_quizes[quiz_key].quizID+"_list").href = 'pages/questions.html?quiz_id='+ course_quizes[quiz_key].quizID + '&course_id='+course['courseID'];

							}else{



							}
						}

					}
					approved = 0;

				});
			}

   		});












   		//Add yellow label for quizes pending correction
		//Add red label for quizes that were not approved
   		getUserQuestions(function(user_questions){

			if(user_questions != null){

				for(key in user_questions['questions']){


					if(user_questions['questions'][key].corrected === "true"){

						if(('#'+user_questions['questions'][key].quizID).length){

							$('#'+user_questions['questions'][key].quizID).html("");
							$('#'+user_questions['questions'][key].quizID).append('<span class="label label-danger">Wrong</span>');

						}

					}else{

						if(('#'+user_questions['questions'][key].quizID).length){

							$('#'+user_questions['questions'][key].quizID).html("");
							$('#'+user_questions['questions'][key].quizID).append('<span class="label label-warning">Pending correction</span>');

						}
					}
				}
   			}

   		});

 	});

}

function getAmountQuizesOnLevel(course,course_quizes,level,callback){

		var onCourse = 0;

		for(quiz_key in course_quizes) {

				if(('#'+course['courseID']).length){

					if(course_quizes[quiz_key].quizLevel == level){

						onCourse = onCourse + 1;
					}
				}


		}
		callback(level,onCourse);

}




/**
* Function will retrieve all courses as a json object
* and call the handler function with the courses.
*/
function getCourses(handler) {
	// Get URL from where to fetch courses json
	var url = getHostRoot() + '/dhis/api/systemSettings/VJFS_courses';

	// Get courses as json object and on success use handler function
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(courses) {
		handler(courses);
	}).error(function(error) {
		handler(null);
	});
}

function showPoints(){
	getUserQuizes(function(userQuizes){
		var points = 0;
		if(userQuizes!=null){
			getCourses(function(courses){
				for(key in userQuizes['quizes']){
					for(keys in courses['courses']){
						if(userQuizes['quizes'][key].courseID == courses['courses'][keys].courseID){
							points += 1*(courses['courses'][keys].courseLevel)
						}
					}
				}
				//console.log(points);
				if(points <= 0){
					$('#user_score').append('<h4> Your total score: ' + points +', start taking courses and get points!</h4>');
				} else {
					$('#user_score').append('<h4> Your total score: ' + points +'</h4>');
				}
				
			});
		} else {
			$('#user_score').append('<h4> Your total score: ' + points +', start taking courses and get points!</h4>');
		}
		
	});
}

function getQuizes(handler) {

	// Get URL from where to fetch quiz's json
	var url = getHostRoot() + '/dhis/api/systemSettings/VJFS_quizes';

	// Get quiz's as json object and on success use handler function
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(quizes) {
		handler(quizes);
	}).error(function(error) {
		handler(null);
	});
}


function getQuiz(quiz_id, handler) {

	getQuizes(function(quizes) {

    // get quizes in this particular course
    var url = window.location;
    var courseId = getURLParameter(url, 'course_id');
    var quizId = getURLParameter(url, 'quiz_id');
    if (courseId > 0 && quizId > 0) {
      console.log("yep");
      var course_quizes = $.grep(quizes['quizes'], function (e) {
        return e.courseID == courseId;
      });

      course_quizes.sort(function (a, b) {
        if (a.quizLevel < b.quizLevel) return -1;
        if (a.quizLevel > b.quizLevel) return 1;
        return 0;
      });

      var quizesInCourse = [];

      for(quiz_key in course_quizes) {
        // gather quiz ids for this particular course
        quizesInCourse.push(course_quizes[quiz_key].quizID);
      }
      console.log(quizesInCourse);

      $.each(quizesInCourse, function (index, value) {
        if (value == quizId) {
          index = index + 1;
          if (index < quizesInCourse.length) {
            // if it's not the last element, get next element (next quiz id)
            var nextQuizId = quizesInCourse[index];
            // and update hidden element
            $('#nextQuizId').val(nextQuizId);
            return false;
          } else {
            // last element, no more quizes in this course
            $('#nextQuizId').val(0);
          }
        }
      });
    }

		// Retrieve quiz based on quiz_id
		var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });

		// Result is an array, but should only be one element so using [0]
		if(quiz[0] == null) {
			handler(null);;
			return;
		}
		// Get quiz from quizes and call handler function on it
		handler(quiz[0]);
	});
}
