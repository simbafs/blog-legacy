import fs from 'fs'
import { Octokit } from 'octokit'
import toml from '@iarna/toml'

const apikey = fs.readFileSync('./apikey').toString()

const octokit = new Octokit({
    auth: apikey,
})

async function getAllRepoOfUser(user, octokit) {
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i
    let repos = []
    let nextLink = ''

    do {
        const [data, link] = await get(nextLink)
        repos = repos.concat(data)
        nextLink = link
    } while (nextLink)

    async function get(link) {
        const processFn = res => {
            const nextLink = res.headers.link.match(nextPattern)?.[0]
            return [
                res.data.map(repo => ({
                    name: repo.name,
                    full_name: repo.full_name,
                    link: repo.html_url,
                    desc: repo.description || '',
                    img: '',
                })),
                nextLink,
            ]
        }
        if (link) {
            return octokit
                .request(link, {
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28',
                    },
                })
                .then(processFn)
        }
        return octokit
            .request('GET /users/{user}/repos', {
                user: user,
                type: 'public',
                page: 1,
                per_page: 20,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            })
            .then(processFn)
    }

    return repos
}

getAllRepoOfUser('simbafs', octokit)
    .then(repos => {
        console.log(toml.stringify({ all: repos }))
    })
