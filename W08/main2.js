function main2()
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    var light = new THREE.PointLight(0xffffff);
    light.position.set(1,1,1);
    scene.add(light);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
   

    //Objectの構成
    var vertices = [ [-1,1,-1],[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,1],[-1,-1,1],[1,-1,1],[1,1,1]  ]; //v0,v1,v2,v3,v4,v5,v6,v7
    //var vertices = [ [-1,1,0],[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,2],[-1,-1,2],[1,-1,2],[1,1,2]  ]; //v0,v1,v2,v3,v4,v5,v6,v7
    var faces =    [ [0,1,2],[0,2,3],[4,5,1],[4,1,0],[7,6,5],[7,5,4],[3,2,6],[3,6,7],[4,0,3],[4,3,7],[2,1,5],[2,5,6] ];  //f0:v0,v1,v2
    
    var v0 = new THREE.Vector3().fromArray(vertices[0]);
    var v1 = new THREE.Vector3().fromArray(vertices[1]);
    var v2 = new THREE.Vector3().fromArray(vertices[2]);
    var v3 = new THREE.Vector3().fromArray(vertices[3]);
    var v4 = new THREE.Vector3().fromArray(vertices[4]);
    var v5 = new THREE.Vector3().fromArray(vertices[5]);
    var v6 = new THREE.Vector3().fromArray(vertices[6]);
    var v7 = new THREE.Vector3().fromArray(vertices[7]);
    var id = faces;
    var f0 = new THREE.Face3(id[0][0],id[0][1],id[0][2]);
    var f1 = new THREE.Face3(id[1][0],id[1][1],id[1][2]);
    var f2 = new THREE.Face3(id[2][0],id[2][1],id[2][2]);
    var f3 = new THREE.Face3(id[3][0],id[3][1],id[3][2]);
    var f4 = new THREE.Face3(id[4][0],id[4][1],id[4][2]);
    var f5 = new THREE.Face3(id[5][0],id[5][1],id[5][2]);
    var f6 = new THREE.Face3(id[6][0],id[6][1],id[6][2]);
    var f7 = new THREE.Face3(id[7][0],id[7][1],id[7][2]);
    var f8 = new THREE.Face3(id[8][0],id[8][1],id[8][2]);
    var f9 = new THREE.Face3(id[9][0],id[9][1],id[9][2]);
    var f10= new THREE.Face3(id[10][0],id[10][1],id[10][2]);
    var f11= new THREE.Face3(id[11][0],id[11][1],id[11][2]);

    
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    geometry.vertices.push(v5);
    geometry.vertices.push(v6);
    geometry.vertices.push(v7);
    geometry.faces.push(f0);
    geometry.faces.push(f1);
    geometry.faces.push(f2);
    geometry.faces.push(f3);
    geometry.faces.push(f4);
    geometry.faces.push(f5);
    geometry.faces.push(f6);
    geometry.faces.push(f7);
    geometry.faces.push(f8);
    geometry.faces.push(f9);
    geometry.faces.push(f10);
    geometry.faces.push(f11);
    
    
    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = THREE.FaceColors;
    geometry.faces[0].color = new THREE.Color(256,256,256);
    geometry.faces[1].color = new THREE.Color(256,256,256);
    geometry.faces[2].color = new THREE.Color(256,256,256);
    geometry.faces[3].color = new THREE.Color(256,256,256);
    geometry.faces[4].color = new THREE.Color(256,256,256);
    geometry.faces[5].color = new THREE.Color(256,256,256);
    geometry.faces[6].color = new THREE.Color(256,256,256);
    geometry.faces[7].color = new THREE.Color(256,256,256);
    geometry.faces[8].color = new THREE.Color(256,256,256);
    geometry.faces[9].color = new THREE.Color(256,256,256);
    geometry.faces[10].color = new THREE.Color(256,256,256);
    geometry.faces[11].color = new THREE.Color(256,256,256); 
    
    
    var triangle = new THREE.Mesh( geometry, material );
    scene.add( triangle );

    document.addEventListener('mousedown',mouse_down_event);
    function mouse_down_event(event)
    {
	//Mouse picking
	
	//Clicked point in window coordinates
	var x_win = event.clientX;
	var y_win = event.clientY;

	//Window coordinates to NDC
	var vx = renderer.domElement.offsetLeft;
	var vy = renderer.domElement.offsetTop;
	var vw = renderer.domElement.width;
	var vh = renderer.domElement.height;

	var x_NDC = 2*(x_win-vx)/vw-1;
	var y_NDC = -(2*(y_win-vy)/vh-1);

	//NDC to world coordinates
	var p_NDC = new THREE.Vector3(x_NDC,y_NDC,1);
	var p_wld = p_NDC.unproject(camera);

	//Origin and drection of the ray
	//カメラの位置
	var origin= camera.position;
	
	var direction = p_wld.sub(camera.position).normalize();

	//色を変える
	var raycaster = new THREE.Raycaster(origin,direction);
	var intersects = raycaster.intersectObject(triangle);
	if(intersects.length>0)
	{
	    intersects[0].face.color.setRGB(0,0,1);
	    intersects[0].object.geometry.colorsNeedUpdate = true;
	}
    }

    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        triangle.rotation.x += 0.001;
        triangle.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}