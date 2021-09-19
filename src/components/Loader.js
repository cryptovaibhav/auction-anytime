import React from 'react';
import loader from "../assets/spinner.gif";

function Loader(props) {
    return(
        <div className="spinner">
            <img src={loader}></img>
        </div>
    );
}

export default Loader;