const path = require('path')
const fs = require('fs/promises')
const exec = require('util').promisify(require('child_process').exec)
const matter = require('gray-matter')
const yaml = require('js-yaml')
const { getOg } = require('@simbafs/og')

/**
 * date string to yyyy-mm-dd
 * @param {string} date
 *
 * @returns {string}
 */
function formatDate(date) {
    return new Date(date).toISOString().split('T')[0]
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

    const pathArray = filepath.split('/').slice(4)

    if (doRenderOG) {
        const { png } = await getOg({
            title: data.title,
            subtitle: `${data.date} by simbafs`,
            tags: data.tags,
        })
        // console.log(pathArray.slice(0, -1), pathArray.slice(-1)[0].replace('.md', '.png'))
        await fs.mkdir(path.join('static/og', ...pathArray.slice(0, -1)), {
            recursive: true,
        })

        await fs.writeFile(
            path.join('static/og', ...pathArray).replace(/\.md$/, '.png'),
            png
        )

        data.image = path.join('/og', ...pathArray).replace(/\.md$/, '.png')
    }

    return data
}

async function main() {
    const files = await exec('hugo list all')
        .then(({ stdout }) => stdout.split('\n')
            .map(item => item.split(',')[0])
            .slice(1)
            .filter(item => !item.match(/_index.md$/))
            .filter(item => item)
        )
        .catch(console.error)
    for (const file of files) {
        console.log(file)

        // read
        const fileContent = await fs.readFile(file, 'utf-8').catch(console.error)
        const stat = await fs.stat(file).catch(console.error)

        // format
        const { data, content } = matter(fileContent)
        const formattedData = await formatMatter(data, file, stat.ctime)

        // write
        try {
            await fs.writeFile(
                file,
                `---\n${yaml.dump(formattedData)}---\n${content}`
            )
        } catch (e) {
            console.error(e)
            console.log(data)
        }
    }
}

main().catch(console.error)
