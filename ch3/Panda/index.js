function main () {
  /*========== Create a WebGL Context ==========*/
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");

  /*========== Define and Store the Geometry ==========*/
  const squares = [
    //front square
    -0.3, -0.3, -0.3,
     0.3, -0.3, -0.3,
     0.3,  0.3, -0.3,
    -0.3, -0.3, -0.3,
    -0.3,  0.3, -0.3,
     0.3,  0.3, -0.3,

     //back square
    -0.2, -0.2,  0.3,
     0.4, -0.2,  0.3,
     0.4,  0.4,  0.3,
    -0.2, -0.2,  0.3,
    -0.2,  0.4,  0.3,
     0.4,  0.4,  0.3
  ];

  const squareColors = [
    //front color
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.6, 1.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.6, 1.0, 1.0, 1.0,

    //back color
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
  ];

  /*========== Shaders GLSL Source==========*/
  //Vertex Shader
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aColor;

    varying lowp vec4 vertexColor;
    void main() {
      gl_Position = aPosition;
      vertexColor = aColor;
    }
  `;

  //Fragment Shader
  const fsSource = `
    varying lowp vec4 vertexColor;
    void main() {
      gl_FragColor = vertexColor;
    }
  `;

  /*========== Connect the attribute with the vertex shader ===================*/
  //Create necessary shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  //Specifiy source code of necessary shaders
  gl.shaderSource(vertexShader, vsSource);
  gl.shaderSource(fragmentShader, fsSource);

  //Compile shader source code
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  //Add shaders to programe of GPU
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  //Link all shaders
  gl.linkProgram(program);

  //Use linked program
  gl.useProgram(program);

  /*========== Fill data ======================== */
  //Fill data to WebGL context buffer

  //Vertex data
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

   //Get vertex location of GPU program
  const posAttribLocation = gl.getAttribLocation(program, "aPosition");

  let size = 3;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(posAttribLocation, size, type, normalize, stride, offset);
  gl.enableVertexAttribArray(posAttribLocation);

  //Color data
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);

  size = 4;
  const colorAttribLocation = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorAttribLocation, size, type, normalize, stride, offset);
  gl.enableVertexAttribArray(colorAttribLocation);

  /*========== Drawing ======================== */
  gl.clearColor(1, 1, 1, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const mode = gl.TRIANGLES;
  const first = 0;
  const count = 12;
  gl.drawArrays(mode, first, count);
}

main();