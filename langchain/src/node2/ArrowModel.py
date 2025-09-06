from pydantic import BaseModel,Field,ConfigDict,constr
from typing import Literal, Optional,List,Type

class label_class(BaseModel):
    text : Optional[str]
    strokeColor : Optional[str] = Field(
    "transparent",
    pattern=r'^(transparent|#[0-9a-fA-F]{6})$'
    )

class StartModel(BaseModel):
    id : Optional[str] = None
    # type : Optional[Literal['text', "rectangle" , "ellipse" , "diamond"]] = None
    # text : Optional[str] = None
    # height : Optional[float] = None
    # width : Optional[float] = None
    # label : Optional[label_class] = None

class EndModel(BaseModel):
    id : Optional[str] = None
    # type : Optional[Literal['text', "rectangle" , "ellipse" , "diamond"]] = None
    # text : Optional[str] = None
    # height : Optional[float] = None
    # width : Optional[float] = None
    # label : Optional[label_class] = None


class ArrowModel(BaseModel):
