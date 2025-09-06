import {CaptureUpdateAction, Excalidraw, exportToSvg } from '@excalidraw/excalidraw'
import "@excalidraw/excalidraw/index.css";
import { useEffect, useState } from 'react';
import ShinyButton from './comp/Button';
import newElements from './scene/newElement';
import axios from 'axios';
import {
  sceneCoordsToViewportCoords,
  viewportCoordsToSceneCoords,
} from "@excalidraw/excalidraw"; 

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
 