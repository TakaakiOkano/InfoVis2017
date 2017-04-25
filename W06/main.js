function main()
{
    var width = 500;
    var height = 500;

    //描画する空間全体scene
    var scene = new THREE.Scene();

    //camera設定
    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    
    //camera2種類Orthographic or Perspective
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );  //cameraの位置
    scene.add( camera );             //cameraを追加

    //描画のためのクラスrenderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement ); //ウェブページのbodyにrendererのdomElementを追加

    //Objectの構成
    var vertices = [ [-1,1,0],[-1,-1,0],[1,-1,0],[1,1,0] ];//,[-1,1,1],[-1,-1,1],[1,-1,1],[1,1,1]  ]; //v0,v1,v2,v3,v4,v5,v6,v7
    var faces =    [ [0,1,2],[0,2,3] ];//,[4,5,1],[4,1,0],[7,6,5],[7,5,4],[3,2,6],[3,6,7],[4,0,3],[4,3,7],[2,1,5],[2,5,6] ];  //f0:v0,v1,v2
    
    var v0 = new THREE.Vector3().fromArray(vertices[0]);
    var v1 = new THREE.Vector3().fromArray(vertices[1]);
    var v2 = new THREE.Vector3().fromArray(vertices[2]);
    var v3 = new THREE.Vector3().fromArray(vertices[3]);
    /*var v4 = new THREE.Vector3().fromArray(vertices[4]);
    var v5 = new THREE.Vector3().fromArray(vertices[5]);
    var v6 = new THREE.Vector3().fromArray(vertices[6]);
    var v7 = new THREE.Vector3().fromArray(vertices[7]);
    var v8 = new THREE.Vector3().fromArray(vertices[8]);*/
    var id = faces[0][0];
    var id1 = faces[0][1];
    var f0 = new THREE.Face3(id[0],id[1],id[2]);
    var f1 = new THREE.Face3(id1[0],id1[1],id1[2]);
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    /*geometry.vertices.push(v4);
    geometry.vertices.push(v5);
    geometry.vertices.push(v6);
    geometry.vertices.push(v7);
    geometry.vertices.push(v8);*/
    geometry.faces.push(f0);
    geometry.faces.push(f1);
    
    
    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = THREE.FaceColors;
    geometry.faces[0][0].color = new THREE.Color(1,0,0);
    geometry.faces[0][1].color = new THREE.Color(1,0,0);
  /*  geometry.faces[2].color = new THREE.Color(1,0,0);
    geometry.faces[3].color = new THREE.Color(1,0,0);
    geometry.faces[4].color = new THREE.Color(1,0,0);
    geometry.faces[5].color = new THREE.Color(1,0,0);
    geometry.faces[6].color = new THREE.Color(1,0,0);
    geometry.faces[7].color = new THREE.Color(1,0,0);
    geometry.faces[8].color = new THREE.Color(1,0,0);
    geometry.faces[9].color = new THREE.Color(1,0,0);
    geometry.faces[10].color = new THREE.Color(1,0,0);
    geometry.faces[11].color = new THREE.Color(1,0,0); */
    

    //
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    loop();

    //動き
    function loop()
    {
        requestAnimationFrame( loop );  // 関数を呼び続ける おまじないみたいなもの
        cube.rotation.x += 0.001;       // 回転
        cube.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}
