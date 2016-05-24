var aggregator = {};
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;


var canvas, context, debugCanvas, debugContext;
var bg;
var birdDelayCounter = 0; // counter for delaying creation of birds
var focused = true;
var debrisVector = new Array();
var planetVector = new Array();
var stageWidth = 955;
var stageHeight = 960;
// important box2d scale and speed vars
var SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;
var worldScale = 30;
var world;
var worlds =[];

var lastTimestamp = Date.now();
var fixedTimestepAccumulator = 0;
var bodiesToRemove = [];
var actors = [];
var bodies = [];
var btns = [];
var hashes = [];
var tweets = [];
var currentParent;
var currentH;
var autoTweets;
var autoTweetDisplay;
var tweetSpeed = 2000;
var autoTweetDisplaySpeed = 4000;
var randomTweet;
var randomMode = false;
var maxTweets =  200;
var currentLarge = [];

var currentTweet;
var dragBody; 
var dragWorld;
var mouseX;
var mouseY;
var isMouseDown = false;
var mouseJoint;

var singTweetHolder;
var drawTweetLine;
var drawTweetCircle;
var singleTweetLine;
var tweetHolderFlip = false;
var currentTweetG;
var currentTweetC;
var currentTweetSize;
var rollCircle;
var rollCounter = 0;
var rollSpeed = 20;
var rollAngle = 270;

var secretWorld;
var secretTweets = [];
var secretLarge;

var deadHashes = [];
var deadTweets = [];
var deadCounter = 0;

var world = new b2World(new b2Vec2(0,0), true);
var secretWorld = new b2World(new b2Vec2(0,0), true);
var deadWorld = new b2World(new b2Vec2(0,0), true);
worlds = [world, secretWorld, deadWorld];

var walls = 0x0001;
var rims = 0x0004;

var rimCombo = walls | rims;

var actorObject = function(body, skin) {
	this.body = body;
	this.skin = skin;
	this.update = function() {  // translate box2d positions to pixels
		//this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
		this.skin.x = this.body.GetWorldCenter().x * SCALE;
		this.skin.y = this.body.GetWorldCenter().y * SCALE;
	}
	actors.push(this);
}