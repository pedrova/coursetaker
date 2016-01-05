/**
 * Created by GladeJoa on 19.11.14.
 */

function displayAttendants(course) {
    // For auto completion of finding attendant's username
    getUsers(function(users){

        // Setup "Bloodhound" auto suggestion thingy
        setupBloodHound('bloodhound_user', 'users', users['users'], function(user) {
            return user['userCredentials']['code'];
        }, function(user) {
            return user['name'] + ' (' + user['userCredentials']['code'] + ')';
        });

        // Add on attendants for course
        if(course['courseAttendants']) {
            for(var i = 0; i < course['courseAttendants'].length; i++) {
                for(var j = 0; j < users['users'].length; j++) {

                    if(users['users'][j].hasOwnProperty('userCredentials')
                        && (course['courseAttendants'][i]['attendantUsername'] == users['users'][j]['userCredentials']['code'])) {

                        var attendantUsername = course['courseAttendants'][i]['attendantUsername'];
                        var attendantName = course['courseAttendants'][i]['attendantName'];

                        var user = '<li class="list-group-item clearfix">';
                        user += '<label>' + attendantName + ' (' + attendantUsername + ')</label>';
                        user += '<button type="button" class="btn btn-danger pull-right" id="deleteAttendant"';
                        user += 'onclick="deleteAttendant(' + course['courseID'] + ', \'' + attendantUsername + '\');">Delete</button>';
                        user += '</li>';
                        $('#attendants').append(user);

                        continue;
                    }
                }
            }
        }
    });

    // Add on dropdown box for attendants
    $('#courseContainer').append(
        '<div id="attendants">'+
            '<label class="list-group-item active">Attendants</label>' +
            '<form role="form" class="list-group-item" id="attendantForm">' +
                '<div class="form-group">' +
                    '<div id="bloodhound_user">' +
                        '<input class="typeahead form-control" id="attendantUsername" type="text" placeholder="Attendant name">' +
                    '</div>' +
                    '<br>' +
                    '<button type="button" class="btn btn-info" onclick="addAttendant(' + course['courseID'] + ');">Add Attendant</button>' +
                '</div>' +
            '</form>' +
        '</div>');
}

function displayMentors(course) {

    // For auto completion of finding mentors username
    getUsers(function(users){

        // Setup "Bloodhound" auto suggestion thingy
        setupBloodHound('bloodhound_mentor', 'mentors', users['users'], function(user) {
            return user['userCredentials']['code'];
        }, function(user) {
            return user['name'] + ' (' + user['userCredentials']['code'] + ')';
        });

        // Add on mentors for course
        if(course['courseMentors']) {
            for(var i = 0; i < course['courseMentors'].length; i++) {
                for(var j = 0; j < users['users'].length; j++) {

                    if(users['users'][j].hasOwnProperty('userCredentials')
                        && (course['courseMentors'][i]['mentorUsername'] == users['users'][j]['userCredentials']['code'])) {

                        var mentorUsername = course['courseMentors'][i]['mentorUsername'];
                        var mentorName = course['courseMentors'][i]['mentorName'];

                        var user = '<li class="list-group-item clearfix">';
                        user += '<label>' + mentorName + ' (' + mentorUsername + ')</label>';
                        user += '<button type="button" class="btn btn-danger pull-right" id="deleteMentor"';
                        user += 'onclick="deleteMentor(' + course['courseID'] + ', \'' + mentorUsername + '\');">Delete</button>';
                        user += '</li>';
                        $('#mentors').append(user);

                        continue;
                    }
                }
            }
        }
    });

    // Add on dropdown box for mentors
    $('#courseContainer').append(
        '<div id="mentors">'+
            '<label class="list-group-item active">Mentors</label>' +
            '<form role="form" class="list-group-item" id="mentorsForm">' +
                '<div class="form-group">' +
                    '<div id="bloodhound_mentor">' +
                        '<input class="typeahead form-control" id="mentorUsername" type="text" placeholder="Mentor name">' +
                    '</div>' +
                '<br>' +
                '<button type="button" class="btn btn-info" onclick="addMentor(' + course['courseID'] + ');">Add Mentor</button>' +
                '</div>' +
            '</form>' +
        '</div>');
}

function getUsers(handler) {
    // Get URL from where to fetch users's json
    // (This URL will only retrieve id, name and username)
    var url = getHostRoot() + '/api/users.json?fields=name,id,userCredentials[code]';

    // Get quiz's as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(users) {
        handler(users);
    }).error(function() {
        handler(null);
    });
}

function getUserByUsername(username, handler) {
    // Get URL from where to fetch users's json
    // (This URL will only retrieve id, name and username)
    var url = getHostRoot() + '/api/users.json?fields=name,id,userCredentials[code]&filter=userCredentials.code:like:' + username;

    // Get quiz's as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(user) {
        handler(user);
    }).error(function() {
        handler(null);
    });
}

