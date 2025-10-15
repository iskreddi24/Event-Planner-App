import React from 'react';
import SwipeSentence from '../components/SwipeSentence';
import InnerCompo from '../components/InnerCompo';

function HomeComp() {
    return (
        <div className="homemain">
            <SwipeSentence />
            <InnerCompo />
        </div>
    );
}

export default HomeComp;