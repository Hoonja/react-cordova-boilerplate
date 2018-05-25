#!/usr/bin/env bash

# Update client repository
git pull origin master

# Build parent-app-web
yarn install
yarn run build

# Prepare client_build
if [ -e client_build ]
then
    cd client_build
    git pull origin master
    cd ..
else
    git clone https://github.com/DanbiEduCorp/client_build.git
fi

# Update builds
rm -r client_build/winkapp-parent-ios/
cp -R www/ client_build/winkapp-parent-ios/

# Git Commit and Push
cd client_build/
git add *
git commit -m 'update build(winkapp-parent-ios)'
git push origin master
cd ..
