<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Courses</title>

    <!-- Bootstrap -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">

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
  			
  			<div class="col-xs-6">
				<form role="form">
					<div class="form-group">
						<label for="courseTitle">Title</label> <input type="text"
							class="form-control" id="courseTitle" value="Course 1">
					</div>
					<div class="form-group">
						<label for="courseDescription">Description</label>
						<textarea class="form-control" rows="6" cols="60">This is the description of Course 1.</textarea>
					</div>
		
					<button type="submit" class="btn btn-default">Save</button>
				</form>
  			</div>
		</div>
		
		<br>
	
	  	<div class="row">
  			<!-- padd content to center -->
  			<div class="col-xs-3"></div>
  			
	  		<div class="col-xs-6">
				<label>Quiz</label> 		
				
				<ul>
					<li class="list-group-item" id="quiz_1_id"><a href="quiz.jsp">Quiz 1</a></li>
					<li class="list-group-item" id="quiz_2_id"><a href="quiz.jsp">Quiz 2</a></li>
					<li class="list-group-item" id="quiz_3_id"><a href="quiz.jsp">Quiz 3</a></li>
				</ul>
				
				<a href="quiz.jsp" class="btn btn-default">New Quiz</a>
			</div>
		</div>
	</div>


	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="../js/bootstrap.min.js"></script>
  </body>
</html>