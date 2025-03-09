import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";


async function manage_join(room_id: string) {
    await fetch(`/api/room/join/${room_id}`, { method: "PUT" })

}

function Join() {

    const navigate = useNavigate();
    const { room_id } = useParams();
    const [errorMessage, setErrorMessage] = useState(undefined as (string | undefined))
    console.log(room_id)
    useEffect(() => {
        if (room_id === undefined) {
            navigate('/');
            return
        }
        manage_join(room_id).then(() => {
            navigate('/')
        }).catch((err) => {
            setErrorMessage(err.toString())
        })
    })

    const errorDisplay = <>
        <div>
            Could not join room "{room_id}"
            <div>{errorMessage}</div>
        </div>
        <button onClick={() => navigate('/')}>OK</button>
    </>

    return (
        <>
            {errorMessage ? errorDisplay : ""}
        </>
    )
}

export default Join
