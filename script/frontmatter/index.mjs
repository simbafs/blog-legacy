import path from 'path'
import fs from 'fs/promises'
import { promisify } from 'util'
import { exec as _exec } from 'child_process'
const exec = promisify(_exec)
import matter from 'gray-matter'
import yaml from 'js-yaml'
import { getOg } from '@simbafs/og'

import { template } from './template.mjs'

/** @param {string} date */
function formatDate(date) {
	return new Date(date).toISOString()
}

const doRenderOG = process.argv.includes('--og')

/**
 * @param {object} matter
 * @param {string} filepath
 * @param {Date} ctime
 *
 * @returns {Promise<object>}
 */
async function formatMatter(matter, filepath, ctime) {
	const data = {
		...matter,
		title: matter?.title || path.basename(filepath, path.extname(filepath)),
		slug: matter?.slug || path.basename(filepath, path.extname(filepath)),
		date: formatDate(matter?.date || ctime),
		tags: matter?.tags || [],
		categories: filepath.split(path.sep).slice(2, -1), // 4 = content/post
		image: matter?.image || undefined,
		draft: matter?.draft || undefined,
	}

	const pathArray = filepath.split('/').slice(2)

	if (doRenderOG) {
		const { png } = await getOg(
			{
				title: data.title,
				subtitle: `${data.date} by SimbaFs`,
				tags: data.tags,
			},
			{
				font: 'jf-openhuninn-2.0',
				template,
			},
		)
		// console.log(pathArray.slice(0, -1), pathArray.slice(-1)[0].replace('.md', '.png'))
		await fs.mkdir(path.join('static', 'og', ...pathArray.slice(0, -1)), {
			recursive: true,
		})

		await fs.writeFile(path.join('static/og', ...pathArray).replace(/\.md$/, '.png'), png)

		data.image = path.join('/og', ...pathArray).replace(/\.md$/, '.png')
	}

	return data
}

async function main() {
	const onlyChange = process.argv.includes('-c') || process.argv.includes('--only-change')
	let files
	if (onlyChange) {
		files = await exec('git add . && git diff HEAD --name-only')
			.then(({ stdout }) => stdout.split('\n').filter(item => item && item.match(/^content.*\.md$/)))
			.catch(e => {
				console.error(e)
				process.exit(1)
			})
	} else {
		files = await exec('hugo list all')
			.then(({ stdout }) =>
				stdout
					.split('\n')
					.map(item => item.split(',')[0])
					.filter(item => item && item.match(/^content.*\.md$/) && !item.match(/_index.md$/)),
			)
			.catch(e => {
				console.error(e)
				process.exit(1)
			})
	}
	for (const file of files) {
		console.log(file)

		// read
		const stat = await fs.stat(file).catch(console.error)
		if (!stat) continue

		const fileContent = await fs.readFile(file, 'utf-8').catch(console.error)

		// format
		const { data, content } = matter(fileContent)
		const formattedData = await formatMatter(data, file, stat.ctime)

		// write
		fs.writeFile(file, `---\n${yaml.dump(formattedData)}---\n${content}`).catch(e => {
			console.error(e)
			console.log(data)
		})
	}
}

main().catch(console.error)
