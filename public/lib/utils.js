///https://stackoverflow.com/questions/5878703/webgl-is-there-an-alternative-to-embedding-shaders-in-html#12538197

utils = {};

utils.allShaders = {};
utils.SHADER_TYPE_FRAGMENT = "x-shader/x-fragment";
utils.SHADER_TYPE_VERTEX = "x-shader/x-vertex";

utils.addShaderProg = function (gl, vertex, fragment) {

    // loads both into the cache
    utils.loadShader(vertex, utils.SHADER_TYPE_VERTEX);
    utils.loadShader(fragment, utils.SHADER_TYPE_FRAGMENT);

    var vertexShader = utils.createShader(gl, vertex);
    var fragmentShader = utils.createShader(gl, fragment);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert("Could not initialise main shaders");
      gl.deleteProgram(program);
    }else{
      return program;
    }


};

// this function only loads the shader, then stores it into the allShaders object
utils.loadShader = function(file, type) {
    var cache, shader;

    $.ajax({
        async: false,
        url: "js/shaders/" + file + ".glsl", //todo: use global config for shaders folder?
        dataType: "text",
        success: function(result) {
           cache = {script: result, type: type};
        }
    });

    // store in global cache
    utils.allShaders[file] = cache;
};

utils.createShader = function (gl, id) {

    //get the shader object from the cache
    var shaderScript = utils.allShaders[id].script;
    var shaderType = utils.allShaders[id].type;

    //create the right shader
    var shader;
    if (shaderType == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderType == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    //wire up the shader and compile
    gl.shaderSource(shader, shaderScript);
    gl.compileShader(shader);

    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      return shader;
    }else{
      alert(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
};
