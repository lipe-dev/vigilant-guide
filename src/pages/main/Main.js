import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import drawing from '../../assets/Op1.svg'
import GlobalStyles from '../../components/GlobalStyles'
import Layout, { Row, Card, Column } from '../../components/Layout'
import { Title, SubTitle, Footer } from '../../components/Typography'
import {
	Input,
	TextArea,
	Label,
	DropArea,
	Button,
} from '../../components/Forms'
import Preview from '../../components/Preview'

const parser = new DOMParser()
const serializer = new XMLSerializer()

const Main = () => {
	const [link, setLink] = useState('')
	const [text, setText] = useState('')

	const [svgString, setSvgString] = useState('')

	// const canvasRef = useRef(null)

	const documentRef = useRef(null)

	useEffect(() => {
		fetch(drawing).then((result) => {
			result.text().then((text) => {
				documentRef.current = parser.parseFromString(text, 'image/svg+xml')
				setSvgString(
					serializer.serializeToString(documentRef.current.documentElement)
				)
			})
		})
	}, [])

	const changeText = (event) => {
		setText(event.target.value)

		const textNode = documentRef.current.getElementById('text-here')

		if (textNode) {
			while (textNode.firstChild) {
				textNode.removeChild(textNode.lastChild)
			}

			const lines = event?.target?.value?.split('\n')

			for (let index = 0; index < lines.length; index++) {
				const line = lines[index].trim()
				const tspan = documentRef.current.createElementNS(
					'http://www.w3.org/2000/svg',
					'tspan'
				)
				tspan.setAttributeNS(null, 'x', '50%')
				tspan.setAttributeNS(null, 'dy', index ? 100 : 0)
				tspan.setAttributeNS(null, 'text-anchor', 'middle')
				const textEl = documentRef.current.createTextNode(line)
				tspan.appendChild(textEl)
				textNode.appendChild(tspan)
			}
		}

		setSvgString(
			serializer.serializeToString(documentRef.current.documentElement)
		)
	}

	const changeLink = (event) => {
		setLink(event.target.value)

		const linkNode = documentRef.current.getElementById('link-here')
		if (linkNode) {
			linkNode.textContent = event.target.value
		}

		setSvgString(
			serializer.serializeToString(documentRef.current.documentElement)
		)
	}

	const downloadImage = useCallback(() => {
		const win = window.URL || window.webkitURL || window
		const img = new Image()
		const blob = new Blob([svgString], { type: 'image/svg+xml' })
		const url = win.createObjectURL(blob)

		img.src = url
		img.onload = () => {
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			ctx.canvas.width = 1080
			ctx.canvas.height = 1920
			ctx.drawImage(img, 0, 0)
			win.revokeObjectURL(url)

			const uri = canvas
				.toDataURL('image/png')
				.replace('image/png', 'octet/stream')

			const a = document.createElement('a')
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

				console.log(reader.result)

				image.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					'href',
					Buffer.from(reader.result).toString()
				)

				setSvgString(
					serializer.serializeToString(documentRef.current.documentElement)
				)
			}
			reader.readAsDataURL(file)
		})
	}, [])
	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	return (
		<Layout>
			<GlobalStyles />

			<Row>
				<Column span={12}>
					<Title>Vigilant-Guide</Title>
					<SubTitle>
						A randomly named tool that only does a single very specific task.
					</SubTitle>
				</Column>
			</Row>

			<Row>
				<Column span={12}>
					<Card>
						<Row>
							<Column span={6}>
								<Label>
									Main Text
									<TextArea
										type='text'
										multiple
										onChange={changeText}
										value={text}
									/>
								</Label>

								<Label>
									Short Link
									<Input type='text' onChange={changeLink} value={link} />
								</Label>

								<Label htmlFor='#fileInput'>Background Image</Label>
								<DropArea {...getRootProps()}>
									<input {...getInputProps()} id='fileInput' />
									<p>
										{/* eslint-disable-next-line react/no-unescaped-entities */}
										Drag 'n' drop an image here, or click to select a file
									</p>
								</DropArea>
							</Column>
							<Column span={6}>
								<Preview dangerouslySetInnerHTML={{ __html: svgString }} />
								<Button onClick={downloadImage}>Download Image</Button>
							</Column>
						</Row>
					</Card>
				</Column>
			</Row>

			<Row>
				<Column span={12}>
					<Footer>
						Click <a href='https://lipe.dev/vigilant-guide'>here</a> to read a
						very pretentious blog post in which I make a big deal about how I
						made this.
					</Footer>
				</Column>
			</Row>
		</Layout>
	)
}

export default Main
