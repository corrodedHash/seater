import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import QRCode from 'qrcode'

async function manage_join(room_id: string) {
    await fetch(`/api/room/join/${room_id}`, { method: "PUT" })

}

function Share() {
    const navigate = useNavigate();
    const { room_id } = useParams();
    const hostname = window.location.origin
    const target_url = `${hostname}/join/${room_id}`
    const [dataURL, setDataURL] = useState<string>()
    useEffect(() => {
        QRCode.toDataURL(target_url)
            .then(url => {
                setDataURL(url)
            })
            .catch(err => {
                console.error(err)
            })
    }, [target_url])

    return (
        <>
            URL: {target_url}
            {dataURL ? <img src={dataURL} height="300" width="300"></img> : ""}
        </>
    )
}

export default Share
