var average = function(arr) {
  return _.reduce(arr, function (sum, x) { return sum + x }, 0) / arr.length;
};

var WINDOW_SIZE = 9;
var SYMETRICAL_THRESHOLD = 50;

var Exercise = function (skeleton) {
	this.skeleton = skeleton;
  this.state = "up";
  this.repErrors = {};
  this.setErrors = {};
	this.repetitions = 0;
	this.leftAngleWindow = [];
	this.rightAngleWindow = [];
};

Exercise.prototype.updateAngle = function (data) {
  var leftAngle = this.skeleton.jointAngle(data, "handleft", "shouldercenter", "hipcenter", _.last(this.leftAngleWindow));
  var rightAngle = this.skeleton.jointAngle(data, "handright", "shouldercenter", "hipcenter", _.last(this.rightAngleWindow));
  if (isNaN(leftAngle) || isNaN(rightAngle)) {
    return;
  }

	this.leftAngleWindow.push(leftAngle);
	this.rightAngleWindow.push(rightAngle);

  if (this.leftAngleWindow.length > WINDOW_SIZE) {
    this.leftAngleWindow = _.rest(this.leftAngleWindow);
    this.rightAngleWindow = _.rest(this.rightAngleWindow);
  }
};

Exercise.prototype.getCurrentAngle = function () {
  var lower = Math.floor(this.leftAngleWindow.length / 3 * 2);
  return {
    left: average(this.leftAngleWindow.slice(lower)),
    right: average(this.rightAngleWindow.slice(lower))
  };
};

Exercise.prototype.getPrevAngle = function () {
  var lower = Math.floor(this.leftAngleWindow.length / 3);
  var upper = Math.floor(this.leftAngleWindow.length / 3 * 2);
  return {
    left: average(this.leftAngleWindow.slice(lower, upper)),
    right: average(this.rightAngleWindow.slice(lower, upper))
  };
};

Exercise.prototype.getPrevPrevAngle = function () {
  var upper = Math.floor(this.leftAngleWindow.length / 3);
  return {
    left: average(this.leftAngleWindow.slice(0, upper)),
    right: average(this.rightAngleWindow.slice(0, upper))
  };
};

Exercise.prototype.getCurrentAngleChange = function () {
  var current = this.getCurrentAngle();
  var prev = this.getPrevAngle();
  return {
    left: current.left - prev.left,
    right: current.right - prev.right
  };
};

Exercise.prototype.getPrevAngleChange = function () {
  var prev = this.getPrevAngle();
  var prevPrev = this.getPrevPrevAngle();
  return {
    left: prev.left - prevPrev.left,
    right: prev.right - prevPrev.right
  };
};

Exercise.prototype.hasFinishedRep = function () {
  if (this.state == "up") {
    if (this.getPrevAngleChange().left > 0 && this.getCurrentAngleChange().left < 0) {
      if (this.getPrevAngle().left > 90 && this.getCurrentAngle().left > 90) {
        this.state = "down";
      }
    }
  } else {
    if (this.getPrevAngleChange().left < 0 && this.getCurrentAngleChange().left > 0) {
      if (this.getPrevAngle().left < 90 && this.getCurrentAngle().left < 90) {
        this.state = "up";
        return true;
      }
    }
  }
  return false;
};

Exercise.prototype.getRange = function() {
  if (this.getCurrentAngle().left > 45 && this.getCurrentAngle().left < 150) {
    return "middle";
  } else if (this.getCurrentAngle().left >= 150) {
    return "high";
  } else {
    return "low";
  }
}

Exercise.prototype.isSymetrical = function() {
  var current = this.getCurrentAngle();
  return Math.abs(current.left - current.right) < SYMETRICAL_THRESHOLD;
};

Exercise.prototype.addError = function(error) {
  this.repErrors[error] = error;
  this.setErrors[error] = error;
}

Exercise.prototype.resetRep = function() {
  this.repErrors = {};
};

Exercise.prototype.resetSet = function() {
  this.setErrors = {};
};

Exercise.prototype.checkCorrectElbow = function() {
};

Exercise.prototype.updateRepetitions = function (jsonObject) {
  this.updateAngle(jsonObject);

  if (!this.isSymetrical()) {
    this.addError("Arms were not symetrical");
  }

	if (this.hasFinishedRep()) {
		$("#repetitions").text(++this.repetitions);
	}

  $('#info').html('')
    .append('Range : ' + this.getRange()).append($('<br>'))
    .append('Left : ' + this.getCurrentAngle().left).append($('<br>'))
    .append('Right : ' + this.getCurrentAngle().right).append($('<br>'))


  $('#errors').html('');
  _.each(this.repErrors, function(error) {
    $('#errors').append($('<p>').text(error));
  });
};

