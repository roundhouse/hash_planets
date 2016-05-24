function Hash(hashName, pX,pY,r,color,stroke, secondLine){
	var container = new createjs.Container();
	var bgSize = r*4;
	//console.log(bgSize);
	var hashBg =  new createjs.Shape()
	hashBg.graphics.beginStroke("#ccc");
	hashBg.graphics.setStrokeStyle(2); // 2 pixel
	hashBg.graphics.beginFill("#888888").drawCircle(0, 0, bgSize);

	
	var hashStroke =  new createjs.Shape()
	hashStroke.graphics.beginFill(stroke).drawCircle(0, 0, r+(r/5));

	var hashG = new createjs.Shape();
	hashG.graphics.beginFill(color).drawCircle(0, 0, r);

	var rollStrokeSize = (r/8);

	//Large Section
	var xL1 = (r-(rollStrokeSize/2)) *Math.cos(0 *Math.PI/180);
	var yL1 = (r-(rollStrokeSize/2)) *Math.sin(0 *Math.PI/180);
	var xL2 = (r-(rollStrokeSize/2)) *Math.cos(60*Math.PI/180);
	var yL2 = (r-(rollStrokeSize/2)) *Math.sin(60*Math.PI/180);
	var xLP = (r+(rollStrokeSize/4)) *Math.cos(30*Math.PI/180);
	var yLP = (r+(rollStrokeSize/4)) *Math.sin(30*Math.PI/180);
	/*
	//Small Section
	var xS1 = (r-5) *Math.cos(220 *Math.PI/180);
	var yS1 = (r-5) *Math.sin(220 *Math.PI/180);
	var xS2 = (r-5) *Math.cos(270*Math.PI/180);
	var yS2 = (r-5) *Math.sin(270*Math.PI/180);
	var xSP = (r+3) *Math.cos(245*Math.PI/180);
	var ySP = (r+3) *Math.sin(245*Math.PI/180);
	*/
	var rollRingW1 =  new createjs.Shape();
	var rollRingG1 =  new createjs.Shape();
	var rollRingW2 =  new createjs.Shape();
	var rollRingG2 =  new createjs.Shape();
	//var rollRingW3 =  new createjs.Shape();
	//var rollRingG3 =  new createjs.Shape()


	rollRingW1.graphics.setStrokeStyle(rollStrokeSize).beginStroke("white").moveTo(xL1, yL1).quadraticCurveTo(xLP, yLP, xL2, yL2).endStroke();
	rollRingW2.graphics.setStrokeStyle(rollStrokeSize).beginStroke("white").moveTo(xL1, yL1).quadraticCurveTo(xLP, yLP, xL2, yL2).endStroke();
	rollRingG1.graphics.setStrokeStyle(rollStrokeSize).beginStroke("#339933").moveTo(xL1, yL1).quadraticCurveTo(xLP, yLP, xL2, yL2).endStroke();
	rollRingG2.graphics.setStrokeStyle(rollStrokeSize).beginStroke("#339933").moveTo(xL1, yL1).quadraticCurveTo(xLP, yLP, xL2, yL2).endStroke();
	//rollRingW3.graphics.setStrokeStyle(10).beginStroke("white").moveTo(xS1, yS1).quadraticCurveTo(xSP, ySP, xS2, yS2).endStroke();
	//rollRingG3.graphics.setStrokeStyle(10).beginStroke("#339933").moveTo(xS1, yS1).quadraticCurveTo(xSP, ySP, xS2, yS2).endStroke();
	rollRingW2.rotation = 175;
	rollRingG1.rotation = 100;
	rollRingG2.rotation = 280;

	var hashRings = [rollRingW1, rollRingW2, rollRingG1, rollRingG2];
	hashBg.alpha = .15;
	hashStroke.alpha = .8;
	hashG.alpha = 1;
	container.alpha = 1; 
	rollRingW1.alpha = rollRingW2.alpha = rollRingG1.alpha = rollRingG2.alpha = 0;
	
	var text = new createjs.Text(hashName, "28px Arial", "#FFF");
	text.textAlign = "center";
	//text.snapToPixel = false;
	//text.lineWidth = (r*2) -20;
	//text.height;
	if(secondLine){
		console.log(secondLine);
		var text2 = new createjs.Text(secondLine, "28px Segoe Light", "#FFF");
		text2.textAlign = "center";
	}


	//console.log(text.height);
	//text.regY = text.height/2;
	text.textBaseline = "middle";
	//text.y = text.y - 20;
	//text.x = 0;

	hashG.onMouseOver  = hashOver;
	hashG.onMouseOut  = hashOut;
	container.addChild(hashBg);
	container.addChild(hashStroke);
	container.addChild(hashG);
	container.addChild(rollRingG1);
	container.addChild(rollRingG2);
	container.addChild(rollRingW2);
	container.addChild(rollRingW1);
	//container.addChild(rollRingW3);
	//container.addChild(rollRingG3);
	container.addChild(text);

	stage.addChild(container);
	
  var fixtureDef = new b2FixtureDef();
  fixtureDef.restitution = .5;
  fixtureDef.density = 0;
  fixtureDef.friction = 0;
  var circleShape = new b2CircleShape(r/worldScale);
  fixtureDef.shape = circleShape;
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.Set(pX/worldScale,pY/worldScale);
  var thePlanet = world.CreateBody(bodyDef);
  planetVector.push(thePlanet);
  thePlanet.CreateFixture(fixtureDef);

  var fixtureDefRim = new b2FixtureDef();
  fixtureDefRim.restitution = .5;
  fixtureDefRim.density = 1;
  fixtureDef.friction = 0;
  fixtureDefRim.filter.categoryBits = 0x0004;
  fixtureDefRim.filter.maskBits =rimCombo;
  var circleShapeRim = new b2CircleShape(bgSize/worldScale);
  fixtureDefRim.shape = circleShapeRim;
  var bodyDefRim = new b2BodyDef();
  bodyDefRim.type = b2Body.b2_dynamicBody;

  bodyDefRim.position.Set(pX/worldScale,pY/worldScale);
  var thePlanetRim = world.CreateBody(bodyDefRim);
  thePlanet.CreateFixture(fixtureDefRim);

  
  var actor = new actorObject(thePlanet, container);
	thePlanet.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
	bodies.push(thePlanet);
	
	hashes.push({"hash":thePlanet, "hashG":container, "hashCenter": hashG,  "hashStroke":hashStroke, "hashRoll": hashRings,"hashBg":hashBg, "color": color, "thisWorld":world, "size": r, "pX":pX, "pY":pY, "lable":text});
}
function hashOver(event) {	
	for (var i = hashes.length - 1; i >= 0; i--) {
		if(hashes[i].hashCenter == event.target){
			hashOver = true;
			rolltate(hashes[i].hashRoll);
			for (var j = hashes[i].hashRoll.length - 1; j >= 0; j--) {
				TweenLite.to(hashes[i].hashRoll[j], .5, {alpha:1});
			}
			currentH = i;
		}else{
			TweenLite.to(hashes[i].hashG, .25, {alpha:.25});				
		}
	}
	console.log(currentH);
	for (var i = tweets.length - 1; i >= 0; i--) {
		console.log(tweets[i].parentHash);
		if(tweets[i].parentHash != hashes[currentH].hash){
				TweenLite.to(tweets[i].tweetG, .15, {alpha:.25});
		}
	}
}
function rolltate(rollRings){
	if(hashOver ==  true){
		//for (var i = rollRings.length - 1; i >= 0; i--) {
			TweenLite.to(rollRings[0], 5, {rotation:rollRings[0].rotation+360, ease:Linear.easeNone, onComplete: rolltate, onCompleteParams:[rollRings]});
			//TweenLite.to(rollRings[1], .75, {rotation:rollRings[1].rotation-360, ease:Linear.easeNone, onComplete: rolltate, onCompleteParams:[rollRings]});
			//TweenLite.to(rollRings[2], 1, {rotation:rollRings[2].rotation+360, ease:Linear.easeNone, onComplete: rolltate, onCompleteParams:[rollRings]});
			//TweenLite.to(rollRings[3], 1.25, {rotation:rollRings[3].rotation-360, ease:Linear.easeNone, onComplete: rolltate, onCompleteParams:[rollRings]});
		//};
		TweenLite.to(rollRings[0], 1, {rotation:rollRings[0].rotation+1080, ease:Linear.easeNone, ease:Power2.easeOut});
		TweenLite.to(rollRings[1], 1.5, {rotation:rollRings[1].rotation+720, ease:Linear.easeNone, ease:Power2.easeOut});
		TweenLite.to(rollRings[2], 1.25, {rotation:rollRings[2].rotation - 1080, ease:Linear.easeNone, ease:Power2.easeOut});
		TweenLite.to(rollRings[3], 1.5, {rotation:rollRings[3].rotation- 720, ease:Linear.easeNone, ease:Power2.easeOut});
	}
}

