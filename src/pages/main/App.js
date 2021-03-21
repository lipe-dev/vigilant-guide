import React, {useEffect, useRef, useState, useCallback} from 'react'
import {useDropzone} from "react-dropzone";

import drawing from '../../assets/Op1.svg'

const parser = new DOMParser()
const serializer = new XMLSerializer()

const App = () => {
    const [link, setLink] = useState('')
    const [text, setText] = useState('')

    const [svgString, setSvgString] = useState('')

    // const canvasRef = useRef(null)

    const documentRef = useRef(null)

    useEffect(() => {
        fetch(drawing).then(result => {
            result.text().then(text => {
                documentRef.current = parser.parseFromString(text, 'image/svg+xml')
            })
        })
    }, [])

    const changeText = (event) => {
        setText(event.target.value)

        const textNode = documentRef.current.getElementById('text-here')

        if (textNode) {
            while (textNode.firstChild) {
                textNode.removeChild(textNode.lastChild);
            }

            const lines = event?.target?.value?.split('\n')

            for (let index = 0; index < lines.length; index++) {
                const line = lines[index].trim()
                const tspan = documentRef.current.createElementNS('http://www.w3.org/2000/svg', "tspan")
                tspan.setAttributeNS(null, 'x', '50%')
                tspan.setAttributeNS(null,'dy', index ? 100 : 0)
                tspan.setAttributeNS(null,'text-anchor', 'middle')
                const textEl = documentRef.current.createTextNode(line)
                tspan.appendChild(textEl)
                textNode.appendChild(tspan)
            }
        }

        setSvgString(serializer.serializeToString(documentRef.current.documentElement))
    }

    const changeLink = (event) => {
        setLink(event.target.value)

        const linkNode = documentRef.current.getElementById('link-here')
        if (linkNode) {
            linkNode.textContent = event.target.value
        }

        setSvgString(serializer.serializeToString(documentRef.current.documentElement))
    }

    const downloadImage = useCallback(() => {
        console.log(svgString);

        let win = window.URL || window.webkitURL || window;
        let img = new Image()
        let blob = new Blob([svgString], { type: 'image/svg+xml'})
        let url = win.createObjectURL(blob)

        img.src= url
        img.onload = () => {
            const canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            ctx.canvas.width = 1080
            ctx.canvas.height = 1920
            ctx.drawImage(img, 0, 0)
            win.revokeObjectURL(url)

            let uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream')

            let a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display:none'
            a.href = uri
            a.download = `${text.trim()}.png`
            a.click()

            window.URL.revokeObjectURL(uri)

            document.body.removeChild(a)
        }
    }, [svgString, text])

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                const image = documentRef.current.getElementById('background-image')

                console.log(reader.result);

                image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', Buffer.from(reader.result).toString())

                setSvgString(serializer.serializeToString(documentRef.current.documentElement))
            }
            reader.readAsDataURL(file)
        })

    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})

    return (
        <div>
            <textarea type="text" multiple onChange={changeText} value={text}/>
            <input type="text" onChange={changeLink} value={link}/>

            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>

            {/*{!converting && <a download="image.png" href={download}>Click here to download</a>}*/}
            <div style={{width: 300}} dangerouslySetInnerHTML={{__html: svgString}}/>

            {/*<canvas width={1080} height={1920} ref={canvasRef}/>*/}

            <button onClick={downloadImage}>Download Image</button>
        </div>
    )
}

export default App
