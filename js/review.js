
$(document).ready(function(){
    Parse.initialize("xRcpayJ1Hgmw3n9hQJTdA43Igz9r2KlQC9I4QcfK", "rLl6JFzFA7C6Qbc9DUIyeTGbh8LDpeAGTh6h6Sz1");
    $('#stars').raty({ 'score': 3, 'path': '/raty/lib/images'});
var Review = Parse.Object.extend("Review");

$('form').submit(function() {
	var review = new Review();

	review.set('title', $("#title-area").val());
	review.set('comment', $("#comment-area").val());

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
	$('#reviews').empty();
	data.forEach(function(d) {
		addItem(d);
	});
}

var addItem = function(item) {
	var title = item.get("title");
	var comment = item.get("comment");
	var titleText = '<h2 class="title">' + title + '</h2>';
	var date = '<p class="date">time</p>';
	var commentText = '<p class="comment">' + comment + '</p>';
	var vote = '<p class="date">votes</p>';
	var reviewDiv = $('<div class="panel panel-default" id="review-block">' + titleText + date + commentText + vote + '</div>');
	$('#reviews').append(reviewDiv);
}

getData();
})