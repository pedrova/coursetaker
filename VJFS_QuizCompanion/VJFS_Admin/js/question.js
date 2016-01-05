/**
 * Created by GladeJoa on 17.11.14.
 */

function getQuestionResourceURL() {
    var url = getHostRoot() + '/dhis/api/systemSettings/VJFS_questions';
    return url;
}

/**
 * Function will display question's for a given quiz.
 */
function displayQuestions(quiz) {

    // Display Question header and add new question button
    $('#quiz').append(' <label class="list-group-item active">Question</label>');
    $('#quiz').append('<ul class="list-group-item list-group" id="quizQuestion"></ul>');
    $('#quiz').append('<a href="question_text.html?quiz_id=' + quiz.quizID + '&course_id=' + quiz.courseID + '" class="btn-block btn btn-info">New Text Question</a>');
    $('#quiz').append('<a href="question_multiplechoice.html?quiz_id=' + quiz.quizID + '&course_id=' + quiz.courseID + '" class="btn-block btn btn-info">New Multiple Choice Question</a>');

    getQuestions(function(questions) {
        if(questions != null) {
            var quiz_questions = $.grep(questions['questions'], function(e){ return e.quizID == quiz['quizID']; });

            // Display question's if quiz has any
            for(key in quiz_questions) {
                var file = quiz_questions[key].questionType == 'text' ? 'question_text.html' : 'question_multiplechoice.html';
                var question = '<li class="list-group-item clearfix">';
                question += '<a href="' + file + '?question_id=' + quiz_questions[key].questionID + '&quiz_id=' + quiz.quizID + '&course_id=' + quiz.courseID + '">' + quiz_questions[key].questionTitle + '</a>';
                question += '<button type="button" class="btn btn-danger pull-right" id="deleteQuestion" onclick="deleteQuestion(' + quiz['quizID'] + ', ' + quiz_questions[key].questionID + ');">Delete</button>';
                question += '</li>';
                $('#quizQuestion').append(question);
            }
        }
    });
}

function getQuestions(handler) {
    // Get URL from where to fetch quiz's json
    var url = getQuestionResourceURL();

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

function setQuestions(questions, handler) {
    // Get URL from where to fetch courses json
    var url = getQuestionResourceURL();

    // Update courses on server
    $.ajax({
        type: "POST",
        url: url,
        data: questions,
        contentType: 'text/plain'
    }).success(function(data) {
        handler(data);
    }).error(function() {
        handler(null);
    });
}

function getQuestion(question_id, handler) {
    getQuestions(function(questions) {
        // Retrieve question based on question_id
        var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });

        // Result is an array, but should only be one element so using [0]
        if(question[0] == null) {
            handler(null);
            return;
        }

        // Get question from questions and call handler function on it
        handler(question[0]);
    });
}

