---
title: Github Action Collections
slug: github-action-collections
date: '2023-08-06'
tags: []
categories:
  - devops
draft: true
---

# Github Action Collections

## Build docker image with tag and push to ghcr

settings > actions > general > Workflow permissions > read and write permissions

```yaml
name: Deploy Images to GHCR

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
      build-and-push:
        runs-on: ubuntu-latest
        steps:
          - name: 'Checkout GitHub Action'
            uses: actions/checkout@main

          - name: 'Login to GitHub Container Registry'
            uses: docker/login-action@v1
            with:
              registry: ghcr.io
              username: ${{ github.actor }}
              password: ${{ secrets.GITHUB_TOKEN }}
              
          - name: Set env
            id: vars
            run: echo "tag=${GITHUB_REF#refs/*/}" >> $GITHUB_OUTPUT

          - name: echo 
            run: echo ${{ steps.vars.outputs.tag }}
            
          - name: build image
            run: |
              docker build . -t ghcr.io/simbafs/coscup-attendance:latest -t ghcr.io/simbafs/coscup-attendance:${{ steps.vars.outputs.tag }}

          - name: push image
            run: |
              docker push ghcr.io/simbafs/coscup-attendance:${{ steps.vars.outputs.tag }}
              docker push ghcr.io/simbafs/coscup-attendance:latest
```

> modified from https://dev.to/willvelida/pushing-container-images-to-github-container-registry-with-github-actions-1m6b
