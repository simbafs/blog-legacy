# filediff := $(shell git diff --name-only HEAD | grep --color=never content/post | sed -e 's/content\/post\///')
date := $(shell date +%Y-%m-%d)
push: 
	# make og
	git add .
	git commit -m "$(date)"
	git pull
	git push

diff:
	@echo "$(filediff)"

tree: 
	tree content/post | less
	# tree -d content/post

build:
	hugo --minify --gc

server:
	hugo server -D

frontmatter:
	node ./script/frontmatter/index.js --only-change

og: 
	node ./script/frontmatter/index.js --og --only-change

clean: 
	rm -r public

updateTheme: 
	hugo mod get -u github.com/CaiJimmy/hugo-theme-stack/v3

.PHONY: push tree build diff og frontmatter server updateTheme
