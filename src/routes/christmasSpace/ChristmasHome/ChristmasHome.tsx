import React from "react";
import {useParams} from "react-router-dom";

function ChristmasHome() {

    let { gameId } = useParams();
    return (
        <div>
            <h1>
                This is home for game: {gameId}
            </h1>
        </div>
    )
}

export default ChristmasHome;