1) Did you receive help from any other sources (classmates, etc.)? If so, please list who.
	I received my timeStamp function from a public github: https://gist.github.com/	hurjas/2660489

2) Did you complete any advanced extensions to this challenge? If so, what?
	No, I did not do any extra credit

3) Approximately how many hours did it take you to complete this challenge?
	~12-15 hours

4) Did you encounter any problems in this challenge we should warn students about in the future? How can we make the challenge better?
	I ran into a problem where I could not select glyphicons with jQuery. 
For example:

	$(‘.glyphicon).on('click', function() {});

wouldn’t work. It took me a while to solve, but I found the way to do it is:

	$(document).on('click', '.glyphicon', function() {});