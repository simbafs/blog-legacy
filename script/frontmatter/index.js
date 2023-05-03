const yaml = require('yaml')
const toml = require('@ltd/j-toml')
const fs = require('fs/promises')
const typeOf = require('just-typeof')

const contentPath = '../../content'

const parser = {
	toml: toml.parse,
	yaml: yaml.parse,
}

function cutFrontmatter(content, type) {
	const separator = {
		yaml: '---',
		toml: '+++',
	}[type]

	const frontmatter = []
	let n = 0
	for (let line of content.split('\n')) {
		if (n === 0 && line.includes(separator)) n++
		else if (n === 1) {
			if (line.includes(separator)) {
				n++
			} else {
				frontmatter.push(line)
			}
		} else if (n === 2) break
	}
	return frontmatter.join('\n')
}

async function allField(currentPath, frontmatter) {
	const path = file => `${currentPath}/${file}`
	const filesPath = await fs.readdir(currentPath)

	for (let file of filesPath) {
		const isDir = (await fs.lstat(path(file))).isDirectory()

		if (isDir) {
			const next = await allField(path(file), frontmatter)
			frontmatter = {
				...frontmatter,
				...next,
			}
		}

		if (!file.match(/\.md$/) || file.match(/_index.md$/)) continue

		const content = (await fs.readFile(path(file))).toString()
		const frontmatterType = content.match(/^---/)
			? 'yaml'
			: content.match(/^\+\+\+/)
			? 'toml'
			: ''

		const frontmatterString = cutFrontmatter(content, frontmatterType)
		try {
			frontmatter[path(file)] = parser[frontmatterType](frontmatterString)
		} catch (e) {
			console.error(e)
			console.log(path(file))
			console.log(frontmatterString)
			process.exit(1)
		}
	}

	return frontmatter
}

function unique(arr) {
	const set = new Set()
	for (let item of arr) {
		set.add(item)
	}
	return Array.from(set.values())
}

function whichType(obj) {
	const type = typeOf(obj)
	if (type === 'array') {
		return `array of ${unique(obj.map(whichType)).join(', ')}`
	}
	return type
}

allField(contentPath, {})
	// convert fields to type
	.then(data => {
		return Object.entries(data).map(item =>
			Object.entries(item[1]).map(item => {
				item[1] = whichType(item[1])
				return item
			})
		)
	})
	.then(data => {
		data = data.flat()
		const map = {}
		for (let item of data) {
			// console.log(item)
			map[item[0]] = unique((map[item[0]] || []).concat(item[1]))
		}
		return map
	})
	.then(console.log)
