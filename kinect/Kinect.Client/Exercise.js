var average = function(arr) {
  return _.reduce(arr, function (sum, x) { return sum + x }, 0) / arr.length;
};

var WINDOW_SIZE = 9;

var Exercise = function (skeleton) {
	this.skeleton = skeleton;
  this.state = "up";
	this.repetitions = 0;
	this.angleWindow = [];
};

Exercise.prototype.updateAngle = function (data) {
	this.angleWindow.push(this.skeleton.jointAngle(data, "handleft", "shouldercenter", "hipcenter"));

  if (this.angleWindow.length > WINDOW_SIZE) {
    this.angleWindow = _.rest(this.angleWindow);
  }
};

Exercise.prototype.getCurrentAngle = function () {
  var lower = Math.floor(this.angleWindow.length / 3 * 2);
  return average(this.angleWindow.slice(lower));
};

Exercise.prototype.getPrevAngle = function () {
  var lower = Math.floor(this.angleWindow.length / 3);
  var upper = Math.floor(this.angleWindow.length / 3 * 2);
  return average(this.angleWindow.slice(lower, upper));
};

Exercise.prototype.getPrevPrevAngle = function () {
  var upper = Math.floor(this.angleWindow.length / 3);
  return average(this.angleWindow.slice(0, upper));
};

Exercise.prototype.getCurrentAngleChange = function () {
  return this.getCurrentAngle() - this.getPrevAngle();
};

Exercise.prototype.getPrevAngleChange = function () {
  return this.getPrevAngle() - this.getPrevPrevAngle();
};

Exercise.prototype.hasFinishedRep = function () {
  if (this.state == "up") {
    if (this.getPrevAngleChange() > 0 && this.getCurrentAngleChange() < 0) {
      if (this.getPrevAngle() > 90 && this.getCurrentAngle() > 90) {
        this.state = "down";
      }
    }
  } else {
    if (this.getPrevAngleChange() < 0 && this.getCurrentAngleChange() > 0) {
      if (this.getPrevAngle() < 90 && this.getCurrentAngle() < 90) {
        this.state = "up";
        return true;
      }
    }
  }
  return false;
};

Exercise.prototype.checkCorrectElbow = function() {
};

Exercise.prototype.updateRepetitions = function (jsonObject) {
  this.updateAngle(jsonObject);

	//console.log((this.getPrevAngleChange() > 0) && (this.getCurrentAngleChange() < 0));
  //console.log(this.getPrevAngle() + "|" + this.getCurrentAngle());
  console.log(this.state);

	if (this.hasFinishedRep()) {
		$("#repetitions").text(++this.repetitions);
	}
};

