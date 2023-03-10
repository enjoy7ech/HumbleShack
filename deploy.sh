VERSION=v$(node -p  "require('./package.json').version")
echo 检查version....
if [ -n "`git ls-remote --tags|grep $VERSION`" ];
then
    echo "$VERSION已存在，请先修改version"
    exit
else
    git pull
    git add .
    git commit -am "update version $VERSION"
    git push
    git tag $VERSION
    git push origin $VERSION
fi
