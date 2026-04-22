import { convertToExcalidrawElements,mutateElement } from "@excalidraw/excalidraw";

const newElements = convertToExcalidrawElements([
    {
    "id": "DPhlo2rEeRQbPExWtk1-T",
    "type": "line",
    "x": 386.58984375,
    "y": 184.82421875,
    "width": 8.515625,
    "height": 265.0546875,
    "angle": 0,
    "strokeColor": "#1e1e1e",
    "backgroundColor": "transparent",
    "fillStyle": "solid",
    "strokeWidth": 2,
    "strokeStyle": "solid",
    "roughness": 1,
    "opacity": 100,
    "groupIds": [],
    "frameId": null,
    "roundness": {
        "type": 2
    },
    "seed": 1020305802,
    "version": 49,
    "versionNonce": 1423684118,
    "isDeleted": false,
    "boundElements": null,
    "updated": 1761419808138,
    "link": null,
    "locked": false,
    "points": [
        [
            0,
            0
        ],
        [
            8.515625,
            265.0546875
        ]
    ],
    "lastCommittedPoint": null,
    "startBinding": null,
    "endBinding": null,
    "startArrowhead": "triangle",
    "endArrowhead": null
}
])
  
newElements.forEach((el) => {
  if (el.type === "text" && !el.containerId) {
    mutateElement(el, { width: 475.0,height:229.5
    });
  }
});
newElements.forEach(el => {
  if (el.type === "arrow") {
    mutateElement(el as any, {"startArrowhead": "triangle",});
  }
});

export default newElements