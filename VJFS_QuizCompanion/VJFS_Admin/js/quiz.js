/**
 * Created by GladeJoa on 16.11.14.
 */


function getQuizResourceURL() {
    var url = getHostRoot() + '/dhis/api/systemSettings/VJFS_quizes';
    return url;
}

/**
 * Function will display quiz's for a given course.
 */
function displayQuizes(course) {

    // Display Quiz header and add new quiz button
    $('#course').append(' <label class="list-group-item active">Quiz</label>');
    $('#course').append('<ul class="list-group-item list-group" id="courseQuiz"></ul>');
    $('#course').append('<a href="quiz.html?course_id=' + course.courseID + '" class="btn btn-block btn btn-info">New Quiz</a>');


    getQuizes(function(quizes) {

        if(quizes != null) {
            var course_quizes = $.grep(quizes['quizes'], function(e){ return e.courseID == course['courseID']; });

            // Display quiz's if course has any
            for(key in course_quizes) {
                var quiz = '<li class="list-group-item clearfix">';
                quiz += '<a href="quiz.html?quiz_id=' + course_quizes[key].quizID + '&course_id=' + course['courseID'] + '">' + course_quizes[key].quizTitle + '</a>';
                quiz += '<button type="button" class="btn btn-danger pull-right" id="deleteQuiz" onclick="deleteQuiz(' + course['courseID'] + ', ' + course_quizes[key].quizID + ');">Delete</button>';
                quiz += '</li>';
                $('#courseQuiz').append(quiz);
            }
        }
    });
}

function getQuizes(handler) {
    // Get URL from where to fetch quiz's json
    var url = getQuizResourceURL();

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
function getImages(handler) {
    // Get URL from where to fetch quiz's json
    var quiz_id = getURLParameter(window.location, 'quiz_id');

    var url = getImageResourceURL(quiz_id);

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
function getImageResourceURL(quiz_id){
    //var quiz_id = getURLParameter(window.location, 'quiz_id');
    var url = getHostRoot() + '/dhis/api/systemSettings/VJFS_Images_' + quiz_id;
    //console.log(url);
    return url;
}

function setQuizes(quizes, handler) {
    // Get URL from where to fetch courses json
    var url = getQuizResourceURL();

    // Update courses on server
    $.ajax({
        type: 'POST',
        url: url,
        data: quizes,
        contentType: 'text/plain'
    }).success(function(data) {
        handler(data);
    }).error(function() {
        handler(null);
    });
}

function getQuiz(quiz_id, handler) {
    getQuizes(function(quizes) {
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
function setImages(quizID, images, handler){
     var url = getImageResourceURL(quizID);

    // Update quiz images on server
    $.ajax({
        type: 'POST',
        url: url,
        data: images,
        contentType: 'text/plain'
    }).success(function(data) {
        handler(data);
    }).error(function() {
        handler(null);
    });
}
function saveQuiz(course_id, quiz_id) {
    // Create URL to POST new quiz to
    var url = getQuizResourceURL();

    // Retrieve quiz title and quiz level from form
    var quizTitle =  $('#quizTitle').val();
    var quizLevel = $('#quizLevel').val();
    var quizDescription = JSON.stringify($('#quizDescription').summernote('code'));

    //console.log("quiz descrption stringified: "+ JSON.stringify($('#quizDescription').summernote('code')));
    //console.log("quiz descrption parsed: "+ JSON.parse($('#quizDescription').summernote('code')));
    var images = {
        "images": []
    };
    var imagesReplaced = false;
    var description2 = $('#quizDescription').summernote('code');
    //console.log(description2);
    var re = /<img.+?px;">/g;
    var imagesFound = description2.match(re);
   
    if(imagesFound != null){
        imagesReplaced = true;
         //console.log(imagesFound.length);
         for (i = 0; i < imagesFound.length; i++) {
            images['images'].push( {"imageContent" : imagesFound[i]} );
            //console.log()
        }
    }

    var quizReplaceImages = description2.replace(re, ' imageplaceholder ');
    //console.log(quizReplaceImages);
    //console.log(quizReplaceImages);

    // Quiz title cannot be empty: tell user and return
    if(quizTitle.isEmpty()) {
        $('#quizTitle').addClass('invalid');
        $('#quizTitle').val("");
        $('#quizTitle').prop('placeholder', 'This field must be filled out.');
        return false;
    }

    getQuizes(function(quizes) {

        var quizID2 = '';
        // Check if this is the first quiz
        if(quizes == null) {
            quizes = { "quizes" : [] };
        }

        if(quiz_id != null) {
            // Here we must update given quiz_id
            var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });
            quiz[0].quizTitle = quizTitle;
            quiz[0].quizLevel = quizLevel;
            if(imagesReplaced == true){
                quiz[0].quizDescription = JSON.stringify(quizReplaceImages);

            } else {
                 quiz[0].quizDescription = quizDescription;
            }
            quizID2 = getURLParameter(window.location, 'quiz_id');
        } else {
            quizID2 = getUniqueID();
            // Here we have a new quiz
            if(imagesReplaced == true){
                quizes['quizes'].push( {"quizID" : quizID2, "courseID" : course_id, "quizTitle" : quizTitle, "quizDescription" : JSON.stringify(quizReplaceImages), "quizLevel" : quizLevel } );

            } else {
                quizes['quizes'].push( {"quizID" : quizID2, "courseID" : course_id, "quizTitle" : quizTitle, "quizDescription" : quizDescription, "quizLevel" : quizLevel } );

            }
        }

        // Update quizes on server and go to menu over quizes
        
        setQuizes(JSON.stringify(quizes), function() {
            setImages(quizID2, JSON.stringify(images), function() {
                window.location.href = getAppRoot() + '/content/course.html?course_id=' + course_id;
            });
        });
        
        //console.log("description2 : " + description2);
    });
}

function deleteQuiz(course_id, quiz_id) {
    if(quiz_id == null) return;

    // Create URL to POST new courses to
    var url = getQuizResourceURL();

    getQuizes(function(quizes) {

        // Check if there exists courses
        if(quizes != null) {

            // Check that course_id is valid
            var quiz = $.grep(quizes['quizes'], function(e){ return e.quizID == quiz_id; });
            if(quiz[0] == null) return;

            // Check that course doesn't contain question's
            getQuestions(function(questions) {
                var delete_quiz = true;

                if(questions != null) {
                    for(key in questions['questions']) {
                        if(questions['questions'][key].quizID == quiz_id) {
                            delete_quiz = false;
                            break;
                        }
                    }
                }

                if(delete_quiz) {
                    // Retrieve index into courses array for course
                    var quiz_index = quizes['quizes'].indexOf(quiz[0]);

                    // Delete course from courses
                    quizes['quizes'].splice(quiz_index, 1);

                    // Update courses on server and go to menu over courses
                    setQuizes(JSON.stringify(quizes), function() {
                        window.location.href = getAppRoot() + '/content/course.html?course_id=' + course_id;
                    });
                } else {
                    alert("Can't delete: " + quiz[0].quizTitle + " cause it contains questions.");
                }
            });
        }
    });
}