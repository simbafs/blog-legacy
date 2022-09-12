/**
 *	author: simbafs
 *	usage: node convert.js <src path> <target path>
 *	inspired by: https://github.com/nodejh/nodejh.github.io/issues/11
 *	This program will auto change category -> categories, tag -> tags,
 *	If date is not set, it will assume today's date.
 *	required:
 *		node version > v10 (for fs promises api)
 *		yaml
 *		@iarna/toml
 */
const fs = require('fs').promises;
const path = require('path');
const yaml = require('yaml');
const toml = require('@iarna/toml');

const src = process.argv[2];
const target = process.argv[3];

const isMD = /\.md$/;

readDir(src, target);

async function readDir(src, target){
	const files = await fs.readdir(src);
	for(let file of files){
		const t = path.join(target, file);
		const f = path.join(src, file);
		const isDir = (await fs.stat(f)).isDirectory();

		if(isDir){
			readDir(f, t);
		}else if(isMD.test(f)){
			readFile(f, t);
		}else{
			console.log(`unknown file: ${f}`);
		}
	}
}

async function readFile(src, target){
	console.log(`convert ${src} to ${target}`);

	const raw = await fs.readFile(src, { encoding: 'utf8' });
	let [, rawMata, post] = raw.split('---\n');
	let meta = yaml.parse(rawMata);

	// date
	if(meta.date){
		meta.date = meta.date.split(' ')[0];
	}else{
		meta.date = (new Date()).toISOString().split('T')[0];
	}

	// tags
	if (meta.tag){
		meta.tags = meta.tag
		delete meta.tag;
	}
	if(!Array.isArray(meta.tags)){
		meta.tags = [meta.tags];
	}

	// categories
	if (meta.category){
		meta.categories = meta.category
		delete meta.category;
	}
	if(!Array.isArray(meta.categories)){
		meta.categories = [meta.categories];
	}
	// meta.categories = meta.categories.join('-');


	const tomlMeta = toml.stringify(meta);

	await createFile(target);

	await fs.appendFile(target, '+++\n' + tomlMeta + '+++\n' + post);
	// console.log({ tomlMeta });
}

async function createFile(target){
	const dirName = path.dirname(target);
	const filename = path.basename(target);
	return fs.mkdir(dirName, { recursive: true })
		.then(() => fs.open(target, 'w'))
		.then(f => f.close())
}
