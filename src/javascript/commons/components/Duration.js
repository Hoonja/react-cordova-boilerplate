import React, { Component } from 'react';
import moment from 'moment';
import {connect} from "react-redux";
import {socket as action} from "../../redux/actions";
import {service, values} from "../configs";

const mapStateToProps = ({ socket }) => {
    return {
        remote: socket.remote,
    }
};
const mapDispatchProps = dispatch => ({
    updateStatus: (status) => dispatch(action.updateVideoCallStatus(status)),

});
class Duration extends Component {
    constructor(props){
        super(props);

        this.interval = null;

        this.state = {
        };
    }

    componentWillUnmount(){
        this.onStopTimer();
    }

    componentDidMount(){
        if(this.props.on){
            this.onStartTimer();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.on !== this.props.on && this.props.on){
            this.onStartTimer();
        } else if(prevProps.on !== this.props.on && !this.props.on){
            this.onStopTimer();
        }
    }

    run() {
        const {startTime} = this.state;

        this.animationId = requestAnimationFrame(() => {
            this.setState({
                duration: moment().diff(startTime)
            });
            setTimeout(() => {
                const keys = Object.keys(this.props.remote);
                const iceConnectionState = service.getValue(this.props.remote[keys[0]], 'peer.pc.pc.iceConnectionState', '');
                if(iceConnectionState === 'disconnected') {
                    this.props.updateStatus(values.callStatus.CALL_END);
                } else {
                    this.run();
                }
            }, 1000);

        });
    }

    onStartTimer() {
        this.setState({
            startTime: new Date()
        });
        this.run();
    }

    onStopTimer(){
        if(this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.props.setDuration(this.state.duration);
            this.run = null;
        }
    }

    render() {
        let {format='mm:ss', className=''} = this.props;

        return (
            <span className={className}>
                {moment(this.state.duration).format(format)}
            </span>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Duration);;
