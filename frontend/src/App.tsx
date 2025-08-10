import {CaptureUpdateAction, Excalidraw } from '@excalidraw/excalidraw'
import "@excalidraw/excalidraw/index.css";
import { useEffect, useState } from 'react';
import ShinyButton from './comp/Button';
import newElements from './scene/newElement';
import axios from 'axios';

const extractPromptTexts = (elements: any[]): string[] => {
  return elements
    .filter(el => el.type === "text")
    .map(el => el.text.trim())
    .filter(text => text.startsWith("{") && text.endsWith("}"))
    .map(text => text.slice(1, -1)); // remove the { and }
};

export default function App() 
{

  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [promptPos, setPromptPos] = useState <{ x: number; y: number } | null>(null);

  const handleChange = () => {
    const elements = excalidrawAPI.getSceneElements();
    const promptEl = elements.find(
    (el) =>
      el.type === "text" &&
      el.text?.trim().startsWith("{") &&
      el.text?.trim().endsWith("}")
    );
    // setHasPrompt(foundPrompt);
  if (promptEl) {
    const newPos = {
      x: promptEl.x + promptEl.width + 10,
      y: promptEl.y,
    };

    // Only update if position actually changed
    if (
      !promptPos ||
      newPos.x !== promptPos.x ||
      newPos.y !== promptPos.y
    ) {
      setPromptPos(newPos);
      // insertOrUpdateCanvasButton(promptEl);
    }
    if (!hasPrompt) setHasPrompt(true);

  } 
  else {
    // Only update if it was true before
    if (hasPrompt) setHasPrompt(false);
    if (promptPos) setPromptPos(null);
  }
    console.log(`x = ${promptPos?.x} y = ${promptPos?.y} and ${hasPrompt}`);

    // save locally
    // const existingElements = excalidrawAPI.getSceneElements();
    // const appState = excalidrawAPI.getAppState();
    // localStorage.setItem("excalidraw-scene", JSON.stringify({existingElements,appState}));
  };

//   const insertOrUpdateCanvasButton = (promptEl) => {
//   const id = runButtonIdRef.current || `run-btn-${promptEl.id}`; // link to prompt

//   const existingElements = excalidrawAPI.getSceneElements();
//   const existingRect = existingElements.find((el) => el.id === `${id}-rect`);
//   const existingText = existingElements.find((el) => el.id === `${id}-text`);

//   const newX = promptEl.x + promptEl.width + 20;
//   const newY = promptEl.y;

//   const rect = {
//     id: `${id}-rect`,
//     type: "rectangle",
//     x: newX,
//     y: newY,
//     width: 80,
//     height: 40,
//     backgroundColor: "#a78bfa",
//     strokeColor: "#000",
//     fillStyle: "solid",
//     ...getSharedProps(),
//   };
//   const text = {
//   id: `${id}-text`,
//   type: "text",
//   x: newX + 20,
//   y: newY + 10,
//   width: 0,
//   height: 0,
//   angle: 0,
//   strokeColor: "#000000",
//   backgroundColor: "transparent",
//   fillStyle: "solid",
//   strokeWidth: 1,
//   roughness: 0,
//   opacity: 100,
//   groupIds: [id],
//   boundElements: [],
//   seed: Math.floor(Math.random() * 100000),
//   version: 1,
//   versionNonce: Math.floor(Math.random() * 100000),

//   // ✅ Required text properties
//   text: "Run",
//   fontSize: 20,
//   fontFamily: 1,
//   textAlign: "center",
//   verticalAlign: "middle",
//   baseline: 18,

//   // ✅ These help prevent crashes or locked states
//   locked: false,
//   isDeleted: false,
//   };


//   if (existingRect || existingText) {
//     // Update scene with modified existing
//     const updatedElements = existingElements.map((el) => {
//       if (el.id === `${id}-rect`) return { ...rect, version: el.version + 1 };
//       if (el.id === `${id}-text`) return { ...text, version: el.version + 1 };
//       return el;
//     });
//     excalidrawAPI.updateScene({ elements: updatedElements });
//   } else {
//     // Insert new
//     excalidrawAPI.updateScene({
//       elements: [...existingElements, rect, text],
//     });
//     runButtonIdRef.current = id;
//   }
// };

// const getSharedProps = () => ({
//   angle: 0,
//   fillStyle: "solid",
//   strokeWidth: 1,
//   roughness: 0,
//   opacity: 100,
//   seed: Math.floor(Math.random() * 100000),
//   version: 1,
//   versionNonce: Math.floor(Math.random() * 100000),
//   groupIds: [],
//   boundElements: [],
// });

  const handlePromptScan = () => {
    const elements = excalidrawAPI.getSceneElements();
    const prompts = extractPromptTexts(elements);
    if (prompts.length > 0) {
      console.log(`prompts = ${prompts}`);
    } else {
      console.log("No prompts detected.");
    }
  };

  const updateScene = () => {
    const existingElements = excalidrawAPI.getSceneElements();
    const sceneData = {
      elements: [...existingElements,...newElements],
      // appState: {
      //   viewBackgroundColor: "#edf2ff",
      // },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    };
    if (excalidrawAPI) {
      excalidrawAPI.updateScene(sceneData);
    }

    const elements = excalidrawAPI.getSceneElements();
    console.log(elements.map(el => ({ id: el.id, locked: el.locked })));
  };

  
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (e.key === "Enter" && hasPrompt && isCmdOrCtrl) {
        e.preventDefault();
        // handlePromptScan();
        const elements = excalidrawAPI.getSceneElements();
        const prompts = extractPromptTexts(elements);
        window.alert(`prompt = ${prompts}`);
        const res = await axios.post('http://localhost:3000/api/prompt',{prompts});
        console.log(res);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasPrompt]);

  return (
    <div className="h-screen w-screen">
      <Excalidraw 
        excalidrawAPI={(api) => setExcalidrawAPI(api)} 
        renderTopRightUI = {() => {
            return (
              <ShinyButton
                onClick={updateScene}/>
            );
        }}
        initialData = {{
          elements: [],
          appState: { viewBackgroundColor: "#ffffff" }
        }}
        theme='dark'
        onChange={() => {
          // const existingElements = excalidrawAPI.getSceneElements();
          handlePromptScan();
          handleChange();
          // console.log(existingElements);
        }}
      />
    </div>
  )
};
 