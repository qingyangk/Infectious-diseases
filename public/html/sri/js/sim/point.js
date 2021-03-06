class Point {
  constructor(x, y, velocity, status = Point.SUSCEPTIBLE) {
    this.x = x
    this.y = y
    this.velocity = velocity
    this.status = status
    this.infectionCircle = new Circle(this.x, this.y, Point.infectionRadius)
    this.lastStatusUpdate = globalUpdateCount
    this.lastInfection = globalUpdateCount
    this.nInfected = 0
    this.ignoreSocialDistancing = false
    this.inQuarantine = false
    this.beingTreated = false
  }

  /**
   * Update movement information
   * @param {Quadtree} qtree 
   * // 更新点位置
   */
  move(bypassLimit = false) {
    if (this.status == Point.DEAD) return;
    if (!bypassLimit) this.velocity.limit(Point.maxSpeed)
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.infectionCircle = new Circle(this.x, this.y, Point.infectionRadius)
  }

  /**
   * 
   * @param {Quadtree} qtree 
   * // 更新点状态
   */
  update(qtree) {
    if (this.status == Point.DEAD) return;
    if (!this.inQuarantine) {
      // Get points that are within range
      const others = qtree.query(this.infectionCircle).filter(pt => Utils.dist(pt.x, pt.y, this.x, this.y) <= this.infectionCircle.r + Point.radius)
      // Repulse and infect
      const runInfection = this.isInfectious() && globalUpdateCount - this.lastInfection >= Point.infectionInterval + randomGaussian(0, DAY_LENGTH / 10)
      if (runInfection) this.lastInfection = globalUpdateCount
      const pos = createVector(this.x, this.y)
      others.forEach(pt => {
        if (pt.status != Point.Dead) {
          // Repulse
          if (!pt.ignoreSocialDistancing) {
            const dist = p5.Vector.sub(createVector(pt.x, pt.y), pos)
            const mag = max(dist.mag(), 1) // prevent mag from being 0
            dist.setMag(Point.maxSpeed * Point.socialDistanceStrength * Point.socialDistanceFactor / mag)
            pt.velocity.add(dist) // Think of this as a single instance of acceleration instead of continuous
          }
          // Infect
          if (runInfection && pt.status == 0 && random() < Point.infectionChance) {
            pt.setStatus(Point.INFECTIOUS1)
            this.nInfected += 1
          }
        }
      })
    }
    // Update status
    if (this.status == Point.INFECTIOUS1 && globalUpdateCount - this.lastStatusUpdate >= Point.infectious1Interval) {
      this.setStatus(Point.INFECTIOUS2)
    } else if (this.status == Point.INFECTIOUS2) {
      if (globalUpdateCount - this.lastStatusUpdate >= Point.infectious2Interval) this.setStatus(Point.REMOVED)
      else if (!this.beingTreated && (globalUpdateCount - this.lastStatusUpdate) % DAY_LENGTH == 0 && random() < Point.infectionUntreatedDeathRate) {
        this.setStatus(Point.DEAD)
      }
    }
  }

  /**
   * Randomly rotate velocity within a given range
   */
  randomSteer() {
    this.velocity.rotate(random(-HALF_PI / 8, HALF_PI / 8))
  }

  /**
   * Set the current status of the Point
   * @param {Integer} status 
   */
  setStatus(status) {
    this.status = status
    this.lastStatusUpdate = globalUpdateCount
    if (this.isInfectious()) this.lastInfection = globalUpdateCount
  }

  /**
   * Returns true if this has an infectious status
   */
  isInfectious() {
    return this.status == Point.INFECTIOUS1 || this.status == Point.INFECTIOUS2
  }

  /**
   * Draw
   */
  draw() {
    let color = null
    if (this.status == Point.SUSCEPTIBLE) color = Point.COLOR_SUSCEPTIBLE
    else if (this.status == Point.VACCINATED) color = Point.COLOR_VACCINATED
    else if (this.status == Point.INFECTIOUS1) color = Point.COLOR_INFECTIOUS1
    else if (this.status == Point.INFECTIOUS2) color = Point.COLOR_INFECTIOUS2
    else if (this.status == Point.REMOVED) color = Point.COLOR_REMOVED
    else color = Point.COLOR_DEAD
    strokeWeight(1) // 点大小
    stroke(0) // 点边框颜色
    fill(color) // 点颜色
    circle(this.x, this.y, Point.radius * 2) // 点大小
    if (!this.inQuarantine && (this.status == Point.INFECTIOUS1 || this.status == Point.INFECTIOUS2)) {
      noFill() // 透明圈
      stroke(color) // 圈颜色
      circle(this.infectionCircle.x, this.infectionCircle.y, this.infectionCircle.r * 2) // 半径
    }
  }
}

Point.COLOR_SUSCEPTIBLE = COLOR_TEAL
Point.COLOR_INFECTIOUS1 = COLOR_DIM_YELLOW
Point.COLOR_INFECTIOUS2 = COLOR_ORANGE_RED
Point.COLOR_REMOVED = COLOR_DARK_BLUE
Point.COLOR_DEAD = COLOR_MED_GRAY
Point.COLOR_VACCINATED = COLOR_LIGHT_BLUE

Point.SUSCEPTIBLE = 0
Point.INFECTIOUS1 = 1 // Infectious, no symptoms
Point.INFECTIOUS2 = 2 // Infectious, with symptoms
Point.REMOVED = 3 // Recovered
Point.DEAD = 4
Point.VACCINATED = 5

Point.maxSpeed = 1
Point.radius = POINT_RADIUS_DEFAULT
Point.socialDistanceStrength = SOCIAL_DISTANCE_STRENGTH_DEFAULT
Point.socialDistanceFactor = SOCIAL_DISTANCE_FACTOR_DEFAULT
Point.infectionRadius = INFECTION_RADIUS_DEFAULT
Point.infectionInterval = INFECTION_INTERVAL_DEFAULT
Point.infectionChance = INFECTION_CHANCE_DEFAULT
Point.infectious1Interval = INFECTIOUS1_DURATION_DEFAULT
Point.infectious2Interval = INFECTIOUS2_DURATION_DEFAULT
Point.infectionUntreatedDeathRate = INFECTION_UNTREATED_DEATH_RATE_DEFAULT