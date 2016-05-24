function DeadHash(pX,pY,r,color,stroke){
	var container = new createjs.Container();
	
	var hashBg =  new createjs.Shape()
	hashBg.graphics.beginStroke("#ccc");
	hashBg.graphics.setStrokeStyle(2); // 2 pixel
	hashBg.graphics.beginFill("#888888").drawCircle(0, 0, r+100);

	
	var hashStroke =  new createjs.Shape()
	hashStroke.graphics.beginFill(stroke).drawCircle(0, 0, r+15);

	var hashG = new createjs.Shape();
	hashG.graphics.beginFill(color).drawCircle(0, 0, r);

	hashBg.alpha = .05;
	hashStroke.alpha = .75;
  hashG.alpha = .75;
	
	container.addChild(hashBg);
	container.addChild(hashStroke);
	container.addChild(hashG);

	stage.addChild(container);
	
  container.onPress  = deadDrag;

  var fixtureDef = new b2FixtureDef();
  fixtureDef.restitution = .5;
  fixtureDef.density = 0;
  fixtureDef.friction = 0;
  var circleShape = new b2CircleShape(r/worldScale);
  fixtureDef.shape = circleShape;
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_dynamicBody;
  //bodyDef.userData= new Sprite();
  bodyDef.position.Set(pX/worldScale,pY/worldScale);
  var thePlanet = deadWorld.CreateBody(bodyDef);
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
  var thePlanetRim = deadWorld.CreateBody(bodyDefRim);
  thePlanet.CreateFixture(fixtureDefRim);

  
  var actor = new actorObject(thePlanet, container);
	thePlanet.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
	bodies.push(thePlanet);
	deadHashes.push({"hash":thePlanet, "hashG":container, "hashStroke":hashStroke, "hashBg":hashBg, "color": color, "thisWorld":deadWorld, "size": r, "pX":pX, "pY":pY});

  //Random Movement
  var randoX = Math.floor(Math.random() * (200 - 1)) -100;
  var randoY = Math.floor(Math.random() * (200 - 1)) -100;
  var randomDirtection = new b2Vec2(randoX, randoY);
  thePlanet.ApplyForce(randomDirtection , thePlanet.GetWorldCenter());

}

function deadDrag(event){
    
    for (var i=0; i<deadHashes.length; i++) {
      if(event.target == deadHashes[i].hashG){ 
        currentTweet = i;
        break;
      }
    }
    isMouseDown = true;
    currentTweetG = event.target;
    currentTweetC = deadHashes[currentTweet].hash;
    dragBody = deadHashes[currentTweet].hash.GetUserData().body;
    dragWorld = deadWorld;
}
function deadDragStop(event){
    isMouseDown = false;
}

