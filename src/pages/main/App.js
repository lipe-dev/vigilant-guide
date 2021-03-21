import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useDropzone} from "react-dropzone";

import drawing from '../../assets/Op1.svg'
import GlobalStyles from "../../components/GlobalStyles";
import {Layout} from "../../components/Layout/Layout";
import {Row} from "../../components/Layout/Row";
import {Title} from "../../components/Typography/Title";
import {SubTitle} from "../../components/Typography/SubTitle";
import {Card} from "../../components/Layout/Card";
import {Column} from "../../components/Layout/Column";
import {Input} from "../../components/Forms/Input";
import {TextArea} from "../../components/Forms/TextArea";
import {Label} from "../../components/Forms/Label";
import {DropArea} from "../../components/Forms/DropArea";
import {FileUpload} from "../../components/Forms/FileUpload";
import {Preview} from "../../components/Preview/Preview";
import {Button} from "../../components/Forms/Button";
import {Footer} from "../../components/Typography/Footer";

const parser = new DOMParser()
const serializer = new XMLSerializer()

const App = () => {
    const [link, setLink] = useState('')
    const [text, setText] = useState('')
    const [file, setFile] = useState('')

    const [svgString, setSvgString] = useState('')

    // const canvasRef = useRef(null)

    const documentRef = useRef(null)

    useEffect(() => {
        fetch(drawing).then(result => {
            result.text().then(text => {
                documentRef.current = parser.parseFromString(text, 'image/svg+xml')
                setSvgString(serializer.serializeToString(documentRef.current.documentElement))
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
                tspan.setAttributeNS(null, 'dy', index ? 100 : 0)
                tspan.setAttributeNS(null, 'text-anchor', 'middle')
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
        let blob = new Blob([svgString], {type: 'image/svg+xml'})
        let url = win.createObjectURL(blob)

        img.src = url
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
            setFile(file.name)

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
        <Layout>
            <GlobalStyles/>

            <Row>
                <Column span={12}>
                    <Title>Vigilant-Guide</Title>
                    <SubTitle>A randomly named tool that only does a single very specific task.</SubTitle>
                </Column>
            </Row>

            <Row>
                <Column span={12}>
                    <Card>
                        <Row>
                            <Column span={6}>
                                <Label>
                                    Main Text
                                    <TextArea type="text" multiple onChange={changeText} value={text}/>
                                </Label>

                                <Label>
                                    Short Link
                                    <Input type="text" onChange={changeLink} value={link}/>
                                </Label>

                                <Label>
                                    Background Image
                                    <DropArea {...getRootProps()}>
                                        <FileUpload {...getInputProps()} />
                                        <DropArea.Text >{file || `Drag 'n' drop an image here, or click to select a file`}</DropArea.Text>
                                    </DropArea>
                                </Label>
                            </Column>
                            <Column span={6}>
                                <Preview dangerouslySetInnerHTML={{__html: svgString}}/>
                                <Button onClick={downloadImage}>Download Image</Button>
                            </Column>
                        </Row>
                    </Card>
                </Column>
            </Row>

            <Row>
                <Column span={12}>
                    <Footer>Click <a href="https://lipe.dev/vigilant-guide">here</a> to read a very pretentious blog post in which I make a big deal about how I made this.</Footer>
                </Column>
            </Row>
        </Layout>
    )
}

export default App
