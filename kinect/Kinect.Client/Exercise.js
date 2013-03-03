var average = function(arr) {
  return _.reduce(arr, function (sum, x) { return sum + x }, 0) / arr.length;
};

var WINDOW_SIZE = 15;
var SYMETRICAL_THRESHOLD = 50;
var TOO_FAR_THRESHOLD = 240;
var UP_THRESHOLD = 130;

var Exercise = function (skeleton) {
	this.skeleton = skeleton;
  this.state = "up";
  this.repErrors = {};
  this.setErrors = {};
	this.repetitions = 0;
	this.leftAngleWindow = [];
	this.rightAngleWindow = [];
  this.footWindow = [];
};

Exercise.prototype.updateAngle = function (data) {
  var leftAngle = this.skeleton.jointAngle(data, "hipcenter", "shouldercenter", "handleft", _.last(this.leftAngleWindow));
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

Exercise.prototype.updateFootDistance = function (data) {
  this.footWindow.push(this.skeleton.getDistanceByAxis(data, "ankleleft", "ankleright", "x"));
  if (this.footWindow.length > (WINDOW_SIZE/3)) {
    this.footWindow = _.rest(this.footWindow);
  }
}

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
      if (this.getPrevAngle().left > UP_THRESHOLD && this.getCurrentAngle().left > UP_THRESHOLD && _.max(this.footWindow) > 100 ) {
        this.state = "down";
      }
    }
  } else {
    if (this.getPrevAngleChange().left < 0 && this.getCurrentAngleChange().left > 0) {
      if (this.getPrevAngle().left < UP_THRESHOLD && this.getCurrentAngle().left < UP_THRESHOLD && _.min(this.footWindow) < 100 ) {
        this.state = "up";
        return true;
      }
    }
  }
  return false;
};

Exercise.prototype.checkIsTooFar = function() {
  var current = this.getCurrentAngle();
  if (current.left >= TOO_FAR_THRESHOLD) {
    this.addError("Left arm went too far");
  }
  if (current.right >= TOO_FAR_THRESHOLD) {
    this.addError("Right arm went too far");
  }
  return (current.left >= TOO_FAR_THRESHOLD || current.right >= TOO_FAR_THRESHOLD);
}

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
  this.updateFootDistance(jsonObject);

  if (!this.isSymetrical()) {
    this.addError("Arms were not symetrical");
  }

  this.checkIsTooFar();

	if (this.hasFinishedRep() && this.repErrors.length != 0) {
		$("#repetitions").text(++this.repetitions);
	}

  $('#info').html('')
    .append('Range : ' + this.getRange() + " state : " + this.state).append($('<br>'))
    .append('Left : ' + this.getCurrentAngle().left).append($('<br>'))
    .append('Right : ' + this.getCurrentAngle().right).append($('<br>'));

  $('#errors').html('');
  _.each(this.repErrors, function(error) {
    $('#errors').append($('<p>').text(error));
  });
};