function hashOut(event) {
	hashOver = false;
	TweenLite.to(hashes[currentH].hashRoll[0], .5, {rotation:hashes[currentH].hashRoll[0].rotation - 1080, alpha:0, ease:Linear.easeNone, ease:Power2.easeOut});
	TweenLite.to(hashes[currentH].hashRoll[1], .5, {rotation:hashes[currentH].hashRoll[1].rotation - 720, alpha:0, ease:Linear.easeNone, ease:Power2.easeOut});
	TweenLite.to(hashes[currentH].hashRoll[2], .5, {rotation:hashes[currentH].hashRoll[2].rotation +1080 , alpha:0, ease:Linear.easeNone, ease:Power2.easeOut});
	TweenLite.to(hashes[currentH].hashRoll[3], .5, {rotation:hashes[currentH].hashRoll[3].rotation + 720, alpha:0, ease:Linear.easeNone, ease:Power2.easeOut});


	for (var i = hashes[currentH].hashRoll.length - 1; i >= 0; i--) {
		//TweenLite.to(hashes[currentH].hashRoll[i], .5, {alpha:0});
		//TweenLite.to(rollRings[0], 1, {rotation:rollRings[0].rotation+1080, ease:Linear.easeNone, ease:Power2.easeOut});
		//TweenLite.to(rollRings[1], 1, {rotation:rollRings[1].rotation+720, ease:Linear.easeNone, ease:Power2.easeOut});
		//TweenLite.to(rollRings[2], 1, {rotation:rollRings[2].rotation - 1080, ease:Linear.easeNone, ease:Power2.easeOut});
		//TweenLite.to(rollRings[3], 1, {rotation:rollRings[3].rotation- 720, ease:Linear.easeNone, ease:Power2.easeOut});

	}
	for (var i = hashes.length - 1; i >= 0; i--) {
		createjs.Tween.get(hashes[i].hashG).to({alpha:1}, 500);
	}
	for (var i = tweets.length - 1; i >= 0; i--) {
	 TweenMax.to(tweets[i].tweetG, .25, {alpha:tweets[i].tweetAlpha});
	}
}
