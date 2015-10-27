
$(document).ready(function(){
    Parse.initialize("xRcpayJ1Hgmw3n9hQJTdA43Igz9r2KlQC9I4QcfK", "rLl6JFzFA7C6Qbc9DUIyeTGbh8LDpeAGTh6h6Sz1");
    
    var starCount = 0; //counts total number of given stars
  	var numReviews = 0; //counts total number of reviews
    $('#review-rating').raty({ 'path': '/raty/lib/images' });
	var Review = Parse.Object.extend("Review");

	$('form').submit(function() {
		var review = new Review();

		review.set('title', $("#title-area").val());
		review.set('comment', $("#comment-area").val());
		
		var rating = $('#review-rating').raty('score');
		rating = parseInt(rating);

		review.set('rating', rating);

		review.save(null, function() {
			success:getData()
		});

		return false;
	})

	var getData = function() {
		var query = new Parse.Query(Review);

		query.find({
			success:function(response) {
				buildList(response);
			}
		});
	}

	var buildList = function(data) {
		//$('#reviews').empty();
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
		var date = timeStamp();
		starCount += rating;
		numReviews++;

		var stars = '<div id="' + id + '"></div>'
		var titleText = '<h2 id="title' + id + '" class="title"></h2>';
		var timestamp = '<p class="date">' + date + '</p>';
		var commentText = '<p id="comment' + id + '" class="comment"></p>';
		var upvote = '<span class="glyphicon glyphicon-arrow-up"></span>'
		var downvote = '<span class="glyphicon glyphicon-arrow-down"></span>'
		var votes = '<p class="vote">votes</p>';
		var reviewDiv = $('<div class="panel panel-default" id="review-block">' + titleText + 
			stars + timestamp + commentText + votes + '</div>');





		$('#reviews').append(reviewDiv);
		$('#title' + id).text(title);
		$('#comment' + id).text(comment);
		$('#' + id).raty({ 'score': rating, 'path': '/raty/lib/images', 'readOnly': true });

	}

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