function saveQuestion(course_id, quiz_id, question_id) {

    // Create URL to POST new quiz to
    var url = getQuestionResourceURL();

    // Retrieve quiz title and quiz level from form
    var questionTitle =  $('#questionTitle').val();
    var questionQuestion = $('#questionQuestion').val();
    var questionAnswer = $('#questionAnswer').val();
    var questionType = $('#questionType').val();

    var legal = true;

    // Title can't be empty
    if(questionTitle.isEmpty()) {
        $('#questionTitle').addClass("invalid");
        $('#questionTitle').val("");
        $('#questionTitle').prop('placeholder', 'This field must be filled out.');
        legal = false;
    }

    // Question can't be empty
    if(questionQuestion.isEmpty()) {
        $('#questionQuestion').addClass("invalid");
        $('#questionQuestion').val("");
        $('#questionQuestion').prop('placeholder', 'This field must be filled out.');
        legal = false;
    }

    if(!legal) return false;

    getQuestions(function(questions) {

        // Check what type of question we have
        if(questionType === 'text') {
            // Here we have a new text question

            // Check if this is the first quiz
            if(questions == null) {
                questions = { "questions" : [] };
            }

            if(question_id != null) {
                // Here we must update given quiz_id
                var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });
                question[0].questionTitle = questionTitle;
                question[0].questionQuestion = questionQuestion;
                question[0].questionAnswer = questionAnswer;
            } else {
                // Here we have a new quiz
                questions['questions'].push( {"questionID" : getUniqueID(), "quizID" : quiz_id, "course_id" : course_id, "questionTitle" : questionTitle,
                                               "questionType" : questionType, "questionQuestion" : questionQuestion, "questionAnswer" : questionAnswer } );
            }



        } else if(questionType === 'multiple') {
            // Here we have a new multiple choice question
            var num_alternatives = $('#alternatives').children('.alternative').length;

            // Must at least have one alternative
            if(num_alternatives == 0) {
                $('#alternatives').html('<span id="alternatives_invalid" style="color: red;">Must have at least 1 alternative.</span>');
                return false;
            }

            var alternativeIsEmpty = false;
            var questionAlternatives = [];

            // Retrieve all checkbox values and alternative values for all alternatives
            $('#alternatives').children('.alternative').each(function (index){
                var alternative_checked = $(this).find('#alternativeYN').is(':checked');
                var alternative_value = $(this).find('#alternativeValue').val();

                // Alternative must have a value
                // Mark all empty alternatives that they must have a value
                if(alternative_value.isEmpty()) {
                    $(this).find('#alternativeValue').attr('placeholder', 'This field must be filled out');
                    $(this).find('#alternativeValue').addClass('invalid');
                    $(this).find('#alternativeValue').val('');
                    alternativeIsEmpty = true;
                }

                questionAlternatives.push({"alternativeChecked" : alternative_checked, "alternativeValue" : alternative_value});
            });

            // Return if one or more of alternatives has no value
            if(alternativeIsEmpty) return false;

            // Check if this is the first question
            if(questions == null) {
                questions = { "questions" : [] };
            }

            if(question_id != null) {
                // Here we must update given question_id
                var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });
                question[0].questionTitle = questionTitle;
                question[0].questionQuestion = questionQuestion;
                question[0].questionAlternatives = questionAlternatives;
            } else {
                // Here we have a new question
                questions['questions'].push( {"questionID" : getUniqueID(), "quizID" : quiz_id, "course_id" : course_id, "questionTitle" : questionTitle,
                    "questionType" : questionType, "questionQuestion" : questionQuestion, "questionAlternatives" : questionAlternatives } );
            }
        } else {
            // Here we have undefined behaviour
            console.log("saveQuestion: type not defined");
            return false;
        }

        // Update questions on server and go to specific quiz for question
        setQuestions(JSON.stringify(questions), function() {
            window.location.href = getAppRoot() + '/content/quiz.html?course_id=' + course_id + '&quiz_id=' + quiz_id;
        });
    });
}

function deleteQuestion(quiz_id, question_id) {
    if(question_id == null) return;

    // Create URL to POST new courses to
    var url = getQuestionResourceURL();

    getQuestions(function(questions) {

        // Check if there exists questions
        if(questions != null) {

            // Check that question_id is valid
            var question = $.grep(questions['questions'], function(e){ return e.questionID == question_id; });
            if(question[0] == null) return;

            // Retrieve index into question array for question
            var question_index = questions['questions'].indexOf(question[0]);

            // Delete question from questions
            questions['questions'].splice(question_index, 1);

            // Update questions on server and go to quiz that contained question
            setQuestions(JSON.stringify(questions), function() {
                getQuiz(quiz_id, function(quiz) {
                    window.location.href = getAppRoot() + '/content/quiz.html?course_id=' + quiz['courseID'] + '&quiz_id=' + quiz_id;
                })
            });
        }
    });
}

function addAlternative(alternative_checked, alternative_value) {
    // Remove error message if one exists
    $('#alternatives_invalid').remove();

    // Add on a new alternative
    var alternative_id = getUniqueID();
    $('#alternatives').append('<div class="row form-group alternative" id="' + alternative_id + '">' +
                                '<div class="col-lg-9">' +
                                    '<div class="input-group pull-left">' +
                                        '<span class="input-group-addon">' +
                                            'Correct? <input type="checkbox"  id="alternativeYN">' +
                                        '</span>' +
                                        '<input type="text" class="form-control" id="alternativeValue" placeholder="Alternative?">' +
                                    '</div>' +
                                '</div>' +
                                '<div class="col-lg-3">' +
                                    '<div class="input-group pull-right">' +
                                        '<button type="button" class="btn btn-danger" onclick="deleteAlternative(' + alternative_id + ');">Delete</button>' +
                                    '</div>' +
                                '</div>' +
                            '</div>');

    // Add on checked and value if they are set
    if(alternative_checked != null) {
        $('#' + alternative_id).find('#alternativeYN').prop('checked', alternative_checked);
    }
    if(alternative_value != null) {
        $('#' + alternative_id).find('#alternativeValue').val(alternative_value);
    }
}

function deleteAlternative(alternative_id) {
    $('#' + alternative_id).remove();
}
