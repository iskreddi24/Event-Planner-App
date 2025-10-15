import { useState } from "react";
import "../styles/stylefun.css"; 

import Anniversary from "../pages/events/Anniversary";
import Birthday from "../pages/events/Birthday";
import HalfSaree from "../pages/events/HalfSaree";
import Wedding from "../pages/events/Wedding";

function InnerCompo() {
    const [currentPage, setCurrentPage] = useState('anniversary'); 

    const renderPage = () => {
        switch (currentPage) {
            case 'anniversary':
                return <Anniversary />;
            case 'birthday':
                return <Birthday />;
            case 'halfsaree':
                return <HalfSaree />;
            case 'wedding':
                return <Wedding />;
            default:
                return <Anniversary />;
        }
    };

    return (
        <div>
            <nav className="fun-navbar">
                <h2 className="fun-title">Our Services</h2>
                <ul className="fun-menu">
                    <li><button onClick={() => setCurrentPage('anniversary')} className={currentPage === 'anniversary' ? 'active' : ''}>Anniversary</button></li>
                    <li><button onClick={() => setCurrentPage('birthday')} className={currentPage === 'birthday' ? 'active' : ''}>Birthday</button></li>
                    <li><button onClick={() => setCurrentPage('halfsaree')} className={currentPage === 'halfsaree' ? 'active' : ''}>Half Saree</button></li>
                    <li><button onClick={() => setCurrentPage('wedding')} className={currentPage === 'wedding' ? 'active' : ''}>Wedding</button></li>
                </ul>
            </nav>

            {renderPage()}
        </div>
    );
}

export default InnerCompo;