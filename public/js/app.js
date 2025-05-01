function App() {
  console.log("App started");

  class RenderScene {
    /** @type {[[number]]} */
    #pixels = [[]];
    /** @type {string} */
    #color = RenderScene.rgbToHex(0,0,0);
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    /** @type {HTMLCanvasElement} */
    #renderer;
    /** @type {number} */
    #width;
    /** @type {number} */
    #height;
    /** @type {number} */
    ratioFactorY;
    /** @type {number} */
    ratio;
    /** @type {number} */
    #cursorOutlineWidth = 4;

    constructor() {
      if (typeof window != "undefined") {
        this.#width      = 800;
        this.#height     = 800;
        // temporary. eventually there will be options to choose more than a 16x16 canvas
        this.ratioFactorY = 16
        this.ratio     = 800/this.ratioFactorY;

        this.#renderer = document.createElement("canvas");
        this.#renderer.width = this.#width;
        this.#renderer.height = this.#height;

        this.#ctx = this.#renderer.getContext("2d");

        // Affects the thickness of the outline for the cursor
        this.#ctx.lineWidth = this.#cursorOutlineWidth;

        document.querySelector("#render-scene").appendChild(this.#renderer);

        this.ClearCanvas();
        console.log("Render scene initiated");
      }
    }

    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    /**
     *
     * @param {string} hex
     * @returns {[number, number, number]}
     */
    static hexToRgb(hex) {
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;

      return [r, g, b];
    }

    /**
     *
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @returns {string}
     */
    static rgbToHex(r, g, b) {
      return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    /**
     *
     * @param {number} index
     * @returns {[number, number]}
     */
    #indexToCoords(index) {
      const x = index % this.ratioFactorY;
      const y = index / this.ratioFactorY;
      return [x, y];
    }

    /**
     * Takes XY coords in an array and converts it too an index in an array
     *
     * @param {[number, number]} coords Represents XY coordinates
     * @returns {number}
     */
    #coordsToIndex(coords) {
      const x = coords[1];
      const y = coords[0];

      return x + (this.ratioFactorY * (y % this.ratioFactorY))
    }

    /**
     * Returns a hex color string based on the given color
     *
     * @param {[number, number]} coords Represents XY coordinates
     * @returns
     */
    #getInverseColor(coords) {
      /** @todo Implement color lumation checks and inversion */
      return RenderScene.rgbToHex(0, 0, 0);
    }

    get Renderer() {
      return this.#renderer;
    }

    /**
     * Draws a square based on the privided pixel parameter
     *
     * @param {[number, number]} coords Represents XY coordinates
     * @param {string} color Hex color code
     */
    DrawPixel(coords, color) {
      console.log("making pixel");
      // !! redo this logic for positional awareness
      this.#pixels[0].push(this.#color);
      this.#ctx.fillStyle = color;
      this.#ctx.fillRect(
        (coords[0]*this.ratio) + (this.#cursorOutlineWidth / 2),
        (coords[1]*this.ratio) + (this.#cursorOutlineWidth / 2),
        (this.ratio) - this.#cursorOutlineWidth,
        (this.ratio) - this.#cursorOutlineWidth);
    }

    ClearCanvas() {
      const holdColor = this.#color;
      this.#ctx.fillStyle = RenderScene.rgbToHex(255,255,255);
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.#ctx.fillRect(0, 0, this.#width, this.#height);
      this.#ctx.fillStyle = holdColor;
    }

    /**
     * Fully redraws the canvas
     */
    RenderCanvas() {
      this.ClearCanvas();

      for (let pixel of this.#pixels[0]) {
        this.DrawPixel(pixel);
      }
    }

    /**
     * Clears a specific pixel and portion of the canvas
     *
     * @param {[number, number]} coords Represents XY coordinates
     */
    ClearPixel(coords) {
      this.#ctx.clearRect(
        coords[0]*this.ratio, coords[1]*this.ratio,
        this.ratio, this.ratio);

      // end by deleting the pixel from the array
    }

    /**
     * Clears a specific pixel and portion of the canvas
     *
     * @param {[number, number]|number} XYCoordsOrIndex Represents XY coords, or an array index number
     */
    DrawCursor(XYCoordsOrIndex) {
      let cellX, cellY;

      if (typeof XYCoordsOrIndex === "number") {
        cellX, cellY = this.#indexToCoords(XYCoordsOrIndex)
        cellX = XYCoordsOrIndex % this.ratioFactorY;
        cellY = XYCoordsOrIndex/ this.ratioFactorY;
      } else {
        [cellX, cellY] = XYCoordsOrIndex;
      }

      this.#ctx.line = 20;
      this.#ctx.strokeStyle = this.#getInverseColor([cellX, cellY]);
      this.#ctx.strokeRect(
        (cellX*this.ratio) + (this.#cursorOutlineWidth / 2),
        (cellY*this.ratio) + (this.#cursorOutlineWidth / 2),
        this.ratio - this.#cursorOutlineWidth,
        this.ratio - this.#cursorOutlineWidth);
    }
  }

  const RS = new RenderScene();

  class UserInterface {
    /** @type {number} */
    #mouseX;
    /** @type {number} */
    #mouseY;
    /** @type {number} */
    #cellX;
    /** @type {number} */
    #cellY;

    constructor() {
      this.InitiateListeners();
    }

    /**
     * @param {[number, number]}
     */
    set MousePos([mouseX, mouseY]) {
      this.#mouseX = mouseX;
      this.#mouseY = mouseY;
      this.#cellX = (mouseX - (mouseX % RS.ratio)) / RS.ratio;
      this.#cellY = (mouseY - (mouseY % RS.ratio)) / RS.ratio;
    }

    /**
     * @return {[number, number]}
     */
    get MousePos() {
      return [this.#mouseX, this.#mouseY];
    }

    InitiateListeners() {
      RS.Renderer.addEventListener("mouseenter", (e) => {
      });
      RS.Renderer.addEventListener("mousemove", (e) => {
        this.MousePos = [e.offsetX, e.offsetY];
      });
      RS.Renderer.addEventListener("mousedown", (e) => {
      });
      RS.Renderer.addEventListener("mouseup", (e) => {
      });
    }

    ShowCursor() {
      RS.DrawCursor([this.#cellX, this.#cellY]);
    }
  }

  const UI = new UserInterface();

  requestAnimationFrame(function Loop() {
    RS.RenderCanvas();
    UI.ShowCursor();
    requestAnimationFrame(Loop);
  });
}

App();
