
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

		review.set('title', $("#title-area").val());
		review.set('comment', $("#comment-area").val());
		
		var rating = $('#review-rating').raty('score');
		rating = parseInt(rating);

		review.set('rating', rating);

		review.set('upvote', 0);
		review.set('downvote', 0);

		date = timeStamp();
		review.set('date', date);

		review.save(null, function() {
			success:getData()
		});

		return false;
	})

//deals with votes and deleting posts

	$(document).on('click', '.glyphicon', function() {
		var id = $(this).attr("id");
		if($(this).hasClass( "glyphicon-arrow-up" )) {
			getObject(id, 'upvote');
		} else if ($(this).hasClass( "glyphicon-arrow-down" )) {
			getObject(id, 'downvote');
		} else {
			console.log('deleted');
		}
	});

// grabs the corresponding review depending on which interactive button is clicked
// and updates the page to reflect the changes.

	var getObject = function(id, voteType) {
		var query = new Parse.Query(Review);
 		query.get(id, {
 			success: function(response) {
 				var count = response.get(voteType);
 				response.set(voteType, count + 1);
 				response.save(null, function() {
 					success: getData()
 				});
 			}
 		});
	 }

	var getData = function() {
		var query = new Parse.Query(Review);

		query.find({
			success:function(response) {
				buildList(response);
			}
		});
	}

	var buildList = function(data) {
		$('#reviews').empty();
		numReviews = 0;
		data.forEach(function(d) {
			addItem(d);
		});
		console.log('Star count: ' + starCount);
		var average = starCount / numReviews;
		console.log('Average: ' + average);
		console.log('NumReviews: ' + numReviews);
		starCount = 0;
		$('#avg-rating').raty({ 'score': average, 'path': '/raty/lib/images', 'readOnly': true });
	}

	var addItem = function(item) {
		var title = item.get("title");
		var comment = item.get("comment");
		var rating = item.get("rating");
		var id = item.id;
		var upCount = item.get("upvote");
		var downCount = item.get("downvote");
		var total = upCount + downCount;
		var date = item.get("date");
		starCount += rating;
		numReviews++;

		var stars = '<div id="' + id + '"></div>'
		var titleText = '<h2 id="title' + id + '" class="title"></h2>';
		var timestamp = '<p class="date">' + date + '</p>';
		var commentText = '<p id="comment' + id + '" class="comment"></p>';
		var upvoteArrow = '<span class="glyphicon glyphicon-arrow-up" id="' + id + '"></span>'
		var downvoteArrow = '<span class="glyphicon glyphicon-arrow-down" id="' + id + '"></span>'
		var votes = '<p class="vote">' + upCount + ' out of ' + total + ' found this review helpful</p>';
		var reviewDiv = $('<div class="panel panel-default col-xs-12 col-md-12" id="review-block"><div class="col-xs-10 col-md-10">' 
			+ titleText + stars + timestamp + commentText + votes + '</div><div class="col-xs-2 col-md-2" id="vote-arrow">' + upvoteArrow
			+ downvoteArrow + '</div></div>');


		$('#reviews').append(reviewDiv);
		$('#title' + id).text(title);
		$('#comment' + id).text(comment);
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