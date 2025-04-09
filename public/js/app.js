function App() {
  console.log("App started");

  class Pixel {
    /** @type {number} */
    #x;
    /** @type {number} */
    #y;
    /** @type {number} */
    #color;

    constructor(x, y, color) {
      this.Pos = [x, y];
      this.Col = color;
    }

    /**
     * Returns colors
     */
    get Col() {
      return this.#color;
    }
    /**
     * Sets color
     *
     * @param {number} coords
     */
    set Col(color) {
      this.#color = color;
    }

    /**
     * Returns xy positions in an array
     */
    get Pos() {
      return [this.#x, this.#y];
    }
    /**
     * Sets xy positions from array
     *
     * @param {[number, number]} coords
     */
    set Pos([x, y]) {
      this.#x = x;
      this.#y = y;
    }

    /**
     * Defines pixel position and color
     *
     * @param {number} x
     * @param {number} y
     * @param {number} color
     */
    SetPixel(x, y, color) {
      this.Pos = [x, y];
      this.Col = color;
    }
  }

  class RenderScene {
    /** @type {[Pixel]} */
    #pixels = [];
    /** @type {CanvasRenderingContext2D} */
    #ctx;
    /** @type {HTMLCanvasElement} */
    #renderer;
    /** @type {number} */
    #width
    /** @type {number} */
    #height

    constructor() {
      if (typeof window != "undefined") {
        this.#width      = 800;
        this.#height     = 800;

        this.#renderer = document.createElement("canvas");
        this.#renderer.width = this.#width;
        this.#renderer.height = this.#height;

        this.#ctx = this.#renderer.getContext("2d");

        document.querySelector("#render-scene").appendChild(this.#renderer);

        console.log("Render scene initiated");
        this.#ctx.fillStyle = "white";
        this.#ctx.fillRect(0, 0, this.#width, this.#height);

        // temporary test draw
        this.DrawPixel(new Pixel(0, 0, "red"))
      }
    }

    /**
     * Draws a square based on the privided pixel parameter
     *
     * @param {Pixel} pixel
     */
    DrawPixel(pixel) {
      if (pixel instanceof Pixel) {
        console.log("making pixel");
        this.#pixels.push(pixel);
        const [posX, posY] = pixel.Pos;
        this.#ctx.fillStyle = pixel.Col;
        this.#ctx.fillRect(posX, posY, 20, 20);
      }
    }
  }

  new RenderScene();
}

App();