function getUserByID(ID, handler) {
    // Get URL from where to fetch users's json
    // (This URL will only retrieve id, name and username)
    var url = getHostRoot() + '/api/users.json?fields=name,id,userCredentials[code]&filter=id' + ID;

    // Get quiz's as json object and on success use handler function
    $.ajax({
        url: url,
        dataType: 'json'
    }).success(function(user) {
        handler(user);
    }).error(function() {
        handler(null);
    });
}

function addAttendant(course_id){
    var attendantUsername = $('#attendantUsername').val();

    if(attendantUsername.isEmpty()) {
        $('#attendantUsername').addClass('invalid');
        $('#attendantUsername').val('');
        $('#attendantUsername').prop('placeholder', 'This must be filled out');
        return false;
    }

    getCourses(function(courses) {
        if(courses != null) {
            var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });

            getUserByUsername(attendantUsername, function(user){
                console.log("User: " + JSON.stringify(user));

                if(user['users'].length == 0) {
                    console.log("No user with that username");
                    $('#attendantUsername').addClass('invalid');
                    $('#attendantUsername').prop('placeholder', 'Username not found');
                    $('#attendantUsername').val('');
                    return false;
                }

                var attendantName = user['users'][0]['name'];
                var attendantID = user['users'][0]['id'];
                course[0]['courseAttendants'].push({ "attendantUsername" : attendantUsername, "attendantName" : attendantName, "attendantID" : attendantID});

                console.log("Courses: " + JSON.stringify(courses));

                 setCourses(JSON.stringify(courses), function() {
                     window.location.href = window.location.href;
                 });
            });
        }
    });
}

function deleteAttendant(course_id, attendantUsername) {
    if(course_id == null || attendantUsername.isEmpty()) return;

    // Create URL to POST updated courses to
    var url = getHostRoot() + '/api/systemSettings/courses';

    getCourses(function(courses) {

        // Check if there exists courses
        if(courses != null) {

            // Get course to remove attendant from
            var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });
            if(course[0] == null) return;

            // Get attendant to remove
            var attendant = $.grep(course[0]['courseAttendants'], function(e) { return e.attendantUsername == attendantUsername; });
            var attendant_index = course[0]['courseAttendants'].indexOf(attendant[0]);

            // Remove attendant from course
            course[0]['courseAttendants'].splice(attendant_index, 1);

            // Update courses on server and go back to course page
            setCourses(JSON.stringify(courses), function() {
                window.location.href = window.location.href;
            });
        }
    });
}

function addMentor(course_id){
    var mentorUsername = $('#mentorUsername').val();

    if(mentorUsername.isEmpty()) {
        $('#mentorUsername').addClass('invalid');
        $('#mentorUsername').val('');
        $('#mentorUsername').prop('placeholder', 'This must be filled out');
        return false;
    }

    getCourses(function(courses) {
        if(courses != null) {
            var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });

            getUserByUsername(mentorUsername, function(user){
                console.log("Mentor: " + JSON.stringify(user));

                if(user['users'].length == 0) {
                    console.log("No user with that username");
                    $('#mentorUsername').addClass('invalid');
                    $('#mentorUsername').prop('placeholder', 'Username not found');
                    $('#mentorUsername').val('');
                    return false;
                }

                var mentorName = user['users'][0]['name'];
                var mentorID = user['users'][0]['id'];
                course[0]['courseMentors'].push({ "mentorUsername" : mentorUsername, "mentorName" : mentorName, "mentorID" : mentorID});

                console.log("Courses: " + JSON.stringify(courses));

                setCourses(JSON.stringify(courses), function() {
                    window.location.href = window.location.href;
                });
            });
        }
    });
}

function deleteMentor(course_id, mentorUsername) {
    if(course_id == null || mentorUsername.isEmpty()) return;

    // Create URL to POST updated courses to
    var url = getHostRoot() + '/api/systemSettings/courses';

    getCourses(function(courses) {

        // Check if there exists courses
        if(courses != null) {

            // Get course to remove attendant from
            var course = $.grep(courses['courses'], function(e){ return e.courseID == course_id; });
            if(course[0] == null) return;

            // Get attendant to remove
            var mentor = $.grep(course[0]['courseMentors'], function(e) { return e.mentorUsername == mentorUsername; });
            var mentor_index = course[0]['courseMentors'].indexOf(mentor[0]);

            // Remove attendant from course
            course[0]['courseMentors'].splice(mentor_index, 1);
            
            // Update courses on server and go back to course page
            setCourses(JSON.stringify(courses), function() {
                window.location.href = window.location.href;
            });
        }
    });
}
