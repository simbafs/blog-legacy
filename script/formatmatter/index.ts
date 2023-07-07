import matter from 'gray-matter'
import fs from 'fs/promises'
import path from 'path'
import yaml from 'js-yaml'

// any format of date string to yyyy-mm-dd
function formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
}

type MatterData = {
    title: string
    slug: string
    date: string
    tags: string[]
    categories: string[]
    image: string | undefined
    draft: boolean
}

// formatMatter({}, './content/post/other/some.md', './content/post/',  stat)
function formatMatter(matter: any, filepath: string, ctime: Date): MatterData {
    return {
        title: matter?.title || path.basename(filepath, path.extname(filepath)),
        slug: matter?.slug || path.basename(filepath, path.extname(filepath)),
        date: formatDate(matter?.date || ctime),
        tags: matter?.tags || [],
        categories: filepath.split(path.sep).slice(4, -1), // 4 = ../../content/post
        image: matter?.image || undefined,
        draft: matter?.draft || false,
    }
}

async function main(source: string) {
    const files = await fs.readdir(source)
    for (const file of files) {
        const stat = await fs.stat(path.join(source, file))
        if (stat.isDirectory()) {
            main(path.join(source, file))
            continue
        }

        if (path.extname(file) !== '.md' || file === '_index.md') {
            continue
        }

        console.log(path.join(source, file))

        // read
        const fileContent = await fs.readFile(path.join(source, file), 'utf-8')

        // format
        const { data, content } = matter(fileContent)
        const formattedData = formatMatter(data, path.join(source, file), stat.ctime)

        // write
        try {
            await fs.writeFile(path.join(source, file), `---\n${yaml.dump(formattedData)}---\n${content}`)
        } catch (e) {
            console.error(e)
            console.log(data)
        }
    }
}

main('../../content/post')
    .catch(console.error)
