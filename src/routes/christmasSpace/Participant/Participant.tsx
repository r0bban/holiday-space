import React from "react";
import {useParams} from "react-router-dom";

function Participant() {

    let { participantId } = useParams();

    return (
        <div>
            <h1>
                This is home for participant: {participantId}
            </h1>
        </div>
    )
}

export default Participant;