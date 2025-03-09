import { useEffect, useState } from "react";
import { useParams } from "react-router";
import QRCode from 'qrcode'

function Share() {
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
            <div className="qrbox">
                {dataURL ? <img src={dataURL} height="300" width="300"></img> : ""}
                <div>URL: {target_url}</div>
            </div>
        </>
    )
}

export default Share
