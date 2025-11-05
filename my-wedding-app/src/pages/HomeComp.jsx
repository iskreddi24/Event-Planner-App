// import React from 'react';
// import SwipeSentence from '../components/SwipeSentence';
// import InnerCompo from '../components/InnerCompo';

// function HomeComp() {
//     return (
//         <div className="homemain">
//             <SwipeSentence />
//             <InnerCompo />
//         </div>
//     );
// }

// export default HomeComp;
import React from 'react';
// Import the component you want to add
import VIPWeddingServiceComp from './VIPWeddingServiceComp'; 
// Import the Auth context to check if the user is logged in
import { useAuth } from "../context/AuthContext"; 
import SwipeSentence from '../components/SwipeSentence';
import InnerCompo from '../components/InnerCompo';

function HomeComp() {
    // Access the authentication status
    const { isAuthenticated } = useAuth(); 

    return (
        <div className="homemain">
            <SwipeSentence />
            <InnerCompo />
            
            {/* ----------------------------------------------------------------- */}
            {/* --- Conditional Rendering for VIPWeddingServiceComp (After Login) --- */}
            {/* If the user is authenticated, render the VIP component */}
            {isAuthenticated && <VIPWeddingServiceComp />}
            {/* ----------------------------------------------------------------- */}
        </div>
    );
}

export default HomeComp;