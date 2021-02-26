import io
import os
import json

rootDir = '.'

outTSFile = "./shaderAsset.ts"
resultText = {}


def writeFromFile(filePath):
    print("writeFromFile work")
    filePathStrArray = filePath.split('/')
    key = filePathStrArray.pop().split('.')[0]
    print("key:"+key)
    if len(filePathStrArray) > 1:
        key = filePathStrArray[-1]+'/'+key
    print("resultKey:"+key)
    with io.open(filePath, 'r', encoding='utf-8') as file:
        text = file.read()
        resultText[key] = text
        file.close()


def findAll(root):
    list = os.listdir(root)
    for item in list:
        print("path:"+item)
        if os.path.isdir(item):
            item = root+'/'+item
            findAll(item)
        elif item.endswith("glsl"):
            item = root+'/'+item
            writeFromFile(item)


findAll(rootDir)
with io.open(outTSFile, 'w', encoding="utf-8") as file:
    resultStr = "export let data="
    print(resultText)
    resultStr += json.dumps(resultText, sort_keys=True,
                            indent=4, separators=(',', ': '), ensure_ascii=False)
    print(resultStr)
    file.write(resultStr)
    file.close()
