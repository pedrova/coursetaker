<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin Panel</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    
    <!-- CSS -->
<!--     <link href="css/main.css" rel="stylesheet"> -->
    

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container">
        <div class="row">
            
            <!-- padd content to center -->
            <div class="col-xs-3"></div>
            
            <div class="col-xs-6 list-group">
                <label class="label list-group-item active">Courses</label>
            
                <ul>
                    <li class="list-group-item"  id="course_1_id"><a href="content/course.jsp">Course 1</a></li>   
                    <li class="list-group-item"  id="course_2_id"><a href="content/course.jsp">Course 2</a></li>
                    <li class="list-group-item"  id="course_3_id"><a href="content/course.jsp">Course 3</a></li>        
                </ul>
                
               <a href="content/course.jsp" class="btn btn-default">New Course</a>
            </div>
        </div>
    </div>

    
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>