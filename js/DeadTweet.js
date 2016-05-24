function DeadTweet(){
	//console.log(currentParent.color);
	var r=Math.random()*3 +1;
	var a=Math.random()*.45+ .25;

	var tweetG = new createjs.Shape();
	tweetG.graphics.beginFill('#fff').drawCircle(0, 0, r);

	var randomX = Math.floor(Math.random() * (window.innerWidth - 0)) -0;
	var randomY = Math.floor(Math.random() * (stageHeight - 0)) -0;

	tweetG.x = randomX;
	tweetG.y = randomY;
	tweetG.alpha = 0;

	stage.addChildAt(tweetG, stage.children.length-1);
	createjs.Tween.get(tweetG).to({alpha:a}, 1000);

	//BOX2D
	var tweetFixture = new b2FixtureDef;
	tweetFixture.density = 0;
  tweetFixture.friction = 0;
  tweetFixture.restitution = .5;
  tweetFixture.filter.categoryBits = 0x0001;
	tweetFixture.filter.maskBits =0x0001;
  tweetFixture.shape = new b2CircleShape(r/worldScale);
  var tweetBody = new b2BodyDef;
	tweetBody.type = b2Body.b2_dynamicBody;

  //tweetBody.position.Set(pX/worldScale,pY/worldScale);
  tweetBody.position.x = tweetG.x / worldScale;
	tweetBody.position.y = tweetG.y / worldScale;

  var tweet = deadWorld.CreateBody(tweetBody)
  debrisVector.push(tweet);
  tweet.CreateFixture(tweetFixture);

  var actor = new actorObject(tweet, tweetG);
	tweet.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
	bodies.push(tweet);
	deadTweets.push({"childTweet":tweet, "tweetG":tweetG, "tweetSize": r, "tweetAlpha":a, "thisWorld": deadWorld});

	var randoX = Math.floor(Math.random() * (20 - 1)) -10;
	var randoY = Math.floor(Math.random() * (20 - 1)) -10;
	var randomDirtection = new b2Vec2(randoX, randoY);
	tweet.ApplyForce(randomDirtection , tweet.GetWorldCenter());
}