aggregator = (function() {

$('#debug').on('click', function() { $('#debugCanvas').toggle(); });  // toggle debug view

	$(document).ready(function() {
		// setup functions to run once page is loaded
		setup.canvas();
		setup.ticker();
		box2d.setup();
		window.onfocus = onFocus;
		window.onblur = onBlur;
	});

	function onFocus() { focused = true; box2d.pauseResume(false); $('#paused').css({'display':'none'}); }
	function onBlur() { focused = false; box2d.pauseResume(true); $('#paused').css({'display':'block'}); }

/* ------ SETUP ------- */
// initial setup of canvas, contexts, and render loop

	var setup = (function() {

			var canvas = function() {
			canvas = document.getElementById('demoCanvas');
			debugCanvas = document.getElementById('debugCanvas');
			canvas.width  = window.innerWidth;
  		canvas.height = stageHeight;
  		debugCanvas.width  = window.innerWidth;
  		debugCanvas.height = stageHeight;


			context = canvas.getContext('2d');
			debugContext = debugCanvas.getContext('2d');
			stage = new createjs.Stage(canvas);
			stage.mouseEventsEnabled = true;
  		stage.enableMouseOver();
			stage.snapPixelsEnabled = true;
		}

		var ticker = function() {
			createjs.Ticker.setFPS(30);
			//Ticker.useRAF = true;
			createjs.Ticker.addListener(aggregator);
		}

		return {
			canvas: canvas,
			ticker: ticker
		}
	})();

/* ------- Box2D --------- */
// handles all physics movement

	var box2d = (function() {

		var setup = function() {
			addBg();
			stage.onMouseMove = mouseTracker;

			createBoundries(world);
			createBoundries(deadWorld);

			var deadHash1 = new DeadHash(550, 620, 50, '#000', '#3f3f3f');
			var deadHash2 = new DeadHash(800, 100, 49, '#000', '#3f3f3f');
			var deadHash3 = new DeadHash(1400, 650, 48, '#000', '#3f3f3f');
			var deadHash4 = new DeadHash(60, 60, 47, '#000', '#3f3f3f');

			for (var i=0; i<60; i++) {
				var deadTweet = new DeadTweet();
			}


			var planet1 = new SecretHash("#????",1350, 200,30, '#0f7e3f', '#69a643');

			var hash3 =  new Hash("#Planet 1",1200,650,50, '#008a00', '#6ba941');
     	var hash2 =  new Hash("#Planet 2",1000,450,70, '#008a00', '#6ba941', "Rumors");
     	var hash1 = new Hash("#Planet 3",200,300,80, '#008a00', '#6ba941');

     	addDebug();
     	singleTweetView();
     	currentParent = hashes[0];
     	/*
     	for (var i=0; i<hashes.length; i++) {
     		addBUtton(hashes[i].color)
     	};
     	*/
     	autoTweets=setInterval(function(){autoTweetCreator()},tweetSpeed);
     	autoTweetDisplay=setInterval(function(){diplayRandomTweet()}, autoTweetDisplaySpeed);
		}

		function createBoundries(thisWorld){
				//create boundries	
			var floorFixture = new b2FixtureDef;
			floorFixture.density = 1;
			floorFixture.restitution = .5;
			floorFixture.shape = new b2PolygonShape;
			floorFixture.shape.SetAsBox(window.innerWidth/ worldScale, 10 / worldScale);
			var floorBodyDef = new b2BodyDef;
			floorBodyDef.type = b2Body.b2_staticBody;
			floorBodyDef.position.x = 0;
			floorBodyDef.position.y = (stageHeight +200) / worldScale
			var floor = thisWorld.CreateBody(floorBodyDef);
			floor.CreateFixture(floorFixture);

			var ceilingFixture = new b2FixtureDef;
			ceilingFixture.density = 1;
			ceilingFixture.restitution = .5;
			ceilingFixture.shape = new b2PolygonShape;
			ceilingFixture.shape.SetAsBox(window.innerWidth / worldScale, 10 / worldScale);
			var ceilingBodyDef = new b2BodyDef;
			ceilingBodyDef.type = b2Body.b2_staticBody;
			ceilingBodyDef.position.x = 0;
			ceilingBodyDef.position.y = -200 / worldScale;
			var ceiling = thisWorld.CreateBody(ceilingBodyDef);
			ceiling.CreateFixture(floorFixture);

			// boundaries - left
			var leftFixture = new b2FixtureDef;
			leftFixture.density = 1;
			leftFixture.restitution = .5;
			leftFixture.shape = new b2PolygonShape;
			leftFixture.shape.SetAsBox(10 / worldScale, stageHeight/ worldScale);
			var leftBodyDef = new b2BodyDef;
			leftBodyDef.type = b2Body.b2_staticBody;
			leftBodyDef.position.x = -200 / worldScale;
			leftBodyDef.position.y = 0;
			var left = thisWorld.CreateBody(leftBodyDef);
			left.CreateFixture(leftFixture);

			var rightFixture = new b2FixtureDef;
			rightFixture.density = 1;
			rightFixture.restitution = .5;
			rightFixture.shape = new b2PolygonShape;
			rightFixture.shape.SetAsBox(10 / worldScale, stageHeight / worldScale);
			var rightBodyDef = new b2BodyDef;
			rightBodyDef.type = b2Body.b2_staticBody;
			rightBodyDef.position.x = (window.innerWidth + 200) / worldScale;
			rightBodyDef.position.y = 0;
			var right = thisWorld.CreateBody(rightBodyDef);
			right.CreateFixture(rightFixture);
		}

		function autoTweetCreator(){
			var randomHash = Math.floor(Math.random() * (hashes.length + 0));
			currentParent = hashes[randomHash];
			var _tweet = new Tweet();
		}

		function addBg(){
			bg = new createjs.Shape();
			bg.graphics.beginFill("black").drawRect(0, 0, window.innerWidth, stageHeight)
			stage.addChild(bg);
			//bg.onPress = createDebris;
		}
		function addBUtton(color){
			var btn = new createjs.Shape();
			btn.graphics.beginFill(color).drawRect(0, 0, 100, 50);
			btn.onPress = changeHash;
			btns.push({"button":btn, "color":color});
			btn.y = 600;
			btn.x =  (btns.length * 110) + 200;
			stage.addChild(btn);
		}

		function singleTweetView(){
			singleTweetHolder = new createjs.Shape();
			singleTweetHolder.graphics.beginFill("#fff").drawRect(0, 0, 350, 100);
			singleTweetHolder.regY = 50;
			singleTweetHolder.regX = 175;
			TweenLite.to(singleTweetHolder, 0, {alpha:1, scaleX:0});
			stage.addChild(singleTweetHolder);

			singleTweetLine = new createjs.Shape();
			stage.addChild(singleTweetLine);

			rollCircle = new createjs.Shape();
			stage.addChild(rollCircle);
		}

		function changeHash(e){
			for (var i = btns.length - 1; i >= 0; i--) {
				if(e.target  ==  btns[i].button){
					console.log(e.target);
					currentParent = hashes[i]; 
				}
			};
		}

		function mouseTracker(e){
				mouseX = e.stageX/worldScale;
				mouseY = e.stageY/worldScale;
				window.clearInterval(autoTweetDisplay);
				autoTweetDisplay=setInterval(function(){diplayRandomTweet()}, autoTweetDisplaySpeed);
				if(randomMode == true){
					randomMode = false;
					hideRandomTweet();
					for (var i=0; i<tweets.length; i++) {
		  			tweets[i].tweetG.onMouseOver  = tweetOver;
						tweets[i].tweetG.onMouseOut  = tweetOut;
						tweets[i].tweetG.onPress  = tweetDrag;
	  			}
				}
				
		}

    function createDebris(e) {
    		//addTweet();
       //addTweet(e.stageX,e.stageY);
    }

    function diplayRandomTweet(){
  		randomMode = true;
  		for (var i=0; i<tweets.length; i++) {
  				tweets[i].tweetG.onMouseOver  = null
	  			tweets[i].tweetG.onMouseOut  = null;
	  			tweets[i].tweetG.onPress  = null;
  		}
    	randomTweet = Math.floor(Math.random() * ((tweets.length-1) - 0)) - 0;
    	currentTweetG = tweets[randomTweet].tweetG;
    	TweenLite.to(currentTweetG, .25, {alpha:.9, scaleX:1.5, scaleY:1.5, ease:Elastic.easeOut});
    	window.clearInterval(autoTweetDisplay);
    	autoTweetDisplay=setInterval(function(){hideRandomTweet()}, 4000);
    	diplayTweetSingle();
    }
    function hideRandomTweet(){
    	drawTweetLine = false;
    	singleTweetLine.graphics.clear();
    	TweenLite.to(currentTweetG, .25, {alpha:tweets[randomTweet].tweetAlpha, scaleX:1, scaleY:1, ease:Elastic.easeOut});
    	TweenLite.to(singleTweetHolder, .25, {alpha:0, scaleX:0});
    	window.clearInterval(autoTweetDisplay);
    	autoTweetDisplay=setInterval(function(){diplayRandomTweet()}, 1000);
    }

		// box2d debugger
		var addDebug = function() {
			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(debugContext);
			debugDraw.SetDrawScale(SCALE);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			//secretWorld.SetDebugDraw(debugDraw);
			world.SetDebugDraw(debugDraw);
		}
		
		// remove actor and it's skin object
		var removeActor = function(actor) {
			stage.removeChild(actor.skin);
			actors.splice(actors.indexOf(actor),1);
		}

		// box2d update function. delta time is used to avoid differences in simulation if frame rate drops
		var update = function() {
			var now = Date.now();
			var dt = now - lastTimestamp;
			fixedTimestepAccumulator += dt;
			lastTimestamp = now;

			for (var i=0; i<worlds.length; i++){
				worlds[i].Step(1/30, 10, 10);
				worlds[i].ClearForces();
			}

			
			if(tweets.length > maxTweets){
					removeActor(tweets[0].childTweet.GetUserData());
					tweets[0].thisWorld.DestroyBody(tweets[0].childTweet)
					tweets.splice(0,1);
					deadCounter = 0;
			}

      for (var i=0; i<tweets.length; i++) {
    		var debrisPosition = tweets[i].childTweet.GetWorldCenter();
        var planetShape = tweets[i].parentHash.GetFixtureList().GetShape();
        var planetRadius = planetShape.GetRadius();
        var planetPosition = tweets[i].parentHash.GetWorldCenter();
        var planetDistance = new b2Vec2(0,0);
        planetDistance.Add(debrisPosition);
        planetDistance.Subtract(planetPosition);
        var finalDistance = planetDistance.Length();
	      planetDistance.NegativeSelf();
	      var vecSum = Math.abs(planetDistance.x)+Math.abs(planetDistance.y);
	      planetDistance.Multiply((1/vecSum)*planetRadius/finalDistance);
	      //console.log(planetDistance);
	      tweets[i].childTweet.ApplyForce(planetDistance,tweets[i].childTweet.GetWorldCenter());
      }
      for (var i=0; i<secretTweets.length; i++) {
				//console.log(i);
	    	var debrisPosition = secretTweets[i].childTweet.GetWorldCenter();
	      var planetShape = secretTweets[i].parentHash.GetFixtureList().GetShape();
	      var planetRadius = planetShape.GetRadius();
	      var planetPosition = secretTweets[i].parentHash.GetWorldCenter();
	      var planetDistance = new b2Vec2(0,0);
	      planetDistance.Add(debrisPosition);
	      planetDistance.Subtract(planetPosition);
	      var finalDistance = planetDistance.Length();
        planetDistance.NegativeSelf();
        var vecSum = Math.abs(planetDistance.x)+Math.abs(planetDistance.y);
        planetDistance.Multiply((1/vecSum)*planetRadius/finalDistance);
        secretTweets[i].childTweet.ApplyForce(planetDistance,secretTweets[i].childTweet.GetWorldCenter());
    	}

			if(drawTweetLine == true){
				if(isMouseDown){
					currentTweetC.SetAwake(true);
				}
				singleTweetLine.graphics.clear();
				stage.setChildIndex(singleTweetLine, 0);
				stage.setChildIndex(singleTweetHolder, 0);

				singleTweetLine.graphics.beginStroke("white").moveTo(currentTweetG.x, currentTweetG.y).lineTo(singleTweetHolder.x-175, singleTweetHolder.y-50).endStroke();
				singleTweetLine.graphics.beginStroke("white").moveTo(currentTweetG.x, currentTweetG.y).lineTo(singleTweetHolder.x-175, singleTweetHolder.y+50).endStroke();
				singleTweetLine.graphics.beginStroke("white").moveTo(currentTweetG.x, currentTweetG.y).lineTo(singleTweetHolder.x + 175, singleTweetHolder.y-50).endStroke();
				singleTweetLine.graphics.beginStroke("white").moveTo(currentTweetG.x, currentTweetG.y).lineTo(singleTweetHolder.x + 175, singleTweetHolder.y+50).endStroke();
				
				
				singleTweetLine.alpha=.5;
			}

			if(drawTweetCircle == true){
				stage.setChildIndex(rollCircle, 0);
				if(rollCounter <= 360){
					currentTweetC.SetAwake(false);

					var xS = currentTweetSize *Math.cos(rollAngle *Math.PI/180);
					var yS = currentTweetSize *Math.sin(rollAngle *Math.PI/180);

					var xE = currentTweetSize *Math.cos((rollAngle+(rollSpeed))*Math.PI/180);
					var yE = currentTweetSize *Math.sin((rollAngle+(rollSpeed))*Math.PI/180);

					var distX = xE - xS;
					var distY = yE - yS;
					distX = distX * distX;
					distY = distY * distY;
					distP = (Math.sqrt( distX + distY )*.1)/2;

					var xP = (currentTweetSize+distP) *Math.cos((rollAngle+(rollSpeed/2))*Math.PI/180);
					var yP = (currentTweetSize+distP) *Math.sin((rollAngle+(rollSpeed/2))*Math.PI/180);

					rollCircle.x = currentTweetG.x;
					rollCircle.y = currentTweetG.y;
					//rollCircle.graphics.setStrokeStyle(3, 'round', 'round').beginStroke("white").moveTo(xS, yS).bezierCurveTo(xP, yP, xS, yS, xC, yC).endStroke();
					
					//rollCircle.graphics.setStrokeStyle(3, 'square', 'square').beginStroke("white").moveTo(xP, yP).arcTo(xC, yC, xS, yS, currentTweetSize).endStroke();

					rollCircle.graphics.setStrokeStyle(3, 'square', 'miter', 5).beginStroke("white").moveTo(xS, yS).quadraticCurveTo(xP, yP, xE, yE);

					rollAngle = rollAngle + rollSpeed;
					rollCounter = rollCounter + rollSpeed;

				}else{
					rollAngle = 270;
					rollCounter = 0;
					rollCircle.graphics.clear();
					diplayTweetSingle();
				}
			}


			if(isMouseDown && (!mouseJoint)) {
	         currentTweetC.SetAwake(true);
	         if(dragBody) {		
	            var md = new b2MouseJointDef();
	            md.bodyA = dragWorld.GetGroundBody();
	            md.bodyB = dragBody;
	            md.target.Set(mouseX, mouseY);
	            md.collideConnected = false;
	            md.maxForce = 300.0 * dragBody.GetMass();
	            mouseJoint = dragWorld.CreateJoint(md);
	            dragBody.SetAwake(true);
	         }
	      }
	          
	      if(mouseJoint) {
	         if(isMouseDown) {
	            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
	         } else {
	            dragWorld.DestroyJoint(mouseJoint);
	            mouseJoint = null;
	         }
	      }


      
      for(var i=0, l=actors.length; i<l; i++) {
				actors[i].update();
			}

			//secretWorld.DrawDebugData();
			world.DrawDebugData();
		}

		var pauseResume = function(p) {
			if(p) { TIMESTEP = 0;
				window.clearInterval(autoTweets);
			} else {
				TIMESTEP = 1/STEP; 
				autoTweets=setInterval(function(){autoTweetCreator()},tweetSpeed);
			}
			lastTimestamp = Date.now();

		}

		return {
			setup: setup,
			update: update,
			pauseResume: pauseResume
		}
	})();

/* ------- UPDATE -------- */
// main update loop for rendering assets to canvas

	var tick = function(dt, paused) {
		if(focused) {
			box2d.update();
			stage.update();
		}
	}

/* ------- GLOBAL -------- */
// main global functions

	return {
		tick: tick
	}

}());
