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
     0.4,  0.4,  0.3,

     //top square
    -0.3,  0.3, -0.3,
     0.3,  0.3, -0.3,
    -0.2,  0.4,  0.3,
     0.4,  0.4,  0.3,
     0.3,  0.3, -0.3,
    -0.2,  0.4,  0.3
  ];

  const squareColors = [
    //front color
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    //back color
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    //top color
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0
  ];

  /*========== Shaders GLSL Source==========*/
  //Vertex Shader
  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vertexColor;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
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
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log('An error occurred compiling the vertex shader: ' + gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return null;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log('An error occurred compiling the fragment shader: ' + gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return null;
  }

  //Add shaders to programe of GPU
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  //Link all shaders
  gl.linkProgram(program);

  //Use linked program
  gl.useProgram(program);

  let cubeRotation = 0.0;
  let then = 0.0;

  function render(now){

    now *= 0.001;
    let deltaTime = now - then;
    then = now;

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

    //Projection Matrix
    const projMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glMatrix.mat4.create();

    glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);

    //Transform Matrix
    const modelMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
    const modelViewMatrix = glMatrix.mat4.create();

    glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -2.0]);
    glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
    glMatrix.mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 1, 0]);

    gl.uniformMatrix4fv(modelMatrixLocation, false, modelViewMatrix);

    /*========== Drawing ======================== */
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const mode = gl.TRIANGLES;
    const first = 0;
    const count = squares.length / 3; // for 3 D (x,y,z)
    gl.drawArrays(mode, first, count);

    cubeRotation += deltaTime;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();