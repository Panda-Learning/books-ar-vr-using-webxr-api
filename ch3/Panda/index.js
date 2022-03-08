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

  /*========== Shaders GLSL Source==========*/
  //Vertex Shader
  const vsSource = `
    attribute vec4 aPosition;

    void main() {
      gl_Position = aPosition;
    }
  `;

  //Fragment Shader
  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
  const sourceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

  //Get vertex postion of GPU program
  const posAttribPosition = gl.getAttribLocation(program, "aPosition");

  let size = 3;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(posAttribPosition, size, type, normalize, stride, offset);
  gl.enableVertexAttribArray(posAttribPosition);

  /*========== Drawing ======================== */
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const mode = gl.TRIANGLES;
  const first = 0;
  const count = 12;
  gl.drawArrays(mode, first, count);
}

main();