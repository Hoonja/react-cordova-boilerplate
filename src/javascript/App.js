import React from 'react';

import { StickyContainer } from 'react-sticky';
import { WrapperContainer } from './layout';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menu : false,
            mypage : false,
        };

        this.onOpenChange = this.onOpenChange.bind(this);
    }

    onOpenChange(target){
        return this.setState({
            menu : false,
            mypage : false,
            [target] : !this.state[target],
        });
    }

    render() {
        return (
            <div>

                <StickyContainer className="contents-container">
                    {/*<HeaderContainer onOpenChange={this.onOpenChange}/>*/}
                    <WrapperContainer />
                    {/*<FooterContainer />*/}
                </StickyContainer>
            </div>
        );
    }
}

export default App;
