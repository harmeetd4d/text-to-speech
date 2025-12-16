"use client"

import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { folder, Leva, useControls } from "leva";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { FileContext } from "../contexts/FileContext";
import { AudioControlContext } from "../contexts/AudioControlContext";


const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

let setupMode = false;

const SpeakerBot=(props)=> {
  const { filesUrl } = useContext(FileContext);
  const { playAudio, setPlayAudio } = useContext(AudioControlContext)

  const { nodes, materials, scene } = useGLTF(
    "/models/678e299ce34aab11ffcd3897.glb"
  );

  const {
    script,
    headFollow,
    smoothMorphTarget,
    morphTargetSmoothing,
  } = useControls({
    playAudio: {
      value: playAudio,
      render: setPlayAudio,
    },
    headFollow: true,
    smoothMorphTarget: true,
    morphTargetSmoothing: 0.5,

    // script: {
    //   value: "welcome",
    //   options: ["welcome", "pizzas", "happy", "angry",],
    // },
  });
  // const audio = useMemo(() => new Audio(`/audios/${script}.mp3`), [script]);
  const [audio, setAudio] = useState(null);
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [jsonFile, setJsonFile] = useState(null);
  // const jsonFile = useLoader(THREE.FileLoader, filesUrl.json);
  // const lipsync = JSON.parse(jsonFile);

  useEffect(() => {
    if (filesUrl.json) {
      const loader = new THREE.FileLoader();
      loader.load(filesUrl.json, (data) => {
        const lipsync = JSON.parse(data);  // Parse JSON here
        setJsonFile(lipsync);
      });
    }
  }, [filesUrl.json]);

  useEffect(() => {
    if (filesUrl.audio) {
      const newAudio = new Audio(filesUrl.audio);
      setAudio(newAudio);
    }
  }, [filesUrl.audio]);

  useEffect(() => {
    const newAudio = new Audio(filesUrl.audio);

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
    }

    setAudio(newAudio);
  }, [script]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;
    if (audio.paused || audio.ended) {
      setPlayAudio(false)
      setAnimation("Standing");
      return;
    }

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );
      }
    });

    for (let i = 0; i < jsonFile.mouthCues.length; i++) {
      const mouthCue = jsonFile.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = 1;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
            ],
            1,
            morphTargetSmoothing
          );
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
            corresponding[mouthCue.value]
            ]
            ],
            1,
            morphTargetSmoothing
          );
        }

        break;
      }
    }
  });

  useEffect(() => {
    nodes.Wolf3D_Head.morphTargetInfluences[
      nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
    ] = 1;
    nodes.Wolf3D_Teeth.morphTargetInfluences[
      nodes.Wolf3D_Teeth.morphTargetDictionary["viseme_I"]
    ] = 1;
    if (audio) {
      if (playAudio) {
        audio.play();
        if (script === "welcome") {
          setAnimation("Standing");
        } else {
          setAnimation("Standing");
        }
      } else {
        setAnimation("Standing");
        audio.pause();
      }
    }
  }, [playAudio, script, audio]);

  const { animations: greetingAnimation } = useFBX("/animations/Waving.fbx");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: standingAnimation } = useFBX("/animations/Standing.fbx");

  greetingAnimation[0].name = "Greeting";
  idleAnimation[0].name = "Idle";
  standingAnimation[0].name = "Standing";

  const [animation, setAnimation] = useState("Standing");

  const group = useRef();
  const { actions } = useAnimations([greetingAnimation[0], idleAnimation[0], standingAnimation[0]], group);

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation]);

  // CODE ADDED AFTER THE TUTORIAL (but learnt in the portfolio tutorial ♥️)
  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("Head").lookAt(state.camera.position);
    }
  });


  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );

        if (!setupMode) {
          try {
            set({
              [target]: value,
            });
          } catch (e) { }
        }
      }
    });
  };

  useFrame(() => {
    !setupMode &&
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        const mapping = {};
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
          return; // eyes wink/blink are handled separately
        }
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });

    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    // LIPSYNC
    if (setupMode) {
      return;
    }

    const appliedMorphTargets = [];

    Object.values(corresponding).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);



  return (
    <>
      <Leva hidden={true} />
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
        <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
        <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
        <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
        <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
        <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
      </group>
    </>
  )
}

useGLTF.preload('/models/678e299ce34aab11ffcd3897.glb')
export default SpeakerBot