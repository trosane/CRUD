
$(document).ready(function(){
    Parse.initialize("xRcpayJ1Hgmw3n9hQJTdA43Igz9r2KlQC9I4QcfK", "rLl6JFzFA7C6Qbc9DUIyeTGbh8LDpeAGTh6h6Sz1");
    
    var starCount = 0; //counts total number of given stars
  	var numReviews = 0; //counts total number of reviews
  	// initializes the stars for the submission form
    $('#review-rating').raty({ 'path': '/raty/lib/images' });
	var Review = Parse.Object.extend("Review");

// handles the form submit and sets values in the parse database

	$('form').submit(function() {
		var review = new Review();
	// sets titles and comments in Parse
		review.set('title', $("#title-area").val());
		review.set('comment', $("#comment-area").val());
	// sets ratings as an integer in Parse
		var rating = $('#review-rating').raty('score');
		rating = parseInt(rating);
		review.set('rating', rating);
	// sets votes in Parse to initialize them
		review.set('upvote', 0);
		review.set('downvote', 0);
	// sets the time in Parse
		date = timeStamp();
		review.set('date', date);
	// saves the data to the Parse database
		review.save(null, function() {
			success:getData()
		});

		return false;
	})

//deals with votes and deleting posts

	$(document).on('click', '.glyphicon', function() {
		var id = $(this).attr("id");
		if($(this).hasClass( "glyphicon-arrow-up" )) {
			$(this).css('color', '#885261');
			getObject(id, 'upvote');
		} else if ($(this).hasClass( "glyphicon-arrow-down" )) {
			$(this).css('color', '#885261');
			getObject(id, 'downvote');
		} else {
			$(this).css('color', '#41081F');
			getObject(id, null);
		}
	});

// grabs the corresponding review depending on which interactive button is clicked
// and updates the page to reflect the changes.

	var getObject = function(id, voteType) {
		var query = new Parse.Query(Review);
 		query.get(id, {
 			success: function(response) {
 				if (voteType) { // if the vote arrows were clicked
	 				var count = response.get(voteType);
	 				response.set(voteType, count + 1);
	 			} else { // if the delete button was clicked
	 				response.destroy();
	 			}
	 			// goes through and reloads the data on the page to reflect the changes
 				response.save(null, function() {
 					success: getData()
 				});
 			}
 		});
	 }

// fetches the data from the Parse database

	var getData = function() {
		var query = new Parse.Query(Review);

		query.find({
			success:function(response) {
				buildList(response);
			}
		});
	}

// goes through each review in the database and sets up the div to post to the page

	var buildList = function(data) {
		$('#reviews').empty(); // empties the reviews from the page to prevent copies
		numReviews = 0; // initilaizes the count of reviews for average calculation
		data.forEach(function(d) {
			addItem(d);
		});
		var average = starCount / numReviews;
		starCount = 0;
		$('#avg-rating').raty({ 'score': average, 'path': '/raty/lib/images', 'readOnly': true });
	}

	var addItem = function(item) {
	// gets all the needed data from the Parse database
		var title = item.get("title");
		var comment = item.get("comment");
		var rating = item.get("rating");
		var id = item.id;
		var upCount = item.get("upvote");
		var downCount = item.get("downvote");
		var total = upCount + downCount;
		var date = item.get("date");

	// increments the total stars and the number of reviews for average calculation
		starCount += rating;
		numReviews++;

	// sets up the html elements and combines them to form the review block
		var stars = '<div id="' + id + '"></div>'
		var titleText = '<h2 id="title' + id + '" class="title"></h2>';
		var timestamp = '<p class="date">' + date + '</p>';
		var commentText = '<p id="comment' + id + '" class="comment"></p>';
		var upvoteArrow = '<span class="glyphicon glyphicon-arrow-up" id="' + id + '"></span>'
		var downvoteArrow = '<span class="glyphicon glyphicon-arrow-down" id="' + id + '"></span>'
		var votes = '<p class="vote">' + upCount + ' out of ' + total + ' found this review helpful</p>';
		var deleteIcon = '<span class="glyphicon glyphicon-remove-circle" id="' + id + '"></span>'
		var reviewDiv = $('<div class="panel panel-default col-xs-12 col-md-12" id="review-block"><div class="col-xs-10 col-md-10">' 
			+ titleText + stars + timestamp + commentText + votes + '</div><div class="col-xs-2 col-md-2" id="vote-arrow">' + upvoteArrow
			+ downvoteArrow + deleteIcon + '</div></div>');

	// adds the review block to the page and fills in the user input to prevent XSS
		$('#reviews').append(reviewDiv);
		$('#title' + id).text(title);
		$('#comment' + id).text(comment);
	// sets up the star rating for each review
		$('#' + id).raty({ 'score': rating, 'path': '/raty/lib/images', 'readOnly': true });

	}

// function that returns a timestamp in a nice format
	var timeStamp = function() {
		// Create a date object with the current time
		  var now = new Date();

		// Create an array with the current month, day and time
		  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

		// Create an array with the current hour, minute and second
		  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

		// Determine AM or PM suffix based on the hour
		  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

		// Convert hour from military time
		  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

		// If hour is 0, set it to 12
		  time[0] = time[0] || 12;

		// If seconds and minutes are less than 10, add a zero
		  for ( var i = 1; i < 3; i++ ) {
		    if ( time[i] < 10 ) {
		      time[i] = "0" + time[i];
		    }
		  }

		// Return the formatted string
		  return date.join("/") + " " + time.join(":") + " " + suffix;
	}

	getData();
})