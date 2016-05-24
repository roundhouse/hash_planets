 function Tweet(){
		var r=Math.random()*60 +20;
		var a=Math.random()*.55+ .25;

		var tweetG = new createjs.Shape();
		tweetG.graphics.beginFill(currentParent.color).drawCircle(0, 0, r);

		var randomY = Math.floor(Math.random() * (100 - 600 + 1)) + 600;
		var randomX = Math.floor(Math.random() * (700 - 500 + 1)) + 500;

		tweetG.x = randomX;
		tweetG.y = randomY;

		tweetG.alpha = 0;

		tweetG.onMouseOver  = tweetOver;
		tweetG.onMouseOut  = tweetOut;
		tweetG.onPress  = tweetDrag;
		stage.onMouseUp  = tweetDragStop;

		stage.addChildAt(tweetG, stage.children.length-1);
		
		for (var i=0; i<hashes.length; i++){
			stage.setChildIndex(hashes[i].hashG, 0);
		}

		createjs.Tween.get(tweetG).to({alpha:a}, 1000);

		//BOX2D
		var tweetFixture = new b2FixtureDef;
		tweetFixture.density = 0;
    tweetFixture.friction = 0;
    tweetFixture.restitution = .5;
    tweetFixture.filter.categoryBits = 0x0001;
		tweetFixture.filter.maskBits =0x0001;
    tweetFixture.shape = new b2CircleShape(r*.75/worldScale);
    var tweetBody = new b2BodyDef;
		tweetBody.type = b2Body.b2_dynamicBody;

    tweetBody.position.x = tweetG.x / worldScale;
		tweetBody.position.y = tweetG.y / worldScale;

    var tweet = currentParent.thisWorld.CreateBody(tweetBody)
    debrisVector.push(tweet);
    tweet.CreateFixture(tweetFixture);

    var actor = new actorObject(tweet, tweetG);
		tweet.SetUserData(actor);
		bodies.push(tweet);
		tweets.push({"childTweet":tweet, "tweetG":tweetG, "tweetSize": r, "tweetAlpha":a, "parentHash":currentParent.hash, "thisWorld": currentParent.thisWorld});
}

function tweetDrag(event){
		TweenLite.to(event.target, .25, {alpha:.9, scaleX:1.5, scaleY:1.5, ease:Power2.easeOut});
		
		event.target.onMouseOver  = null
		event.target.onMouseOut  = null;

		for (var i=0; i<tweets.length; i++) {
			if(event.target == tweets[i].tweetG){ 
				currentTweet = i;
				break;
			}
		}
		currentTweetG = event.target;
		dragBody = tweets[currentTweet].childTweet.GetUserData().body;
		dragWorld = tweets[currentTweet].thisWorld;
		
		isMouseDown = true;
		drawTweetCircle = false;
		rollCounter = 0;
		rollAngle = 270 + rollSpeed;
		diplayTweetSingle();
		rollCircle.graphics.clear();
}
function tweetDragStop(event){
		isMouseDown = false;
		drawTweetLine = false;
		singleTweetLine.graphics.clear();
		TweenLite.to(singleTweetHolder, .25, {alpha:0, scaleX:0});
		drawTweetCircle = false;
		rollCounter = 0;
		rollAngle = 270 + rollSpeed;
		rollCircle.graphics.clear();
		tweets[currentTweet].tweetG.onMouseOver  = tweetOver;
		tweets[currentTweet].tweetG.onMouseOut  = tweetOut;
}

function tweetOver(event){
	for (var i=0; i<tweets.length; i++) {
		if(event.target == tweets[i].tweetG){ 
			currentTweet = i;
			break;
		}
	}
	currentTweetG = tweets[currentTweet].tweetG;
	currentTweetC = tweets[currentTweet].childTweet
	currentTweetSize = tweets[currentTweet].tweetSize*1.5;
	drawTweetCircle = true;
	stage.setChildIndex(currentTweetG, 0);
	TweenLite.to(event.target, .25, {alpha:.9, scaleX:1.5, scaleY:1.5, ease:Power2.easeOut});
}
function tweetOut(event){
	for (var i = tweets.length - 1; i >= 0; i--) {
		if(tweets[i].tweetG == event.target){
			TweenLite.to(event.target, .25, {alpha:tweets[i].tweetAlpha, scaleX:1, scaleY:1, ease:Power2.easeOut});
			break;
		}
	}
	drawTweetLine = false;
	singleTweetLine.graphics.clear();
	TweenLite.to(singleTweetHolder, .25, {alpha:0, scaleX:0});
	drawTweetCircle = false;
	rollCounter = 0;
	rollAngle = 270 + rollSpeed;
	rollCircle.graphics.clear();
}
function diplayTweetSingle(){
	drawTweetCircle = false;
	rollCircle.graphics.clear();
	if(currentTweetG.x < window.innerWidth/2){
		tweetHolderFlip = false
		singleTweetHolder.x = currentTweetG.x + 300;
		singleTweetHolder.y = currentTweetG.y;
	}else{
		tweetHolderFlip = true;
		singleTweetHolder.x = currentTweetG.x - 300;
		singleTweetHolder.y = currentTweetG.y;
	}
	
	drawTweetLine = true;
	TweenLite.to(singleTweetHolder, .25, {alpha:1, scaleX:1});
	stage.setChildIndex(singleTweetHolder, 0);
}