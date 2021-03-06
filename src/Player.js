import Point from './Point';
import Ray from './Ray';

const stepDistance = 1.4; // per 16ms
const turnRotation = 0.025; // per 16ms

export default function Player(x, y, direction) {
  this.position = new Point(x, y);
  this.direction = direction;
}

// Determine the distance to walls the user can see by casting rays of light from the player's
// eyes and figuring out where they intersect with a wall. The `resolution` is the number of rays
// to cast, and `fov` determines how spread apart they will be.
Player.prototype.castRays = function (map, fov, resolution) {
  // If the field of view is 60 degrees and the resolution is 320, there is 60 / 320 degrees
  // between each ray.
  const angleBetweenRays = fov / resolution;

  // The player's direction is the center of the screen, and the left edge of the screen is half
  // the field of view to the left. In our coordinate system, angles increase as we turn counter-
  // clockwise, so we add to player's current direction.
  const startAngle = this.direction + fov / 2;

  // Generate the angle for each ray starting from the left and sweeping to the right screen edge.
  const rayAngles = new Array(resolution).fill(0).map((_, index) => startAngle - index * angleBetweenRays);

  // Calculate the distance from each ray to the nearest wall.
  return rayAngles.map(angle => new Ray(map, angle, this.position));
};

Player.prototype.turnRight = function (elapsed) {
  this.direction -= turnRotation * elapsed / 16;
};

Player.prototype.turnLeft = function (elapsed) {
  this.direction += turnRotation * elapsed / 16;
};

Player.prototype.moveForward = function (map, elapsed) {
  const deltaX = stepDistance * (elapsed / 16) * Math.cos(this.direction);
  const deltaY = stepDistance * (elapsed / 16) * Math.sin(this.direction);

  this.position = this.position.add(
    adjustDelta(map, this.position.add(deltaX, 0), deltaX),
    adjustDelta(map, this.position.add(0, -deltaY), -deltaY),
  );
};

Player.prototype.moveBackward = function (map, elapsed) {
  const deltaX = stepDistance * (elapsed / 16) * Math.cos(this.direction);
  const deltaY = stepDistance * (elapsed / 16) * Math.sin(this.direction);

  this.position = this.position.add(
    adjustDelta(map, this.position.add(-deltaX, 0), -deltaX),
    adjustDelta(map, this.position.add(0, deltaY), deltaY),
  );
};

// Step to the left, which is the same as stepping forward but rotated 90 degrees to the left.
Player.prototype.moveLeft = function (map, elapsed) {
  const deltaX = stepDistance * (elapsed / 16) * Math.cos(this.direction + Math.PI / 2);
  const deltaY = stepDistance * (elapsed / 16) * Math.sin(this.direction + Math.PI / 2);

  this.position = this.position.add(
    adjustDelta(map, this.position.add(deltaX, 0), deltaX),
    adjustDelta(map, this.position.add(0, -deltaY), -deltaY),
  );
};

// Step to the right, which is the same as stepping backward but rotated 90 degrees to the left.
Player.prototype.moveRight = function (map, elapsed) {
  const deltaX = stepDistance * (elapsed / 16) * Math.cos(this.direction + Math.PI / 2);
  const deltaY = stepDistance * (elapsed / 16) * Math.sin(this.direction + Math.PI / 2);

  this.position = this.position.add(
    adjustDelta(map, this.position.add(-deltaX, 0), -deltaX),
    adjustDelta(map, this.position.add(0, deltaY), deltaY),
  );
};

// Perform collision-detection to determine if a proposed new position for the player is a valid
// one. If it is, return the proposed delta. Otherwise, return 0.
function adjustDelta(map, proposed, delta) {
  return map.isWall(proposed) ? 0 : delta;
}
