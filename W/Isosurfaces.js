function Isosurfaces( volume, isovalue , Color)   
{
    var geometry = new THREE.Geometry();//
    //var material = new THREE.MeshLambertMaterial();//
    var material = new THREE.MeshPhongMaterial();
    
    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();
    var cell_index = 0;
    var counter = 0;
 
    //Marching process
    for ( var z = 0; z < volume.resolution.z - 1; z++ )
    {
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {
		//
                var indices = cell_node_indices( cell_index++ );
		//
                var index = table_index( indices );
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

		//For each triangle face
                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
		    //Extract a triangle face
		    
		    //Edges and its end-points
		    //3角形の各頂点
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+2];
                    var eid2 = lut.edgeID[index][j+1];

		    //3角形の各頂点の両端の頂点
                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];

		    //vertex coordinates of the end-points
                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );

		    //Vertex coordinates of the triangle face
		    //3角形の各頂点の座標
                    var v01 = interpolated_vertex( v0, v1, isovalue );
                    var v23 = interpolated_vertex( v2, v3, isovalue );
                    var v45 = interpolated_vertex( v4, v5, isovalue );
		    
		    //各頂点をpush
                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );

                    var id0 = counter++;  //v01
                    var id1 = counter++;  //v23
                    var id2 = counter++;  //v45
                    geometry.faces.push( new THREE.Face3( id0, id1, id2 ) );    
                }
            }
            cell_index++;
        }
        cell_index += volume.resolution.x;
    }

    geometry.computeVertexNormals();


    //change color
    //material.color = new THREE.Color( "white" );

    // Create color map
    var RESOLUTION = 256;//resolution
    var cmap = [];
    for ( var i = 0; i < RESOLUTION; i++ )
    {
	var S = i / (RESOLUTION-1); // [0,1]
	//var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
	//var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
	//var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
	//var color = new THREE.Color( R, G, B );
	var color = new THREE.Color( Color );
	cmap.push( [ S, '0x' + color.getHexString() ] );
    }
        
    
    // Assign colors for each vertex
    material.vertexColors = THREE.VertexColors;
    var nfaces = geometry.faces.length;
    for ( var i = 0; i < nfaces; i++ )
    {
/*	var id = geometry.faces[i];
	var S0 = volume.values[ id[0] ];
	var S1 = volume.values[ id[1] ];
	var S2 = volume.values[ id[2] ];*/
	var C0 = new THREE.Color().setHex(cmap[isovalue][1]); 
	var C1 = new THREE.Color().setHex(cmap[isovalue][1]); 
	var C2 = new THREE.Color().setHex(cmap[isovalue][1]); 
	geometry.faces[i].vertexColors.push( C0 );
	geometry.faces[i].vertexColors.push( C1 );
	geometry.faces[i].vertexColors.push( C2 );
    }
  
    
    return new THREE.Mesh( geometry, material );


    function cell_node_indices( cell_index )
    {
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

	//cell node indices
	//立方体の各格子点
        var id0 = cell_index;
        var id1 = id0 + 1;
        var id2 = id1 + lines;
        var id3 = id0 + lines;
        var id4 = id0 + slices;
        var id5 = id1 + slices;
        var id6 = id2 + slices;
        var id7 = id3 + slices;
	
        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices )
    {
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];

        var index = 0;
        if ( s0 > isovalue ) { index |=   1; }
        if ( s1 > isovalue ) { index |=   2; }
        if ( s2 > isovalue ) { index |=   4; }
        if ( s3 > isovalue ) { index |=   8; }
        if ( s4 > isovalue ) { index |=  16; }
        if ( s5 > isovalue ) { index |=  32; }
        if ( s6 > isovalue ) { index |=  64; }
        if ( s7 > isovalue ) { index |= 128; }
	//求めたindexを返す
        return index;
    }

    //頂点の補間(v0,v1:end-points,s:isovalue
    function interpolated_vertex( v0, v1, s )
    {
	var id0 = get_index(v0.x,v0.y,v0.z);
	var id1 = get_index(v1.x,v1.y,v1.z);

	var s0 = volume.values[id0];
	var s1 = volume.values[id1];

	if(s0 == s1){
            return new THREE.Vector3().addVectors( v0, v1 ).divideScalar( 2 );
	}else{
	    var a = (s-s0)/(s1-s0);    
	    var x = (1-a)*v0.x+a*v1.x ;
	    var y = (1-a)*v0.y+a*v1.y ;
	    var z = (1-a)*v0.z+a*v1.z ;
	    return new THREE.Vector3(x,y,z);
	}

	function get_index(x,y,z)
	{
	    var nlines = volume.resolution.x;   
	    var nslices = volume.resolution.x * volume.resolution.y;
	    return x + y*nlines + z*nslices;
	}


    }
}
