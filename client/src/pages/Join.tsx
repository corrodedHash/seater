import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";


async function manage_join(room_id: string) {
    let response = await fetch(`/api/room/join/${room_id}`, { method: "PUT" })
    if (response.status === 401) {
        await fetch('/api/token')
        response = await fetch(`/api/room/join/${room_id}`, { method: "PUT" })
    }
    console.log(response.status)
    if (response.status >= 400) {
        throw Error(`${response.status}: ${await response.text()}`)
    }

}

function Join() {

    const navigate = useNavigate();
    const { room_id } = useParams();
    const [errorMessage, setErrorMessage] = useState(undefined as (string | undefined))

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
