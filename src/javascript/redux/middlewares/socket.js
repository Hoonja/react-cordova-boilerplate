import {socket as type} from '../types'

function middleware (socket) {
    const criteria = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    const _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$eventName = _ref.eventName,
        eventName = _ref$eventName === undefined ? 'action' : _ref$eventName,
        _ref$execute = _ref.execute,
        execute = _ref$execute === undefined ? defaultExecute : _ref$execute;

    let emitBound = socket.emit.bind(socket);
    return function (_ref2) {
        const dispatch = _ref2.dispatch;
        let nextRef;

        // Wire socket.io to dispatch actions sent by the server.
        socket.on(eventName, dispatch);
        socket.on('reconnect', (attemptNumber) => {
            execute({type: type.SOCKET_RECONNECT}, emitBound, nextRef, dispatch);
        });
        socket.on('disconnect', () => {
            execute({type: type.SOCKET_DISCONNECT}, emitBound, nextRef, dispatch);
        });

        return function (next) {
            nextRef = next;
            return function (action) {
                if (evaluate(action, criteria)) {
                    return execute(action, emitBound, next, dispatch);
                }
                return next(action);
            };
        };
    };

    function evaluate(action, option) {
        if (!action || !action.type) {
            return false;
        }

        const type = action.type;

        let matched = false;
        if (typeof option === 'function') {
            // Test function
            matched = option(type, action);
        } else if (typeof option === 'string') {
            // String prefix
            matched = type.indexOf(option) === 0;
        } else if (Array.isArray(option)) {
            // Array of types
            matched = option.some(function (item) {
                return type.indexOf(item) === 0;
            });
        }
        return matched;
    }

    function defaultExecute(action, emit, next, dispatch) {
        // eslint-disable-line no-unused-vars
        emit(eventName, action);
        return next(action);
    }
}
export default middleware;