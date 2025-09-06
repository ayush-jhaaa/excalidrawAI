

def node_2_filter(state):
    state["filtered_v1"] = "PLACEHOLDER_FILTER"
    print('node 2 running')
    return state

def node_3_filter(state):
    state["filtered_v2"] = "PLACEHOLDER_FILTER"
    print('node 3 running')
    return state

def node_4_finalizer(state):
    state["final_diagram"] = "PLACEHOLDER_FINAL"
    print('node 4 running')
    return state
