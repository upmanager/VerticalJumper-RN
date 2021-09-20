import { ADDJUMER, REMOVEJUMPER, SAVEHEIGHT } from "@constants";
const initialState = {
    jumpers: [],
};

export default (state = initialState, action = {}) => {
    let { jumpers } = state;

    switch (action.type) {
        case ADDJUMER:
            if (!jumpers) jumpers = [];
            return { ...state, jumpers: [...jumpers, action.data] };
        case REMOVEJUMPER:
            if (!jumpers) jumpers = [];
            jumpers = jumpers.filter(item => item.key != action.data);
            return { ...state, jumpers: [...jumpers] };
        case SAVEHEIGHT:
            const index = jumpers.findIndex(item => item.key == action.data.key);
            if (index >= 0) {
                jumpers[index].height = action.data.height;
            }
            return { ...state, jumpers: [...jumpers] };
        default:
            return state;
    }
};
