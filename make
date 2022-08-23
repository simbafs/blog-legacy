#!/bin/bash
USER=simba
HOST=simba-fs.dev
DIR=website/blog
GITROOT=$(git rev-parse --show-toplevel)

EDITOR=${EDITOR:-vim}

# TODO
mkindex(){
	echo hi
}

case $1 in
	list)
		tree -d content/posts
		;;
	size)
		wc $(find content -name '*.md' ) -c | sort -n -r
		;;
	server)
		hugo server -D
		;;
	edit)
		$EDITOR content/posts/$2/index.md
		;;
	new)
		path=$2
		if [ -z "$path" ]; then
			echo "Usage: $0 new <path>"
			exit 1
		fi
		path=content/posts/$path
		mkdir -p $path
		hugo new $path/index.md
		# mkindex
		$EDITOR $path/index.md
		;;
	deploy|*)
		cd $GITROOT
		git add .
		git commit -m '' --allow-empty-message
		git push
		# hugo
		# rsync -avz --delete public/ $USER@$HOST:~/$DIR
		;;
esac
