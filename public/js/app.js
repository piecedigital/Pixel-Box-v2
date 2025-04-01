import * as THREE from 'three';

function App() {
  class Pixel {
    /** @type {number} */
    #x;
    /** @type {number} */
    #y;
    /** @type {number} */
    #color;

    constructor(x, y, color) {
      this.SetPixel(x, y, color);
      console.log("App started");
    }

    SetColor(color) {
      this.#color = color;
    }

    SetPosition(x, y) {
      this.#x = x;
      this.#y = y;
    }

    SetPixel(x, y, color) {
      this.SetPosition(x, y);
      this.SetColor(color);
    }
  }

  class RenderScene {
    /** @type {[Pixel]} */
    #pixels = [];
    /** @type {THREE.Scene} */
    #scene;
    /** @type {THREE.OrthographicCamera} */
    #camera;
    /** @type {THREE.WebGLRenderer} */
    #renderer;

    constructor() {
      if (typeof window != "undefined") {
        let width      = 800;
        let height     = 800;
        this.#scene    = new THREE.Scene();
        this.#camera   = new THREE.OrthographicCamera(
          width / -2, width / 2,
          height / -2, height / 2,
          1, 1000);
        this.#renderer = new THREE.WebGLRenderer();

        renderer.setSize(width, height);
        document.getElementById("render-scene")?.appendChild(renderer.domElement);

        console.log("Render scene initiated");
      }
    }

    #DrawSquare(pixel) {
      this.#renderer.domElement.getContext("2d");
    }

    /**
     * @param {Pixel} pixel
     */
    DrawPixel(pixel) {
      if (pixel instanceof Pixel) {
        this.#pixels.appendChild(pixel);
      }
    }
  }
}

App();
