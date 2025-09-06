from pydantic import BaseModel,Field,ConfigDict,constr
from typing import Literal, Optional,List,Type


class label_class(BaseModel):
    text : Optional[str]
    strokeColor : Optional[str] = Field(
    "transparent",
    pattern=r'^(transparent|#[0-9a-fA-F]{6})$'
    )

null = None
false = False
######################################
class Roundness(BaseModel):
    # internal enum; typical values: 2 (slight), 3 (full), 12 (pill/ellipse)
    type: Literal[2, 3, 12]
    value: Optional[float] = Field(default=None, ge=0)

    model_config = ConfigDict(extra="forbid")

######################################
class BoundElementRef(BaseModel):
    id: str
    type: Literal["arrow" , "text"]  # currently only "arrow" shows up here also text, for fuck sake this is enough

    model_config = ConfigDict(extra="forbid")

######################################

# Hex or "transparent"
# HexOrTransparent = constr(pattern=r'^(transparent|#[0-9a-fA-F]{6})$')


class ShapeModel(BaseModel):
    id : Optional[str] = None
    x : int
    y : int
    type : Literal["rectangle" , "diamond" , "ellipse"]
    height : Optional[int] = Field(None)
    width : Optional[int] = Field(None)
    opacity : Optional[int] = Field(100, ge=0, le=100)
    angle : Optional[float] = None # in radians

    fillStyle : Optional[Literal["solid" , "hachure" , "cross-hatch"]] = Field("hachure")
    backgroundColor: Optional[str] = Field(
        "transparent",
        pattern=r'^(transparent|#[0-9a-fA-F]{6})$'
    )
    strokeColor : Optional[str] = Field(
        "transparent",
        pattern=r'^(transparent|#[0-9a-fA-F]{6})$'
        )
    strokeWidth : Optional[Literal[1,2,4,8]] = None
    strokeStyle : Optional[Literal["solid" , "dashed" , "dotted"]] = None

    roughness : Optional[float] = Field(1,ge = 0.001,le = 2)
    label : Optional[label_class] = None

    link : Optional[str] = None
    locked : Optional[bool] = None

    groupIds: Optional[List[str]] = None
    roundness: Optional[Roundness] = None
    seed: Optional[int] = None
    version: Optional[int] = Field(default=None, ge=1)
    versionNonce: Optional[int] = None
    boundElements: Optional[List[BoundElementRef]] = None

    def corrected(self) -> dict:
        data = self.model_dump(exclude_none=True)
        # if label exists, remove width/height
        if "label" in data:
            data.pop("width", None)
            data.pop("height", None)
        return data
    
    model_config = ConfigDict(extra="ignore")

raw =     {
      "id": "node3_data",
      "type": "rectangle",
      "x": 620,
      "y": 200,
      "width": 100,
      "height": 80,
      "angle": 0,
      "strokeColor": "#000000",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [
        "node3"
      ],
      "roundness": {
        "type": 3
      },
      "seed": 1,
      "version": 1,
      "versionNonce": 1,
      "boundElements": [
        {
          "id": "arrow_node2_node3",
          "type": "arrow"
        },
        {
          "id": "text_30",
          "type": "text"
        }
      ],
      "updated": 1,
      "link": null,
      "locked": false
    }

# import json
# pydantic_raw = json.loads(raw)
# from pydantic import ValidationError
# try:
#     obj = shape.model_validate(raw)   # not .parse_obj, not .dict()
#     print("OK:", obj.corrected())
# except ValidationError as e:
#     for e in e.errors():
#         print("\nERR:",type(e))


from pydantic import ValidationError

try:
    obj = ShapeModel.model_validate(raw)
    print("OK:", obj.corrected())
except ValidationError as e:
    for err in e.errors():
        # each `err` is a dict
        print("\nERR dict:", err)

        # you can unpack it directly
        loc = err.get("loc")
        msg = err.get("msg")
        err_type = err.get("type")
        print(f"Location: {loc}, \nMessage: {msg}, \nType: {err_type}")
