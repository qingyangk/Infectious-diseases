
/**
 * Button that is drawn on the canvas
 * // 在画布上的绘制按钮
 */
class Button {
  constructor(x, y, w, h, msg, callback, state = false) {
    this.boundary = new Rectangle(x, y, w, h)
    this.msg = msg
    this.callback = callback
    this.state = state
  }

  inBounds(x, y) {
    return this.boundary.contains({ x: x, y: y })
  }

  action() {
    this.callback()
  }

  draw() {
    strokeWeight(2)
    if (this.state) {
      stroke(0)
      fill(Point.COLOR_INFECTIOUS1)
    } else {
      stroke(COLOR_LIGHT_GRAY) // 按钮边框颜色
      noFill()
    }
    // x y 宽度 高度 圆润度
    rect(this.boundary.x, 5, this.boundary.w, this.boundary.h, 2)
    textAlign(CENTER, CENTER)
    rectMode(CENTER)

    textSize(12)
    strokeWeight(0)
    if (this.state) fill(0)
    else fill('#fff') // 按钮文字颜色
    text(this.msg, this.boundary.cx, this.boundary.cy + 6, this.boundary.w, this.boundary.h)
    rectMode(CORNER)
  }
}