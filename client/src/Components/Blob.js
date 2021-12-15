import React, { useEffect, useRef, useState } from 'react'
import Socket from '../services/socket'
import './Blob.css'
import * as THREE from 'three'
import { perlin3D } from '@leodeslf/perlin-noise'

const Blob = () => {
  const [status, setStatus] = useState({})
  const canvasRef = useRef()

  useEffect(() => {
    console.log('init')
    console.log('app mounted')
    Socket.onMessage((message) => {
      if (message.text !== status) {
        setStatus(message)
      }
    })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const light = new THREE.AmbientLight(0xefe0ff) // soft white light
    scene.add(light)

    const light2 = new THREE.PointLight(0xefe0ff, 6, 50)
    light2.position.set(10, 10, 15)
    scene.add(light2)

    const geometry = new THREE.SphereGeometry(3, 128, 128)

    const material = new THREE.MeshStandardMaterial({
      color: 0x7b2eff,
      wireframe: false,
    })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 3
    var k = 2

    const animate = () => {
      var time = performance.now() * 0.001
      geometry.attributes.position.needsUpdate = true
      cube.matrixAutoUpdate = true
      cube.rotation.z += 0.0
      if (status.isWoke) {
        camera.position.z = 3
        k = 5
      } else {
        camera.position.z = 5
        k = 2
      }

      for (var i = 0; i < geometry.attributes.position.array.length; i++) {
        if (i % 3 === 0) {
          const v = new THREE.Vector3(
            geometry.attributes.position.array[i],
            geometry.attributes.position.array[i + 1],
            geometry.attributes.position.array[i + 2]
          )

          v.normalize().multiplyScalar(
            1 + 0.3 * perlin3D(v.x * k + time, v.y * k, v.z * k)
          )

          geometry.attributes.position.array[i] = v.x
          geometry.attributes.position.array[i + 1] = v.y
          geometry.attributes.position.array[i + 2] = v.z
        }
      }

      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  })

  return <canvas ref={canvasRef} className='three-canvas' />
}

export default Blob
