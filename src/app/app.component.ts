import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas', { static: true })

  canvas: any;
  ctx: any;
  // CUSTOM OPTION
  title = 'my-app';
  options = [
    { value: "a", type: "img" },
    { value: "c", type: "img" },
    { value: "e", type: "img" },
    { value: "b", type: "img" },
    { value: "d", type: "img" },
    { value: "c", type: "img" },
    { value: "e", type: "img" },
    { value: "c", type: "img" },
  ];

  // CUSTOM COLORS
  colors = [
    ["#8939d6", "#fff"],
    ["#017ec1", "#fff"],
    ["#19add9", "#fff"],
    ["#1b4db4", "#fff"],
  ];

  startAngle = 0;
  arc = Math.PI / (this.options.length / 2);
  spinTimeout: any;
  spinArcStart = 10;
  spinTime = 0;
  spinTimeTotal = 0;
  spinAngleStart = 0
  loading = true;

  constructor(private elref: ElementRef) { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawRouletteWheel(this.ctx)
    }, 100)
  }

  // Drawing Wheel

  drawRouletteWheel(cxt: CanvasRenderingContext2D) {
    if (cxt) {
      const outsideRadius = 200;
      const textRadius = 160;
      const insideRadius = 0;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (var i = 0; i < this.options.length; i++) {
        // Drawing piece of wheel
        const angle = this.startAngle + i * this.arc;
        const currentColor = i % this.colors.length;
        this.ctx.fillStyle = this.colors[currentColor][0];
        this.ctx.strokeStyle = "#44201f";
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
        this.ctx.fill();
        this.ctx.save();
        this.ctx.translate(
          255 + Math.cos(angle + this.arc / 2) * textRadius,
          255 + Math.sin(angle + this.arc / 2) * textRadius
        );
        this.ctx.rotate(angle + this.arc / 2 + 1.6);
        const item = this.options[i];

        // Adding wheel content
        const img = this.elref.nativeElement.querySelector(`.${item.value}`);
        if (item.type == "img") {
          this.ctx.drawImage(img, -18, 0, 50, 50);
          this.ctx.restore();
        } else {
          this.ctx.beginPath();
          this.ctx.font = "20px custom";
          this.ctx.lineWidth = 1;
          const text = this.options[i].value;
          this.ctx.textAlign = "center";
          this.ctx.strokeStyle = this.colors[currentColor][1];
          this.ctx.fillStyle = this.colors[currentColor][1];
          this.ctx.fillText(text, -this.ctx.measureText(item.value).width / 2, 0);
          this.ctx.restore();
        }
      }
      this.ctx.restore();
    }
  }

  // // Spin the wheel

  spin() {
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel();
  }

  // // // Rotate wheel
  private rotateWheel = () => {
    this.spinTime += 7;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    let spinAngle =
      this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI) / 180;

    const degrees = ((this.startAngle * 180) / Math.PI) % 360;

    this.options.map((el, index) => {
      const avrg = 360 / this.options.length;
      const marker = this.elref.nativeElement.querySelector('.marker')
      if (Math.abs(avrg * (index + 1) - Math.round(degrees)) < 10) {
        marker?.classList.add("bounce");
        setTimeout(() => {
          marker?.classList.remove("bounce");
        }, 200);
      }
    });
    this.drawRouletteWheel(this.ctx);
    this.spinTimeout = setTimeout(this.rotateWheel, 10);
  }

  // // // Stop Wheel
  stopRotateWheel() {
    clearTimeout(this.spinTimeout);
    const degrees = (this.startAngle * 180) / Math.PI + 90;
    const arcd = (this.arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    this.ctx.save();
    const text = this.options[index].value;
    alert(`🏆🏆🏆 Your prize is ${text}.  🏆🏆🏆`);
    // document.getElementById('spinBtn').disabled = false;
    this.ctx.restore();
  }

  // // // Animation
  easeOut(t: number, b: number, c: number, d: number) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }
}
