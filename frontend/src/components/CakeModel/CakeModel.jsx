// src/components/GLBViewer.jsx
import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, onModelLoad }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  React.useEffect(() => {
    if (scene && onModelLoad) {
      onModelLoad(scene); // pass loaded scene to parent
    }
  }, [scene, onModelLoad]);

  return <primitive ref={groupRef} object={scene} />;
}

function GLBViewer() {
  const [modelUrl, setModelUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6'); 
  const [secondaryColor, setSecondaryColor] = useState('#EF4444');
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [meshInfo, setMeshInfo] = useState([]);

  const modelSceneRef = useRef(null); // keep the loaded scene reference

  const handleModelLoad = (scene) => {
    setIsModelLoaded(true);
    modelSceneRef.current = scene; // store reference for later color changes
    
    // Extract mesh info
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        meshes.push({
          name: child.name || 'Unnamed Mesh',
          material: child.material ? child.material.type : 'No Material'
        });
      }
    });
    setMeshInfo(meshes);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setIsModelLoaded(false);
      modelSceneRef.current = null;
    }
  };

  const applyColors = () => {
    if (!modelSceneRef.current) return;

    let index = 0;
    modelSceneRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone material so each mesh can be recolored independently
        child.material = child.material.clone();
        if (index % 2 === 0) {
          child.material.color.set(primaryColor);
        } else {
          child.material.color.set(secondaryColor);
        }
        index++;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          3D Model Viewer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            
           
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload GLB File
              </label>
              <input
                type="file"
                accept=".glb"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

           
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-300"
                />
              </div>

              <button
                onClick={applyColors}
                disabled={!isModelLoaded}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Apply Colors
              </button>
            </div>

            {/* Info */}
            {isModelLoaded && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Model Information</h3>
                <div className="text-sm text-gray-600">
                  <p>Meshes: {meshInfo.length}</p>
                  {meshInfo.slice(0, 3).map((mesh, index) => (
                    <p key={index} className="truncate">
                      {mesh.name} ({mesh.material})
                    </p>
                  ))}
                  {meshInfo.length > 3 && (
                    <p>+{meshInfo.length - 3} more meshes...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Viewer */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">3D Preview</h2>
            
            <div className="aspect-video bg-gray-200 rounded-lg relative">
              {modelUrl ? (
                <Canvas
                  camera={{ position: [5, 5, 5], fov: 75 }}
                  className="rounded-lg"
                >
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    
                    <Model 
                      url={modelUrl} 
                      onModelLoad={handleModelLoad}
                    />
                    
                    <OrbitControls />
                    <Environment preset="sunset" />
                  </Suspense>
                </Canvas>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Upload a GLB file to view 3D model</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GLBViewer;
