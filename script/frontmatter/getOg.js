// import satori from 'satori'
// import { html } from 'satori-html'
// import fs from 'fs'
// import { Resvg } from '@resvg/resvg-js'
// import ogTemplate from './og'
//
// const og = ogTemplate(html)

const satori = require('satori')
const fs = require('fs')
const { Resvg } = require('@resvg/resvg-js')

const jfFont = fs.readFileSync(
    '/home/simba/.local/share/fonts/jf-openhuninn-1.1.ttf'
)
/**
 * generate og image from provided information
 * @param {object} opt
 * @param {string} opt.title
 * @param {string} opt.subtitle
 * @param {string} opt.tags
 */
async function getOG(opt) {
    // const { html } = require('satori-html')
    const { html } = await import('satori-html')
    const og = require('./og')(html)
    // console.log(JSON.stringify(og(opt), null, 2))

    return satori
        .default(og(opt), {
            width: 800,
            height: 400,
            fonts: [
                {
                    name: 'Inter',
                    data: jfFont,
                    weight: 400,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: jfFont,
                    weight: 700,
                    style: 'normal',
                },
            ],
        })
        .then(svg => {
            const png = new Resvg(svg, {
                background: 'rgba(238, 235, 230, 0)',
                fitTo: {
                    mode: 'width',
                    value: 1200,
                },
            })
                .render()
                .asPng()
            // fs.writeFileSync('./out.svg', svg)
            // fs.writeFileSync('./out.png', png)
            return { png, svg }
        })
}

module.exports = getOG

// getOG({
//     title: 'title title title title title title title title title title title title title title title title',
//     subtitle: '2022/04/12 by simbafs',
//     tags: 'js, html, og',
// })
//     .then(({ png }) => fs.writeFileSync('og.png', png))
//     .catch(console.error)
