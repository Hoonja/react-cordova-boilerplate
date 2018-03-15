import React, { Component } from 'react';
import moment from 'moment';

class Timer extends Component {
    constructor(props){
        super(props);

        let {countTime = 180000} = this.props;

        this.interval = null;

        this.state = {
            resetId: undefined,
            countTime:countTime
        }
    }

    componentWillUnmount(){
        this.deleteInterval();
    }

    componentDidMount(){
        if(this.props.on){
            this.runInterval();
        }
    }

    runInterval(){
        this.deleteInterval();

        this.interval = setInterval(()=>{
            let {countTime} = this.state;
            if (countTime > 0){
                this.setState({
                    countTime:countTime - 1000
                })
            } else {
                if(this.props.timeoutCallback){
                    this.props.timeoutCallback();
                }
                this.deleteInterval();
            }
        }, 1000);
    }

    deleteInterval() {
        if(this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.resetId !== nextProps.resetId){
            this.setState({
                resetId :nextProps.resetId,
                countTime :nextProps.countTime
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.on === true){
            this.runInterval()
        } else {
            this.deleteInterval()
        }
    }

    render() {
        let {label='유효시간', format='mm:ss', className=''} = this.props;

        return (
            <span className={className} onClick={(e)=>{if(this.props.onClick){this.props.onClick(e)}}}>
        {label}
                <em>
          {moment(this.state.countTime).format(format)}
        </em>
      </span>
        );
    }
}

export default Timer;
