from typing import Annotated
from typing_extensions import TypedDict

from nodes import  node_2_filter, node_3_filter, node_4_finalizer
from node_1 import node_1_generator
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

class DiagramState(TypedDict, total=False):
    messages: Annotated[list, add_messages]
    user_input: str
    raw_diagram: str
    filtered_v1: str
    filtered_v2: str
    final_diagram: str


# build graph
graph = StateGraph(DiagramState)

graph.add_node("generator", node_1_generator)
graph.add_node("filter1", node_2_filter)
graph.add_node("filter2", node_3_filter)
graph.add_node("finalizer", node_4_finalizer)

# connect nodes
graph.set_entry_point("generator")
graph.add_edge("generator", "filter1")
graph.add_edge("filter1", "filter2")
graph.add_edge("filter2", "finalizer")
graph.add_edge("finalizer", END)

app = graph.compile()

initial_state = DiagramState(user_input="Draw me a network diagram")
final_state = app.invoke(initial_state)

print("\nFinal State:", final_state)

from IPython.display import Image, display

try:
    display(Image(app.get_graph().draw_mermaid_png()))
except Exception as e:
    print(e)
    # This requires some extra dependencies and is optional
    pass