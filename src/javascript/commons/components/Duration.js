import React, { Component } from 'react';
import moment from 'moment';

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
            this.run();
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
        }
    }

    render() {
        let {format='mm:ss', className=''} = this.props;

        return (
            <span className={className}>
                <em>
                    {moment(this.state.duration).format(format)}
                </em>
            </span>
        );
    }
}

export default Duration;
