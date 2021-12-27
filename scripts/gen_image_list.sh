path=$1

pushd $path > /dev/null
cur_path=`pwd`
echo "# `basename "$cur_path"`" >> README.md
echo '' >> README.md
ls | grep -v '.md' | grep -v '.sh' | xargs -n 1 -I@ echo $'@\n![](@)\n' >> README.md
popd > /dev/null
