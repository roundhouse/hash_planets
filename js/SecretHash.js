function SecretHash(hashName, pX,pY,r,color,stroke){
	var container = new createjs.Container();

	var hashBg =  new createjs.Shape()
	hashBg.graphics.beginStroke("#ccc");
	hashBg.graphics.setStrokeStyle(2); // 2 pixel
	hashBg.graphics.beginFill("#888888").drawCircle(0, 0, r+100);

	var hashG = new createjs.Shape();
	hashG.graphics.beginFill(color).drawCircle(0, 0, r);
		

	hashBg.alpha = .1;
	hashG.alpha = .2;

	//hashG.onMouseOver  = secretOver;
	//hashG.onMouseOut  = secretOut;
	container.addChild(hashBg);
	container.addChild(hashG);

	stage.addChild(container);

  var fixtureDef = new b2FixtureDef();
  fixtureDef.restitution = 0;
  fixtureDef.density = .5;
  var circleShape = new b2CircleShape(r/worldScale);
  fixtureDef.shape = circleShape;
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.Set(pX/worldScale,pY/worldScale);
  var thePlanet = secretWorld.CreateBody(bodyDef);
  planetVector.push(thePlanet);
  thePlanet.CreateFixture(fixtureDef);

  var fixtureDefRim = new b2FixtureDef();
  fixtureDefRim.restitution = .5;
  fixtureDefRim.density = .15;
  fixtureDef.friction = 0;
  fixtureDefRim.filter.categoryBits = 0x0004;
  fixtureDefRim.filter.maskBits =rimCombo;
  //fixtureDefRim.filter.maskBits =0x0004;
  var circleShapeRim = new b2CircleShape(r*3.5/worldScale);
  fixtureDefRim.shape = circleShapeRim;
  var bodyDefRim = new b2BodyDef();
  bodyDefRim.type = b2Body.b2_dynamicBody;

  bodyDefRim.position.Set(pX/worldScale,pY/worldScale);
  var thePlanetRim = secretWorld.CreateBody(bodyDefRim);
  thePlanet.CreateFixture(fixtureDefRim);

  
  var actor = new actorObject(thePlanet, container);
	thePlanet.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
	bodies.push(thePlanet);
	//hashes.push({"hash":thePlanet, "hashG":hashG, "hashStroke":hashStroke, "hashBg":hashBg, "color": color, "thisWorld":world, "size": r, "pX":pX, "pY":pY});
	

	//Random Movement
	var randoX = Math.floor(Math.random() * (100 - 1)) -50;
  var randoY = Math.floor(Math.random() * (100 - 1)) -50;
  var randomDirtection = new b2Vec2(randoX, randoY);
  thePlanet.ApplyForce(randomDirtection , thePlanet.GetWorldCenter());

	for (var i=0; i<5; i++) {
		createSecretTweet(thePlanet, secretWorld, color);
	}
}

function secretOver(e){
	var fixtureDef = new b2FixtureDef();
  fixtureDef.restitution = 1;
  fixtureDef.density = 1;
  var circleShape = new b2CircleShape(300/worldScale);
  fixtureDef.shape = circleShape;
  var bodyDef = new b2BodyDef();
  bodyDef.position.Set(1350/worldScale,200/worldScale);
  var largePlanet = secretWorld.CreateBody(bodyDef);
  largePlanet.CreateFixture(fixtureDef);
  secretLarge = largePlanet;
  //currentLarge = [{"largePlanet" : largePlanet, "world" : hashie.thisWorld}];
}
function secretOut(e){
		secretWorld.DestroyBody(secretLarge);
}
function createSecretTweet(parentPlanet, world, color){
	//console.log(currentParent.color);
		var r=Math.random()*6 +2;
		var a=Math.random()*.15+ .05;

		var tweetG = new createjs.Shape();
		tweetG.graphics.beginFill(color).drawCircle(0, 0, r*2);

		var randomY = Math.floor(Math.random() * (100 - 50 + 1)) - 50;
		var randomX = Math.floor(Math.random() * (1000 - 800 + 1)) + 800;

		tweetG.x = randomX;
		tweetG.y = randomY;

		tweetG.alpha = 0;

		stage.addChildAt(tweetG, stage.children.length-1);

		createjs.Tween.get(tweetG).to({alpha:a}, 1000);

		//BOX2D
		var tweetFixture = new b2FixtureDef;
		tweetFixture.density = 0;
    tweetFixture.friction = 0;
    tweetFixture.restitution = 0;
    tweetFixture.filter.categoryBits = 0x0001;
		tweetFixture.filter.maskBits =0x0001;
    tweetFixture.shape = new b2CircleShape(r*1.5/worldScale);
    var tweetBody = new b2BodyDef;
		tweetBody.type = b2Body.b2_dynamicBody;
    //tweetBody.position.Set(pX/worldScale,pY/worldScale);
    tweetBody.position.x = tweetG.x / worldScale;
		tweetBody.position.y = tweetG.y / worldScale;

    var tweet = world.CreateBody(tweetBody)
    debrisVector.push(tweet);
    tweet.CreateFixture(tweetFixture);

    var actor = new actorObject(tweet, tweetG);
		tweet.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		bodies.push(tweet);
		secretTweets.push({"childTweet":tweet, "tweetG":tweetG, "tweetAlpha":a, "parentHash":parentPlanet, "thisWorld": secretWorld});
}
